'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Globe2,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';

type PlanKey = 'growth' | 'revenue_partner' | 'starter';

type SubscriptionRecord = {
  id: string;
  checkout_key: string | null;
  provider: string;
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
    amount: 499,
    description: 'For small and growing service businesses ready to automate revenue recovery and lead follow-up.',
    features: [
      'Automated revenue recovery & quote reactivation',
      'AI missed-call & SMS lead recovery workflows',
      'CRM integration support',
      'TCPA compliance, quiet hours, and human kill switch',
      'Monthly recovery analytics & ROI reporting',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    amount: 999,
    description: 'For growing trade contractors needing automated recovery, missed-call SMS text-back, and lead enrichment.',
    features: [
      'Everything in Starter',
      '45-second missed-call recovery engine',
      'Pre-loaded local homeowner trade leads',
      'SMS, Voice & Email automated recovery workflows',
      '1-Click CRM & Calendar Sync',
      'Monthly USD recurring billing via Razorpay or PayPal',
    ],
  },
  {
    key: 'revenue_partner',
    name: 'Revenue Partner',
    amount: 1299,
    description: 'For high-volume, multi-location contractors requiring dedicated integration, custom funnels, and enterprise SLA.',
    features: [
      'Everything in Growth',
      'Multi-location & multi-van dispatcher routing',
      'Custom CRM workflow and Webhook triggers',
      'Dedicated 1-on-1 concierge onboarding',
      'Priority SLA and custom SMS number provisioning',
    ],
  },
];

const LIVE_STATUSES = new Set(['active', 'trialing', 'past_due', 'unpaid']);

