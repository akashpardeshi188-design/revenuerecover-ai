import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  getSafeSupabaseError,
  resolveAuthContext,
  supabaseRestRequest,
  setRefreshedSessionIfNeeded,
} from '@/lib/supabase-rest';
import {
  getRazorpayConfig,
  razorpayRequest,
  verifyRazorpayPlan,
  RAZORPAY_PLAN_AMOUNTS,
} from '@/lib/razorpay-rest';

export const runtime = 'nodejs';

const PLAN_KEYS = ['starter', 'growth', 'revenue_partner'] as const;
type PlanKey = (typeof PLAN_KEYS)[number];

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

type RazorpaySubscriptionResponse = {
  id: string;
  entity: string;
  plan_id: string;
  status: string;
  short_url?: string;
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

function razorpayPlanIdFor(planKey: PlanKey): string | null {
  const envMap: Record<PlanKey, string[]> = {
    starter: ['RAZORPAY_PLAN_ID_STARTER', 'RAZORPAY_STARTER_PLAN_ID'],
    growth: ['RAZORPAY_PLAN_ID_GROWTH', 'RAZORPAY_GROWTH_PLAN_ID'],
    revenue_partner: [
      'RAZORPAY_PLAN_ID_REVENUE_PARTNER',
      'RAZORPAY_REVENUE_PLAN_ID',
      'RAZORPAY_PLAN_ID_REVENUE',
    ],
  };

  const candidateNames = envMap[planKey] || [];
  for (const name of candidateNames) {
    const val = process.env[name]?.trim();
    if (val) return val;
  }
  return null;
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
  const config = getRazorpayConfig();

  if (!config || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Razorpay subscription checkout is not configured for this deployment.' },
      { status: 503 }
    );
  }

  const planId = razorpayPlanIdFor(planKey);
  if (!planId) {
    return NextResponse.json(
      { error: `The ${planKey} subscription plan is not yet configured for Razorpay. Please contact support.` },
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
    // 1. Authoritative server-side plan verification on Razorpay
    const planVerification = await verifyRazorpayPlan(config, planKey, planId);
    if (!planVerification.valid) {
      console.error('Razorpay plan verification failed', {
        planKey,
        configuredPlanId: planId,
        error: planVerification.error,
      });
      return NextResponse.json(
        {
          error: `The configured Razorpay plan does not match the required monthly price ($${RAZORPAY_PLAN_AMOUNTS[planKey].usd} USD). Please contact support.`,
        },
        { status: 503 }
      );
    }

    // 2. Prepare pending subscription record in staging DB
    const prepareResponse = await supabaseRestRequest(
      'rpc/prepare_razorpay_checkout',
      auth.accessToken,
      {
        method: 'POST',
        body: JSON.stringify({ p_plan_key: planKey, p_checkout_key: checkoutKey }),
      }
    );

    const preparePayload = (await prepareResponse.json().catch(() => ({}))) as unknown;
    if (!prepareResponse.ok) {
      const errorMsg = getSafeSupabaseError(preparePayload, 'Could not prepare subscription checkout.');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const prepared = preparePayload as PreparedCheckout;

    // 3. Create Subscription on Razorpay API
    const { response: subResponse, payload: subPayload } =
      await razorpayRequest<RazorpaySubscriptionResponse>(config, '/subscriptions', {
        method: 'POST',
        body: JSON.stringify({
          plan_id: planId,
          total_count: 60, // 5-year recurring monthly cycle
          quantity: 1,
          customer_notify: 1,
          notes: {
            company_id: profile.company_id,
            checkout_key: checkoutKey,
            plan_key: planKey,
            subscription_id: prepared.subscription_id,
          },
        }),
      });

    if (!subResponse.ok || !subPayload?.id) {
      console.error('Razorpay subscription creation failed', {
        status: subResponse.status,
        payload: subPayload,
      });
      return NextResponse.json(
        { error: 'Could not create subscription with Razorpay. Please retry.' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      subscriptionId: subPayload.id,
      keyId: config.keyId,
      planKey,
      planId,
      amount: prepared.amount,
      currency: 'USD',
      checkoutKey,
      internalSubscriptionId: prepared.subscription_id,
    });

    return setRefreshedSessionIfNeeded(response, auth);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Subscription checkout failed.';
    console.error('Razorpay subscription checkout error', { message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
