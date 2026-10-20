import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearSessionCookies,
  supabaseAuthRequest,
} from '@/lib/supabase-rest';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    await supabaseAuthRequest('logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => null);
  } else if (refreshToken) {
    // The browser session is cleared even when the access token has expired.
    // Server-side session revocation is attempted only when an access token exists.
  }

  return clearSessionCookies(NextResponse.json({ success: true }));
}
