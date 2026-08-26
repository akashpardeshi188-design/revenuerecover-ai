'use client';

import { useState, useEffect } from 'react';
import {
  OperatingMode,
  Opportunity,
  Customer,
  Conversation,
  Campaign,
  Integration,
  BusinessRules,
  ProspectLead,
  GrowthMetrics,
  Organization,
  Referral,
  SystemEvent,
  AuditLogEntry,
  PipelineStage,
  RevenueScanResult,
} from './types';
import {
  demoOrganization,
  demoBusinessRules,
  demoGrowthMetrics,
  demoOpportunities,
  demoCustomers,
  demoConversations,
  demoCampaigns,
  demoIntegrations,
  demoProspectLeads,
  demoReferrals,
} from './demo-data';
import { eventBus } from './event-bus';
import { complianceEngine } from './compliance';
import { ScoringEngine } from './scoring-engine';

interface AppState {
  mode: OperatingMode;
  organization: Organization;
  businessRules: BusinessRules;
  opportunities: Opportunity[];
  customers: Customer[];
  conversations: Conversation[];
  campaigns: Campaign[];
  integrations: Integration[];
  prospectLeads: ProspectLead[];
  growthMetrics: GrowthMetrics;
  referrals: Referral[];
}

const STORAGE_KEY = 'revenuerecover_app_state_v1';

