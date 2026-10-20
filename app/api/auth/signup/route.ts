import { NextRequest, NextResponse } from 'next/server';
import {
  applySessionCookies,
  getSafeSupabaseError,
  supabaseAuthRequest,
  type SupabaseSession,
} from '@/lib/supabase-rest';

function getConfirmationRedirectTo(): string | null {
  // On Preview, always redirect back to the current deployment rather than a
  // production domain. Vercel supplies VERCEL_URL for each deployment.
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL;
    if (/^[a-z0-9.-]+$/i.test(host) && !host.includes('..')) {
      return `https://${host}/auth/confirmed`;
    }
  }

  const configuredBase = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredBase) {
    try {
      const url = new URL(configuredBase);
      const localDevelopmentHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      if (url.protocol === 'https:' || (process.env.NODE_ENV !== 'production' && url.protocol === 'http:' && localDevelopmentHost)) {
        return new URL('/auth/confirmed', url.origin).toString();
      }
    } catch {
      // Ignore an invalid optional URL and fail back to the configured Site URL.
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000/auth/confirmed';
  }
  return null;
}

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
    const redirectTo = getConfirmationRedirectTo();
    upstream = await supabaseAuthRequest('signup', {
      method: 'POST',
      headers: redirectTo ? { 'X-Redirect-To': redirectTo } : undefined,
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
