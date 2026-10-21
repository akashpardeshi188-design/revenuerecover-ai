import { createHmac, timingSafeEqual } from 'node:crypto';

export type RazorpayMode = 'sandbox' | 'live';

export type RazorpayConfig = {
  mode: RazorpayMode;
  baseUrl: string;
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
};

export const RAZORPAY_PLAN_AMOUNTS: Record<string, { usd: number; cents: number }> = {
  growth: { usd: 999, cents: 99900 },
  revenue_partner: { usd: 1299, cents: 129900 },
};

export function getRazorpayConfig(): RazorpayConfig | null {
  const keyId =
    process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  const isLiveKey = keyId.startsWith('rzp_live_');
  const mode: RazorpayMode = isLiveKey ? 'live' : 'sandbox';

  // Fail closed: Never allow live charges in Preview, dev, or staging environments
  // unless explicitly deployed in production with production enablement set.
  if (
    mode === 'live' &&
    (process.env.VERCEL_ENV !== 'production' ||
      process.env.RAZORPAY_LIVE_PAYMENTS_ENABLED !== 'true')
  ) {
    return null;
  }

  return {
    mode,
    baseUrl: 'https://api.razorpay.com/v1',
    keyId,
    keySecret,
    webhookSecret,
  };
}

export async function razorpayRequest<T>(
  config: RazorpayConfig,
  path: string,
  init: RequestInit = {}
): Promise<{ response: Response; payload: T | null }> {
  const headers = new Headers(init.headers);
  const authHeader = Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64');
  headers.set('Authorization', `Basic ${authHeader}`);
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

export type RazorpayPlanDetails = {
  id?: string;
  entity?: string;
  interval?: number;
  period?: string;
  item?: {
    id?: string;
    active?: boolean;
    name?: string;
    amount?: number;
    unit_amount?: number;
    currency?: string;
  };
};

/**
 * Server-side authoritative verification of a Razorpay plan.
 * Checks that the plan exists on Razorpay, is billed monthly in USD,
 * and matches exactly $999 or $1,299 USD (in cents: 99900 or 129900).
 */
export async function verifyRazorpayPlan(
  config: RazorpayConfig,
  planKey: string,
  planId: string
): Promise<{ valid: boolean; error?: string; plan?: RazorpayPlanDetails }> {
  const expected = RAZORPAY_PLAN_AMOUNTS[planKey];
  if (!expected) {
    return { valid: false, error: `Invalid subscription plan key: ${planKey}` };
  }

  try {
    const { response, payload } = await razorpayRequest<RazorpayPlanDetails>(
      config,
      `/plans/${encodeURIComponent(planId)}`,
      { method: 'GET' }
    );

    if (!response.ok || !payload || payload.id !== planId) {
      return {
        valid: false,
        error: `Plan ${planId} was not found on Razorpay (${response.status})`,
      };
    }

    const item = payload.item;
    const currency = item?.currency?.toUpperCase();
    const amount = item?.amount ?? item?.unit_amount;
    const interval = payload.interval ?? 1;
    const period = payload.period?.toLowerCase();

    if (currency !== 'USD') {
      return {
        valid: false,
        error: `Plan currency must be USD, received: ${currency}`,
      };
    }

    if (period !== 'monthly' && period !== 'month') {
      return {
        valid: false,
        error: `Plan billing period must be monthly, received: ${period}`,
      };
    }

    if (interval !== 1) {
      return {
        valid: false,
        error: `Plan billing interval must be 1 month, received: ${interval}`,
      };
    }

    if (amount !== expected.cents) {
      return {
        valid: false,
        error: `Plan amount ${amount} cents does not match expected ${expected.cents} cents ($${expected.usd})`,
      };
    }

    return { valid: true, plan: payload };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Plan verification failed';
    return { valid: false, error: message };
  }
}

/**
 * Verifies the payment callback signature returned by Razorpay Checkout
 * for recurring subscriptions:
 * HMAC SHA256 of `${razorpay_payment_id}|${razorpay_subscription_id}` using `keySecret`.
 */
export function verifyRazorpaySubscriptionPaymentSignature(
  params: {
    paymentId: string;
    subscriptionId: string;
    signature: string;
  },
  keySecret: string
): boolean {
  if (!params.paymentId || !params.subscriptionId || !params.signature || !keySecret) {
    return false;
  }

  try {
    const payload = `${params.paymentId}|${params.subscriptionId}`;
    const expected = createHmac('sha256', keySecret).update(payload).digest('hex');

    const expectedBuffer = Buffer.from(expected, 'hex');
    const actualBuffer = Buffer.from(params.signature, 'hex');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

/**
 * Verifies Razorpay Webhook signature against the raw body:
 * HMAC SHA256 of rawBody using `webhookSecret`.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string | null,
  webhookSecret: string
): boolean {
  if (!rawBody || !signature || !webhookSecret) {
    return false;
  }

  try {
    const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

    const expectedBuffer = Buffer.from(expected, 'hex');
    const actualBuffer = Buffer.from(signature, 'hex');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}
