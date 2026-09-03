'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Building2,
  ShieldCheck,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  hasCta?: boolean;
  ctaType?: 'monthly' | 'annual';
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hi there! 👋 I am the RevenueRecover AI Assistant. Are you looking to recover missed customer calls and unlock 150–200 local trade leads for your HVAC/Plumbing business?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = '';
      let hasCta = false;
      let ctaType: 'monthly' | 'annual' = 'monthly';

      const lower = text.toLowerCase();
      if (lower.includes('lead') || lower.includes('150') || lower.includes('200')) {
        aiReply =
          'Great question! When you activate your Growth Plan ($119/mo), our AI engine instantly ingests 150–200 verified local homeowner leads in your service ZIP code. You can start with 1-click via PayPal below:';
        hasCta = true;
        ctaType = 'monthly';
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('plan') || lower.includes('annual')) {
        aiReply =
          'Our Growth Plan is currently 60% OFF at $119/mo (or $990/year for the VIP Enterprise License with 500+ leads). Both plans come with instant cloud activation via PayPal:';
        hasCta = true;
        ctaType = lower.includes('annual') || lower.includes('year') ? 'annual' : 'monthly';
      } else if (lower.includes('servicetitan') || lower.includes('housecall') || lower.includes('crm')) {
        aiReply =
          'Yes! We offer 1-click native webhook sync with ServiceTitan, Housecall Pro, Jobber, and QuickBooks. Inactive customers and missed calls are automatically recovered.';
        hasCta = true;
        ctaType = 'monthly';
      } else {
        aiReply =
          'RevenueRecover AI automatically engages your missed calls in 45 seconds via smart SMS text-back, booking the job before your competitor answers. Ready to activate your software?';
        hasCta = true;
        ctaType = 'monthly';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply,
          timestamp: 'Just now',
          hasCta,
          ctaType,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const quickPrompts = [
    '🎁 How to get 150-200 leads?',
    '⚡ How does missed-call recovery work?',
    '💳 How do I pay via PayPal ($119)?',
    '👑 $990 VIP Annual Plan',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-84 sm:w-96 bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl flex flex-col h-[480px] animate-in fade-in slide-in-from-bottom-3 text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-emerald-300">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="w-3 h-3 bg-emerald-400 rounded-full absolute bottom-0 right-0 border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  RevenueRecover AI Agent <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">24/7 Autonomous Sales Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-grow overflow-y-auto py-3 space-y-3 pr-1 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow'
                  }`}
                >
                  {msg.text}

                  {/* Embedded 1-Click PayPal Checkout CTAs */}
                  {msg.hasCta && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5">
                      <a
                        href={
                          msg.ctaType === 'annual'
                            ? 'https://www.paypal.com/ncp/payment/ZKXHXXNDN4D7J'
                            : 'https://www.paypal.com/ncp/payment/GFXAWMG4S227E'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 shadow hover:brightness-105 transition"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        {msg.ctaType === 'annual'
                          ? '⚡ Pay $990/yr VIP Annual on PayPal'
                          : '⚡ Pay $119/mo & Unlock 150–200 Leads'}
                      </a>
                      <div className="text-[9px] text-center text-slate-400 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> PayPal Verified • Instant Setup
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 w-20 text-slate-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="py-2 flex gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:border-emerald-500 hover:text-white transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-2 border-t border-slate-800 flex-shrink-0"
          >
            <input
              type="text"
              placeholder="Ask anything about RevenueRecover AI..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition active:scale-95 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs shadow-2xl shadow-emerald-500/30 hover:scale-105 transition active:scale-95 border-2 border-emerald-300"
      >
        <Bot className="w-5 h-5 text-slate-950" />
        <span>Ask AI Sales Assistant</span>
        <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
      </button>
    </div>
  );
}
