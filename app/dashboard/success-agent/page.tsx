'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { CustomerSuccessAgent } from '@/lib/agents/customer-success-agent';
import {
  HelpCircle,
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export default function CustomerSuccessAgentPage() {
  const { state } = useAppStore();

  const healthReport = CustomerSuccessAgent.generateHealthReport(
    state.organization,
    state.opportunities,
    state.businessRules
  );

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: `Hello Dave! I am your AI Customer Success Copilot. Summit HVAC has recovered $${state.organization.monthly_recovered.toLocaleString()} this month with an overall health score of ${healthReport.healthScore}/100. How can I help you optimize your recovery workflows today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    const res = await CustomerSuccessAgent.answerSupportCopilot(
      userText,
      state.organization,
      state.opportunities
    );

    setIsTyping(false);
    setMessages((prev) => [...prev, { sender: 'agent', text: res.response }]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <DashboardNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Customer Success Copilot</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                24/7 dedicated operational copilot for setup, workflow optimization, and recovery diagnostics.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Health Score: {healthReport.healthScore}/100 ({healthReport.status})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Health & Actionable Tips */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-white text-sm">Automated Optimization Recommendations</h3>
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                </div>

                <div className="space-y-3">
                  {healthReport.recommendations.map((rec, i) => (
                    <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                      <div className="font-bold text-emerald-400">{rec.title}</div>
                      <p className="text-slate-300 leading-relaxed">{rec.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 text-xs shadow-xl">
                <div className="font-bold text-white text-sm">Monthly Performance Summary</div>
                <p className="text-slate-400 leading-relaxed font-mono">
                  {healthReport.monthlyRecoveredSummary}
                </p>
              </div>
            </div>

            {/* Right Chat Copilot */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-[520px] shadow-xl">
              <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                        msg.sender === 'user' ? 'bg-slate-800 text-slate-200' : 'bg-emerald-500 text-slate-950 font-bold'
                      }`}
                    >
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 font-mono'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" /> AI Success Copilot is thinking...
                  </div>
                )}
              </div>

              <form onSubmit={handleSend} className="pt-4 border-t border-slate-800 mt-4 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question (e.g. How do I increase quote recovery rate?)..."
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition disabled:opacity-40"
                >
                  <Send className="w-3 h-3" /> Ask
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
