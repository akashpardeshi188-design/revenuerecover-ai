'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Search,
} from 'lucide-react';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What exactly does RevenueRecover AI do?',
      a: 'RevenueRecover AI acts as a 24/7 automated Revenue Recovery Employee for home service and professional businesses. It monitors your CRM and phone lines for missed calls, abandoned quotes, failed payments, and dormant clients, and follows up with polite, compliant, high-converting messages to get customers back on your schedule.',
      cat: 'Product & Capabilities',
    },
    {
      q: 'How much does it cost, and what is the ROI?',
      a: 'Plans start at $49/mo (Starter) and $149/mo (Growth). Because average home service tickets range from $1,200 to $8,000+, recovering even a single unbooked job or missed emergency call per month pays for an entire year of the software (typical 15x to 50x ROI). All plans include a 14-day free trial.',
      cat: 'Pricing & Billing',
    },
    {
      q: 'Will it work with my HVAC, plumbing, or roofing business?',
      a: 'Yes! RevenueRecover AI comes pre-configured with industry-specific blueprints, seasonal maintenance scripts, emergency dispatch timers, and high-ticket quote follow-up sequences designed specifically for contractors and service pros.',
      cat: 'Industries',
    },
    {
      q: 'Can I connect my CRM (ServiceTitan, Housecall Pro, Jobber)?',
      a: 'Yes, we provide 1-click native integrations for ServiceTitan, Housecall Pro, Jobber, QuickBooks Online, Stripe, HubSpot, Google Calendar, and Zapier. Setup takes less than 3 minutes with zero custom coding.',
      cat: 'Integrations',
    },
    {
      q: 'Can I approve messages before they are sent to customers?',
      a: 'Yes, 100%. In "Copilot Mode", every AI-drafted follow-up is placed in your 1-click Approval Queue. You also have access to "Supervised Autopilot" (where standard follow-ups are automated while sensitive replies are flagged) and an instant emergency Global Kill Switch.',
      cat: 'Control & Safety',
    },
    {
      q: 'How does it comply with TCPA, CAN-SPAM, and messaging laws?',
      a: 'Our built-in Compliance Engine enforces local 8:00 AM – 9:00 PM quiet hours based on customer area codes, respects carrier 10DLC throughput limits, and immediately honors STOP/UNSUBSCRIBE keywords by adding contacts to a permanent suppression list.',
      cat: 'Compliance',
    },
    {
      q: 'How do I cancel if I change my mind?',
      a: 'You can cancel your subscription with 1 click directly inside your billing portal at any time. There are no long-term contracts, setup penalties, or cancellation fees.',
      cat: 'Pricing & Billing',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything You Need to Know
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Clear answers about setup, integrations, pricing, compliance, and ROI guarantees.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-lg mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. ServiceTitan, pricing, approval mode)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition shadow-lg"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-emerald-400 transition"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-150">
                    <p>{faq.a}</p>
                    <div className="mt-3 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                      Category: {faq.cat}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">Have a specific question not covered here?</h3>
          <p className="text-xs text-slate-400">
            Our AI Sales Agent is available 24/7 to answer custom technical inquiries or simulate your recovery numbers.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/demo"
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
            >
              Test AI Sales SDR in Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
