import { NextRequest, NextResponse } from 'next/server';
import {
  applySessionCookies,
  getSafeSupabaseError,
  supabaseAuthRequest,
  type SupabaseSession,
} from '@/lib/supabase-rest';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('email' in body) ||
    typeof body.email !== 'string' ||
    !('password' in body) ||
    typeof body.password !== 'string'
  ) {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const password = body.password;
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 1 ||
    password.length > 1024
  ) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await supabaseAuthRequest('token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json(
      { error: 'Authentication is not configured on this deployment.' },
      { status: 503 }
    );
  }

  const payload = (await upstream.json().catch(() => ({}))) as unknown;
  if (!upstream.ok) {
    const status = upstream.status === 429 ? 429 : upstream.status >= 500 ? 503 : 401;
    return NextResponse.json(
      { error: status === 401 ? 'Invalid email or password.' : 'Sign-in is temporarily unavailable.' },
      { status }
    );
  }

  const session = payload as SupabaseSession;
  if (!session.access_token || !session.refresh_token || !session.user?.id) {
    return NextResponse.json(
      { error: getSafeSupabaseError(payload, 'Could not start a session.') },
      { status: 502 }
    );
  }

  const response = NextResponse.json({
    success: true,
    user: { id: session.user.id, email: session.user.email ?? email },
  });
  return applySessionCookies(response, session);
}
