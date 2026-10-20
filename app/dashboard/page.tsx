'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CircleDollarSign,
  Clock3,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from 'lucide-react';

type Company = {
  id: string; name: string; status: string; city: string; state: string;
  website: string; created_at: string;
};
type Opportunity = {
  id: string; client_lead_id: string | null; reason: string; age_hours: number;
  estimated_opportunity: string; recommended_action: string;
  status: 'detected' | 'in_progress' | 'recovered' | 'lost' | 'dismissed';
  recovered_value: number | null; created_at: string; customerName: string;
  customerPhone: string | null; customerEmail: string | null;
  serviceRequested: string | null; estimatedValue: number;
};
type Lead = {
  id: string; customer_name: string; customer_email: string | null;
  customer_phone: string | null; service_requested: string | null;
  status: string; estimated_job_value: number | null; created_at: string;
};
type Summary = {
  success: true; company: Company;
  metrics: {
    confirmedRecoveredTotal: number; atRiskTotal: number; identifiedTotal: number;
    recoveryRate: number; activeOpportunities: number; opportunitiesLoaded: number;
    leadsLoaded: number; paymentsLogged: number;
  };
  recentOpportunities: Opportunity[];
  recentLeads: Lead[];
  latestPayment: {
    amount: number | string; currency: string; status: string; created_at: string;
    payer_email: string | null; payer_name: string | null;
  } | null;
  latestSubscription: {
    plan_tier: string; amount: number | string | null; status: string;
    provider: string; created_at: string; current_period_end: string | null;
  } | null;
};

