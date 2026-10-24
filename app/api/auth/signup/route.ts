import { NextRequest, NextResponse } from 'next/server';
import { getAuthConfirmationRedirectTo } from '@/lib/auth-redirect';
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
    return NextResponse.json({ error: 'Complete all required fields.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('name' in body) ||
    typeof body.name !== 'string' ||
    !('email' in body) ||
    typeof body.email !== 'string' ||
    !('password' in body) ||
    typeof body.password !== 'string'
  ) {
    return NextResponse.json({ error: 'Complete all required fields.' }, { status: 400 });
  }

  const name = body.name.trim();
  const email = body.email.trim().toLowerCase();
  const password = body.password;
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: 'Name must be between 2 and 120 characters.' }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (password.length < 8 || password.length > 1024) {
    return NextResponse.json({ error: 'Password must contain at least 8 characters.' }, { status: 400 });
  }

  let upstream: Response;
  try {
    const redirectTo = getAuthConfirmationRedirectTo();
    const signupEndpoint = redirectTo
      ? `signup?${new URLSearchParams({ redirect_to: redirectTo }).toString()}`
      : 'signup';
    upstream = await supabaseAuthRequest(signupEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        data: { name },
      }),
    });
  } catch {
    return NextResponse.json(
      { error: 'Authentication is not configured on this deployment.' },
      { status: 503 }
    );
  }

  const payload = (await upstream.json().catch(() => ({}))) as unknown;
  if (!upstream.ok) {
    const message = getSafeSupabaseError(payload, 'Account could not be created.');
    return NextResponse.json(
      { error: upstream.status === 429 ? 'Too many attempts. Please try again later.' : message },
      { status: upstream.status === 429 ? 429 : upstream.status >= 500 ? 503 : 400 }
    );
  }

  const session = payload as SupabaseSession;
  if (!session.access_token || !session.refresh_token || !session.user?.id) {
    // Supabase may require email confirmation before issuing a session.
    return NextResponse.json({
      success: true,
      confirmationRequired: true,
      message: 'Check your email to confirm the account, then sign in.',
    }, { status: 201 });
  }

  const response = NextResponse.json({
    success: true,
    confirmationRequired: false,
    user: { id: session.user.id, email: session.user.email ?? email },
  }, { status: 201 });
  return applySessionCookies(response, session);
}
