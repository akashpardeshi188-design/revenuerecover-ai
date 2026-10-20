import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
  supabaseRestRequest,
} from '@/lib/supabase-rest';

type CompanyRow = {
  id: string;
  name: string;
  status: string;
  city: string;
  state: string;
  website: string;
  created_at: string;
};

type LeadRow = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  service_requested: string | null;
  status: string;
  estimated_job_value: number | null;
  created_at: string;
};

type OpportunityStatus = 'detected' | 'in_progress' | 'recovered' | 'lost' | 'dismissed';

type OpportunityRow = {
  id: string;
  client_lead_id: string | null;
  reason: string;
  age_hours: number;
  estimated_opportunity: string;
  recommended_action: string;
  status: OpportunityStatus;
  recovered_value: number | null;
  created_at: string;
};

type PaymentRow = {
  id: string;
  amount: number | string;
  currency: string;
  status: string;
  created_at: string;
  payer_email: string | null;
  payer_name: string | null;
};

type SubscriptionRow = {
  plan_tier: string;
  amount: number | string | null;
  status: string;
  provider: string;
  created_at: string;
  current_period_end: string | null;
};

async function getRows<T>(path: string, accessToken: string): Promise<T[]> {
  const response = await supabaseRestRequest(path, accessToken, { method: 'GET' });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error('SUPABASE_QUERY_FAILED');
  }

  return Array.isArray(payload) ? (payload as T[]) : [];
}

function parseEstimatedAmount(value: string | null | undefined): number {
  if (!value) return 0;
  const match = value.replace(/,/g, '').match(/(?:\$|USD\s*)?\s*(\d+(?:\.\d{1,2})?)/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

export async function GET(request: NextRequest) {
  const auth = await resolveAuthContext(request).catch(() => null);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const profile = await getSupabaseProfile(auth.user.id, auth.accessToken);
  if (!profile?.company_id) {
    const response = NextResponse.json(
      { error: 'Complete company onboarding before opening the dashboard.' },
      { status: 409 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  const companyFilter = encodeURIComponent(profile.company_id);

  try {
    const [companies, leads, opportunities, payments, subscriptions] = await Promise.all([
      getRows<CompanyRow>(
        'companies?id=eq.' + companyFilter + '&select=id,name,status,city,state,website,created_at&limit=1',
        auth.accessToken
      ),
      getRows<LeadRow>(
        'client_leads?company_id=eq.' + companyFilter +
          '&select=id,customer_name,customer_email,customer_phone,service_requested,status,estimated_job_value,created_at' +
          '&order=created_at.desc&limit=100',
        auth.accessToken
      ),
      getRows<OpportunityRow>(
        'recovery_opportunities?company_id=eq.' + companyFilter +
          '&select=id,client_lead_id,reason,age_hours,estimated_opportunity,recommended_action,status,recovered_value,created_at' +
          '&order=created_at.desc&limit=1000',
        auth.accessToken
      ),
      getRows<PaymentRow>(
        'payments?company_id=eq.' + companyFilter +
          '&select=id,amount,currency,status,created_at,payer_email,payer_name' +
          '&order=created_at.desc&limit=10',
        auth.accessToken
      ),
      getRows<SubscriptionRow>(
        'subscriptions?company_id=eq.' + companyFilter +
          '&select=plan_tier,amount,status,provider,created_at,current_period_end' +
          '&order=created_at.desc&limit=1',
        auth.accessToken
      ),
    ]);

    if (companies.length === 0) {
      const response = NextResponse.json(
        { error: 'The company profile is not accessible. Please sign in again or contact support.' },
        { status: 403 }
      );
      return setRefreshedSessionIfNeeded(response, auth);
    }

    const leadById = new Map(leads.map((lead) => [lead.id, lead]));
    const hydratedOpportunities = opportunities.map((opportunity) => {
      const lead = opportunity.client_lead_id
        ? leadById.get(opportunity.client_lead_id)
        : undefined;
      return {
        ...opportunity,
        customerName: lead?.customer_name ?? 'Customer details unavailable',
        customerPhone: lead?.customer_phone ?? null,
        customerEmail: lead?.customer_email ?? null,
        serviceRequested: lead?.service_requested ?? null,
        estimatedValue: parseEstimatedAmount(opportunity.estimated_opportunity),
      };
    });

    const active = opportunities.filter(
      (opportunity) => !['recovered', 'lost', 'dismissed'].includes(opportunity.status)
    );
    const recovered = opportunities.filter((opportunity) => opportunity.status === 'recovered');
    const atRiskTotal = active.reduce(
      (total, opportunity) => total + parseEstimatedAmount(opportunity.estimated_opportunity),
      0
    );
    const identifiedTotal = opportunities.reduce(
      (total, opportunity) => total + parseEstimatedAmount(opportunity.estimated_opportunity),
      0
    );
    const confirmedRecoveredTotal = recovered.reduce(
      (total, opportunity) => total + Math.max(0, Number(opportunity.recovered_value ?? 0)),
      0
    );

    const response = NextResponse.json(
      {
        success: true,
        company: companies[0],
        metrics: {
          confirmedRecoveredTotal,
          atRiskTotal,
          identifiedTotal,
          recoveryRate: opportunities.length > 0
            ? Math.round((recovered.length / opportunities.length) * 100)
            : 0,
          activeOpportunities: active.length,
          opportunitiesLoaded: opportunities.length,
          leadsLoaded: leads.length,
          paymentsLogged: payments.length,
        },
        recentOpportunities: hydratedOpportunities.slice(0, 20),
        recentLeads: leads.slice(0, 10),
        latestPayment: payments[0] ?? null,
        latestSubscription: subscriptions[0] ?? null,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );

    return setRefreshedSessionIfNeeded(response, auth);
  } catch {
    const response = NextResponse.json(
      { error: 'Dashboard data could not be loaded from staging. Check the database grants and RLS policies.' },
      { status: 502 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }
}
