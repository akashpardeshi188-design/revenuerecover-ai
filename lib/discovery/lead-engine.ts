/**
 * RevenueRecover AI — Lead Capture & Ingestion Engine
 * Ingests raw customer lead signals (Missed Calls, Web Forms, Inbound Emails, Booking Feeds).
 */

import { Lead, LeadSourceEvent, SourceType, TradeCategory, CountryCode, LeadUrgency } from './types';
import { AILeadScorer } from './ai-lead-scorer';
import { LeadDeduplicationEngine } from './lead-deduplication';

export class LeadCaptureEngine {
  /**
   * Ingests a raw lead signal and converts it into a standardized, scored Lead entity.
   */
  static async ingestLead(payload: {
    tenantId: string;
    sourceType: SourceType;
    sourceChannel: 'MISSED_PHONE_CALL' | 'WEBSITE_CONTACT_FORM' | 'DIRECT_BOOKING' | 'INBOUND_EMAIL' | 'SMS_INQUIRY' | 'CRM_SYNC';
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    serviceCategory: TradeCategory;
    serviceRequested: string;
    issueDescription?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: CountryCode;
    urgency?: LeadUrgency;
    estimatedJobValueUSD?: number;
    rawMetadata?: Record<string, any>;
  }): Promise<{ lead: Lead; event: LeadSourceEvent }> {
    const leadId = `lead_${Math.random().toString(36).substring(2, 10)}`;
    const eventId = `evt_${Math.random().toString(36).substring(2, 10)}`;
    const now = new Date().toISOString();

    // 1. Initial AI / Heuristic Lead Scoring
    const scoringResult = await AILeadScorer.scoreLead({
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      serviceCategory: payload.serviceCategory,
      serviceRequested: payload.serviceRequested,
      issueDescription: payload.issueDescription,
      city: payload.city,
      stateProvince: payload.stateProvince,
      urgency: payload.urgency || 'HIGH',
      channel: payload.sourceChannel,
    });

    // 2. Normalize customer phone
    const cleanPhone = payload.customerPhone?.replace(/\D/g, '');
    const phoneE164 = cleanPhone ? (cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`) : undefined;

    const newLead: Lead = {
      id: leadId,
      tenantId: payload.tenantId,
      sourceType: payload.sourceType,
      sourceChannel: payload.sourceChannel,
      customerName: payload.customerName || 'Local Homeowner',
      customerPhoneE164: phoneE164,
      customerEmail: payload.customerEmail,
      serviceCategory: payload.serviceCategory,
      serviceRequested: payload.serviceRequested,
      issueDescription: payload.issueDescription || `${payload.serviceCategory} assistance requested in ${payload.city}`,
      city: payload.city,
      stateProvince: payload.stateProvince,
      postalCode: payload.postalCode || '75001',
      country: payload.country,
      urgency: payload.urgency || 'HIGH',
      estimatedJobValueUSD: payload.estimatedJobValueUSD || scoringResult.estimatedJobValueUSD,
      leadScore: scoringResult.score,
      leadClassification: scoringResult.classification,
      scoreReasons: scoringResult.reasons,
      aiClassificationExplanation: scoringResult.explanation,
      consentStatus: payload.sourceChannel === 'MISSED_PHONE_CALL' ? 'IMPLIED_INQUIRY' : 'EXPRESS_WRITTEN',
      consentTimestamp: now,
      isDuplicate: false,
      masterOpportunityId: '', // Set during deduplication
      status: 'NEW',
      createdAt: now,
      updatedAt: now,
    };

    const newEvent: LeadSourceEvent = {
      id: eventId,
      leadId: leadId,
      masterOpportunityId: '',
      sourceType: payload.sourceType,
      channel: payload.sourceChannel,
      rawPayload: payload.rawMetadata || {},
      timestamp: now,
    };

    // 3. Deduplicate and link with Master Opportunity
    const masterOpportunity = LeadDeduplicationEngine.processLeadTouchpoint(newLead, newEvent);
    newLead.masterOpportunityId = masterOpportunity.id;
    newEvent.masterOpportunityId = masterOpportunity.id;

    return { lead: newLead, event: newEvent };
  }
}
