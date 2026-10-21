import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
} from '@/lib/supabase-rest';
import {
  getRazorpayConfig,
  verifyRazorpaySubscriptionPaymentSignature,
} from '@/lib/razorpay-rest';
import { supabaseServiceRpc } from '@/lib/paypal-rest';

export const runtime = 'nodejs';

function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
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
  const subscriptionId = typeof payload.razorpay_subscription_id === 'string' ? payload.razorpay_subscription_id.trim() : '';
  const signature = typeof payload.razorpay_signature === 'string' ? payload.razorpay_signature.trim() : '';
  const internalSubscriptionId = payload.internalSubscriptionId;
  const checkoutKey = payload.checkoutKey;
  const planId = typeof payload.planId === 'string' ? payload.planId.trim() : '';

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

  // 1. Verify Callback Signature with HMAC SHA-256
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

  // 2. Authoritatively Link Subscription and Record Payment in Supabase
  try {
    const linkResult = await supabaseServiceRpc<boolean>('link_razorpay_subscription', {
      p_subscription_id: internalSubscriptionId,
      p_checkout_key: checkoutKey,
      p_company_id: profile.company_id,
      p_provider_subscription_id: subscriptionId,
      p_provider_plan_id: planId || 'plan_razorpay',
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
    const message = error instanceof Error ? error.message : 'Database linking failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
