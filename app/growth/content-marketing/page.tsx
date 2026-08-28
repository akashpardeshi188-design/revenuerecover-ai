'use client';

import React, { useState } from 'react';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  Share2,
  Sparkles,
  Search,
  Copy,
  CheckCircle2,
  FileText,
  Video,
  MessageSquare,
  Globe,
} from 'lucide-react';

export default function ContentMarketingPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const socialContent = [
    {
      platform: 'LinkedIn (Thought Leadership)',
      icon: Globe,
      category: 'Founder Insight',
      headline: 'The $23,400 monthly leak sitting inside every 5-truck HVAC shop',
      copy: `Most Texas & Florida HVAC business owners think their biggest problem is lead generation.\n\nIt’s not.\n\nWe analyzed 150+ contractors and found that 82% of emergency callers after 6:00 PM hang up and call a competitor within 3 minutes if nobody answers.\n\nAnd 40% of delivered $4,000+ heat pump estimates sit in ServiceTitan without a single follow-up after Day 3.\n\nYou don’t need more leads. You need an automated system that texts back missed calls in 45 seconds and follows up on open quotes.\n\nThat is why we built RevenueRecover AI.`,
    },
    {
      platform: 'X / Twitter (Short Form)',
      icon: MessageSquare,
      category: 'Short Insight',
      headline: 'Why home service businesses lose 30% of their revenue',
      copy: `Contractors spend $150 per Google lead.\n\nThen let 1 in 4 calls go to voicemail because techs are on a roof.\n\nIf you text that homeowner back in 45 seconds, 70% book with you instead of calling the next listing.\n\nStop paying for leads you don't answer.`,
    },
    {
      platform: 'YouTube / Short Video (Script)',
      icon: Video,
      category: 'Video Script',
      headline: '60-Second Video Script: The Missed Call Calculator',
      copy: `[HOOK - 0 to 5s]: If you run an HVAC or plumbing business, you are likely losing $20,000 every month without realizing it.\n\n[PROBLEM - 5 to 20s]: When a Dallas homeowner has a broken AC in July, they don't leave voicemails. They call the next plumber on Google.\n\n[SOLUTION - 20 to 45s]: RevenueRecover AI texts them back in 45 seconds, qualifies their issue, and schedules the diagnostic on your calendar automatically.\n\n[CTA - 45 to 60s]: Run a free 60-second revenue leak audit for your shop at the link in bio.`,
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <GrowthNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Share2 className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Content Marketing & Social Media Engine
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Weekly high-intent SEO topics, LinkedIn thought leadership, X threads, and YouTube video scripts.
              </p>
            </div>
          </div>

          {/* Social Posts Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Platform-Specific Social Content (Ready to Post)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialContent.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <Icon className="w-4 h-4 text-cyan-400" /> {item.platform}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {item.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm">{item.headline}</h4>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {item.copy}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(item.copy, idx)}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copiedIndex === idx ? 'Copied to Clipboard!' : 'Copy Post'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
