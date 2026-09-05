/**
 * RevenueRecover AI — Lead Identity & Deduplication Engine
 * Consolidates multi-touch customer inquiries into a unified MasterOpportunity.
 */

import { Lead, LeadSourceEvent, MasterOpportunity, LeadClassification, LeadUrgency } from './types';

// In-Memory Global Opportunity Store for active tracking & deduplication
const opportunitiesStore: Map<string, MasterOpportunity> = new Map();

export class LeadDeduplicationEngine {
  /**
   * Generates a deterministic customer identifier from phone or email.
   */
  static getCustomerIdentifier(phone?: string, email?: string): string {
    if (phone) {
      const cleanDigits = phone.replace(/\D/g, '');
      if (cleanDigits.length >= 10) return `cust_phone_${cleanDigits.slice(-10)}`;
    }
    if (email) {
      return `cust_email_${email.trim().toLowerCase()}`;
    }
    return `cust_anon_${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Ingests a new lead touchpoint and merges it into an existing or new MasterOpportunity.
   */
  static processLeadTouchpoint(lead: Lead, event: LeadSourceEvent): MasterOpportunity {
    const custId = this.getCustomerIdentifier(lead.customerPhoneE164, lead.customerEmail);

    let opp = Array.from(opportunitiesStore.values()).find(
      (o) => o.tenantId === lead.tenantId && o.customerIdentifier === custId && o.stage !== 'ARCHIVED'
    );

    const now = new Date().toISOString();

    if (opp) {
      // Collapse into existing Master Opportunity
      lead.isDuplicate = true;
      opp.touchpointEvents.push(event);
      opp.compositeScore = Math.min(Math.max(opp.compositeScore + 10, lead.leadScore), 99); // Multi-touch boosts intent
      if (lead.urgency === 'EMERGENCY') opp.highestUrgency = 'EMERGENCY';
      opp.classification = 'HOT';
      opp.summary = `${opp.summary} • Multi-touch: ${event.channel} at ${new Date(event.timestamp).toLocaleTimeString()}`;
      opp.updatedAt = now;
      opportunitiesStore.set(opp.id, opp);
      return opp;
    }

    // Create New Master Opportunity
    const oppId = `opp_${Math.random().toString(36).substring(2, 10)}`;
    const newOpportunity: MasterOpportunity = {
      id: oppId,
      tenantId: lead.tenantId,
      primaryLeadId: lead.id,
      customerIdentifier: custId,
      customerName: lead.customerName,
      customerPhone: lead.customerPhoneE164,
      customerEmail: lead.customerEmail,
      tradeCategory: lead.serviceCategory,
      summary: `${lead.serviceRequested} in ${lead.city}, ${lead.stateProvince}`,
      highestUrgency: lead.urgency,
      estimatedPipelineValueUSD: lead.estimatedJobValueUSD,
      compositeScore: lead.leadScore,
      classification: lead.leadClassification,
      touchpointEvents: [event],
      assignedBusinessId: lead.assignedBusinessId,
      stage: 'INBOX',
      createdAt: now,
      updatedAt: now,
    };

    opportunitiesStore.set(oppId, newOpportunity);
    return newOpportunity;
  }

  static getOpportunityById(id: string): MasterOpportunity | undefined {
    return opportunitiesStore.get(id);
  }

  static getAllOpportunities(tenantId?: string): MasterOpportunity[] {
    const all = Array.from(opportunitiesStore.values());
    return tenantId ? all.filter((o) => o.tenantId === tenantId) : all;
  }
}
