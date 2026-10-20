'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CreditCard, LoaderCircle, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';

type PlanKey = 'starter' | 'growth' | 'revenue_partner';

type SubscriptionRecord = {
  id: string;
  checkout_key: string | null;
  plan_tier: string;
  amount: number | null;
  amount_cents: number;
  currency: string;
  status: string;
  provider_subscription_id: string | null;
  provider_plan_id: string | null;
  created_at: string;
  updated_at: string;
  last_payment_at: string | null;
  canceled_at: string | null;
};

const PLANS: Array<{
  key: PlanKey;
  name: string;
  amount: number;
  description: string;
  features: string[];
}> = [
  {
    key: 'starter',
    name: 'Starter',
    amount: 497,
    description: 'For smaller HVAC and plumbing teams beginning to automate recovery.',
    features: [
      'Missed-lead and quote follow-up',
      'Core recovery opportunities dashboard',
      'Human approval before outreach',
      'Monthly USD billing',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    amount: 997,
    description: 'For growing contractors with ongoing lead and invoice volume.',
    features: [
      'Everything in Starter',
      'Automated recovery sequences',
      'Multi-channel recovery workflows',
      'Priority implementation support',
    ],
  },
  {
    key: 'revenue_partner',
    name: 'Revenue Partner',
    amount: 1997,
    description: 'For high-volume or multi-location service businesses.',
    features: [
      'Everything in Growth',
      'Multi-location operating support',
      'Advanced recovery workflow configuration',
      'Dedicated implementation support',
    ],
  },
];

const LIVE_STATUSES = new Set(['active', 'trialing', 'past_due', 'unpaid']);

function isPlanKey(value: string | null): value is PlanKey {
  return value === 'starter' || value === 'growth' || value === 'revenue_partner';
}

function isUuid(value: string | null): value is string {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function money(amount: number | null, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(Number(amount ?? 0));
}

function statusLabel(status: string) {
  switch (status) {
    case 'active': return 'Active';
    case 'trialing': return 'Trial';
    case 'past_due': return 'Payment needs attention';
    case 'unpaid': return 'Unpaid';
    case 'inactive': return 'Awaiting PayPal approval';
    case 'canceled': return 'Canceled';
    default: return status.replaceAll('_', ' ');
  }
}

export default function BillingPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('growth');
  const [checkoutKey, setCheckoutKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelingId, setCancelingId] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const activeSubscription = useMemo(
    () => subscriptions.find((subscription) => LIVE_STATUSES.has(subscription.status)) ?? null,
    [subscriptions]
  );
  const pendingSubscription = useMemo(
    () => subscriptions.find((subscription) => subscription.status === 'inactive') ?? null,
    [subscriptions]
  );
  const selectedPlanDetails = PLANS.find((plan) => plan.key === selectedPlan) ?? PLANS[1];

  const refreshSubscriptions = useCallback(
    async (initialKey?: string, forceFreshKey = false) => {
      setIsRefreshing(true);
      try {
        const response = await fetch('/api/checkout/paypal/status', { cache: 'no-store' });
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
          subscriptions?: SubscriptionRecord[];
        };
        if (!response.ok) {
          throw new Error(payload.error || 'Could not load billing details.');
        }

        const list = Array.isArray(payload.subscriptions) ? payload.subscriptions : [];
        setSubscriptions(list);

        const live = list.find((subscription) => LIVE_STATUSES.has(subscription.status));
        const pending = list.find(
          (subscription) => subscription.status === 'inactive' && subscription.checkout_key
        );

        if (live) {
          if (isPlanKey(live.plan_tier)) setSelectedPlan(live.plan_tier);
          setMessage(
            live.status === 'past_due' || live.status === 'unpaid'
              ? 'Your current subscription needs payment attention. Please contact support before starting another plan.'
              : `Your ${statusLabel(live.status).toLowerCase()} ${live.plan_tier.replaceAll('_', ' ')} subscription is recorded.`
          );
        } else if (pending?.checkout_key) {
          if (isPlanKey(pending.plan_tier)) setSelectedPlan(pending.plan_tier);
          setCheckoutKey(pending.checkout_key);
        } else if (forceFreshKey) {
          setCheckoutKey(crypto.randomUUID());
        } else if (initialKey) {
          setCheckoutKey(initialKey);
        }
      } catch (refreshError: unknown) {
        setError(refreshError instanceof Error ? refreshError.message : 'Could not load billing details.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedPlan = params.get('plan');
    if (isPlanKey(requestedPlan)) setSelectedPlan(requestedPlan);

    const returnedCheckoutKey = params.get('checkout_key');
    const checkoutState = params.get('checkout');
    const forceFreshKey = checkoutState === 'cancelled';
    const initialKey =
      !forceFreshKey && isUuid(returnedCheckoutKey)
        ? returnedCheckoutKey
        : crypto.randomUUID();
    setCheckoutKey(initialKey);

    if (checkoutState === 'approved') {
      setMessage('PayPal returned you to RevenueRecover AI. Refresh the status below while PayPal confirms the subscription.');
    } else if (checkoutState === 'cancelled') {
      setMessage('Checkout was canceled. No new subscription is marked active.');
    }

    void refreshSubscriptions(initialKey, forceFreshKey);
  }, [refreshSubscriptions]);

  const beginCheckout = async () => {
    setError('');
    setMessage('');
    if (!checkoutKey) {
      setError('Preparing a secure checkout session. Please retry in a moment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey: selectedPlan, checkoutKey }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        approvalUrl?: string;
        alreadyActive?: boolean;
        status?: string;
      };

      if (!response.ok) throw new Error(payload.error || 'Could not start PayPal checkout.');
      if (payload.alreadyActive) {
        setMessage('This subscription is already active.');
        await refreshSubscriptions();
        return;
      }
      if (!payload.approvalUrl) {
        setMessage('PayPal returned without a new approval link. Refresh your billing status before retrying.');
        await refreshSubscriptions();
        return;
      }

      // The server returns only allow-listed HTTPS PayPal approval URLs.
      window.location.assign(payload.approvalUrl);
    } catch (checkoutError: unknown) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not start PayPal checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelSubscription = async (subscription: SubscriptionRecord) => {
    if (!window.confirm('Cancel this PayPal subscription? PayPal will stop future recurring billing after it accepts the request.')) {
      return;
    }

    setError('');
    setMessage('');
    setCancelingId(subscription.id);
    try {
      const response = await fetch('/api/checkout/paypal/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        status?: string;
      };
      if (!response.ok) throw new Error(payload.error || 'Could not cancel this subscription.');

      setMessage(payload.message || (payload.status === 'sync_pending'
        ? 'PayPal accepted cancellation; local status is still syncing.'
        : 'Subscription canceled.'));
      setCheckoutKey(crypto.randomUUID());
      await refreshSubscriptions(undefined, true);
    } catch (cancelError: unknown) {
      setError(cancelError instanceof Error ? cancelError.message : 'Could not cancel this subscription.');
    } finally {
      setCancelingId('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-3 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Account billing</p>
            <h1 className="text-3xl font-black text-white">Plans & subscriptions</h1>
            <p className="max-w-2xl text-sm text-slate-400">
              Monthly plans are billed in USD. Before checkout, the server verifies that your PayPal plan matches the configured amount.
            </p>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-emerald-400 hover:underline">
            Return to dashboard
          </Link>
        </header>

        {(message || error) && (
          <div
            role={error ? 'alert' : 'status'}
            className={`rounded-2xl border p-4 text-sm ${error
              ? 'border-red-500/30 bg-red-500/10 text-red-200'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'}`}
          >
            {error || message}
          </div>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-400" />
              <h2 className="font-bold text-white">Current subscriptions</h2>
            </div>
            <button
              type="button"
              onClick={() => void refreshSubscriptions(checkoutKey || crypto.randomUUID())}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh status
            </button>
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-400">Loading billing details…</p>
          ) : activeSubscription ? (
            <div className="flex flex-col gap-4 rounded-xl border border-emerald-500/25 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-400" />
                  <p className="font-bold text-white">
                    {PLANS.find((plan) => plan.key === activeSubscription.plan_tier)?.name ?? activeSubscription.plan_tier}
                  </p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {statusLabel(activeSubscription.status)}
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  {money(activeSubscription.amount, activeSubscription.currency)} per month
                </p>
                {activeSubscription.last_payment_at && (
                  <p className="text-xs text-slate-500">
                    Last payment recorded: {new Date(activeSubscription.last_payment_at).toLocaleDateString('en-US')}
                  </p>
                )}
              </div>
              {['active', 'trialing', 'past_due', 'unpaid'].includes(activeSubscription.status) && (
                <button
                  type="button"
                  onClick={() => void cancelSubscription(activeSubscription)}
                  disabled={cancelingId === activeSubscription.id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/40 px-4 py-2.5 text-xs font-bold text-red-200 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {cancelingId === activeSubscription.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Cancel subscription
                </button>
              )}
            </div>
          ) : pendingSubscription ? (
            <div className="flex flex-col gap-4 rounded-xl border border-amber-500/25 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-bold text-white">
                  {PLANS.find((plan) => plan.key === pendingSubscription.plan_tier)?.name ?? pendingSubscription.plan_tier}
                  {' '}· Awaiting PayPal approval
                </p>
                <p className="text-sm text-slate-300">
                  {money(pendingSubscription.amount, pendingSubscription.currency)} per month
                </p>
                <p className="text-xs text-slate-500">Resume this checkout to avoid creating a duplicate subscription.</p>
              </div>
              <button
                type="button"
                onClick={() => void beginCheckout()}
                disabled={isSubmitting || !checkoutKey}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                Continue checkout <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : subscriptions.some((subscription) => subscription.status === 'canceled') ? (
            <p className="text-sm text-slate-400">Your previous PayPal subscription is canceled. You can select a plan below to start a new subscription.</p>
          ) : (
            <p className="text-sm text-slate-400">No PayPal subscription is recorded for this company yet.</p>
          )}
        </section>

        {!activeSubscription && !pendingSubscription && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white">Choose a monthly plan</h2>
              <p className="mt-1 text-sm text-slate-400">The displayed price is checked against the server's subscription configuration and your PayPal plan before checkout.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => (
                <button
                  type="button"
                  key={plan.key}
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`rounded-2xl border p-5 text-left transition ${selectedPlan === plan.key
                    ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/40'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'}`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{plan.name}</span>
                  <span className="mt-2 block text-2xl font-black text-white">{money(plan.amount)}<span className="text-xs font-medium text-slate-400"> /mo</span></span>
                  <span className="mt-3 block min-h-12 text-xs leading-5 text-slate-400">{plan.description}</span>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-slate-300">
                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-white">Selected: {selectedPlanDetails.name}</p>
                <p className="text-sm text-slate-400">{money(selectedPlanDetails.amount)} billed monthly in USD after PayPal approval.</p>
              </div>
              <button
                type="button"
                onClick={() => void beginCheckout()}
                disabled={isSubmitting || isLoading || !checkoutKey}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:from-emerald-300 hover:to-cyan-200 disabled:opacity-50"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Preparing PayPal…' : 'Continue to PayPal'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        <p className="text-xs leading-5 text-slate-500">
          Payment activation and receipts are driven by verified PayPal events. If the provider plan, amount, or webhook is not configured correctly, checkout will stop rather than record an unverified payment.
        </p>
      </div>
    </main>
  );
}
