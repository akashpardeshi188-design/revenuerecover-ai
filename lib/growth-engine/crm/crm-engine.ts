import { GrowthLead, CRMStage } from '../types';

export interface StageTransitionLog {
  id: string;
  leadId: string;
  fromStage: CRMStage;
  toStage: CRMStage;
  reason: string;
  actor: string;
  timestamp: string;
}

export class CRMEngine {
  private static stageHierarchy: CRMStage[] = [
    'NEW',
    'VERIFIED',
    'QUALIFIED',
    'CONTACTED',
    'ENGAGED',
    'SALES_QUALIFIED',
    'DEMO_BOOKED',
    'DEMO_COMPLETED',
    'TRIAL',
    'PAYMENT_PENDING',
    'CUSTOMER',
    'ACTIVATED',
    'RETENTION',
    'EXPANSION',
    'CHURNED'
  ];

  private static transitionLogs: StageTransitionLog[] = [];

  public static transitionStage(
    lead: GrowthLead,
    toStage: CRMStage,
    reason: string,
    actor = 'CRM_AGENT'
  ): { updatedLead: GrowthLead; log: StageTransitionLog } {
    const fromStage = lead.stage;
    const log: StageTransitionLog = {
      id: `trans_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      leadId: lead.id,
      fromStage,
      toStage,
      reason,
      actor,
      timestamp: new Date().toISOString()
    };

    this.transitionLogs.unshift(log);
    if (this.transitionLogs.length > 1000) {
      this.transitionLogs = this.transitionLogs.slice(0, 1000);
    }

    const updatedLead: GrowthLead = {
      ...lead,
      stage: toStage,
      updatedAt: new Date().toISOString(),
      notes: [...lead.notes, `[${new Date().toLocaleDateString()}] Stage changed from ${fromStage} to ${toStage}: ${reason}`]
    };

    return { updatedLead, log };
  }

  public static getTransitionHistory(leadId?: string): StageTransitionLog[] {
    if (leadId) {
      return this.transitionLogs.filter(l => l.leadId === leadId);
    }
    return this.transitionLogs;
  }

  public static calculateFunnelMetrics(leads: GrowthLead[]) {
    const stageCounts: Record<CRMStage, number> = {
      NEW: 0,
      VERIFIED: 0,
      QUALIFIED: 0,
      CONTACTED: 0,
      ENGAGED: 0,
      SALES_QUALIFIED: 0,
      DEMO_BOOKED: 0,
      DEMO_COMPLETED: 0,
      TRIAL: 0,
      PAYMENT_PENDING: 0,
      CUSTOMER: 0,
      ACTIVATED: 0,
      RETENTION: 0,
      EXPANSION: 0,
      CHURNED: 0
    };

    let totalPipelineUSD = 0;
    let totalMRR_USD = 0;

    for (const lead of leads) {
      stageCounts[lead.stage] = (stageCounts[lead.stage] || 0) + 1;
      totalPipelineUSD += lead.estimatedRecoverableRevenueMonthlyUSD || 0;
      if (['CUSTOMER', 'ACTIVATED', 'RETENTION', 'EXPANSION'].includes(lead.stage)) {
        totalMRR_USD += 119; // Standard growth plan MRR baseline
      }
    }

    return {
      stageCounts,
      totalLeads: leads.length,
      totalPipelineUSD,
      totalMRR_USD,
      qualifiedCount: stageCounts.QUALIFIED + stageCounts.CONTACTED + stageCounts.ENGAGED + stageCounts.SALES_QUALIFIED,
      customerCount: stageCounts.CUSTOMER + stageCounts.ACTIVATED + stageCounts.RETENTION + stageCounts.EXPANSION,
      conversionRateLeadToCustomer: leads.length > 0 ? ((stageCounts.CUSTOMER + stageCounts.ACTIVATED + stageCounts.EXPANSION) / leads.length) * 100 : 0
    };
  }
}
