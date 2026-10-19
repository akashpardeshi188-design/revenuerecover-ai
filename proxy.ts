import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/', '/login',
    '/dashboard/:path*', '/growth/:path*', '/admin/:path*', '/onboarding',
    '/api/admin/:path*', '/api/agents/:path*', '/api/leads/:path*',
    '/api/businesses/:path*', '/api/checkout/:path*', '/api/growth/:path*',
    '/api/sources/:path*', '/api/discovery/import/:path*', '/api/discovery/search/:path*',
  ],
};
