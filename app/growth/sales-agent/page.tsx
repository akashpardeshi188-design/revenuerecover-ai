'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { SalesAgent } from '@/lib/agents/sales-agent';
import {
  Bot,
  User,
  Sparkles,
  Send,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export default function SalesAgentSimulatorPage() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: 'Hi there! I am Alex, the AI Sales SDR for RevenueRecover AI. I help US service contractors qualify revenue leakage and explore our recovery platform. Ask me anything about our pricing, CRM integrations, or trial setup!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    'How much does it cost, and what is the ROI?',
    'Will it work with my HVAC business in Dallas?',
    'Can I connect ServiceTitan or Housecall Pro?',
    'Can I approve AI messages before they are sent?',
    'How does it handle TCPA and quiet hours?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setIsTyping(true);

    const res = await SalesAgent.answerQuestion(query);

    setIsTyping(false);
    setMessages((prev) => [...prev, { sender: 'agent', text: res.answer }]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <GrowthNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-5xl overflow-x-hidden">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Sales SDR Simulator</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live interactive demonstration of the autonomous AI Sales Representative answering prospect questions.
            </p>
          </div>

          {/* Quick FAQ Pills */}
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="py-1.5 px-3 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500 text-xs text-slate-300 transition"
              >
                &quot;{q}&quot;
              </button>
            ))}
          </div>

          {/* Chat Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-[550px] shadow-2xl">
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                      msg.sender === 'user' ? 'bg-slate-800 text-slate-200' : 'bg-cyan-500 text-slate-950 font-bold'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-white font-medium'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 font-mono'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" /> AI Sales SDR is drafting answer...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="pt-4 border-t border-slate-800 mt-4 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any sales or product question..."
                className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition disabled:opacity-40"
              >
                <Send className="w-3 h-3" /> Send
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
