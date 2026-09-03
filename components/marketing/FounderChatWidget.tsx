'use client';

import React, { useState } from 'react';
import { MessageCircle, X, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export function FounderChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const founderWhatsApp = '918208057237';
  const defaultMessage = encodeURIComponent(
    'Hi Akash, I saw RevenueRecover AI for HVAC & Plumbing. I want to activate the $119/mo Growth Plan and unlock my 150-200 local leads.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Expanded Popover */}
      {isOpen && (
        <div className="mb-3 w-80 bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-3 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-emerald-300 text-sm">
                  AP
                </div>
                <span className="w-3 h-3 bg-emerald-400 rounded-full absolute bottom-0 right-0 border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  Akash Pardeshi <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">Founder & CEO • Live Now</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Have questions about activating your AI missed-call recovery or claiming your <strong>150–200 local leads</strong>? Chat directly with me on WhatsApp.
          </p>

          <a
            href={`https://wa.me/${founderWhatsApp}?text=${defaultMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" /> Chat on WhatsApp <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </a>

          <div className="text-[10px] text-center text-slate-400">
            ⚡ Instant 45-Second Response • 100% Direct Founder Support
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-2xl shadow-emerald-500/30 hover:scale-105 transition active:scale-95 border border-emerald-300"
      >
        <MessageCircle className="w-4 h-4 fill-slate-950" />
        <span>Chat with Founder</span>
        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
      </button>
    </div>
  );
}