function currency(value: number | string | null | undefined): string {
  const amount = typeof value === 'string' ? Number(value) : Number(value ?? 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}
function readableStatus(status: string): string {
  return status.replace(/_/g, ' ');
}
function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState('');
  const [recoveringId, setRecoveringId] = useState('');
  const [recoveredAmount, setRecoveredAmount] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/dashboard/summary', {
        method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' },
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string; success?: boolean;
      } & Partial<Summary>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || (response.status === 401
          ? 'Your session expired. Sign in again to continue.'
          : 'Dashboard data is unavailable.'));
      }
      setData(payload as Summary);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : 'Dashboard data is unavailable.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const updateStatus = async (
    opportunity: Opportunity,
    status: 'in_progress' | 'recovered' | 'lost' | 'dismissed',
    amount?: number
  ) => {
    setPendingId(opportunity.id);
    setError('');
    try {
      const response = await fetch('/api/recovery-opportunities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          id: opportunity.id, status,
          ...(status === 'recovered' ? { recoveredValue: amount } : {}),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Could not update this recovery opportunity.');
      setRecoveringId('');
      setRecoveredAmount('');
      await loadDashboard();
    } catch (updateError: unknown) {
      setError(updateError instanceof Error ? updateError.message : 'Could not save the update.');
    } finally {
      setPendingId('');
    }
  };

  const submitRecoveredAmount = (opportunity: Opportunity) => {
    const parsed = Number(recoveredAmount);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
      setError('Enter the actual recovered amount in USD as a positive whole number.');
      return;
    }
    void updateStatus(opportunity, 'recovered', parsed);
  };

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-slate-300">
          <LoaderCircle className="h-5 w-5 animate-spin text-emerald-400" />
          Loading your company dashboard from staging…
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Dashboard connection failed</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">{error || 'We could not load your company data.'}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This page reads from the staging database and does not fall back to fictional demo records.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => void loadDashboard()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-300">
              <RefreshCw className="h-4 w-4" /> Retry connection
            </button>
            <a href="/login" className="inline-flex items-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800">
              Go to login
            </a>
          </div>
        </div>
      </main>
    );
  }

  const company = data.company;
  const metrics = data.metrics;
  const loadedAt = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
                <Wrench className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">RevenueRecover AI</h1>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Staging
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {company.name}
              {(company.city || company.state) && (
                <> · {[company.city, company.state].filter(Boolean).join(', ')}</>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Company-scoped database access
            </div>
            <button onClick={() => void loadDashboard()} disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50">
              <RefreshCw className={'h-3.5 w-3.5 ' + (loading ? 'animate-spin' : '')} /> Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Recovery overview</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Your revenue recovery workspace</h2>
            <p className="mt-2 text-sm text-slate-400">
              Metrics below come from your staging database, not sample dashboard data.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-4 w-4" /> Last loaded {loadedAt}
          </div>
        </section>

        {error && (
          <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            <span>{error}</span>
            <button className="shrink-0 underline" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Confirmed recovered" value={currency(metrics.confirmedRecoveredTotal)}
            detail="Amounts manually recorded as recovered" accent="emerald" icon={<CircleDollarSign className="h-5 w-5" />} />
          <MetricCard title="Revenue at risk" value={currency(metrics.atRiskTotal)}
            detail={metrics.activeOpportunities + ' active opportunities'} accent="rose" icon={<TrendingUp className="h-5 w-5" />} />
          <MetricCard title="Identified opportunity" value={currency(metrics.identifiedTotal)}
            detail={metrics.opportunitiesLoaded + ' opportunities in database'} accent="cyan" icon={<TrendingUp className="h-5 w-5" />} />
          <MetricCard title="Recovery rate" value={metrics.recoveryRate + '%'}
            detail={metrics.leadsLoaded + ' customer leads · ' + metrics.paymentsLogged + ' payment records'} accent="violet" icon={<TrendingUp className="h-5 w-5" />} />
        </section>

        <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h3 className="text-sm font-bold text-amber-100">Staging safety notice</h3>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                These controls update database statuses only. Automated SMS/email dispatch is not enabled here,
                and no live PayPal payments are collected from this dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
          <div className="flex flex-col gap-2 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recovery opportunities</h3>
              <p className="mt-1 text-sm text-slate-400">Update the status of records belonging to {company.name}.</p>
            </div>
            <span className="text-xs text-slate-400">{data.recentOpportunities.length} shown · up to 20 most recent</span>
          </div>

          {data.recentOpportunities.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="mt-4 font-semibold text-white">No recovery opportunities yet</h4>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
                The staging database has no recovery opportunity rows for this company yet. Once leads and recovery
                records are added, they will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {data.recentOpportunities.map((opportunity) => (
                <article key={opportunity.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-white">{opportunity.customerName}</h4>
                        <StatusPill status={opportunity.status} />
                        <span className="text-xs text-slate-500">Added {formatDate(opportunity.created_at)}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{opportunity.reason}</p>
                      {opportunity.serviceRequested && (
                        <p className="mt-1 text-xs text-slate-400">Service: {opportunity.serviceRequested}</p>
                      )}
                      {(opportunity.customerPhone || opportunity.customerEmail) && (
                        <p className="mt-1 text-xs text-slate-400">
                          {[opportunity.customerPhone, opportunity.customerEmail].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {opportunity.recommended_action && (
                        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recommended next step</p>
                          <p className="mt-1 text-sm leading-6 text-slate-300">{opportunity.recommended_action}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 xl:w-56 xl:shrink-0">
                      <div className="xl:text-right">
                        <p className="text-xs text-slate-500">Estimated opportunity</p>
                        <p className="mt-1 text-2xl font-extrabold text-white">{currency(opportunity.estimatedValue)}</p>
                        {opportunity.status === 'recovered' && (
                          <p className="mt-1 text-xs text-emerald-300">Recorded recovered: {currency(opportunity.recovered_value)}</p>
                        )}
                      </div>

                      {opportunity.status === 'detected' && (
                        <button disabled={pendingId === opportunity.id}
                          onClick={() => void updateStatus(opportunity, 'in_progress')}
                          className="rounded-xl bg-cyan-300 px-3 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-50">
                          {pendingId === opportunity.id ? 'Saving…' : 'Start recovery'}
                        </button>
                      )}

                      {['detected', 'in_progress'].includes(opportunity.status) && (
                        <>
                          {recoveringId === opportunity.id ? (
                            <div className="space-y-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
                              <label htmlFor={'recovered-' + opportunity.id} className="block text-xs font-semibold text-emerald-100">
                                Actual recovered amount (USD)
                              </label>
                              <input id={'recovered-' + opportunity.id} type="number" inputMode="numeric" min="1" step="1"
                                value={recoveredAmount} onChange={(event) => setRecoveredAmount(event.target.value)}
                                placeholder="e.g. 1250"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400" />
                              <div className="flex gap-2">
                                <button disabled={pendingId === opportunity.id}
                                  onClick={() => submitRecoveredAmount(opportunity)}
                                  className="flex-1 rounded-lg bg-emerald-400 px-2 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50">Confirm</button>
                                <button onClick={() => { setRecoveringId(''); setRecoveredAmount(''); }}
                                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button disabled={pendingId === opportunity.id}
                              onClick={() => { setRecoveringId(opportunity.id); setRecoveredAmount(''); setError(''); }}
                              className="rounded-xl bg-emerald-400 px-3 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50">Mark recovered</button>
                          )}
                          <button disabled={pendingId === opportunity.id} onClick={() => void updateStatus(opportunity, 'lost')}
                            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50">Mark lost</button>
                          <button disabled={pendingId === opportunity.id} onClick={() => void updateStatus(opportunity, 'dismissed')}
                            className="rounded-xl border border-slate-800 px-3 py-2 text-xs text-slate-500 hover:text-slate-300 disabled:opacity-50">Dismiss opportunity</button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <h3 className="text-base font-bold text-white">Recent customer leads</h3>
            <p className="mt-1 text-sm text-slate-400">Customer records loaded from the company database.</p>
            {data.recentLeads.length === 0 ? (
              <p className="py-8 text-sm text-slate-500">No customer leads have been recorded for this company yet.</p>
            ) : (
              <div className="mt-4 divide-y divide-slate-800">
                {data.recentLeads.map((lead) => (
                  <div key={lead.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{lead.customer_name}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {[lead.customer_email, lead.customer_phone, lead.service_requested].filter(Boolean).join(' · ') || 'No contact details'}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <StatusPill status={lead.status} />
                      {lead.estimated_job_value !== null && <p className="mt-1 text-xs text-slate-400">{currency(lead.estimated_job_value)} estimated</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <h3 className="text-base font-bold text-white">Billing snapshot</h3>
            <p className="mt-1 text-sm text-slate-400">Staging billing records only. Live billing is not enabled.</p>
            {data.latestSubscription ? (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold capitalize text-white">{readableStatus(data.latestSubscription.plan_tier)} plan</span>
                  <StatusPill status={data.latestSubscription.status} />
                </div>
                <p className="mt-3 text-2xl font-extrabold text-white">
                  {currency(data.latestSubscription.amount)} <span className="text-sm font-normal text-slate-500">/ month</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">Provider: {data.latestSubscription.provider}</p>
              </div>
            ) : (
              <p className="py-8 text-sm text-slate-500">No subscription record exists for this company yet.</p>
            )}
            {data.latestPayment && (
              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">Latest payment record</span>
                  <StatusPill status={data.latestPayment.status} />
                </div>
                <p className="mt-2 text-xl font-bold text-white">{currency(data.latestPayment.amount)} {data.latestPayment.currency.toUpperCase()}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {data.latestPayment.payer_name || data.latestPayment.payer_email || 'Payer not listed'} · {formatDate(data.latestPayment.created_at)}
                </p>
              </div>
            )}
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-slate-800 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>RevenueRecover AI · Staging environment</span>
          <span>Records are filtered by the signed-in company and protected by database RLS.</span>
        </footer>
      </div>
    </main>
  );
}

function MetricCard({
  title, value, detail, icon, accent,
}: {
  title: string; value: string; detail: string; icon: React.ReactNode;
  accent: 'emerald' | 'rose' | 'cyan' | 'violet';
}) {
  const accents = {
    emerald: 'text-emerald-300 bg-emerald-300/10 border-emerald-300/20',
    rose: 'text-rose-300 bg-rose-300/10 border-rose-300/20',
    cyan: 'text-cyan-300 bg-cyan-300/10 border-cyan-300/20',
    violet: 'text-violet-300 bg-violet-300/10 border-violet-300/20',
  };
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <div className={'rounded-xl border p-2 ' + accents[accent]}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === 'recovered' || status === 'active' || status === 'completed'
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
      : status === 'lost' || status === 'dismissed' || status === 'canceled' || status === 'unpaid'
        ? 'border-rose-400/20 bg-rose-400/10 text-rose-300'
        : status === 'in_progress' || status === 'trialing' || status === 'past_due'
          ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
          : 'border-slate-700 bg-slate-800 text-slate-300';
  return (
    <span className={'inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ' + color}>
      {readableStatus(status)}
    </span>
  );
}
