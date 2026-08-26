import { OpportunityType, UrgencyLevel } from './types';

export interface LeadScoreInput {
  industry: string;
  business_size?: string;
  has_website: boolean;
  has_online_booking: boolean;
  has_lead_form: boolean;
  missed_call_risk: 'high' | 'medium' | 'low';
  estimated_monthly_leads?: number;
  avg_job_value?: number;
  review_count?: number;
  uses_crm?: boolean;
}

export interface LeadScoreResult {
  score: number; // 0-100
  tier: 'hot' | 'warm' | 'cold';
  factors: {
    name: string;
    points: number;
    maxPoints: number;
    impact: string;
  }[];
  summary: string;
}

export interface RecoveryScoreInput {
  type: OpportunityType;
  estimated_value: number;
  customer_ltv: number;
  customer_purchase_count: number;
  days_since_trigger: number;
  urgency: UrgencyLevel;
  previous_response_rate?: number; // 0 to 1
  payment_dispute?: boolean;
}

export interface RecoveryScoreResult {
  score: number; // 0-100
  reasons: string[];
  recommended_channel: 'sms' | 'email' | 'webchat';
  priority_tier: 'critical' | 'high' | 'medium' | 'low';
}

export class ScoringEngine {
  /**
   * Calculate AI Lead Score (0 - 100) for Growth Prospecting
   */
  public static scoreLead(input: LeadScoreInput): LeadScoreResult {
    let score = 0;
    const factors: LeadScoreResult['factors'] = [];

    // 1. High-Value Industry Fit (Max 25 pts)
    const tier1Industries = ['hvac', 'plumbing', 'roofing', 'electrical', 'contractor'];
    const tier2Industries = ['dental', 'med spa', 'auto repair', 'cleaning', 'real estate'];

    const indLower = input.industry.toLowerCase();
    if (tier1Industries.some((ind) => indLower.includes(ind))) {
      score += 25;
      factors.push({
        name: 'High-Ticket Industry Fit',
        points: 25,
        maxPoints: 25,
        impact: 'High average job values ($1,200 - $8,000+) create strong recovery ROI.',
      });
    } else if (tier2Industries.some((ind) => indLower.includes(ind))) {
      score += 18;
      factors.push({
        name: 'Target Service Industry',
        points: 18,
        maxPoints: 25,
        impact: 'Strong repeat customer lifecycle with moderate quote values.',
      });
    } else {
      score += 10;
      factors.push({
        name: 'General Business Fit',
        points: 10,
        maxPoints: 25,
        impact: 'Standard professional service workflow.',
      });
    }

    // 2. High Missed Call / Leakage Risk (Max 25 pts)
    if (input.missed_call_risk === 'high') {
      score += 25;
      factors.push({
        name: 'Severe Leakage Risk',
        points: 25,
        maxPoints: 25,
        impact: 'No immediate automated text-back detected; loses ~20-35% of inbound calls.',
      });
    } else if (input.missed_call_risk === 'medium') {
      score += 15;
      factors.push({
        name: 'Moderate Leakage Risk',
        points: 15,
        maxPoints: 25,
        impact: 'Manual phone routing leaves after-hours and busy-hour leads uncontacted.',
      });
    } else {
      score += 8;
      factors.push({
        name: 'Basic Call Handling',
        points: 8,
        maxPoints: 25,
        impact: 'Some answering service in place but lacks automated SMS reactivation.',
      });
    }

    // 3. Digital Booking & Lead Capture Infrastructure (Max 20 pts)
    let infraPoints = 0;
    if (input.has_website) infraPoints += 6;
    if (input.has_lead_form) infraPoints += 7;
    if (input.has_online_booking) infraPoints += 7;
    score += infraPoints;
    factors.push({
      name: 'Digital Lead Infrastructure',
      points: infraPoints,
      maxPoints: 20,
      impact: `${input.has_lead_form ? 'Lead forms present' : 'No lead forms'}; ${input.has_online_booking ? 'Online booking present' : 'No instant booking'}.`,
    });

    // 4. Job Value & Volume Opportunity (Max 20 pts)
    const avgVal = input.avg_job_value || 1200;
    const leads = input.estimated_monthly_leads || 60;
    const monthlyOpportunity = (leads * 0.18) * avgVal;

    let oppPoints = 10;
    if (monthlyOpportunity > 20000) oppPoints = 20;
    else if (monthlyOpportunity > 10000) oppPoints = 16;
    else if (monthlyOpportunity > 5000) oppPoints = 12;

    score += oppPoints;
    factors.push({
      name: 'Estimated Revenue Upside',
      points: oppPoints,
      maxPoints: 20,
      impact: `Est. $${Math.round(monthlyOpportunity).toLocaleString()}/mo recoverable revenue based on ticket size and volume.`,
    });

    // 5. Operational Maturity (Max 10 pts)
    let maturityPoints = 4;
    if (input.uses_crm) maturityPoints += 3;
    if ((input.review_count || 0) > 50) maturityPoints += 3;
    score += maturityPoints;
    factors.push({
      name: 'Business Maturity & Scale',
      points: maturityPoints,
      maxPoints: 10,
      impact: `${input.review_count || 'Active'} online reviews; CRM integration ready.`,
    });

    score = Math.min(100, Math.max(0, Math.round(score)));

    let tier: LeadScoreResult['tier'] = 'cold';
    if (score >= 80) tier = 'hot';
    else if (score >= 60) tier = 'warm';

    return {
      score,
      tier,
      factors,
      summary: `${tier.toUpperCase()} Lead (${score}/100) — High upside in ${input.industry} with an estimated $${Math.round(monthlyOpportunity).toLocaleString()}/mo revenue recovery potential.`,
    };
  }

