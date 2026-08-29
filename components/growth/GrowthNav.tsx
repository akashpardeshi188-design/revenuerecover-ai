'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { KillSwitchButton } from '@/components/shared/ModeBanner';
import {
  TrendingUp,
  Target,
  Users,
  Send,
  Bot,
  BarChart3,
  Gift,
  ShieldAlert,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
  Key,
  Rocket,
  Brain,
  FileText,
  FlaskConical,
  BookOpen,
  Share2,
  DollarSign,
} from 'lucide-react';

export function GrowthNav() {
  const pathname = usePathname();
  const { state } = useAppStore();

  const navItems = [
    { name: '💰 $2,095/Day Engine (₹1.75L)', href: '/growth/daily-revenue', icon: DollarSign },
    { name: '🚀 650-Client Sprint ($77K)', href: '/growth/sprint-650', icon: Rocket },
    { name: '🧠 AI Growth Brain', href: '/growth/brain', icon: Brain },
    { name: '📋 Daily AI CEO Report', href: '/growth/ceo-report', icon: FileText },
    { name: '🔬 A/B Testing Lab (CRO)', href: '/growth/experiments', icon: FlaskConical },
    { name: '📚 Product Intelligence', href: '/growth/knowledge-base', icon: BookOpen },
    { name: '📢 Content & Social Media', href: '/growth/content-marketing', icon: Share2 },
    { name: 'Growth Command Center', href: '/growth', icon: BarChart3 },
    {
      name: 'AI Lead Generation',
      href: '/growth/lead-gen',
      icon: Target,
      badge: state.prospectLeads.length.toString(),
    },
    { name: 'Sales Pipeline (CRM)', href: '/growth/pipeline', icon: Users },
    { name: 'Outreach Sequencer', href: '/growth/outreach', icon: Send },
    { name: 'AI Sales SDR Simulator', href: '/growth/sales-agent', icon: Bot },
    { name: 'Viral Referral Engine', href: '/growth/referrals', icon: Gift },
    { name: 'Live API Keys & Models', href: '/growth/api-keys', icon: Key },
    { name: 'Compliance & Audit Logs', href: '/growth/security-audit', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-37px)] sticky top-[37px]">
      {/* Top Brand */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/growth" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <TrendingUp className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white tracking-tight">Growth Engine</span>
              <span className="text-[10px] text-cyan-400 font-semibold">Self-Selling AI System</span>
            </div>
          </Link>
        </div>

        {/* Live MRR Ribbon */}
        <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Current Ecosystem MRR</div>
          <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
            ${state.growthMetrics.mrr.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal"> / mo</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">
            {state.growthMetrics.paid_customers} Paying Customers
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switch to Product A */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <Link
          href="/dashboard"
          className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Switch to Customer SaaS (Summit HVAC)</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </Link>

        <div className="flex items-center justify-between gap-2">
          <KillSwitchButton />
          <Link
            href="/"
            title="Return to Public Website"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
