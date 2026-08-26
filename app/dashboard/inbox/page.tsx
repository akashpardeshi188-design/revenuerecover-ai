'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner } from '@/components/shared/ModeBanner';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Search,
} from 'lucide-react';

export default function UnifiedInboxPage() {
  const { state, approveAndSendMessage } = useAppStore();
  const [selectedConvId, setSelectedConvId] = useState<string>(state.conversations[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [replyText, setReplyText] = useState<string>('');

  const filteredConversations = state.conversations.filter((c) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'needs_reply') return c.status === 'needs_reply';
    if (filterStatus === 'ai_handling') return c.status === 'ai_handling';
    return c.status === filterStatus;
  });

  const activeConv = state.conversations.find((c) => c.id === selectedConvId) || state.conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;
    approveAndSendMessage(activeConv.id, replyText);
    setReplyText('');
  };

  const handleUseAiSuggested = () => {
    if (activeConv?.ai_suggested_reply) {
      setReplyText(activeConv.ai_suggested_reply);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <DashboardNav />

        <main className="flex-grow p-6 sm:p-8 space-y-6 max-w-7xl overflow-x-hidden flex flex-col h-[calc(100vh-37px)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Unified Customer Inbox</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Two-way communication across SMS and Email with AI response classification & suggested replies.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold text-slate-400">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-xl transition ${filterStatus === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                All Threads
              </button>
              <button
                onClick={() => setFilterStatus('needs_reply')}
                className={`px-3 py-1.5 rounded-xl transition ${filterStatus === 'needs_reply' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                Needs Reply
              </button>
              <button
                onClick={() => setFilterStatus('ai_handling')}
                className={`px-3 py-1.5 rounded-xl transition ${filterStatus === 'ai_handling' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                AI Handling
              </button>
            </div>
          </div>

          {/* Inbox Split Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
            {/* Left Thread List */}
            <div className="lg:col-span-5 border-r border-slate-800 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 text-xs font-semibold text-slate-400">
                Conversations ({filteredConversations.length})
              </div>

              <div className="flex-grow overflow-y-auto divide-y divide-slate-800/60">
                {filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeConv?.id;
                  const lastMsg = conv.messages[conv.messages.length - 1];

                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`p-4 cursor-pointer transition ${
                        isSelected ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{conv.customer_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                        <span className="text-emerald-400 uppercase font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {conv.channel}
                        </span>
                        <span className="truncate">{conv.customer_phone}</span>
                      </div>

                      <p className="text-xs text-slate-300 truncate line-clamp-1 font-mono">
                        {lastMsg ? lastMsg.text : 'No messages'}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase">
                          {conv.ai_classification.replace('_', ' ')}
                        </span>
                        {conv.status === 'needs_reply' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Thread & Reply Box */}
            <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden bg-slate-950/60">
              {activeConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/60">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{activeConv.customer_name}</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                          {activeConv.channel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {activeConv.customer_phone} • {activeConv.customer_email}
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Classified as: <strong className="text-purple-400 capitalize">{activeConv.ai_classification.replace('_', ' ')}</strong></span>
                    </div>
                  </div>

                  {/* Messages Bubble Stream */}
                  <div className="flex-grow p-6 overflow-y-auto space-y-4">
                    {activeConv.messages.map((msg) => {
                      const isCustomer = msg.sender === 'customer';
                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 max-w-[80%] ${isCustomer ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                              isCustomer ? 'bg-slate-800 text-slate-300' : 'bg-emerald-500 text-slate-950 font-bold'
                            }`}
                          >
                            {isCustomer ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>

                          <div className="space-y-1">
                            <div
                              className={`p-4 rounded-2xl text-xs leading-relaxed ${
                                isCustomer
                                  ? 'bg-slate-900 border border-slate-800 text-slate-200'
                                  : 'bg-emerald-600 text-white font-medium'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <div
                              className={`text-[10px] text-slate-400 font-mono ${
                                isCustomer ? 'text-left' : 'text-right'
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {msg.status}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Suggested Reply Banner */}
                  {activeConv.ai_suggested_reply && (
                    <div className="p-4 bg-emerald-950/30 border-t border-emerald-500/30 shrink-0 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> AI Suggested Follow-up ({activeConv.ai_confidence}% confidence)
                        </span>
                        <button
                          type="button"
                          onClick={handleUseAiSuggested}
                          className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
                        >
                          Insert into composer
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        &quot;{activeConv.ai_suggested_reply}&quot;
                      </p>
                    </div>
                  )}

                  {/* Composer Form */}
                  <form onSubmit={handleSend} className="p-4 border-t border-slate-800 shrink-0 bg-slate-900/60 space-y-2">
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Send message to ${activeConv.customer_name} via ${activeConv.channel.toUpperCase()}...`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 pr-20 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition disabled:opacity-40"
                      >
                        <Send className="w-3 h-3" /> Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                  Select a conversation from the left to view thread
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
