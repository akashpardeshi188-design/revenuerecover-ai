'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import {
  Flame,
  Wrench,
  Zap,
  Home,
  Sparkles,
  Building,
  Car,
  Brush,
  Shield,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function IndustriesDirectoryPage() {
  const industries = [
    {
      slug: 'hvac',
      name: 'HVAC & Heating / Cooling',
      icon: Flame,
      avgTicket: '$1,400 - $8,500',
      leakage: '$24,000/mo',
      desc: 'Recover missed heat pump quotes, after-hours emergency calls, and automated seasonal filter/furnace tune-ups.',
    },
    {
      slug: 'plumbing',
      name: 'Plumbing & Drain Services',
      icon: Wrench,
      avgTicket: '$950 - $4,200',
      leakage: '$18,500/mo',
      desc: 'Instant 45-second text-back on water heater emergencies, unbooked sewer line estimates, and annual backflow tests.',
    },
    {
      slug: 'electrical',
      name: 'Electrical Contractors',
      icon: Zap,
      avgTicket: '$1,200 - $6,000',
      leakage: '$16,000/mo',
      desc: 'Follow up on EV charging station installs, main panel upgrades, generator quotes, and commercial lighting bids.',
    },
    {
      slug: 'roofing',
      name: 'Roofing & Solar',
      icon: Home,
      avgTicket: '$6,000 - $22,000',
      leakage: '$36,000/mo',
      desc: 'Automate multi-week storm damage insurance claim nurturing and convert high-ticket roof replacement bids.',
    },
    {
      slug: 'contractors',
      name: 'General Contractors & Remodeling',
      icon: Building,
      avgTicket: '$12,000 - $50,000+',
      leakage: '$42,000/mo',
      desc: 'Kitchen/bath remodel estimate nurturing, architectural plan follow-up, and dormant client project check-ins.',
    },
    {
      slug: 'dental',
      name: 'Dental Clinics & Orthodontics',
      icon: Sparkles,
      avgTicket: '$800 - $5,500',
      leakage: '$21,000/mo',
      desc: 'Reactivate overdue hygiene patients, unbooked Invisalign / cosmetic quotes, and broken appointment slots.',
    },
    {
      slug: 'med-spa',
      name: 'Med Spas & Aesthetics',
      icon: Sparkles,
      avgTicket: '$450 - $2,800',
      leakage: '$19,000/mo',
      desc: 'Automated 90-day Botox / filler recall sequences, membership payment recovery, and consult follow-up.',
    },
    {
      slug: 'auto-repair',
      name: 'Auto Repair & Collision',
      icon: Car,
      avgTicket: '$600 - $3,500',
      leakage: '$15,500/mo',
      desc: 'Follow up on recommended diagnostic repairs, declined brake/tire estimates, and 5,000-mile maintenance recalls.',
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
            <TrendingUp className="w-3.5 h-3.5" /> Industry Recovery Solutions
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tailored AI Revenue Recovery for Every Service Trade
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Every trade has unique sales cycles, job sizes, and customer churn dynamics. Choose your industry to explore specialized recovery blueprints.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition group shadow-xl"
              >
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-950 text-emerald-400 w-fit border border-slate-800 group-hover:bg-emerald-500/10 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Avg Ticket:</span>
                    <span className="text-white font-semibold">{ind.avgTicket}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Est. Leakage:</span>
                    <span className="text-rose-400 font-semibold">{ind.leakage}</span>
                  </div>
                  <div className="text-emerald-400 font-bold pt-2 flex items-center gap-1 group-hover:translate-x-1 transition">
                    View Recovery Plan <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
