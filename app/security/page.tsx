'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/marketing/Navbar';
import { ModeBanner } from '@/components/shared/ModeBanner';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function SecurityPage() {
  const securityPillars = [
    {
      title: 'TCPA & CAN-SPAM Compliance Engine',
      desc: 'Enforces local 8:00 AM – 9:00 PM quiet hours automatically based on customer area codes. Honors STOP and UNSUBSCRIBE keywords instantly with permanent suppression list enforcement.',
      icon: FileCheck,
    },
    {
      title: 'Strict Multi-Tenant Data Isolation',
      desc: 'Every organization’s leads, conversations, customer records, and revenue metrics are strictly partitioned at the database layer. Cross-tenant access is structurally impossible.',
      icon: Server,
    },
    {
      title: 'Role-Based Access Control (RBAC)',
      desc: 'Granular permissions across Owner, Admin, Manager, Agent, and Viewer roles. Restrict who can trigger campaigns, export customer lists, or modify business rules.',
      icon: Lock,
    },
    {
      title: 'Complete Chronological Audit Trail',
      desc: 'Every single automated message, status change, and AI decision is permanently timestamped with delivery confirmation and consent basis logging.',
      icon: EyeOff,
    },
    {
      title: 'Global Emergency Kill Switch',
      desc: 'One-click immediate override allows business owners to instantly freeze all automated outgoing communications across all channels at any time.',
      icon: AlertTriangle,
    },
    {
      title: 'End-to-End Encryption & Key Management',
      desc: 'All customer data is encrypted in transit using TLS 1.3 and at rest using AES-256 with isolated key rotations.',
      icon: ShieldCheck,
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
            <ShieldCheck className="w-3.5 h-3.5" /> Enterprise-Grade Trust & Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Security, Privacy & Compliance Architecture
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Protecting your customer relationships and brand reputation is built into every layer of our autonomous recovery engine.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-xs text-slate-400 space-y-3 leading-relaxed">
          <div className="font-bold text-white text-sm">Regulatory Notice & Responsibilities</div>
          <p>
            RevenueRecover AI provides automated tools to assist businesses with compliant communications. However, businesses remain responsible for ensuring that they have appropriate lawful consent or prior business relationship bases for their customer outreach, in accordance with the Telephone Consumer Protection Act (TCPA), CAN-SPAM Act, state mini-TCPAs, and applicable carrier 10DLC registration guidelines.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
