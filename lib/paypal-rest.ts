import { createHash } from 'node:crypto';

export type PayPalMode = 'sandbox' | 'live';

export type PayPalConfig = {
  mode: PayPalMode;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
};

type PayPalTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

export function getPayPalConfig(): PayPalConfig | null {
  const mode = process.env.PAYPAL_MODE;
  const clientId =
    process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (
    (mode !== 'sandbox' && mode !== 'live') ||
    !clientId ||
    !clientSecret
  ) {
    return null;
  }

  // Fail closed: this sprint must not initiate real charges from Preview or
  // development, even if someone accidentally copies live PayPal credentials.
  // Live payments require a deliberate production-only enablement at cutover.
  if (
    mode === 'live' &&
    (process.env.VERCEL_ENV !== 'production' ||
      process.env.PAYPAL_LIVE_PAYMENTS_ENABLED !== 'true')
  ) {
    return null;
  }

  return {
    mode,
    clientId,
    clientSecret,
    baseUrl:
      mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com',
  };
}

export async function getPayPalAccessToken(config: PayPalConfig): Promise<string> {
  if (cachedToken && Date.now() < cachedTokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`,
    'utf8'
  ).toString('base64');

  const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  const payload = (await response.json().catch(() => ({}))) as PayPalTokenResponse;
  if (!response.ok || !payload.access_token) {
    throw new Error('PAYPAL_AUTH_FAILED');
  }

  cachedToken = payload.access_token;
  cachedTokenExpiresAt = Date.now() + Math.max(payload.expires_in ?? 300, 60) * 1000;
  return cachedToken;
}

export async function payPalRequest<T>(
  config: PayPalConfig,
  accessToken: string,
  path: string,
  init: RequestInit = {}
): Promise<{ response: Response; payload: T | null }> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Accept', 'application/json');

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
    signal: init.signal ?? AbortSignal.timeout(15_000),
  });

  const payload = (await response.json().catch(() => null)) as T | null;
  return { response, payload };
}

export function getConfiguredAppBaseUrl(): string | null {
  // Always keep Preview billing redirects on the current Preview deployment,
  // even if APP_BASE_URL was accidentally copied from Production or localhost.
  if (process.env.VERCEL_URL && process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`;
  }

  const configured = process.env.APP_BASE_URL;
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === 'https:' || (process.env.NODE_ENV !== 'production' && url.protocol === 'http:')) {
        return url.origin;
      }
    } catch {
      return null;
    }
    return null;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  return null;
}

export async function supabaseServiceRpc<T>(
  functionName: string,
  args: Record<string, unknown>
): Promise<{ response: Response; payload: T | null }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_NOT_CONFIGURED');
  }

  // Only call a fixed RPC allowlist. Never send arbitrary function names to this helper.
  if (!['link_paypal_subscription', 'process_paypal_webhook_event', 'cancel_paypal_subscription', 'link_razorpay_subscription', 'process_razorpay_webhook_event', 'cancel_razorpay_subscription'].includes(functionName)) {
    throw new Error('SUPABASE_RPC_NOT_ALLOWED');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });

  const payload = (await response.json().catch(() => null)) as T | null;
  return { response, payload };
}

export function createPayPalRequestId(companyId: string, checkoutKey: string, planId: string): string {
  // PayPal stores request IDs for duplicate-request protection. A bounded,
  // deterministic key makes safe retries of the same company/plan checkout.
  return createHash('sha256')
    .update(`${companyId}:${checkoutKey}:${planId}`, 'utf8')
    .digest('hex')
    .slice(0, 38);
}

export function getPayPalApprovalUrl(
  links: Array<{ rel?: string; href?: string }> | undefined,
  mode: PayPalMode
): string | null {
  const candidate = links?.find(
    (link) => link.rel === 'approve' || link.rel === 'payer-action'
  )?.href;
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    const allowedHosts =
      mode === 'live'
        ? new Set(['www.paypal.com'])
        : new Set(['www.sandbox.paypal.com', 'sandbox.paypal.com']);
    if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function safelyReadError(response: Response): Promise<string> {
  const payload = (await response.clone().json().catch(() => ({}))) as {
    message?: unknown;
    name?: unknown;
    debug_id?: unknown;
  };

  const code = typeof payload.name === 'string' ? payload.name : 'provider_error';
  const debugId = typeof payload.debug_id === 'string' ? payload.debug_id : '';
  // Do not return the provider's raw payload (which may contain account details) to customers.
  return [code, debugId].filter(Boolean).join(':').slice(0, 200);
}
