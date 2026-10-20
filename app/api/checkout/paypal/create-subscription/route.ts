import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  getSafeSupabaseError,
  resolveAuthContext,
  supabaseRestRequest,
  setRefreshedSessionIfNeeded,
} from '@/lib/supabase-rest';
import {
  createPayPalRequestId,
  getConfiguredAppBaseUrl,
  getPayPalAccessToken,
  getPayPalApprovalUrl,
  getPayPalConfig,
  payPalRequest,
  supabaseServiceRpc,
  type PayPalMode,
} from '@/lib/paypal-rest';

export const runtime = 'nodejs';

const PLAN_KEYS = ['starter', 'growth', 'revenue_partner'] as const;
type PlanKey = (typeof PLAN_KEYS)[number];

type PlanQuote = {
  plan_key: PlanKey;
  amount: number;
  currency: string;
  interval_unit: string;
  interval_count: number;
};

type PreparedCheckout = {
  subscription_id: string;
  company_id: string;
  plan_key: PlanKey;
  amount: number;
  currency: string;
  provider_subscription_id: string | null;
  provider_plan_id: string | null;
  status: string;
};

type PayPalPlan = {
  id?: string;
  status?: string;
  billing_cycles?: Array<{
    tenure_type?: string;
    frequency?: { interval_unit?: string; interval_count?: number };
    pricing_scheme?: {
      fixed_price?: { value?: string; currency_code?: string };
    };
  }>;
};

type PayPalSubscription = {
  id?: string;
  status?: string;
  links?: Array<{ rel?: string; href?: string }>;
};

function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === 'string' && PLAN_KEYS.includes(value as PlanKey);
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function payPalPlanIdFor(planKey: PlanKey): string | null {
  const envName = {
    starter: 'PAYPAL_PLAN_ID_STARTER',
    growth: 'PAYPAL_PLAN_ID_GROWTH',
    revenue_partner: 'PAYPAL_PLAN_ID_REVENUE_PARTNER',
  }[planKey];

  return process.env[envName]?.trim() || null;
}

