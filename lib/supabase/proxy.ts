import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PAGE_PREFIXES = ['/dashboard', '/growth', '/admin', '/onboarding'];
const API_PREFIXES = ['/api/admin', '/api/agents', '/api/leads', '/api/businesses', '/api/checkout', '/api/growth', '/api/sources', '/api/discovery/import', '/api/discovery/search'];
const ADMIN_API_PREFIXES = ['/api/admin', '/api/businesses', '/api/sources', '/api/discovery'];

function isProtectedPath(pathname: string) {
  if (pathname === '/api/growth/cron' || pathname.startsWith('/api/growth/cron/')) return false;
  return [...PAGE_PREFIXES, ...API_PREFIXES].some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));
}

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));
}

function safeNextPath(value: string | null) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
}

function redirectKeepingCookies(url: URL, response: NextResponse) {
  const redirected = NextResponse.redirect(url);
  response.cookies.getAll().forEach(cookie => redirected.cookies.set(cookie));
  return redirected;
}

export async function updateSession(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const apiPath = pathname.startsWith('/api/');
  const protectedPath = isProtectedPath(pathname);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (!protectedPath) return NextResponse.next({ request });
    if (apiPath) return NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 });
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '?error=auth_config';
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  const userId = !error && typeof data?.claims?.sub === 'string' ? data.claims.sub : null;

  if (protectedPath && !userId) {
    if (apiPath) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', safeNextPath(pathname + search));
    return redirectKeepingCookies(loginUrl, response);
  }

  if (!userId) return response;

  if (pathname === '/login' || pathname === '/') {
    const destination = request.nextUrl.clone();
    destination.pathname = '/dashboard';
    destination.search = '';
    return redirectKeepingCookies(destination, response);
  }

  const pageNeedsProfile = pathname === '/dashboard' || pathname.startsWith('/dashboard/') || pathname === '/onboarding';
  const adminApi = matchesPrefix(pathname, ADMIN_API_PREFIXES);
  if (pageNeedsProfile || adminApi) {
    const { data: profile } = await supabase.from('users').select('role, company_id').eq('id', userId).maybeSingle();

    if (adminApi && !['admin', 'manager'].includes(profile?.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (pageNeedsProfile && profile && profile.role !== 'admin' && profile.role !== 'manager' && !profile.company_id && pathname !== '/onboarding') {
      const destination = request.nextUrl.clone();
      destination.pathname = '/onboarding';
      destination.search = '';
      return redirectKeepingCookies(destination, response);
    }

    if (pageNeedsProfile && profile?.company_id && pathname === '/onboarding') {
      const destination = request.nextUrl.clone();
      destination.pathname = '/dashboard';
      destination.search = '';
      return redirectKeepingCookies(destination, response);
    }
  }

  return response;
}
