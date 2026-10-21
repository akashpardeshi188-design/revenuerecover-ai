import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
  supabaseRestRequest,
} from '@/lib/supabase-rest';
import {
  getRazorpayConfig,
  razorpayRequest,
  verifyRazorpaySubscriptionPaymentSignature,
} from '@/lib/razorpay-rest';
import { supabaseServiceRpc } from '@/lib/paypal-rest';

export const runtime = 'nodejs';

type ActivePlanKey = 'growth' | 'revenue_partner';

type PendingSubscription = {
  id: string;
  company_id: string;
  provider: string;
  plan_tier: string;
  status: string;
  checkout_key: string | null;
  provider_subscription_id: string | null;
  provider_plan_id: string | null;
};

type RazorpaySubscriptionDetails = {
  id?: string;
  plan_id?: string;
  status?: string;
  notes?: Record<string, unknown>;
};

function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function isActivePlanKey(value: string): value is ActivePlanKey {
  return value === 'growth' || value === 'revenue_partner';
}

function expectedRazorpayPlanId(planKey: ActivePlanKey): string | null {
  const envName = {
    growth: 'RAZORPAY_PLAN_ID_GROWTH',
    revenue_partner: 'RAZORPAY_PLAN_ID_REVENUE_PARTNER',
  }[planKey];

  return process.env[envName]?.trim() || null;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid verification payload.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid verification payload.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const paymentId = typeof payload.razorpay_payment_id === 'string' ? payload.razorpay_payment_id.trim() : '';
  const subscriptionId =
    typeof payload.razorpay_subscription_id === 'string' ? payload.razorpay_subscription_id.trim() : '';
  const signature = typeof payload.razorpay_signature === 'string' ? payload.razorpay_signature.trim() : '';
  const internalSubscriptionId = payload.internalSubscriptionId;
  const checkoutKey = payload.checkoutKey;
  const submittedPlanId = typeof payload.planId === 'string' ? payload.planId.trim() : '';

  if (!paymentId || !subscriptionId || !signature || !isUuid(internalSubscriptionId) || !isUuid(checkoutKey)) {
    return NextResponse.json({ error: 'Missing required Razorpay payment callback details.' }, { status: 400 });
  }

  const config = getRazorpayConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'Razorpay is not configured for this deployment.' },
      { status: 503 }
    );
  }

  const auth = await resolveAuthContext(request).catch(() => null);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const profile = await getSupabaseProfile(auth.user.id, auth.accessToken);
  if (!profile?.company_id) {
    const response = NextResponse.json(
      { error: 'Company profile required.' },
      { status: 403 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  // 1. Verify the Razorpay callback HMAC before accepting any provider identifiers.
  const isValidSignature = verifyRazorpaySubscriptionPaymentSignature(
    { paymentId, subscriptionId, signature },
    config.keySecret
  );

  if (!isValidSignature) {
    console.warn('Razorpay payment callback signature verification failed', {
      paymentId,
      subscriptionId,
    });
    return NextResponse.json(
      { error: 'Razorpay payment signature could not be verified.' },
      { status: 400 }
    );
  }

  try {
    // 2. Load the pending checkout from this authenticated tenant. Never trust
    // the browser to choose the internal subscription, amount, or provider plan.
    const query = new URLSearchParams({
      id: `eq.${internalSubscriptionId}`,
      checkout_key: `eq.${checkoutKey}`,
      company_id: `eq.${profile.company_id}`,
      provider: 'eq.razorpay',
      select: 'id,company_id,provider,plan_tier,status,checkout_key,provider_subscription_id,provider_plan_id',
      limit: '1',
    });
    const pendingResponse = await supabaseRestRequest(
      `subscriptions?${query.toString()}`,
      auth.accessToken
    ).catch(() => null);

    if (!pendingResponse?.ok) {
      console.error('Razorpay checkout row lookup failed', {
        status: pendingResponse?.status ?? 'network_error',
      });
      return NextResponse.json(
        { error: 'Could not verify the pending subscription for this company.' },
        { status: 502 }
      );
    }

    const pendingRows = (await pendingResponse.json().catch(() => [])) as PendingSubscription[];
    const pending = pendingRows[0];
    if (
      !pending ||
      pending.company_id !== profile.company_id ||
      pending.checkout_key !== checkoutKey ||
      pending.provider !== 'razorpay'
    ) {
      return NextResponse.json(
        { error: 'The pending checkout was not found for this company.' },
        { status: 404 }
      );
    }

    if (!isActivePlanKey(pending.plan_tier)) {
      return NextResponse.json(
        { error: 'This plan is not available for new Razorpay subscriptions.' },
        { status: 400 }
      );
    }

    const expectedPlanId = expectedRazorpayPlanId(pending.plan_tier);
    if (!expectedPlanId) {
      return NextResponse.json(
        { error: 'The Razorpay plan is not configured for this deployment.' },
        { status: 503 }
      );
    }

    if (submittedPlanId && submittedPlanId !== expectedPlanId) {
      return NextResponse.json(
        { error: 'The selected Razorpay plan does not match the pending checkout.' },
        { status: 400 }
      );
    }

    if (
      (pending.status !== 'inactive' && pending.status !== 'active') ||
      (pending.provider_subscription_id && pending.provider_subscription_id !== subscriptionId) ||
      (pending.provider_plan_id && pending.provider_plan_id !== expectedPlanId)
    ) {
      return NextResponse.json(
        { error: 'The subscription does not match the pending checkout state.' },
        { status: 409 }
      );
    }

    // 3. Query Razorpay directly. The signed callback proves the payment/subscription
    // pair, while provider-side notes bind that subscription to this tenant/checkout.
    const providerResult = await razorpayRequest<RazorpaySubscriptionDetails>(
      config,
      `/subscriptions/${encodeURIComponent(subscriptionId)}`,
      { method: 'GET' }
    );

    const providerSubscription = providerResult.payload;
    const notes = providerSubscription?.notes ?? {};
    const providerMatchesCheckout =
      providerResult.response.ok &&
      providerSubscription?.id === subscriptionId &&
      providerSubscription.plan_id === expectedPlanId &&
      String(notes.company_id ?? '') === profile.company_id &&
      String(notes.checkout_key ?? '') === checkoutKey &&
      String(notes.subscription_id ?? '') === internalSubscriptionId &&
      String(notes.plan_key ?? '') === pending.plan_tier;

    if (!providerMatchesCheckout) {
      console.warn('Razorpay subscription did not match the signed checkout', {
        providerStatus: providerResult.response.status,
        subscriptionId,
        internalSubscriptionId,
      });
      return NextResponse.json(
        { error: 'Razorpay subscription details do not match this checkout.' },
        { status: 400 }
      );
    }

    // 4. Link using the server-derived canonical provider plan ID, not a client value.
    const linkResult = await supabaseServiceRpc<boolean>('link_razorpay_subscription', {
      p_subscription_id: internalSubscriptionId,
      p_checkout_key: checkoutKey,
      p_company_id: profile.company_id,
      p_provider_subscription_id: subscriptionId,
      p_provider_plan_id: expectedPlanId,
      p_provider_payment_id: paymentId,
    });

    if (!linkResult.response.ok || linkResult.payload !== true) {
      console.error('Failed linking Razorpay subscription in Supabase', {
        status: linkResult.response.status,
      });
      return NextResponse.json(
        { error: 'Could not record verified subscription in database.' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      verified: true,
      subscriptionId,
      paymentId,
    });
    return setRefreshedSessionIfNeeded(response, auth);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Subscription verification failed';
    console.error('Razorpay subscription verification error', { message });
    return NextResponse.json(
      { error: 'Could not complete subscription verification. Please refresh billing status.' },
      { status: 502 }
    );
  }
}
