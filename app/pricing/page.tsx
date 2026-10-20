'use client';

import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing/Navbar';

const plans = [
  {
    planKey: 'starter',
    name: 'Starter',
    price: 497,
    description: 'For smaller HVAC and plumbing teams starting to automate revenue recovery.',
    highlight: false,
    features: [
      'Recovery opportunities dashboard',
      'Lead and quote follow-up workflows',
      'Human approval and opt-out controls',
      'Core email and SMS connection setup',
    ],
  },
  {
    planKey: 'growth',
    name: 'Growth',
    price: 997,
    description: 'For growing contractors managing ongoing lead and invoice volume.',
    highlight: true,
    features: [
      'Everything in Starter',
      'Additional recovery and reactivation workflows',
      'Multi-channel workflow configuration',
      'CRM connection setup, where supported',
    ],
  },
  {
    planKey: 'revenue_partner',
    name: 'Revenue Partner',
    price: 1997,
    description: 'For high-volume service businesses that need customized recovery workflows.',
    highlight: false,
    features: [
      'Everything in Growth',
      'Multi-location workflow configuration',
      'Advanced custom recovery automations',
      'Dedicated implementation support by agreement',
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <p className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            Monthly subscription plans
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Recover more revenue from the leads you already have
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Choose a plan, create your account, complete company onboarding, and approve the recurring subscription through PayPal.
            All displayed plan prices are monthly in USD.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.planKey}
              className={`rounded-3xl p-7 flex flex-col justify-between relative transition ${plan.highlight
                ? 'bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/15'
                : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Recommended
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <p className="text-sm text-slate-400 min-h-[48px]">{plan.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(plan.price)}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-2">
                    Billed monthly after PayPal approval
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Plan overview
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-7 space-y-3">
                <Link
                  href={`/signup?plan=${plan.planKey}`}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Create account to continue <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center space-y-1">
                  <p className="text-[11px] text-slate-300 font-semibold flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Checkout verifies the configured PayPal plan price.
                  </p>
                  <p className="text-[10px] leading-4 text-slate-500">
                    Connected providers may require setup. Checkout stops if price or subscription configuration does not match.
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
