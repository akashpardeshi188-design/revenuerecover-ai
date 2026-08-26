'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { RoiCalculator } from '@/components/marketing/RoiCalculator';
import {
  Flame,
  Wrench,
  Zap,
  Home,
  Building,
  Sparkles,
  Car,
  CheckCircle2,
  PhoneCall,
  FileText,
  CreditCard,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface IndustryData {
  name: string;
  tagline: string;
  avgLoss: string;
  topLeaks: { title: string; desc: string; loss: string }[];
  recoveryPlays: { title: string; desc: string; channel: string }[];
}

const industryMap: Record<string, IndustryData> = {
  hvac: {
    name: 'HVAC & Heating / Cooling Companies',
    tagline: 'Recover unbooked system replacements, missed emergency calls, and dormant seasonal tune-ups automatically.',
    avgLoss: '$24,800 / month',
    topLeaks: [
      { title: 'Missed After-Hours AC Calls', desc: 'Homeowners facing a broken AC in 95°F heat call until someone answers. Generic voicemail loses the job in 3 minutes.', loss: '$8,200/mo' },
      { title: 'Abandoned Heat Pump & Furnace Quotes', desc: 'High-ticket $6,000–$14,000 replacement estimates sit unaccepted without proactive financing follow-up.', loss: '$11,500/mo' },
      { title: 'Unscheduled Annual Maintenance', desc: 'Hundreds of past install customers forget to schedule their pre-season warranty tune-up.', loss: '$5,100/mo' },
    ],
    recoveryPlays: [
      { title: '45-Second Emergency Text-Back', desc: 'Instant AI SMS acknowledging the missed call and offering immediate technician dispatch booking.', channel: 'SMS' },
      { title: '3-Touch Estimate Re-engagement', desc: 'Day 2, Day 5, and Day 9 sequence answering equipment specs, financing options, and warranty lock.', channel: 'Email + SMS' },
      { title: '10-Month VIP Reactivation Campaign', desc: 'Automated seasonal filter & tune-up invite with direct scheduling link.', channel: 'SMS' },
    ],
  },
  plumbing: {
    name: 'Plumbing & Drain Service Businesses',
    tagline: 'Capture 24/7 emergency water heater leads and re-engage unbooked repipe bids.',
    avgLoss: '$18,500 / month',
    topLeaks: [
      { title: 'Emergency Slab Leak & Burst Pipe Calls', desc: 'Customers in panic dial the top 3 plumbers on Google. Slow response loses the dispatch.', loss: '$7,400/mo' },
      { title: 'High-Ticket Water Heater & Repipe Quotes', desc: '$2,500 - $8,000 estimates delivered as paper or email PDFs without systematic follow-up.', loss: '$8,100/mo' },
      { title: 'Annual Backflow & Inspection Lapses', desc: 'Commercial and residential clients due for compliance testing slip away.', loss: '$3,000/mo' },
    ],
    recoveryPlays: [
      { title: 'Instant Dispatch Text Assistant', desc: 'Captures caller address and sends immediate arrival window estimation.', channel: 'SMS' },
      { title: 'Quote Financing & Rebate Follow-up', desc: 'Highlights utility rebate incentives for tankless and heat-pump water heaters.', channel: 'Email + SMS' },
    ],
  },
  electrical: {
    name: 'Electrical Contractors',
    tagline: 'Turn EV charger and 200-Amp panel upgrade inquiries into confirmed revenue.',
    avgLoss: '$16,000 / month',
    topLeaks: [
      { title: 'EV Charger & Panel Inquiries', desc: 'Homeowners requesting estimates get distracted by EV delivery delays.', loss: '$6,800/mo' },
      { title: 'Commercial Lighting & Generator Bids', desc: 'Bids sent to property managers sit without decision maker follow-up.', loss: '$9,200/mo' },
    ],
    recoveryPlays: [
      { title: 'Panel Upgrade Value Sequencer', desc: 'Outlines solar readiness, home equity boost, and available federal tax credits.', channel: 'Email + SMS' },
    ],
  },
  roofing: {
    name: 'Roofing & Solar Contractors',
    tagline: 'Automate 30-day insurance claim follow-up and recover $36K/mo in storm damage bids.',
    avgLoss: '$36,000 / month',
    topLeaks: [
      { title: 'Storm Damage Insurance Delays', desc: 'Homeowner claims take 2–4 weeks to process; competitors swoop in if you do not stay top-of-mind.', loss: '$24,000/mo' },
      { title: 'Unbooked Full Re-roof Estimates', desc: '$12,000+ quotes require consistent consultation and financing presentation.', loss: '$12,000/mo' },
    ],
    recoveryPlays: [
      { title: '30-Day Insurance Claim Nurturing', desc: 'Guides homeowners through adjuster meetings and deductible questions on autopilot.', channel: 'Email + SMS' },
    ],
  },
  contractors: {
    name: 'General Contractors & Remodelers',
    tagline: 'Convert high-ticket kitchen and bath remodeling inquiries into booked design contracts.',
    avgLoss: '$42,000 / month',
    topLeaks: [
      { title: 'Design/Build Proposal Hesitation', desc: '$30,000+ bids take weeks of consideration without automated value drip.', loss: '$32,000/mo' },
      { title: 'Past Homeowner Project Expansions', desc: 'Past clients who finished a remodel never get prompted for phases 2 or 3.', loss: '$10,000/mo' },
    ],
    recoveryPlays: [
      { title: 'Design Portfolio & Timeline Drip', desc: 'Showcases before/after galleries and answers budget pacing questions automatically.', channel: 'Email' },
    ],
  },
  dental: {
    name: 'Dental Clinics & Orthodontics',
    tagline: 'Reactivate unscheduled hygiene recalls and convert unbooked cosmetic treatment plans.',
    avgLoss: '$21,000 / month',
    topLeaks: [
      { title: 'Unscheduled 6-Month Hygiene Recalls', desc: '30% of active patients drift past their 6-month cleaning window.', loss: '$12,000/mo' },
      { title: 'Unaccepted Invisalign / Crown Treatment Plans', desc: 'Patients leave consultation without booking financial coordinator review.', loss: '$9,000/mo' },
    ],
    recoveryPlays: [
      { title: 'Direct Self-Serve Rebooking SMS', desc: 'Sends 1-click chair opening links directly to overdue patient mobile phones.', channel: 'SMS' },
    ],
  },
};

export default function IndustrySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const data = industryMap[resolvedParams.slug] || industryMap['hvac'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Specialized Recovery Blueprint
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            AI Revenue Recovery for {data.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">{data.tagline}</p>
        </div>

        {/* Leaks breakdown */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Where {data.name} Lose Money</h2>
            <p className="text-xs text-slate-400">Average estimated leakage: <span className="text-rose-400 font-bold">{data.avgLoss}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.topLeaks.map((leak, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                <div className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full w-fit">
                  Leak: {leak.loss}
                </div>
                <h3 className="text-base font-bold text-white">{leak.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{leak.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Plays */}
        <div className="bg-gradient-to-tr from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Automated Recovery Blueprints Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recoveryPlays.map((play, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{play.title}</span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-slate-900 px-2 py-0.5 rounded">{play.channel}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{play.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic ROI Calculator for this industry */}
        <div className="space-y-4">
          <h3 className="text-center font-bold text-white text-xl">Simulate Your Exact {data.name} Revenue Potential</h3>
          <RoiCalculator />
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-4">
          <Link
            href="/free-revenue-scan"
            className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition active:scale-95"
          >
            Run Free 60-Second Scan for My Business <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
