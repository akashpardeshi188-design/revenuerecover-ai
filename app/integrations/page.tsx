'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import {
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Database,
  ShieldCheck,
  CreditCard,
  Calendar,
  MessageSquare,
  Zap,
} from 'lucide-react';

export default function IntegrationsPage() {
  const integrations = [
    {
      name: 'ServiceTitan',
      category: 'Field Service CRM',
      desc: 'Real-time two-way synchronization for unbooked calls, customer quotes, dispatched jobs, and invoices.',
      status: 'Live & Certified',
      badge: 'Native Adapter',
    },
    {
      name: 'Housecall Pro',
      category: 'Field Service CRM',
      desc: 'Instantly pull estimates, appointment statuses, customer records, and payment receipts with zero code.',
      status: 'Live & Certified',
      badge: 'Native Adapter',
    },
    {
      name: 'Jobber',
      category: 'Field Service CRM',
      desc: 'Automatically trigger quote recovery sequences when estimates remain unaccepted after 48 hours.',
      status: 'Live & Certified',
      badge: 'Native Adapter',
    },
    {
      name: 'Stripe Payments',
      category: 'Billing & Payments',
      desc: 'Listen for invoice.payment_failed and failed subscription renewals to dispatch 1-click self-serve SMS retry links.',
      status: 'Live & Certified',
      badge: 'Direct Webhook',
    },
    {
      name: 'QuickBooks Online',
      category: 'Accounting & Invoicing',
      desc: 'Sync overdue invoices (Net-15/Net-30) and automate polite payment statements before debts age.',
      status: 'Live & Certified',
      badge: 'Direct API',
    },
    {
      name: 'Twilio SMS Gateway',
      category: 'Communications',
      desc: 'Enterprise high-throughput 10DLC verified messaging with automated STOP/UNSUBSCRIBE suppression.',
      status: 'Live & Certified',
      badge: 'Carrier Tier 1',
    },
    {
      name: 'Google Calendar Dispatch',
      category: 'Scheduling & Booking',
      desc: 'Check technician availability windows in real-time and auto-book confirmed customer appointments.',
      status: 'Live & Certified',
      badge: 'Calendar API',
    },
    {
      name: 'HubSpot CRM',
      category: 'Sales & Marketing',
      desc: 'Sync lead status, recovery notes, and conversation transcripts into contact deal pipelines.',
      status: 'Live & Certified',
      badge: 'HubSpot App',
    },
    {
      name: 'Zapier & Webhooks',
      category: 'Automation',
      desc: 'Connect 5,000+ apps and trigger custom recovery workflows from any proprietary lead form or phone system.',
      status: 'Live & Certified',
      badge: 'REST API',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" /> Seamless Ecosystem Connectors
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Connects With Your Existing Stack in 3 Minutes
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            No need to replace your current CRM or phone system. RevenueRecover AI connects via clean API adapters to monitor events and execute follow-ups without disruption.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{item.category}</span>
                </div>

                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {item.status}
                </span>
                <Link
                  href="/onboarding"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  Connect <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-4">
          <Link
            href="/free-revenue-scan"
            className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition active:scale-95"
          >
            Start Free Trial With Your Stack <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
