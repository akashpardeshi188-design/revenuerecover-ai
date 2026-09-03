'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/Navbar';
import { GrowthNav } from '@/components/growth/GrowthNav';
import {
  AlertOctagon,
  RefreshCcw,
  Zap,
  CheckCircle2,
  PhoneCall,
  Mail,
  ArrowRight,
  ShieldAlert,
  Clock,
  DollarSign,
  Send,
} from 'lucide-react';

interface FailedPaymentItem {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  amountUSD: number;
  gateway: 'paypal' | 'cards' | 'skydo';
  failureReason: string;
  timestamp: string;
  recoveryStatus: 'PENDING_RETRY' | 'RECOVERY_SENT' | 'RECOVERED';
  suggestedAction: string;
}

export default function FailedPaymentsPage() {
  const [records, setRecords] = useState<FailedPaymentItem[]>([
    {
      id: 'FAIL-9021',
      businessName: 'Apex Plumbing & Rooter LLC (Texas)',
      contactEmail: 'billing@apexplumbing-tx.com',
      contactPhone: '+1 (817) 555-0144',
      amountUSD: 119,
      gateway: 'paypal',
      failureReason: 'Card issuer security block (3DS timeout)',
      timestamp: '25 mins ago',
      recoveryStatus: 'PENDING_RETRY',
      suggestedAction: 'Send direct 1-click PayPal invoice link via SMS',
    },
    {
      id: 'FAIL-8842',
      businessName: 'Summit Air & Mechanical (Florida)',
      contactEmail: 'owner@summitairfl.com',
      contactPhone: '+1 (305) 555-0812',
      amountUSD: 990,
      gateway: 'cards',
      failureReason: 'Daily international card transaction limit exceeded',
      timestamp: '1 hour ago',
      recoveryStatus: 'RECOVERY_SENT',
      suggestedAction: 'Sent Skydo US ACH domestic transfer details',
    },
    {
      id: 'FAIL-7923',
      businessName: 'BlueWave Heating & Cooling (California)',
      contactEmail: 'accounts@bluewavehvac.com',
      contactPhone: '+1 (415) 555-0391',
      amountUSD: 119,
      gateway: 'paypal',
      failureReason: 'Insufficient PayPal wallet balance (Prompted card backup)',
      timestamp: '2 hours ago',
      recoveryStatus: 'PENDING_RETRY',
      suggestedAction: 'Trigger automated 24-hr discount re-engagement',
    },
  ]);

  const [recoveredCount, setRecoveredCount] = useState(4);
  const [recoveredAmountUSD, setRecoveredAmountUSD] = useState(836);

  const handleSendRecovery = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, recoveryStatus: 'RECOVERY_SENT' } : r))
    );
  };

  const handleMarkRecovered = (id: string, amount: number) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, recoveryStatus: 'RECOVERED' } : r))
    );
    setRecoveredCount((c) => c + 1);
    setRecoveredAmountUSD((a) => a + amount);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <GrowthNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
              <AlertOctagon className="w-3.5 h-3.5" /> Failed Payment Telemetry & Dunning Recovery
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Payment Declines & Instant Recovery Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time capture of declined card swipes, PayPal timeouts, and failed checkout attempts. Recover lost revenue in 1-click before contractors leave.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Refresh Realtime Log
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Failed Attempts (24h)</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400 font-mono">3 Attempts</div>
            <div className="text-[10px] text-slate-400">$1,228 USD at risk</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Recovered Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">${recoveredAmountUSD} USD</div>
            <div className="text-[10px] text-emerald-400 font-semibold">₹69,800 INR Recovered</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Recovery Rate</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">72.5%</div>
            <div className="text-[10px] text-slate-400">Via automated 1-click PayPal links</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Average Recovery Time</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono">14 Mins</div>
            <div className="text-[10px] text-cyan-400 font-semibold">Instant Automated Follow-up</div>
          </div>
        </div>

        {/* Failed Payments Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-400" /> Live Failed Checkout Log
              </h3>
              <p className="text-xs text-slate-400">
                Shows exact customer contact details and reasons why payment was declined.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Live Stream Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Business & Contact</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Gateway</th>
                  <th className="p-3">Failure Reason</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Recovery Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {records.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="font-bold text-white text-xs">{item.businessName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5"><Mail className="w-3 h-3" /> {item.contactEmail}</span>
                        <span className="flex items-center gap-0.5"><PhoneCall className="w-3 h-3" /> {item.contactPhone}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-white">
                      ${item.amountUSD} USD
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] uppercase font-bold text-slate-300">
                        {item.gateway}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-red-400 font-medium">{item.failureReason}</span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {item.timestamp}
                    </td>
                    <td className="p-3">
                      {item.recoveryStatus === 'RECOVERED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> RECOVERED
                        </span>
                      ) : item.recoveryStatus === 'RECOVERY_SENT' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                          <Send className="w-3 h-3" /> LINK SENT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                          <Clock className="w-3 h-3" /> PENDING RETRY
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {item.recoveryStatus !== 'RECOVERED' && (
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://www.paypal.com/ncp/payment/GFXAWMG4S227E`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleSendRecovery(item.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3 fill-slate-950" /> Send PayPal Link
                          </a>
                          <button
                            onClick={() => handleMarkRecovered(item.id, item.amountUSD)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition"
                          >
                            Mark Paid
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
