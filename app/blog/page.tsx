'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function BlogDirectoryPage() {
  const posts = [
    {
      title: 'How Texas HVAC Companies Lose $25,000/Month in Unbooked Estimates',
      slug: 'how-hvac-companies-lose-leads',
      date: 'Aug 24, 2026',
      readTime: '5 min read',
      category: 'HVAC Playbook',
      snippet: 'Why 64% of homeowners don’t accept HVAC quotes within 48 hours—and how a simple 3-touch SMS financing reminder recovers 35% of them before competitors call back.',
    },
    {
      title: 'AI Missed Call Text-Back for Contractors: Complete TCPA Compliance Guide',
      slug: 'ai-missed-call-text-back-contractors',
      date: 'Aug 20, 2026',
      readTime: '6 min read',
      category: 'Compliance & Growth',
      snippet: 'The exact rules for carrier 10DLC registration, 8 AM - 9 PM quiet hours enforcement, and automatic STOP keyword suppression when deploying AI text-back systems.',
    },
    {
      title: 'How to Follow Up on High-Ticket Plumbing & Water Heater Quotes Without Being Pushy',
      slug: 'how-to-follow-up-plumbing-quotes',
      date: 'Aug 16, 2026',
      readTime: '4 min read',
      category: 'Plumbing Sales',
      snippet: 'Steal the exact 3-step script sequence that recovered $38,400 in emergency tankless and repipe estimates in 60 days for Summit HVAC & Plumbing.',
    },
    {
      title: 'How to Reactivate 200+ Dormant Service Customers Before the Shoulder Season',
      slug: 'reactivate-dormant-service-customers',
      date: 'Aug 10, 2026',
      readTime: '7 min read',
      category: 'Customer Retention',
      snippet: 'Step-by-step blueprint for scanning your CRM database for clients past their 10-month tune-up window and sending automated VIP filter replacement credits.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Revenue Recovery Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            The Service Business Growth & Recovery Playbook
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Actionable strategies, case studies, and compliance guides for US home service contractors.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                  {post.category}
                </span>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white hover:text-emerald-400 transition cursor-pointer">
                {post.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{post.snippet}</p>

              <div className="pt-2">
                <Link
                  href="/free-revenue-scan"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  Run Revenue Scan for Your Business <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
