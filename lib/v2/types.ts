export type V2Industry = 'hvac' | 'plumbing';

export interface LeadInput {
  state: string;
  city: string;
  industry?: V2Industry;
  limit?: number;
}

export interface LeadCandidate {
  business_name: string;
  phone: string;
  owner_name: string | null;
  website: string | null;
  review_count: number;
  rating: number;
  city: string;
  state: string;
  estimated_missed_calls: number;
  estimated_lost_revenue: number;
  score: number;
  score_breakdown: {
    reviews: number;
    website: number;
    rating: number;
    ai_competitor_not_detected: number;
  };
  source: 'google_places' | 'yelp';
}

export interface PersonalizationResult {
  painLine: string;
  roiLine: string;
  icebreaker: string;
  disclaimer: string;
}

export interface DemoEvent {
  id: string;
  label: string;
  message: string;
  revenue: number;
}

export const V2_STAGES = [
  'new_lead',
  'verified',
  'enriched',
  'qualified',
  'contacted',
  'replied',
  'interested',
  'demo_booked',
  'proposal_sent',
  'closed_won',
  'onboarding',
  'active',
  'at_risk',
  'rescue',
  'churned',
] as const;

export type V2LifecycleStage = (typeof V2_STAGES)[number];