function isPlanKey(value: string | null): value is PlanKey {
  return value === 'growth' || value === 'revenue_partner' || value === 'starter';
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
    case 'active':
      return 'Active';
    case 'trialing':
      return 'Trial';
    case 'past_due':
      return 'Payment needs attention';
    case 'unpaid':
      return 'Unpaid';
    case 'inactive':
      return 'Awaiting gateway approval';
    case 'canceled':
      return 'Canceled';
    default:
      return status.replaceAll('_', ' ');
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BillingPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('growth');
  const [gateway, setGateway] = useState<'razorpay' | 'paypal'>('razorpay');
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
  const selectedPlanDetails = PLANS.find((plan) => plan.key === selectedPlan) ?? PLANS[0];

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
              : `Your ${statusLabel(live.status).toLowerCase()} ${live.plan_tier.replaceAll('_', ' ')} subscription via ${(live.provider || 'gateway').toUpperCase()} is recorded.`
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

    const requestedGateway = params.get('gateway');
    if (requestedGateway === 'paypal' || requestedGateway === 'razorpay') {
      setGateway(requestedGateway);
    }

    const returnedCheckoutKey = params.get('checkout_key');
    const checkoutState = params.get('checkout');
    const forceFreshKey = checkoutState === 'cancelled';
    const initialKey =
      !forceFreshKey && isUuid(returnedCheckoutKey)
        ? returnedCheckoutKey
        : crypto.randomUUID();
    setCheckoutKey(initialKey);

    if (checkoutState === 'approved') {
      setMessage('Payment gateway returned you to RevenueRecover AI. Refresh the status below while the provider confirms your subscription.');
    } else if (checkoutState === 'cancelled') {
      setMessage('Checkout was canceled. No new subscription was marked active.');
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
      if (gateway === 'razorpay') {
        // --- Razorpay Primary Gateway Subscription Flow ---
        const response = await fetch('/api/checkout/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planKey: selectedPlan, checkoutKey }),
        });
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
          subscriptionId?: string;
          keyId?: string;
          planKey?: string;
          planId?: string;
          amount?: number;
          currency?: string;
          checkoutKey?: string;
          internalSubscriptionId?: string;
        };

        if (!response.ok || !payload.subscriptionId || !payload.keyId) {
          throw new Error(payload.error || 'Could not initiate Razorpay subscription.');
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Could not load Razorpay checkout SDK. Please check your network and retry.');
        }

        const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
        const rzp = new RazorpayConstructor({
          key: payload.keyId,
          subscription_id: payload.subscriptionId,
          name: 'RevenueRecover AI',
          description: `${selectedPlanDetails.name} Subscription ($${selectedPlanDetails.amount}/mo USD)`,
          currency: 'USD',
          handler: async function (callbackResponse: {
            razorpay_payment_id: string;
            razorpay_subscription_id: string;
            razorpay_signature: string;
          }) {
            setIsSubmitting(true);
            try {
              const verifyRes = await fetch('/api/checkout/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: callbackResponse.razorpay_payment_id,
                  razorpay_subscription_id: callbackResponse.razorpay_subscription_id,
                  razorpay_signature: callbackResponse.razorpay_signature,
                  internalSubscriptionId: payload.internalSubscriptionId,
                  checkoutKey: payload.checkoutKey,
                  planId: payload.planId,
                }),
              });
              const verifyPayload = (await verifyRes.json().catch(() => ({}))) as {
                error?: string;
                success?: boolean;
              };

              if (!verifyRes.ok || !verifyPayload.success) {
                throw new Error(verifyPayload.error || 'Razorpay payment signature verification failed.');
              }

              setMessage('Razorpay subscription confirmed and activated successfully!');
              setCheckoutKey(crypto.randomUUID());
              await refreshSubscriptions(undefined, true);
            } catch (vErr: unknown) {
              setError(vErr instanceof Error ? vErr.message : 'Could not verify subscription payment.');
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              setMessage('Razorpay checkout window was closed.');
            },
          },
          theme: {
            color: '#10b981',
          },
        });

        rzp.open();
      } else {
        // --- PayPal Secondary Gateway Subscription Flow ---
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

        window.location.assign(payload.approvalUrl);
      }
    } catch (checkoutError: unknown) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not start subscription checkout.');
      setIsSubmitting(false);
    }
  };

  const cancelSubscription = async (subscription: SubscriptionRecord) => {
    const isRazorpay = subscription.provider === 'razorpay';
    const providerName = isRazorpay ? 'Razorpay' : 'PayPal';

    if (
      !window.confirm(
        `Cancel this ${providerName} subscription? The gateway will stop future recurring monthly billing after accepting the cancellation.`
      )
    ) {
      return;
    }

    setError('');
    setMessage('');
    setCancelingId(subscription.id);
    try {
      const endpoint = isRazorpay
        ? '/api/checkout/razorpay/cancel-subscription'
        : '/api/checkout/paypal/cancel-subscription';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        status?: string;
      };
      if (!response.ok) throw new Error(payload.error || `Could not cancel this ${providerName} subscription.`);

      setMessage(
        payload.message ||
          (payload.status === 'sync_pending'
            ? `${providerName} accepted cancellation; status is syncing.`
            : 'Subscription canceled.')
      );
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
            <h1 className="text-3xl font-black text-white">Plans &amp; Subscriptions</h1>
            <p className="max-w-2xl text-sm text-slate-400">
              Recurring monthly plans are billed in USD. Dual gateway integration ensures maximum payment reliability via Razorpay (Primary) or PayPal (Secondary).
            </p>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-emerald-400 hover:underline">
            Return to dashboard
          </Link>
        </header>

        {(message || error) && (
          <div
            role={error ? 'alert' : 'status'}
            className={`rounded-2xl border p-4 text-sm ${
              error
                ? 'border-red-500/30 bg-red-500/10 text-red-200'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
            }`}
          >
            {error || message}
          </div>
        )}

        {/* Current Active/Pending Subscription Section */}
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
                    {PLANS.find((plan) => plan.key === activeSubscription.plan_tier)?.name ??
                      activeSubscription.plan_tier.replaceAll('_', ' ')}
                  </p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {statusLabel(activeSubscription.status)}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {activeSubscription.provider === 'razorpay' ? 'Razorpay' : 'PayPal'}
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
                  {cancelingId === activeSubscription.id ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Cancel subscription
                </button>
              )}
            </div>
          ) : pendingSubscription ? (
            <div className="flex flex-col gap-4 rounded-xl border border-amber-500/25 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-bold text-white">
                  {PLANS.find((plan) => plan.key === pendingSubscription.plan_tier)?.name ??
                    pendingSubscription.plan_tier.replaceAll('_', ' ')}{' '}
                  · Awaiting gateway approval ({pendingSubscription.provider?.toUpperCase() || 'PAYPAL'})
                </p>
                <p className="text-sm text-slate-300">
                  {money(pendingSubscription.amount, pendingSubscription.currency)} per month
                </p>
                <p className="text-xs text-slate-500">Resume checkout to complete subscription activation.</p>
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
            <p className="text-sm text-slate-400">
              Your previous subscription was canceled. You can select a plan below to activate a new subscription.
            </p>
          ) : (
            <p className="text-sm text-slate-400">No active subscription recorded for this company yet.</p>
          )}
        </section>

        {/* Plan Selection & Gateway Section */}
        {!activeSubscription && !pendingSubscription && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Choose a monthly subscription plan</h2>
              <p className="mt-1 text-sm text-slate-400">
                Both plans are authoritative recurring monthly subscriptions billed in USD.
              </p>
            </div>

            {/* Two Public Purchase Plans Only */}
            <div className="grid gap-4 md:grid-cols-2">
              {PLANS.map((plan) => (
                <button
                  type="button"
                  key={plan.key}
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`rounded-2xl border p-6 text-left transition relative overflow-hidden ${
                    selectedPlan === plan.key
                      ? 'border-emerald-400 bg-emerald-500/10 ring-2 ring-emerald-400/40'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{plan.name}</span>
                    {plan.key === 'growth' && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <span className="mt-2 block text-3xl font-black text-white font-mono">
                    {money(plan.amount)}
                    <span className="text-xs font-medium text-slate-400 font-sans"> /mo USD</span>
                  </span>
                  <span className="mt-2 block min-h-10 text-xs leading-5 text-slate-300">{plan.description}</span>
                  <ul className="mt-4 space-y-2 border-t border-slate-800/80 pt-4">
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

            {/* Dual Gateway Selection */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Recurring Billing Gateway
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">RECURRING MONTHLY USD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Razorpay Primary Gateway */}
                <button
                  type="button"
                  onClick={() => setGateway('razorpay')}
                  className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between gap-1.5 ${
                    gateway === 'razorpay'
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/40'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-400" /> Razorpay
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300">
                    Cards, International Credit/Debit, NetBanking
                  </span>
                </button>

                {/* PayPal Secondary Gateway */}
                <button
                  type="button"
                  onClick={() => setGateway('paypal')}
                  className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between gap-1.5 ${
                    gateway === 'paypal'
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/40'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Globe2 className="w-4 h-4 text-cyan-400" /> PayPal
                    </span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-bold px-1.5 py-0.5 rounded">
                      Secondary
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300">
                    PayPal Wallet &amp; Saved International Cards
                  </span>
                </button>
              </div>
            </div>

            {/* Checkout Action Summary */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-white">
                  Selected: {selectedPlanDetails.name} Plan via {gateway === 'razorpay' ? 'Razorpay (Primary)' : 'PayPal (Secondary)'}
                </p>
                <p className="text-sm text-slate-400">
                  {money(selectedPlanDetails.amount)} billed monthly in USD upon authoritative subscription confirmation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void beginCheckout()}
                disabled={isSubmitting || isLoading || !checkoutKey}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black text-slate-950 transition active:scale-95 disabled:opacity-50 ${
                  gateway === 'razorpay'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/20'
                }`}
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isSubmitting
                  ? 'Connecting Gateway…'
                  : `Subscribe with ${gateway === 'razorpay' ? 'Razorpay' : 'PayPal'} (${money(selectedPlanDetails.amount)}/mo)`}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        <p className="text-xs leading-5 text-slate-500">
          Subscription activation, dunning, and cancellation are driven authoritatively by verified server-side webhook and callback events. If a plan or signature verification fails, checkout will fail safely rather than simulate success.
        </p>
      </div>
    </main>
  );
}
