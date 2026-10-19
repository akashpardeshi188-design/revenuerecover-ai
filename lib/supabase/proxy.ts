import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/growth', '/admin', '/onboarding'];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}

function safeNextPath(value: string | null) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
}

export async function updateSession(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const protectedPath = isProtectedPath(pathname);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (!protectedPath) return NextResponse.next({ request });
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
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', safeNextPath(pathname + search));
    return NextResponse.redirect(loginUrl);
  }

  if (!userId) return response;

  if (pathname === '/login' || pathname === '/') {
    const destination = request.nextUrl.clone();
    destination.pathname = '/dashboard';
    destination.search = '';
    return NextResponse.redirect(destination);
  }

  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/') || pathname === '/onboarding') {
    const { data: profile } = await supabase.from('users').select('role, company_id').eq('id', userId).maybeSingle();

    if (profile && profile.role !== 'admin' && profile.role !== 'manager' && !profile.company_id && pathname !== '/onboarding') {
      const destination = request.nextUrl.clone();
      destination.pathname = '/onboarding';
      destination.search = '';
      return NextResponse.redirect(destination);
    }

    if (profile?.company_id && pathname === '/onboarding') {
      const destination = request.nextUrl.clone();
      destination.pathname = '/dashboard';
      destination.search = '';
      return NextResponse.redirect(destination);
    }
  }

  return response;
}
