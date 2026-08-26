'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { ModeBanner, KillSwitchButton } from '@/components/shared/ModeBanner';
import { GrowthNav } from '@/components/growth/GrowthNav';
import { eventBus } from '@/lib/event-bus';
import { SystemEvent, AuditLogEntry } from '@/lib/types';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  Clock,
  EyeOff,
  Radio,
  FileCheck,
} from 'lucide-react';

export default function SecurityAuditPage() {
  const { state } = useAppStore();
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setEvents(eventBus.getEvents(30));
    setAuditLogs(eventBus.getAuditLogs(30));

    const unsub = eventBus.subscribe('*', () => {
      setEvents(eventBus.getEvents(30));
      setAuditLogs(eventBus.getAuditLogs(30));
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ModeBanner />

      <div className="flex-grow flex">
        <GrowthNav />

        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Compliance & Event Bus Audit Stream</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time chronological ledger of all AI decisions, message dispatches, and compliance safety checks.
              </p>
            </div>

            <KillSwitchButton />
          </div>

          {/* Real-time Event Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: System Events Bus */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Live Event Bus Stream ({events.length})
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Listening
                </span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {events.length > 0 ? (
                  events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-400">{evt.event_type}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Actor: {evt.actor_agent || 'System'} • Org: {evt.organization_id}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No events emitted yet. Trigger an action or scan to see live stream.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Message Audit Logs */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Communication Audit Trail ({auditLogs.length})
                </h3>
                <span className="text-[10px] text-slate-400">TCPA/CAN-SPAM Verified</span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{log.recipient}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded uppercase font-bold ${
                            log.status === 'delivered' || log.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate">&quot;{log.message_snippet}&quot;</p>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Agent: {log.agent}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No communication logs yet. Send a message to inspect audit trail.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
