import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
  supabaseRestRequest,
} from '@/lib/supabase-rest';
import {
  getPayPalAccessToken,
  getPayPalConfig,
  payPalRequest,
  supabaseServiceRpc,
} from '@/lib/paypal-rest';

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
    return NextResponse.json({ error: 'Choose a subscription to cancel.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body) ||
    !('subscriptionId' in body) ||
    !isUuid(body.subscriptionId)
  ) {
    return NextResponse.json({ error: 'Invalid subscription reference.' }, { status: 400 });
  }

  const config = getPayPalConfig();
  if (!config || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Subscription cancellation is not configured for this deployment.' },
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
      { error: 'Complete company onboarding before managing billing.' },
      { status: 403 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  const query = new URLSearchParams({
    select: 'id,company_id,provider,provider_subscription_id,status',
    id: `eq.${body.subscriptionId}`,
    company_id: `eq.${profile.company_id}`,
    provider: 'eq.paypal',
    limit: '1',
  });
  const rowResponse = await supabaseRestRequest(
    `subscriptions?${query.toString()}`,
    auth.accessToken
  ).catch(() => null);

  if (!rowResponse?.ok) {
    const response = NextResponse.json(
      { error: 'Could not verify this subscription. Please retry.' },
      { status: rowResponse?.status === 401 ? 401 : 502 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  const rows = (await rowResponse.json().catch(() => [])) as Array<{
    id: string;
    company_id: string;
    provider: string;
    provider_subscription_id: string | null;
    status: string;
  }>;
  const subscription = rows[0];

  if (!subscription?.provider_subscription_id) {
    return NextResponse.json(
      { error: 'This checkout is not yet linked to an approved PayPal subscription.' },
      { status: 409 }
    );
  }
  if (subscription.status === 'canceled') {
    return NextResponse.json({ success: true, status: 'canceled' });
  }
  if (!['active', 'trialing', 'past_due', 'unpaid', 'inactive'].includes(subscription.status)) {
    return NextResponse.json(
      { error: 'This subscription cannot be canceled from its current state.' },
      { status: 409 }
    );
  }

  try {
    const accessToken = await getPayPalAccessToken(config);
    const canceled = await payPalRequest(
      config,
      accessToken,
      `/v1/billing/subscriptions/${encodeURIComponent(subscription.provider_subscription_id)}/cancel`,
      {
        method: 'POST',
        body: JSON.stringify({ reason: 'Cancellation requested by the account owner' }),
      }
    );

    // PayPal can return 204 (empty response) on successful cancellation.
    if (!canceled.response.ok) {
      console.error('PayPal subscription cancellation failed', {
        internalSubscriptionId: subscription.id,
        providerStatus: canceled.response.status,
      });
      return NextResponse.json(
        { error: 'PayPal could not cancel the subscription. Please retry or contact support.' },
        { status: 502 }
      );
    }

    const databaseResult = await supabaseServiceRpc<boolean>('cancel_paypal_subscription', {
      p_subscription_id: subscription.id,
      p_company_id: subscription.company_id,
      p_provider_subscription_id: subscription.provider_subscription_id,
    });

    if (!databaseResult.response.ok || databaseResult.payload !== true) {
      // PayPal has accepted the cancellation; the verified webhook can still sync
      // status. Do not claim that the database record was updated in this request.
      console.error('PayPal cancellation succeeded but internal status sync failed', {
        internalSubscriptionId: subscription.id,
        databaseStatus: databaseResult.response.status,
      });
      const response = NextResponse.json({
        success: true,
        status: 'sync_pending',
        message: 'PayPal accepted the cancellation. The subscription status is still syncing.',
      });
      return setRefreshedSessionIfNeeded(response, auth);
    }

    const response = NextResponse.json({ success: true, status: 'canceled' });
    return setRefreshedSessionIfNeeded(response, auth);
  } catch (error: unknown) {
    console.error('Subscription cancellation failed', {
      internalSubscriptionId: subscription.id,
      errorCode: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    });
    return NextResponse.json(
      { error: 'Could not complete cancellation right now. Please retry.' },
      { status: 502 }
    );
  }
}
