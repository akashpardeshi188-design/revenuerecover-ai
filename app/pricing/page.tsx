'use client';

import { Navbar, Footer } from '@/components/marketing/Navbar';
import {
  Check,
  ArrowRight,
} from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      description: 'Ideal for solo contractors & small trade teams getting started with automated follow-ups.',
      monthlyPrice: 497,
            currency: '$',
      currencyLabel: 'USD',
      highlight: false,
      badge: null,
      features: [
        'Up to 50 active recovery opportunities/mo',
        'Missed-Call Instant Text-Back (SMS)',
        'Quote & Estimate 3-touch follow-up',
        'Copilot Mode (1-Click Human Approval)',
        'Single Location / Dispatch calendar',
        'Email & SMS provider integration',
        'Standard Email & Chat Support',
      ],
    },
    {
      name: 'Growth',
      description: 'The complete AI Revenue Recovery Employee for growing HVAC, plumbing, and service businesses.',
      monthlyPrice: 997,
            currency: '$',
      currencyLabel: 'USD',
      highlight: true,
      badge: 'GROWTH PLAN',
      features: [
        'Lead-generation workflow configured during onboarding',
        'UNLIMITED recovery opportunities/mo',
        'Full ServiceTitan, Housecall Pro & Jobber sync',
        'Stripe & QuickBooks past-due payment recovery',
        'Supervised Autopilot & Automated sequences',
        'Seasonal customer reactivation campaigns',
        'AI Response Classification & suggested replies',
        'TCPA, GDPR & Multi-Region Compliance Engine',
        'Priority Phone & Live Chat Support',
      ],
    },
    {
      name: 'Pro',
      description: 'Engineered for high-volume, multi-truck contractors and multi-location franchises.',
      monthlyPrice: 1994,
            currency: '$',
      currencyLabel: 'USD',
      highlight: false,
      badge: 'ENTERPRISE CAPABLE',
      features: [
        'Everything in Growth Plan',
        'Lead intake workflows for multi-location businesses',
        'Multi-location & Multi-brand management',
        'Full Autonomous Autopilot mode with safeguards',
        'Custom AI Voice / Webhook integrations',
        'Dedicated AI Prompt tuning for your market',
        'Custom CRM webhooks & Zapier connectors',
        'SOC2 Type II compliance reports',
        'Dedicated Account Manager & 1-on-1 Onboarding',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Pricing and billing status */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Revenue recovery plans for service businesses
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Compare the current approved USD monthly plan prices. Secure checkout remains paused while payment verification and subscription activation are reconciled.
          </p>

          <div role="status" className="max-w-3xl mx-auto rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-left text-sm text-amber-100">
            <strong>Checkout temporarily unavailable.</strong> Prices shown are informational only. No payment or subscription can be started from this page until staging verification is complete.
          </div>

          
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const currentPrice = plan.monthlyPrice;

            return (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition ${
                  plan.highlight
                    ? 'bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105 z-10'
                    : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                    </div>

                  </div>

                  <div className="space-y-1 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                        ${currentPrice.toLocaleString('en-US')}
                      </span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-300 font-semibold">
                        Monthly subscription price
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">Taxes and final checkout terms will be shown before billing is enabled.</p>

                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Currency: {plan.currencyLabel}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      What is Included:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                                    <button type="button" disabled aria-disabled="true"
                    className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700">
                    Checkout temporarily unavailable <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-amber-300 font-semibold">
                      Billing is under verification. No payment or subscription will be initiated.
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Checkout will reopen after plan prices, provider verification, and account activation pass staging tests.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
