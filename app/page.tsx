'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { RoiCalculator, FlywheelVisualizer } from '@/components/marketing/RoiCalculator';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  FileText,
  CreditCard,
  Flame,
  Wrench,
  Zap,
  Home,
  CheckCircle2,
  Lock,
  MessageSquare,
  Users,
  Play,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <ModeBanner />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-900">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-600/15 to-cyan-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Revenue Recovery Employee for US Service Businesses</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Turn Lost Leads Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Recovered Revenue.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            RevenueRecover AI finds missed calls, abandoned quotes, failed payments, and inactive customers — then helps your business recover them automatically with intelligent, compliant follow-up.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="https://www.paypal.com/ncp/payment/GFXAWMG4S227E"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition active:scale-95"
            >
              ⚡ Get Growth Plan — $119/mo (Instant 200 Leads) <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base flex items-center justify-center gap-2.5 transition active:scale-95"
            >
              👑 View All Pricing &amp; VIP Plans
            </Link>
          </div>

          {/* Proof Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TCPA & CAN-SPAM Quiet Hours Built-In</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3-Minute Integration (ServiceTitan, Stripe, Jobber)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>100% Human Approval & Kill Switch</span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE REVENUE RECOVERY TICKER */}
      <section className="bg-slate-900/80 border-b border-slate-800 py-3.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-[11px] shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Recoveries:</span>
          </div>
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-slate-300 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">+$4,850</span> Heat Pump Quote (Summit HVAC, Dallas)
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">+$1,250</span> Missed Emergency Call (Alamo Plumbing, SA)
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">+$6,020</span> Commercial Duct Bid (Oakridge Park)
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">+$1,650</span> Expired Card Recovery (Thorne Group)
            </span>
          </div>
        </div>
      </section>

      {/* 4 CORE PROBLEM LEAKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            The Hidden Bleed
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Where Home-Service Businesses Lose $15,000–$40,000 Every Month
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            You spend thousands on Google Ads and Local Services, but 20–35% of that revenue evaporates through operational cracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Leak 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Missed Inbound Calls</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When technicians are in attics or after 5 PM, calls go to voicemail. 68% of callers immediately dial your next competitor.
            </p>
            <div className="text-xs font-semibold text-rose-400 pt-2 border-t border-slate-800">
              Avg Loss: $7,200 / month
            </div>
          </div>

          {/* Leak 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Abandoned Estimates</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              You send a $5,000 equipment quote. The customer gets busy and forgets. Without persistent follow-up, 60% of quotes go unbooked.
            </p>
            <div className="text-xs font-semibold text-cyan-400 pt-2 border-t border-slate-800">
              Avg Loss: $12,500 / month
            </div>
          </div>

          {/* Leak 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Dormant Past Customers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hundreds of past clients who need annual AC tune-ups, filter replacements, or tank flushes never get contacted proactively.
            </p>
            <div className="text-xs font-semibold text-amber-400 pt-2 border-t border-slate-800">
              Avg Loss: $6,400 / month
            </div>
          </div>

          {/* Leak 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Failed Cards & Overdue Invoices</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recurring service club memberships decline when cards expire. Net-30 commercial bills sit unpaid without automated SMS statements.
            </p>
            <div className="text-xs font-semibold text-purple-400 pt-2 border-t border-slate-800">
              Avg Loss: $3,800 / month
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROI CALCULATOR COMPONENT */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <RoiCalculator />
      </section>

      {/* FLYWHEEL SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <FlywheelVisualizer />
      </section>

      {/* INDUSTRY CAROUSEL / GRID */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Tailored Workflows
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pre-Configured for 12+ High-Ticket US Service Niches
            </h3>
            <p className="text-slate-400 text-sm">
              Each industry comes with customized objection scripts, compliance timings, and CRM connectors out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/industries/hvac"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition group space-y-3"
            >
              <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 w-fit group-hover:bg-emerald-500/10 transition">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition">
                HVAC & AC Repair
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency 45-second text-back, seasonal furnace tune-ups, and heat pump estimate follow-up.
              </p>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                Explore HVAC <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            <Link
              href="/industries/plumbing"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition group space-y-3"
            >
              <div className="p-3 rounded-xl bg-slate-900 text-cyan-400 w-fit group-hover:bg-cyan-500/10 transition">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition">
                Plumbing Pros
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Water heater replacements, sewer line bids, slab leak dispatch, and annual inspection reminders.
              </p>
              <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                Explore Plumbing <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            <Link
              href="/industries/electrical"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group space-y-3"
            >
              <div className="p-3 rounded-xl bg-slate-900 text-amber-400 w-fit group-hover:bg-amber-500/10 transition">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base group-hover:text-amber-400 transition">
                Electrical Contractors
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                EV charger installs, 200A panel upgrades, generator quotes, and commercial lighting retrofit follow-ups.
              </p>
              <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                Explore Electrical <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            <Link
              href="/industries/roofing"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition group space-y-3"
            >
              <div className="p-3 rounded-xl bg-slate-900 text-purple-400 w-fit group-hover:bg-purple-500/10 transition">
                <Home className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base group-hover:text-purple-400 transition">
                Roofing & Solar
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-week storm damage insurance claim nurturing, solar panel cleaning rebooking, and re-roof quotes.
              </p>
              <div className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                Explore Roofing <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL BOTTOM CTA */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Recover Your Lost Revenue?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base">
              Run your 60-second diagnostic scan right now or activate a 14-day free trial. Setup takes under 3 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/free-revenue-scan"
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/20 transition active:scale-95"
            >
              Run Free Revenue Scan
            </Link>
            <Link
              href="/pricing"
              className="py-4 px-8 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base transition"
            >
              View Pricing ($49/mo)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
