import { NextRequest, NextResponse } from 'next/server';
import {
  applySessionCookies,
  getSupabaseProfile,
  resolveAuthContext,
} from '@/lib/supabase-rest';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const auth = await resolveAuthContext(request).catch(() => null);

  if (!auth) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const profile = await getSupabaseProfile(auth.user.id, auth.accessToken);
  const isDashboardPage = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdminPage && profile?.role !== 'admin') {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    return auth.refreshedSession ? applySessionCookies(response, auth.refreshedSession) : response;
  }

  // A signed-up account without a company must finish onboarding before entering
  // the dashboard. A missing profile is allowed through onboarding to handle the
  // short interval while Supabase's auth trigger creates the profile.
  if (isDashboardPage && !profile?.company_id) {
    const response = NextResponse.redirect(new URL('/onboarding', request.url));
    return auth.refreshedSession ? applySessionCookies(response, auth.refreshedSession) : response;
  }

  const response = NextResponse.next();
  if (auth.refreshedSession) applySessionCookies(response, auth.refreshedSession);
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/onboarding/:path*'],
};
