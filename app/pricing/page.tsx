'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import {
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Zap,
  TrendingUp,
} from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal for solo contractors & small trade teams getting started with automated follow-ups.',
      monthlyPrice: 49,
      annualPrice: 39,
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
      cta: 'Start 14-Day Free Trial',
      ctaHref: '/onboarding?plan=starter',
    },
    {
      name: 'Growth',
      description: 'The complete AI Revenue Recovery Employee for growing HVAC, plumbing, and service businesses.',
      monthlyPrice: 149,
      annualPrice: 119,
      highlight: true,
      badge: 'MOST POPULAR (78% of Customers)',
      features: [
        'UNLIMITED recovery opportunities/mo',
        'Full ServiceTitan, Housecall Pro & Jobber sync',
        'Stripe & QuickBooks past-due payment recovery',
        'Supervised Autopilot & Automated sequences',
        'Seasonal customer reactivation campaigns',
        'AI Response Classification & suggested replies',
        'TCPA & CAN-SPAM Quiet Hours Compliance Engine',
        'Priority Phone & Live Chat Support',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaHref: '/onboarding?plan=growth',
    },
    {
      name: 'Pro',
      description: 'Engineered for high-volume, multi-truck contractors and multi-location franchises.',
      monthlyPrice: 299,
      annualPrice: 239,
      highlight: false,
      badge: 'ENTERPRISE CAPABLE',
      features: [
        'Everything in Growth Plan',
        'Multi-location & Multi-brand management',
        'Full Autonomous Autopilot mode with safeguards',
        'Custom AI Voice / Webhook integrations',
        'Dedicated AI Prompt tuning for your market',
        'Custom CRM webhooks & Zapier connectors',
        'SOC2 Type II compliance reports',
        'Dedicated Account Manager & 1-on-1 Onboarding',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaHref: '/onboarding?plan=pro',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> 100% Guaranteed ROI
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Simple Pricing That Pays for Itself on Day One
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Just one recovered HVAC replacement or water heater install covers your entire annual subscription. All plans include a 14-day free trial.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-medium ${!isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 transition-colors relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition ${
                plan.highlight
                  ? 'bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105 z-10'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{plan.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isAnnual ? 'Billed annually ($' + (plan.annualPrice * 12) + '/yr)' : 'Billed monthly, cancel anytime'}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                  <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Included Features:
                  </div>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-center text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-md ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-emerald-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center text-[10px] text-slate-400 mt-2">
                  No credit card required for 14 days
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">The 5x Revenue Recovery Guarantee</h4>
              <p className="text-xs text-slate-400 max-w-lg">
                If RevenueRecover AI does not identify and recover at least 5x your monthly subscription cost in your first 30 days of active use, we will refund 100% of your subscription.
              </p>
            </div>
          </div>
          <Link
            href="/free-revenue-scan"
            className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shrink-0 transition"
          >
            Run 60-Sec Scan First
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
