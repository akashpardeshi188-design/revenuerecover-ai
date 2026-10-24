import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
  supabaseRestRequest,
} from '@/lib/supabase-rest';
import { getRazorpayConfig, razorpayRequest } from '@/lib/razorpay-rest';
import { supabaseServiceRpc } from '@/lib/paypal-rest';

export const runtime = 'nodejs';

type SubscriptionRow = {
  id: string;
  company_id: string;
  provider: string;
  status: string;
  provider_subscription_id: string | null;
};

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Choose a subscription to cancel.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body) ||
    !('subscriptionId' in body) ||
    typeof body.subscriptionId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.subscriptionId)
  ) {
    return NextResponse.json({ error: 'Valid subscription ID is required.' }, { status: 400 });
  }

  const subscriptionId = body.subscriptionId;
  const config = getRazorpayConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'Razorpay billing is not configured for this deployment.' },
      { status: 503 }
    );
  }

  const auth = await resolveAuthContext(request).catch(() => null);
  if (!auth) {
    return NextResponse.json({ error: 'Please sign in to manage billing.' }, { status: 401 });
  }

  const profile = await getSupabaseProfile(auth.user.id, auth.accessToken);
  if (!profile?.company_id) {
    const response = NextResponse.json(
      { error: 'Complete company onboarding before managing subscriptions.' },
      { status: 403 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  // Tenant Isolation: Query subscription scoped strictly to caller's company_id
  const query = new URLSearchParams({
    id: `eq.${subscriptionId}`,
    company_id: `eq.${profile.company_id}`,
    provider: 'eq.razorpay',
    select: 'id,company_id,provider,status,provider_subscription_id',
    limit: '1',
  });

  const rowResponse = await supabaseRestRequest(`subscriptions?${query.toString()}`, auth.accessToken);
  const rows = (await rowResponse.json().catch(() => [])) as SubscriptionRow[];
  const existing = rows[0];

  if (!rowResponse.ok || !existing) {
    return NextResponse.json(
      { error: 'Subscription not found for this company.' },
      { status: 404 }
    );
  }

  if (existing.status === 'canceled') {
    return NextResponse.json({ success: true, alreadyCanceled: true, status: 'canceled' });
  }

  // Cancel on Razorpay API if provider_subscription_id is present
  if (existing.provider_subscription_id) {
    const { response: razorpayResponse } = await razorpayRequest(
      config,
      `/subscriptions/${encodeURIComponent(existing.provider_subscription_id)}/cancel`,
      {
        method: 'POST',
        body: JSON.stringify({ cancel_at_cycle_end: 0 }),
      }
    );

    // 400 with "subscription already cancelled" is acceptable
    if (!razorpayResponse.ok && razorpayResponse.status !== 400) {
      console.error('Razorpay provider cancellation failed', {
        status: razorpayResponse.status,
        providerSubscriptionId: existing.provider_subscription_id,
      });
      return NextResponse.json(
        { error: 'Razorpay rejected the cancellation request. Please contact support.' },
        { status: 502 }
      );
    }
  }

  // Update status in Supabase via scoped RPC
  const rpcResult = await supabaseServiceRpc<boolean>('cancel_razorpay_subscription', {
    p_subscription_id: existing.id,
    p_company_id: profile.company_id,
    p_provider_subscription_id: existing.provider_subscription_id,
  });

  if (!rpcResult.response.ok) {
    console.error('Database subscription cancellation RPC failed', {
      status: rpcResult.response.status,
    });
    return NextResponse.json(
      { error: 'Subscription was cancelled with Razorpay, but local record update failed.' },
      { status: 502 }
    );
  }

  const response = NextResponse.json({
    success: true,
    status: 'canceled',
    message: 'Subscription has been cancelled.',
  });
  return setRefreshedSessionIfNeeded(response, auth);
}
