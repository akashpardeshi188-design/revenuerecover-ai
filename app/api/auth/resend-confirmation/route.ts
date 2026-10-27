import { NextRequest, NextResponse } from 'next/server';
import { getAuthConfirmationRedirectTo } from '@/lib/auth-redirect';
import { getSafeSupabaseError, supabaseAuthRequest } from '@/lib/supabase-rest';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter the email address used to sign up.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('email' in body) ||
    typeof body.email !== 'string'
  ) {
    return NextResponse.json({ error: 'Enter the email address used to sign up.' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const redirectTo = getAuthConfirmationRedirectTo();
  let upstream: Response;
  try {
    const resendEndpoint = redirectTo
      ? `resend?${new URLSearchParams({ redirect_to: redirectTo }).toString()}`
      : 'resend';
    upstream = await supabaseAuthRequest(resendEndpoint, {
      method: 'POST',
      body: JSON.stringify({ type: 'signup', email }),
    });
  } catch {
    return NextResponse.json(
      { error: 'Email confirmation is not configured on this deployment.' },
      { status: 503 }
    );
  }

  if (!upstream.ok) {
    const status = upstream.status === 429 ? 429 : upstream.status >= 500 ? 503 : 400;
    // Avoid disclosing whether an account exists or is already confirmed.
    const message = status === 429
      ? 'Too many requests. Wait a few minutes before trying again.'
      : getSafeSupabaseError(await upstream.json().catch(() => ({})), 'Could not resend the confirmation email.');
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({
    success: true,
    message: 'If this account needs confirmation, a new email will be sent shortly.',
  }, { headers: { 'Cache-Control': 'no-store' } });
}
