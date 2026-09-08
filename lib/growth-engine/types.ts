/**
 * Autonomous AI Growth Engine — Core Type Definitions
 * Covers all 25 Agent Schemas, CRM Stages, ICP Rules, Sequences, and Daily Operations.
 */

export type CRMStage =
  | 'NEW'
  | 'VERIFIED'
  | 'QUALIFIED'
  | 'CONTACTED'
  | 'ENGAGED'
  | 'SALES_QUALIFIED'
  | 'DEMO_BOOKED'
  | 'DEMO_COMPLETED'
  | 'TRIAL'
  | 'PAYMENT_PENDING'
  | 'CUSTOMER'
  | 'ACTIVATED'
  | 'RETENTION'
  | 'EXPANSION'
  | 'CHURNED';

export type TargetIndustry = 'HVAC' | 'Plumbing' | 'Electrical' | 'Roofing' | 'Landscaping' | 'Garage Door' | 'General Contracting';
export type TargetCountry = 'USA' | 'UK' | 'Canada';

export type OutreachChannel = 'EMAIL' | 'SMS' | 'LINKEDIN' | 'VOICE_DROP';
export type ConsentStatus = 'EXPLICIT_OPT_IN' | 'IMPLIED_INQUIRY' | 'B2B_LEGITIMATE_INTEREST' | 'SUPPRESSED' | 'REVOKED';

export interface AgentContext {
  organizationId: string;
  leadId?: string;
  customerId?: string;
  campaignId?: string;
  metadata?: Record<string, any>;
}

export interface AgentExecutionResult<T = any> {
  success: boolean;
  agentName: string;
  executionId: string;
  timestamp: string;
  confidenceScore: number; // 0-100
  data: T;
  logs: string[];
  costUSD: number;
  tokensUsed: {
    input: number;
    output: number;
  };
  requiresHumanEscalation: boolean;
  escalationReason?: string;
}

export interface GrowthLead {
  id: string;
  companyName: string;
  contactName?: string;
  industry: TargetIndustry;
  country: TargetCountry;
  stateProvince: string;
  city: string;
  website?: string;
  phoneE164?: string;
  email?: string;
  source: string;
  sourceUrl?: string;
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'INVALID';
  consentStatus: ConsentStatus;
  
  // Scoring
  leadScore: number; // 0-100
  icpScore: number; // 0-100
  painScore: number; // 0-100
  intentScore: number; // 0-100
  contactabilityScore: number; // 0-100
  
  // Revenue Leak Estimates
  estimatedMissedCallsPerWeek: number;
  averageJobValueUSD: number;
  estimatedLostRevenueMonthlyUSD: number;
  estimatedRecoverableRevenueMonthlyUSD: number;
  
  // Pipeline
  stage: CRMStage;
  currentSequenceStep: number;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string[];
}

export interface ICPRuleConfig {
  targetTrades: TargetIndustry[];
  targetCountries: TargetCountry[];
  minTechnicians: number;
  maxTechnicians: number;
  minEstimatedMonthlyRevenue: number;
  requiresWebsite: boolean;
  requiresPhone: boolean;
}

export interface ObjectionResponse {
  objectionKey: string;
  prospectStatement: string;
  rebuttal: string;
  socialProofPoint: string;
  clarifyingQuestion: string;
  recommendedCTA: string;
  confidenceScore: number;
}

export interface RevenueScanResult {
  scanId: string;
  businessName: string;
  websiteUrl: string;
  city: string;
  stateProvince: string;
  country: TargetCountry;
  trade: TargetIndustry;
  overallHealthScore: number; // 0-100
  
  // Audited Factors
  missedCallVulnerability: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  speedToLeadScore: number; // 0-100
  afterHoursCoverage: boolean;
  onlineBookingPresent: boolean;
  dormantReactivationOpportunityUSD: number;
  unpaidInvoiceRiskUSD: number;
  totalEstimatedMonthlyLeakageUSD: {
    conservative: number;
    expected: number;
    optimistic: number;
  };
  identifiedBottlenecks: string[];
  recommendedSolutions: string[];
  personalizedPitch: string;
  recommendedPlanTier: 'STARTER' | 'GROWTH' | 'PRO_ANNUAL';
}

export interface OutreachSequenceStep {
  stepNumber: number;
  dayOffset: number;
  channel: OutreachChannel;
  purpose: 'INITIAL_INTRO' | 'VALUE_PROOF' | 'PAIN_POINT' | 'ROI_CASE_STUDY' | 'BREAKUP_PERMISSION';
  subjectTemplate?: string;
  bodyTemplate: string;
  requiresReview: boolean;
}

export interface DailyGrowthReport {
  date: string;
  leadsDiscovered: number;
  leadsVerified: number;
  leadsQualified: number;
  outreachDispatched: number;
  repliesReceived: number;
  positiveReplies: number;
  demosBooked: number;
  trialsStarted: number;
  newCustomers: number;
  mrrAddedUSD: number;
  totalPipelineValueUSD: number;
  totalAICostUSD: number;
  topOpportunities: {
    companyName: string;
    trade: string;
    city: string;
    opportunityValueUSD: number;
    stage: CRMStage;
  }[];
  criticalAlerts: string[];
  recommendedActionItems: string[];
}
