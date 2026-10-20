import { NextRequest, NextResponse } from 'next/server';

export const ACCESS_TOKEN_COOKIE = 'rr_access_token';
export const REFRESH_TOKEN_COOKIE = 'rr_refresh_token';

export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
  user?: SupabaseUser;
};

export type SupabaseProfile = {
  company_id: string | null;
  role: 'admin' | 'manager' | 'viewer' | 'client' | 'contractor';
};

export type AuthContext = {
  accessToken: string;
  user: SupabaseUser;
  refreshedSession?: SupabaseSession;
};

export function getSupabaseConfig(): { url: string; apiKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const apiKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !apiKey) return null;
  return { url, apiKey };
}

export async function supabaseAuthRequest(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const config = getSupabaseConfig();
  if (!config) throw new Error('SUPABASE_AUTH_NOT_CONFIGURED');

  const headers = new Headers(init.headers);
  headers.set('apikey', config.apiKey);
  headers.set('Content-Type', 'application/json');

  return fetch(`${config.url}/auth/v1/${path.replace(/^\/+/, '')}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
}

export async function supabaseRestRequest(
  path: string,
  accessToken: string,
  init: RequestInit = {}
): Promise<Response> {
  const config = getSupabaseConfig();
  if (!config) throw new Error('SUPABASE_AUTH_NOT_CONFIGURED');

  const headers = new Headers(init.headers);
  headers.set('apikey', config.apiKey);
  headers.set('Authorization', `Bearer ${accessToken}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${config.url}/rest/v1/${path.replace(/^\/+/, '')}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
}

/**
 * Validate the cookie token with Supabase Auth. When it has expired, rotate the
 * refresh token through Supabase and return the new session for a Set-Cookie.
 */
export async function resolveAuthContext(
  request: NextRequest
): Promise<AuthContext | null> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    const userResponse = await supabaseAuthRequest('user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => null);

    if (userResponse?.ok) {
      const user = (await userResponse.json()) as SupabaseUser;
      if (user?.id) return { accessToken, user };
    }

    // Do not attempt token rotation for transient server errors. A 401 means
    // the access token is no longer accepted; only then try the refresh token.
    if (userResponse && userResponse.status !== 401) return null;
  }

  if (!refreshToken) return null;

  const refreshResponse = await supabaseAuthRequest('token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  }).catch(() => null);

  if (!refreshResponse?.ok) return null;

  const session = (await refreshResponse.json()) as SupabaseSession;
  if (!session.access_token || !session.refresh_token || !session.user?.id) return null;

  return {
    accessToken: session.access_token,
    user: session.user,
    refreshedSession: session,
  };
}

export async function getSupabaseProfile(
  userId: string,
  accessToken: string
): Promise<SupabaseProfile | null> {
  const query = new URLSearchParams({
    id: `eq.${userId}`,
    select: 'company_id,role',
    limit: '1',
  });

  const response = await supabaseRestRequest(`users?${query.toString()}`, accessToken).catch(
    () => null
  );
  if (!response?.ok) return null;

  const profiles = (await response.json()) as SupabaseProfile[];
  return profiles[0] ?? null;
}

export function applySessionCookies(
  response: NextResponse,
  session: SupabaseSession
): NextResponse {
  const secure = process.env.NODE_ENV === 'production';
  response.cookies.set(ACCESS_TOKEN_COOKIE, session.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.min(Math.max(session.expires_in ?? 3600, 60), 86400),
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export function clearSessionCookies(response: NextResponse): NextResponse {
  const secure = process.env.NODE_ENV === 'production';
  for (const name of [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE]) {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }
  return response;
}

export function setRefreshedSessionIfNeeded(
  response: NextResponse,
  context: AuthContext | null
): NextResponse {
  if (context?.refreshedSession) applySessionCookies(response, context.refreshedSession);
  return response;
}

export function getSafeSupabaseError(payload: unknown, fallback: string): string {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string' &&
    payload.message.length > 0
  ) {
    return payload.message.slice(0, 240);
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'msg' in payload &&
    typeof payload.msg === 'string' &&
    payload.msg.length > 0
  ) {
    return payload.msg.slice(0, 240);
  }

  return fallback;
}
