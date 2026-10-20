import { NextRequest, NextResponse } from 'next/server';
import {
  clearSessionCookies,
  resolveAuthContext,
  supabaseAuthRequest,
} from '@/lib/supabase-rest';

export async function POST(request: NextRequest) {
  const auth = await resolveAuthContext(request).catch(() => null);

  if (auth) {
    await supabaseAuthRequest('logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    }).catch(() => null);
  }

  // Clear the browser session even if the upstream revocation request fails.
  return clearSessionCookies(NextResponse.json({ success: true }));
}
