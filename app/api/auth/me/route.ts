import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
} from '@/lib/supabase-rest';

export async function GET(request: NextRequest) {
  const auth = await resolveAuthContext(request).catch(() => null);
  if (!auth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const profile = await getSupabaseProfile(auth.user.id, auth.accessToken);
  const response = NextResponse.json({
    authenticated: true,
    user: { id: auth.user.id, email: auth.user.email ?? null },
    profileReady: Boolean(profile),
    profile,
  });

  return setRefreshedSessionIfNeeded(response, auth);
}
