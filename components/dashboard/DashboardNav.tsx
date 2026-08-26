'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { KillSwitchButton } from '@/components/shared/ModeBanner';
import {
  TrendingUp,
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  Users,
  Layers,
  Settings,
  HelpCircle,
  ShieldCheck,
  Zap,
  Flame,
  ArrowUpRight,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export function DashboardNav() {
  const pathname = usePathname();
  const { state } = useAppStore();

  const navItems = [
    { name: 'Executive Overview', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Opportunities Hub',
      href: '/dashboard/opportunities',
      icon: Sparkles,
      badge: state.opportunities.filter((o) => o.status !== 'recovered').length.toString(),
    },
    {
      name: 'Unified Inbox',
      href: '/dashboard/inbox',
      icon: MessageSquare,
      badge: state.conversations.filter((c) => c.status === 'needs_reply').length.toString(),
    },
    { name: 'Customer Database', href: '/dashboard/customers', icon: Users },
    { name: 'Recovery Campaigns', href: '/dashboard/campaigns', icon: Zap },
    { name: 'Integrations Hub', href: '/dashboard/integrations', icon: Layers },
    { name: 'AI Success Copilot', href: '/dashboard/success-agent', icon: HelpCircle },
    { name: 'Rules & Safety Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-37px)] sticky top-[37px]">
      {/* Top Brand */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md">
              <TrendingUp className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white tracking-tight">RevenueRecover</span>
              <span className="text-[10px] text-emerald-400 font-semibold">{state.organization.name}</span>
            </div>
          </Link>
        </div>

        {/* Autopilot Status Pill */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 capitalize font-medium">{state.businessRules.autopilot_mode} Mode</span>
          </div>
          <Link href="/dashboard/settings" className="text-[10px] text-slate-400 hover:text-white">
            Change
          </Link>
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
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && Number(item.badge) > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Growth Portal Link & Kill Switch */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <Link
          href="/growth"
          className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/40 text-cyan-300 text-xs font-semibold flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Switch to Growth Engine</span>
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
