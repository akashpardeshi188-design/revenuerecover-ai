import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
  supabaseRestRequest,
} from '@/lib/supabase-rest';

export async function GET(request: NextRequest) {
  const auth = await resolveAuthContext(request).catch(() => null);
  if (!auth) {
    return NextResponse.json({ error: 'Please sign in to view billing.' }, { status: 401 });
  }

  const profile = await getSupabaseProfile(auth.user.id, auth.accessToken);
  if (!profile?.company_id) {
    const response = NextResponse.json(
      { error: 'Complete company onboarding before viewing billing.' },
      { status: 403 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  const query = new URLSearchParams({
    select: 'id,checkout_key,provider,plan_tier,amount,amount_cents,currency,status,provider_subscription_id,provider_plan_id,created_at,updated_at,last_payment_at,canceled_at',
    company_id: `eq.${profile.company_id}`,
    // provider-agnostic to support both Razorpay and PayPal
    order: 'created_at.desc',
    limit: '10',
  });

  const response = await supabaseRestRequest(
    `subscriptions?${query.toString()}`,
    auth.accessToken
  ).catch(() => null);

  if (!response?.ok) {
    const result = NextResponse.json(
      { error: 'Could not load billing details right now.' },
      { status: response?.status === 401 ? 401 : 502 }
    );
    return setRefreshedSessionIfNeeded(result, auth);
  }

  const subscriptions = (await response.json().catch(() => [])) as Array<Record<string, unknown>>;
  const result = NextResponse.json({ subscriptions });
  return setRefreshedSessionIfNeeded(result, auth);
}
