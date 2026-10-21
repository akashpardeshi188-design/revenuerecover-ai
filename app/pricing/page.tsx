'use client';

import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Zap, CreditCard } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing/Navbar';

const plans = [
  {
    planKey: 'growth',
    name: 'Growth',
    price: 999,
    description: 'For growing service businesses and trade contractors managing high lead and invoice volume.',
    highlight: true,
    features: [
      'Automated revenue recovery & quote reactivation',
      'AI missed-call & SMS lead recovery workflows',
      'Full CRM integrations (ServiceTitan, Jobber, Housecall Pro)',
      'TCPA compliance, quiet hours, and 1-click human kill switch',
      'Multi-channel follow-ups (SMS, Email, Phone AI Agent)',
      'Weekly executive recovery analytics & ROI report',
    ],
  },
  {
    planKey: 'revenue_partner',
    name: 'Revenue Partner',
    price: 1299,
    description: 'For high-volume multi-location contractors requiring customized recovery engines and dedicated account oversight.',
    highlight: false,
    features: [
      'Everything in Growth Plan',
      'Multi-location & franchise territory routing',
      'Custom objection handling & tailored brand scripts',
      'Dedicated revenue engineer & VIP concierge onboarding',
      'Priority 24/7 technical support & SLA guarantee',
      'Custom webhook triggers & billing gateway synchronization',
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Zap className="w-3.5 h-3.5" /> Two Authoritative Monthly Subscription Plans
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Predictable Monthly Revenue Recovery
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Choose your plan, create your account, complete company onboarding, and activate recurring billing via our primary gateway Razorpay or secondary gateway PayPal.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.planKey}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition ${
                plan.highlight
                  ? 'bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/15'
                  : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                  Most Popular for Contractors
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                  <p className="text-sm text-slate-400 min-h-[44px]">{plan.description}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(plan.price)}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">/ month</span>
                  </div>
                  <p className="text-xs text-slate-400 pt-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    Billed monthly via Razorpay (primary) or PayPal (secondary)
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Included Capabilities
                  </span>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 space-y-3">
                <Link
                  href={`/signup?plan=${plan.planKey}`}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition active:scale-95 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 shadow-lg shadow-emerald-500/25 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Start with {plan.name} <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center space-y-1">
                  <p className="text-[11px] text-slate-300 font-semibold flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified server-side recurring subscription flow
                  </p>
                  <p className="text-[10px] leading-4 text-slate-500">
                    No one-time links. Single active subscription enforced per tenant. Cancel anytime in dashboard.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
