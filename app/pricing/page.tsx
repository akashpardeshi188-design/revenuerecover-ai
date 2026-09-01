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
  CreditCard,
  Lock,
  Globe2,
} from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [region, setRegion] = useState<'usa' | 'global'>('usa');

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal for solo contractors & small trade teams getting started with automated follow-ups.',
      monthlyPrice: region === 'usa' ? 49 : 49,
      annualPrice: region === 'usa' ? 39 : 39,
      currency: '$',
      currencyLabel: region === 'usa' ? 'USD' : 'USD / £39 / CAD $55',
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
      cta: region === 'usa' ? 'Start 1-Day Trial ($0 Today)' : 'Instant 0-Day Activation (Risk-Free)',
      ctaHref: '/onboarding?plan=starter',
    },
    {
      name: 'Growth',
      description: 'The complete AI Revenue Recovery Employee for growing HVAC, plumbing, and service businesses.',
      monthlyPrice: 149,
      annualPrice: 119,
      currency: '$',
      currencyLabel: region === 'usa' ? 'USD' : 'USD / £99 / CAD $159 / ₹9,936',
      highlight: true,
      badge: region === 'usa' ? 'MOST POPULAR (78% of US Contractors)' : 'GLOBAL BESTSELLER (30-DAY GUARANTEE)',
      features: [
        'UNLIMITED recovery opportunities/mo',
        'Full ServiceTitan, Housecall Pro & Jobber sync',
        'Stripe & QuickBooks past-due payment recovery',
        'Supervised Autopilot & Automated sequences',
        'Seasonal customer reactivation campaigns',
        'AI Response Classification & suggested replies',
        'TCPA, GDPR & Multi-Region Compliance Engine',
        'Priority Phone & Live Chat Support',
      ],
      cta: region === 'usa' ? 'Start 1-Day Trial ($0 Today)' : 'Instant 0-Day Activation (Risk-Free)',
      ctaHref: '/onboarding?plan=growth',
    },
    {
      name: 'Pro',
      description: 'Engineered for high-volume, multi-truck contractors and multi-location franchises.',
      monthlyPrice: 299,
      annualPrice: 239,
      currency: '$',
      currencyLabel: region === 'usa' ? 'USD' : 'USD / £199 / CAD $320',
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
      cta: region === 'usa' ? 'Start 1-Day Trial ($0 Today)' : 'Instant 0-Day Activation (Risk-Free)',
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {region === 'usa' ? '24-Hour Instant Card Pilot ($0 Today)' : '0-Day Instant Activation + 100% 30-Day Money-Back Guarantee'}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Simple Pricing That Pays for Itself on Day One
          </h1>

          <p className="text-slate-400 text-sm sm:text-base">
            {region === 'usa'
              ? 'Recover your first $1,500 missed call in 24 hours. Enter credit card to begin, $119 auto-bills on Day 1. Cancel anytime with 1-click.'
              : 'Instant activation for Global Contractors (UK, Canada, Australia, UAE, Europe, India). Zero risk with our 30-day 100% money-back guarantee.'}
          </p>

          {/* Region Switcher & Billing Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Region Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setRegion('usa')}
                className={`py-1.5 px-3 rounded-xl transition ${
                  region === 'usa'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇺🇸 United States (1-Day Trial)
              </button>
              <button
                onClick={() => setRegion('global')}
                className={`py-1.5 px-3 rounded-xl transition flex items-center gap-1 ${
                  region === 'global'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe2 className="w-3 h-3" /> 🌍 Global (0-Day Instant)
              </button>
            </div>

            {/* Annual vs Monthly */}
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-medium ${!isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>
                Monthly
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
                  Annual
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  SAVE 20%
                </span>
              </div>
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
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {isAnnual ? 'Billed annually ($' + (plan.annualPrice * 12) + '/yr)' : 'Billed monthly'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Multi-Currency: {plan.currencyLabel}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
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
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center space-y-1">
                  <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {region === 'usa'
                      ? '24-Hour Card Pilot ($0 Today) • Cancel Anytime'
                      : '100% 30-Day Money-Back Guarantee • Zero Risk'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    💳 Accepts VISA, Mastercard, AMEX, Discover, Apple Pay, Google Pay
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