  /**
   * Calculate AI Recovery Score (0 - 100) for Core SaaS Opportunity Detection
   */
  public static scoreRecoveryOpportunity(input: RecoveryScoreInput): RecoveryScoreResult {
    let score = 50;
    const reasons: string[] = [];

    // 1. Opportunity Value & Customer LTV Weight
    if (input.estimated_value >= 3000 || input.customer_ltv >= 8000) {
      score += 20;
      reasons.push('High-ticket value (>$3,000 estimate or high customer LTV)');
    } else if (input.estimated_value >= 1000 || input.customer_ltv >= 3000) {
      score += 12;
      reasons.push('Solid job ticket value ($1,000 - $3,000)');
    } else {
      score += 5;
      reasons.push('Standard service ticket value');
    }

    // 2. Recency / Decay Factor
    if (input.days_since_trigger <= 1) {
      score += 20;
      reasons.push('Extremely fresh trigger (<24 hours) — peak conversion window');
    } else if (input.days_since_trigger <= 4) {
      score += 12;
      reasons.push(`Triggered ${input.days_since_trigger} days ago — high responsiveness expected`);
    } else if (input.days_since_trigger <= 14) {
      score += 2;
      reasons.push(`${input.days_since_trigger} days old — requires re-engagement angle`);
    } else {
      score -= 10;
      reasons.push('Aging trigger (>14 days) — higher friction to reactivate');
    }

    // 3. Urgency & Type Multipliers
    if (input.type === 'missed_call' || input.type === 'missed_lead') {
      score += 15;
      reasons.push('Inbound prospect actively shopping for immediate service');
    } else if (input.type === 'abandoned_quote' || input.type === 'rejected_quote') {
      score += 12;
      reasons.push('Expressed buying intent with written estimate delivered');
    } else if (input.type === 'failed_payment' || input.type === 'overdue_invoice') {
      score += 14;
      reasons.push('Committed revenue with pending payment collection');
    } else if (input.type === 'no_show' || input.type === 'cancelled_appointment') {
      score += 10;
      reasons.push('Slot booking cancelled — high re-booking probability');
    } else if (input.type === 'dormant_customer') {
      score += 6;
      reasons.push('Existing client due for seasonal service / filter replacement');
    }

    // 4. Customer History & Loyalty
    if (input.customer_purchase_count >= 3) {
      score += 10;
      reasons.push(`Loyal repeat customer (${input.customer_purchase_count} past jobs)`);
    } else if (input.customer_purchase_count >= 1) {
      score += 5;
      reasons.push('Existing verified customer on file');
    }

    score = Math.min(100, Math.max(10, Math.round(score)));

    // Channel selection logic
    let recommended_channel: 'sms' | 'email' | 'webchat' = 'sms';
    if (input.type === 'failed_payment' || input.type === 'overdue_invoice') {
      recommended_channel = 'email';
    } else if (input.type === 'missed_call' || input.type === 'missed_lead' || input.type === 'no_show') {
      recommended_channel = 'sms';
    }

    let priority_tier: RecoveryScoreResult['priority_tier'] = 'low';
    if (score >= 85) priority_tier = 'critical';
    else if (score >= 70) priority_tier = 'high';
    else if (score >= 50) priority_tier = 'medium';

    return {
      score,
      reasons,
      recommended_channel,
      priority_tier,
    };
  }
}
