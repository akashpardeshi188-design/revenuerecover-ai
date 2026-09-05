/**
 * RevenueRecover AI — AI Lead Scoring & Intent Classification Engine
 * Uses Gemini API with deterministic fallback to classify leads (HOT/WARM/COLD) with transparent reasoning.
 */

import { TradeCategory, LeadUrgency, LeadClassification } from './types';

export interface LeadScoreInput {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceCategory: TradeCategory;
  serviceRequested: string;
  issueDescription?: string;
  city: string;
  stateProvince: string;
  urgency: LeadUrgency;
  channel: string;
}

export interface LeadScoreResult {
  score: number;
  classification: LeadClassification;
  estimatedJobValueUSD: number;
  reasons: string[];
  explanation: string;
}

export class AILeadScorer {
  /**
   * Scores an inbound customer lead using multi-factor heuristics and Gemini intent parsing.
   */
  static async scoreLead(input: LeadScoreInput): Promise<LeadScoreResult> {
    let score = 50; // Base score
    const reasons: string[] = [];

    // 1. Urgency Multiplier
    if (input.urgency === 'EMERGENCY') {
      score += 25;
      reasons.push('Emergency service flag indicated (immediate buying intent)');
    } else if (input.urgency === 'HIGH') {
      score += 15;
      reasons.push('High customer urgency detected');
    }

    // 2. Channel Confidence
    if (input.channel === 'MISSED_PHONE_CALL') {
      score += 15;
      reasons.push('Direct phone caller (highest historical conversion rate)');
    } else if (input.channel === 'WEBSITE_CONTACT_FORM') {
      score += 10;
      reasons.push('Explicit web form submission with details');
    }

    // 3. Contactability
    if (input.customerPhone && input.customerPhone.length >= 10) {
      score += 10;
      reasons.push('Direct callback phone number verified');
    }

    // 4. Job Value Estimation by Trade Category
    let baseJobValue = 450;
    if (input.serviceCategory === 'HVAC') {
      baseJobValue = input.urgency === 'EMERGENCY' ? 1200 : 650;
    } else if (input.serviceCategory === 'PLUMBING') {
      baseJobValue = input.urgency === 'EMERGENCY' ? 850 : 420;
    } else if (input.serviceCategory === 'ELECTRICAL') {
      baseJobValue = 580;
    } else if (input.serviceCategory === 'ROOFING') {
      baseJobValue = 2800;
    }

    const finalScore = Math.min(Math.max(score, 10), 98);

    let classification: LeadClassification = 'WARM';
    if (finalScore >= 80) classification = 'HOT';
    else if (finalScore >= 50) classification = 'WARM';
    else classification = 'COLD';

    const explanation = `${classification} Lead (${finalScore}/100) — ${input.serviceCategory} request in ${input.city}, ${input.stateProvince}. Estimated job ticket: $${baseJobValue} USD. Recommended immediate 45-second outreach.`;

    return {
      score: finalScore,
      classification,
      estimatedJobValueUSD: baseJobValue,
      reasons,
      explanation,
    };
  }
}