async function readRpcPayload<T>(
  response: Response,
  fallback: string
): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as unknown;
  if (!response.ok) {
    throw new Error(getSafeSupabaseError(payload, fallback));
  }
  return payload as T;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Choose a subscription plan and retry.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body) ||
    !('planKey' in body) ||
    !isPlanKey(body.planKey) ||
    !('checkoutKey' in body) ||
    !isUuid(body.checkoutKey)
  ) {
    return NextResponse.json({ error: 'Invalid subscription checkout request.' }, { status: 400 });
  }

  const planKey = body.planKey;
  const checkoutKey = body.checkoutKey;
  const config = getPayPalConfig();
  const appBaseUrl = getConfiguredAppBaseUrl();
  if (!config || !appBaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Subscription checkout is not configured for this deployment.' },
      { status: 503 }
    );
  }

  const planId = payPalPlanIdFor(planKey);
  if (!planId) {
    return NextResponse.json(
      { error: 'This subscription plan is not yet enabled. Please contact support.' },
      { status: 503 }
    );
  }

  const auth = await resolveAuthContext(request).catch(() => null);
  if (!auth) {
    return NextResponse.json({ error: 'Please sign in before starting a subscription.' }, { status: 401 });
  }

  const profile = await getSupabaseProfile(auth.user.id, auth.accessToken);
  if (!profile?.company_id) {
    const response = NextResponse.json(
      { error: 'Complete company onboarding before selecting a subscription.' },
      { status: 403 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  try {
    // Read the authoritative plan quote from staging's subscription settings.
    const quoteResponse = await supabaseRestRequest('rpc/get_paypal_plan_quote', auth.accessToken, {
      method: 'POST',
      body: JSON.stringify({ p_plan_key: planKey }),
    });
    const quote = await readRpcPayload<PlanQuote>(
      quoteResponse,
      'Could not verify this subscription price.'
    );

    const accessToken = await getPayPalAccessToken(config);
    const planResult = await payPalRequest<PayPalPlan>(
      config,
      accessToken,
      `/v1/billing/plans/${encodeURIComponent(planId)}`,
      { method: 'GET' }
    );

    const providerPlan = planResult.payload;
    const regularMonthlyCycle = providerPlan?.billing_cycles?.find(
      (cycle) =>
        cycle.tenure_type === 'REGULAR' &&
        cycle.frequency?.interval_unit === 'MONTH' &&
        (cycle.frequency.interval_count ?? 1) === 1
    );
    const fixedPrice = regularMonthlyCycle?.pricing_scheme?.fixed_price;
    const expectedAmount = Number(quote.amount).toFixed(2);
    if (
      !planResult.response.ok ||
      providerPlan?.id !== planId ||
      providerPlan.status !== 'ACTIVE' ||
      quote.currency !== 'USD' ||
      quote.interval_unit !== 'MONTH' ||
      quote.interval_count !== 1 ||
      !fixedPrice ||
      fixedPrice.currency_code?.toUpperCase() !== 'USD' ||
      !Number.isFinite(Number(fixedPrice.value)) ||
      Number(fixedPrice.value).toFixed(2) !== expectedAmount
    ) {
      console.error('PayPal plan verification failed', {
        planKey,
        configuredPlanId: planId,
        httpStatus: planResult.response.status,
      });
      return NextResponse.json(
        { error: 'The configured PayPal plan does not match the selected monthly price. Please contact support.' },
        { status: 503 }
      );
    }

    const prepareResponse = await supabaseRestRequest('rpc/prepare_paypal_checkout', auth.accessToken, {
      method: 'POST',
      body: JSON.stringify({ p_plan_key: planKey, p_checkout_key: checkoutKey }),
    });
    const prepared = await readRpcPayload<PreparedCheckout>(
      prepareResponse,
      'Could not prepare subscription checkout.'
    );

    // A repeated request with the same checkout key returns the already-linked subscription.
    if (prepared.provider_subscription_id) {
      const existingResult = await payPalRequest<PayPalSubscription>(
        config,
        accessToken,
        `/v1/billing/subscriptions/${encodeURIComponent(prepared.provider_subscription_id)}`,
        { method: 'GET' }
      );
      if (existingResult.response.ok && existingResult.payload) {
        const existing = existingResult.payload;
        if (existing.status === 'ACTIVE') {
          const response = NextResponse.json({
            success: true,
            alreadyActive: true,
            subscriptionId: existing.id,
            status: existing.status,
          });
          return setRefreshedSessionIfNeeded(response, auth);
        }

        const approvalUrl = getPayPalApprovalUrl(existing.links, config.mode as PayPalMode);
        if (approvalUrl) {
          const response = NextResponse.json({
            success: true,
            subscriptionId: existing.id,
            status: existing.status,
            approvalUrl,
            amount: prepared.amount,
            currency: prepared.currency,
          });
          return setRefreshedSessionIfNeeded(response, auth);
        }
      }

      return NextResponse.json(
        { error: 'This checkout attempt has already been used. Refresh the page to start a new attempt.' },
        { status: 409 }
      );
    }

    const requestId = createPayPalRequestId(prepared.company_id, checkoutKey, planId);
    const subscriptionResult = await payPalRequest<PayPalSubscription>(
      config,
      accessToken,
      '/v1/billing/subscriptions',
      {
        method: 'POST',
        headers: { 'PayPal-Request-Id': requestId },
        body: JSON.stringify({
          plan_id: planId,
          custom_id: prepared.subscription_id,
          application_context: {
            brand_name: 'RevenueRecover AI',
            locale: 'en-US',
            user_action: 'SUBSCRIBE_NOW',
            shipping_preference: 'NO_SHIPPING',
            return_url: `${appBaseUrl}/dashboard/billing?checkout=approved`,
            cancel_url: `${appBaseUrl}/dashboard/billing?checkout=cancelled`,
          },
        }),
      }
    );

    const created = subscriptionResult.payload;
    if (!subscriptionResult.response.ok || !created?.id || !created.links) {
      const debug = await import('@/lib/paypal-rest').then((m) => m.safelyReadError(subscriptionResult.response));
      console.error('PayPal subscription creation failed', {
        status: subscriptionResult.response.status,
        debug,
      });
      return NextResponse.json(
        { error: 'PayPal could not create the subscription. Please try again or contact support.' },
        { status: 502 }
      );
    }

    const approvalUrl = getPayPalApprovalUrl(created.links, config.mode as PayPalMode);
    if (!approvalUrl) {
      console.error('PayPal did not return a trusted approval URL', {
        status: created.status,
        subscriptionId: created.id,
      });
      return NextResponse.json(
        { error: 'PayPal did not return an approval link for this subscription.' },
        { status: 502 }
      );
    }

    // Privileged linking is restricted to service_role in Postgres. The company
    // and plan IDs here come from the authenticated RPC + server configuration.
    const linkResult = await supabaseServiceRpc<boolean>('link_paypal_subscription', {
      p_subscription_id: prepared.subscription_id,
      p_checkout_key: checkoutKey,
      p_company_id: prepared.company_id,
      p_provider_subscription_id: created.id,
      p_provider_plan_id: planId,
    });

    if (!linkResult.response.ok || linkResult.payload !== true) {
      await payPalRequest(config, accessToken, `/v1/billing/subscriptions/${encodeURIComponent(created.id)}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Could not attach subscription to the customer record' }),
      }).catch(() => null);
      console.error('Unable to link PayPal subscription to internal record', {
        status: linkResult.response.status,
      });
      return NextResponse.json(
        { error: 'Subscription was created but could not be linked safely. No activation was recorded; contact support.' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      subscriptionId: created.id,
      status: created.status ?? 'APPROVAL_PENDING',
      approvalUrl,
      amount: prepared.amount,
      currency: prepared.currency,
    });
    return setRefreshedSessionIfNeeded(response, auth);
  } catch (error: unknown) {
    console.error('PayPal subscription checkout failed', error);
    const message =
      error instanceof Error &&
      ['SUPABASE_AUTH_NOT_CONFIGURED', 'SUPABASE_SERVICE_ROLE_NOT_CONFIGURED'].includes(error.message)
        ? 'Subscription checkout is not configured for this deployment.'
        : 'Could not start PayPal checkout. Please try again.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
