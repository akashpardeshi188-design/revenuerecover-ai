'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import {
  Sparkles,
  ArrowRight,
  PhoneCall,
  FileText,
  CreditCard,
  Flame,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Real-time Leakage Detection',
      desc: 'Our engine connects to your CRM, phone lines, and billing software. In milliseconds, it detects missed inbound calls, quotes unviewed for 48 hours, expired membership cards, and inactive clients due for annual service.',
      badge: 'Continuous Monitoring',
      icon: PhoneCall,
    },
    {
      num: '02',
      title: 'AI Recovery Scoring & Context Enrichment',
      desc: 'Every opportunity is scored (0–100) based on ticket value, customer LTV, trigger recency, and past response velocity. The AI pulls historical job records to craft a natural, highly personalized message.',
      badge: 'Scoring Engine',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Intelligent Multi-Channel Follow-up',
      desc: 'The AI executes compliant outreach via SMS or Email during legal quiet hours. In Copilot Mode, it presents suggestions for your 1-click approval; in Supervised Autopilot, it handles standard booking friction automatically.',
      badge: 'TCPA Compliant',
      icon: FileText,
    },
    {
      num: '04',
      title: 'Confirmed Revenue Attribution',
      desc: 'When the customer accepts the quote, pays the invoice, or books the technician slot, the transaction is attributed and confirmed in your dashboard with zero manual data entry.',
      badge: 'Verified ROI',
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How RevenueRecover AI Works Behind the Scenes
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            From missed opportunity detection to confirmed bank deposits — here is how our 8 specialized AI agents work 24/7 to safeguard your business cash flow.
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 relative overflow-hidden shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/30">
                    {step.num}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 uppercase tracking-wider">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Human in the loop reassurance */}
        <div className="bg-gradient-to-tr from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              You Have 100% Control at All Times
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              AI should never have unrestricted authority over your customer relationships. RevenueRecover AI gives you three flexible operating modes:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400 text-sm">Copilot Mode</div>
              <p className="text-slate-400">AI drafts messages and suggests actions, but requires 1-click human approval before sending.</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-cyan-400 text-sm">Supervised Autopilot</div>
              <p className="text-slate-400">AI sends low-risk follow-ups automatically within rules; sensitive cases are escalated to staff.</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-purple-400 text-sm">Global Kill Switch</div>
              <p className="text-slate-400">One-click emergency stop immediately pauses all campaigns and outgoing messages instantly.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-4">
          <Link
            href="/free-revenue-scan"
            className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition active:scale-95"
          >
            Run Free 60-Second Scan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