class StoreService {
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): AppState {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to load state from localStorage', e);
      }
    }

    return {
      mode: 'demo',
      organization: demoOrganization,
      businessRules: demoBusinessRules,
      opportunities: demoOpportunities,
      customers: demoCustomers,
      conversations: demoConversations,
      campaigns: demoCampaigns,
      integrations: demoIntegrations,
      prospectLeads: demoProspectLeads,
      growthMetrics: demoGrowthMetrics,
      referrals: demoReferrals,
    };
  }

  public getState(): AppState {
    return this.state;
  }

  public subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        // quota exceeded
      }
    }
    this.listeners.forEach((listener) => listener(this.state));
  }

  public setMode(mode: OperatingMode): void {
    this.state = { ...this.state, mode };
    eventBus.emit('system.mode_changed', { mode });
    this.notify();
  }

  public updateBusinessRules(rules: Partial<BusinessRules>): void {
    this.state = {
      ...this.state,
      businessRules: { ...this.state.businessRules, ...rules },
    };
    eventBus.emit('rules.updated', { rules });
    this.notify();
  }

  public toggleKillSwitch(active?: boolean): boolean {
    const nextVal = active !== undefined ? active : !this.state.businessRules.kill_switch_active;
    this.state = {
      ...this.state,
      businessRules: { ...this.state.businessRules, kill_switch_active: nextVal },
    };
    eventBus.emit(nextVal ? 'system.kill_switch_activated' : 'system.kill_switch_deactivated', {
      timestamp: new Date().toISOString(),
    });
    this.notify();
    return nextVal;
  }

  public async triggerOpportunityAction(opportunityId: string, customMessage?: string): Promise<{ success: boolean; reason?: string }> {
    const opp = this.state.opportunities.find((o) => o.id === opportunityId);
    if (!opp) return { success: false, reason: 'Opportunity not found' };

    // Compliance Check
    const compliance = complianceEngine.checkCommunication(
      opp.customer_phone || opp.customer_email,
      opp.recommended_channel,
      this.state.businessRules
    );

    if (!compliance.allowed) {
      eventBus.logAudit({
        channel: opp.recommended_channel,
        recipient: opp.customer_phone || opp.customer_email,
        consent_basis: 'Legitimate business transaction relationship',
        message_snippet: customMessage || opp.recommended_action,
        status: compliance.code === 'KILL_SWITCH' ? 'blocked_by_killswitch' : 'suppressed',
        agent: 'RevenueRecoveryAgent',
        organization_id: opp.organization_id,
      });
      return { success: false, reason: compliance.reason };
    }

    const messageText = customMessage || opp.recommended_action;
    complianceEngine.recordMessageSent(opp.customer_phone || opp.customer_email);

    // Update opportunity
    const updatedOpportunities = this.state.opportunities.map((o) =>
      o.id === opportunityId
        ? {
            ...o,
            status: 'contacted' as const,
            last_message_sent: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : o
    );

    // Add or update conversation
    let updatedConversations = [...this.state.conversations];
    const existingConvIndex = updatedConversations.findIndex((c) => c.customer_id === opp.customer_id);

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'ai_agent' as const,
      text: messageText,
      timestamp: new Date().toISOString(),
      channel: opp.recommended_channel,
      status: 'delivered' as const,
    };

    if (existingConvIndex >= 0) {
      updatedConversations[existingConvIndex] = {
        ...updatedConversations[existingConvIndex],
        messages: [...updatedConversations[existingConvIndex].messages, newMsg],
        status: 'ai_handling',
        updated_at: new Date().toISOString(),
      };
    } else {
      updatedConversations.unshift({
        id: `conv_${Date.now()}`,
        organization_id: opp.organization_id,
        customer_id: opp.customer_id,
        customer_name: opp.customer_name,
        customer_phone: opp.customer_phone,
        customer_email: opp.customer_email,
        channel: opp.recommended_channel,
        status: 'ai_handling',
        ai_classification: 'information_request',
        messages: [newMsg],
        updated_at: new Date().toISOString(),
      });
    }

    this.state = {
      ...this.state,
      opportunities: updatedOpportunities,
      conversations: updatedConversations,
    };

    eventBus.emit('message.sent', {
      opportunityId,
      customerId: opp.customer_id,
      channel: opp.recommended_channel,
      recipient: opp.customer_phone || opp.customer_email,
    }, { actorAgent: 'RevenueRecoveryAgent' });

    eventBus.logAudit({
      channel: opp.recommended_channel,
      recipient: opp.customer_phone || opp.customer_email,
      consent_basis: 'Legitimate service quote inquiry',
      message_snippet: messageText,
      status: 'delivered',
      agent: 'RevenueRecoveryAgent',
      organization_id: opp.organization_id,
    });

    this.notify();
    return { success: true };
  }

  public markOpportunityRecovered(opportunityId: string, recoveredAmount?: number): void {
    const opp = this.state.opportunities.find((o) => o.id === opportunityId);
    if (!opp) return;

    const amount = recoveredAmount || opp.estimated_value;
    const now = new Date().toISOString();

    const updatedOpportunities = this.state.opportunities.map((o) =>
      o.id === opportunityId
        ? {
            ...o,
            status: 'recovered' as const,
            recovered_amount: amount,
            recovered_at: now,
            updated_at: now,
          }
        : o
    );

    const updatedOrg = {
      ...this.state.organization,
      monthly_recovered: this.state.organization.monthly_recovered + amount,
      lifetime_recovered: this.state.organization.lifetime_recovered + amount,
    };

    this.state = {
      ...this.state,
      opportunities: updatedOpportunities,
      organization: updatedOrg,
    };

    eventBus.emit('revenue.recovered', {
      opportunityId,
      customerId: opp.customer_id,
      recoveredAmount: amount,
      type: opp.type,
      attributionConfidence: 96,
    }, { actorAgent: 'RevenueRecoveryAgent' });

    this.notify();
  }

  public approveAndSendMessage(conversationId: string, replyText: string): boolean {
    const conv = this.state.conversations.find((c) => c.id === conversationId);
    if (!conv) return false;

    const compliance = complianceEngine.checkCommunication(
      conv.customer_phone || conv.customer_email,
      conv.channel,
      this.state.businessRules
    );

    if (!compliance.allowed) {
      eventBus.logAudit({
        channel: conv.channel,
        recipient: conv.customer_phone || conv.customer_email,
        consent_basis: 'Inbound customer thread',
        message_snippet: replyText,
        status: compliance.code === 'KILL_SWITCH' ? 'blocked_by_killswitch' : 'suppressed',
        agent: 'HumanSupervisor',
        organization_id: conv.organization_id,
      });
      return false;
    }

    complianceEngine.recordMessageSent(conv.customer_phone || conv.customer_email);

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'human_agent' as const,
      text: replyText,
      timestamp: new Date().toISOString(),
      channel: conv.channel,
      status: 'delivered' as const,
    };

    const updatedConversations = this.state.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            status: 'ai_handling' as const,
            messages: [...c.messages, newMsg],
            updated_at: new Date().toISOString(),
          }
        : c
    );

    this.state = { ...this.state, conversations: updatedConversations };

    eventBus.emit('message.sent', {
      conversationId,
      channel: conv.channel,
      sender: 'human_agent',
    });

    eventBus.logAudit({
      channel: conv.channel,
      recipient: conv.customer_phone || conv.customer_email,
      consent_basis: 'Inbound customer thread reply',
      message_snippet: replyText,
      status: 'approved',
      agent: 'HumanSupervisor',
      organization_id: conv.organization_id,
    });

    this.notify();
    return true;
  }

  public updateLeadStage(leadId: string, stage: PipelineStage): void {
    const lead = this.state.prospectLeads.find((l) => l.id === leadId);
    if (!lead) return;

    const updatedLeads = this.state.prospectLeads.map((l) =>
      l.id === leadId ? { ...l, stage, next_action: this.getNextActionForStage(stage) } : l
    );

    let updatedMetrics = { ...this.state.growthMetrics };
    if (stage === 'won') {
      updatedMetrics.paid_customers += 1;
      updatedMetrics.mrr += 149;
      updatedMetrics.ai_assisted_sales += 1;
    } else if (stage === 'demo') {
      updatedMetrics.demos += 1;
    } else if (stage === 'trial') {
      updatedMetrics.trials += 1;
    }

    this.state = {
      ...this.state,
      prospectLeads: updatedLeads,
      growthMetrics: updatedMetrics,
    };

    eventBus.emit(`lead.stage_changed`, { leadId, stage }, { actorAgent: 'SalesAgent' });
    this.notify();
  }

  public addNewProspectLead(lead: Omit<ProspectLead, 'id' | 'lead_score' | 'tier' | 'created_at'>): ProspectLead {
    const scoreResult = ScoringEngine.scoreLead({
      industry: lead.industry,
      business_size: lead.business_size,
      has_website: !!lead.website,
      has_online_booking: lead.research_dossier?.online_booking_present ?? true,
      has_lead_form: true,
      missed_call_risk: 'high',
      avg_job_value: 1400,
    });

    const newLead: ProspectLead = {
      id: `pros_${Date.now()}`,
      lead_score: scoreResult.score,
      tier: scoreResult.tier,
      created_at: new Date().toISOString(),
      ...lead,
    };

    this.state = {
      ...this.state,
      prospectLeads: [newLead, ...this.state.prospectLeads],
      growthMetrics: {
        ...this.state.growthMetrics,
        leads: this.state.growthMetrics.leads + 1,
        ai_generated_leads: this.state.growthMetrics.ai_generated_leads + 1,
      },
    };

    eventBus.emit('lead.created', { leadId: newLead.id, businessName: newLead.business_name });
    eventBus.emit('lead.scored', { leadId: newLead.id, score: newLead.lead_score, tier: newLead.tier });
    this.notify();
    return newLead;
  }

  public runRevenueScanner(input: {
    businessName: string;
    website: string;
    industry: string;
    location: string;
    monthlyLeads: number;
    avgJobValue: number;
    currentProcess: string;
    email?: string;
    phone?: string;
  }): RevenueScanResult {
    const leads = input.monthlyLeads || 80;
    const val = input.avgJobValue || 1200;

    const missed_leads = Math.round(leads * 0.18 * val);
    const abandoned_quotes = Math.round(leads * 0.12 * val);
    const dormant_customers = Math.round(leads * 0.08 * (val * 0.6));
    const failed_payments = Math.round(leads * 0.04 * (val * 0.9));
    const no_show_loss = Math.round(leads * 0.06 * (val * 0.5));

    const total_estimated_leakage =
      missed_leads + abandoned_quotes + dormant_customers + failed_payments + no_show_loss;

    const scanResult: RevenueScanResult = {
      scan_id: `scan_${Date.now()}`,
      business_name: input.businessName || 'Your Business',
      website: input.website,
      industry: input.industry,
      location: input.location,
      monthly_leads: leads,
      avg_job_value: val,
      current_process: input.currentProcess,
      total_estimated_leakage,
      breakdown: {
        missed_leads,
        abandoned_quotes,
        dormant_customers,
        failed_payments,
        no_show_loss,
      },
      confidence_score: 87,
      action_plan: [
        `Deploy 45-second automated SMS text-back on missed calls (Recovers ~$${missed_leads.toLocaleString()}/mo)`,
        `Activate 3-touch multi-channel estimate follow-up sequencer (Recovers ~$${abandoned_quotes.toLocaleString()}/mo)`,
        `Launch automated 10-month seasonal tune-up reactivation campaign (Recovers ~$${dormant_customers.toLocaleString()}/mo)`,
        `Enable 1-click self-serve payment retry links on declined cards (Recovers ~$${failed_payments.toLocaleString()}/mo)`,
      ],
      created_at: new Date().toISOString(),
    };

    // Auto-create lead in Growth Engine
    if (input.businessName || input.email) {
      this.addNewProspectLead({
        business_name: input.businessName || 'Scanner Prospect',
        website: input.website || 'https://prospect.com',
        industry: input.industry || 'HVAC',
        city: input.location.split(',')[0] || 'Dallas',
        state: input.location.split(',')[1]?.trim() || 'Texas',
        public_email: input.email || 'lead@prospect.com',
        public_phone: input.phone || '(555) 012-3456',
        source: 'scanner_inbound',
        estimated_leakage: total_estimated_leakage,
        confidence: 87,
        stage: 'new_lead',
        next_action: 'Send instant scan summary and personalized interactive demo link',
        opt_out: false,
        research_dossier: {
          signals: ['Completed Free Revenue Scanner', `Estimated $${total_estimated_leakage.toLocaleString()}/mo leakage`],
          missed_call_risk: 'High',
          quote_workflow: input.currentProcess || 'Manual phone and email follow-up',
          online_booking_present: true,
          recommended_pitch: `Recover an estimated $${total_estimated_leakage.toLocaleString()}/mo in lost ${input.industry} jobs automatically.`,
        },
      });
    }

    this.state = {
      ...this.state,
      growthMetrics: {
        ...this.state.growthMetrics,
        scans: this.state.growthMetrics.scans + 1,
      },
    };

    eventBus.emit('scanner.completed', {
      businessName: input.businessName,
      totalLeakage: total_estimated_leakage,
    }, { actorAgent: 'SalesAgent' });

    this.notify();
    return scanResult;
  }

  public resetToDemo(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('rr_event_history');
      localStorage.removeItem('rr_audit_logs');
      localStorage.removeItem('rr_ai_cost_logs');
    }
    this.state = {
      mode: 'demo',
      organization: demoOrganization,
      businessRules: demoBusinessRules,
      opportunities: demoOpportunities,
      customers: demoCustomers,
      conversations: demoConversations,
      campaigns: demoCampaigns,
      integrations: demoIntegrations,
      prospectLeads: demoProspectLeads,
      growthMetrics: demoGrowthMetrics,
      referrals: demoReferrals,
    };
    eventBus.clear();
    this.notify();
  }

  private getNextActionForStage(stage: PipelineStage): string {
    switch (stage) {
      case 'new_lead': return 'Run AI Prospect Intelligence Research';
      case 'researching': return 'Generate customized outreach copy';
      case 'qualified': return 'Send personalized campaign #1';
      case 'contacted': return 'Wait for response or Day 2 follow-up';
      case 'engaged': return 'Send interactive demo simulation link';
      case 'demo': return 'Offer 14-day free trial on Growth Plan';
      case 'trial': return 'Guide through 8-step onboarding & CRM connect';
      case 'negotiation': return 'Provide custom ROI projection';
      case 'won': return 'Activate Revenue Recovery Agent & send referral invite';
      case 'lost': return 'Add to 60-day nurture sequence';
      case 'nurture': return 'Send monthly industry revenue report';
      default: return 'Review lead status';
    }
  }
}

export const storeService = new StoreService();

export function useAppStore() {
  const [state, setState] = useState<AppState>(storeService.getState());

  useEffect(() => {
    const unsubscribe = storeService.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    state,
    setMode: (mode: OperatingMode) => storeService.setMode(mode),
    updateBusinessRules: (rules: Partial<BusinessRules>) => storeService.updateBusinessRules(rules),
    toggleKillSwitch: (active?: boolean) => storeService.toggleKillSwitch(active),
    triggerOpportunityAction: (id: string, msg?: string) => storeService.triggerOpportunityAction(id, msg),
    markOpportunityRecovered: (id: string, amount?: number) => storeService.markOpportunityRecovered(id, amount),
    approveAndSendMessage: (convId: string, reply: string) => storeService.approveAndSendMessage(convId, reply),
    updateLeadStage: (leadId: string, stage: PipelineStage) => storeService.updateLeadStage(leadId, stage),
    addNewProspectLead: (lead: Parameters<typeof storeService.addNewProspectLead>[0]) => storeService.addNewProspectLead(lead),
    runRevenueScanner: (input: Parameters<typeof storeService.runRevenueScanner>[0]) => storeService.runRevenueScanner(input),
    resetToDemo: () => storeService.resetToDemo(),
  };
}
