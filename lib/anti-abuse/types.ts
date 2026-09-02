/**
 * RevenueRecover AI — Anti-Abuse & Identity Resolution Type System
 * Enforces: ONE VERIFIED BUSINESS = ONE FREE TRIAL
 */

export type TrialStatus =
  | 'NOT_USED'
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CONVERTED'
  | 'BLOCKED';

export type EligibilityDecision =
  | 'APPROVE'
  | 'VERIFY'
  | 'REVIEW'
  | 'BLOCK_PREVIOUS_TRIAL';

export type SignalStrength = 'VERY_STRONG' | 'STRONG' | 'MEDIUM' | 'WEAK';

export interface BusinessIdentity {
  id: string; // Canonical e.g. BIZ-83920
  legalName: string;
  normalizedName: string;
  displayName: string;
  website: string;
  normalizedDomain: string;
  phone: string;
  normalizedPhone: string;
  country: string;
  industry: string;
  location: string;
  identityConfidence: number; // 0.00 - 1.00
  customerStatus: 'LEAD' | 'TRIAL' | 'PAID' | 'CHURNED';
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  businessId: string;
  email: string;
  normalizedEmail: string;
  phone: string;
  role: 'owner' | 'manager' | 'technician' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface TrialEntitlement {
  id: string;
  businessId: string;
  status: TrialStatus;
  leadQuota: number; // e.g. 200 leads
  leadsUsed: number;
  leadsRemaining: number;
  startedAt?: string;
  expiredAt?: string;
  usedAt?: string;
  source: 'web_signup' | 'scanner_inbound' | 'sdr_invite' | 'referral';
  paymentGatewayRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskSignal {
  code: string;
  category: 'IDENTITY' | 'PREVIOUS_TRIAL' | 'PAYMENT' | 'NETWORK' | 'DEVICE' | 'BEHAVIOR';
  weight: number;
  strength: SignalStrength;
  description: string;
  valueReference?: string;
}

export interface TrialRiskEvaluation {
  businessId: string;
  riskScore: number; // 0 - 100
  decision: EligibilityDecision;
  identityConfidence: number;
  signals: RiskSignal[];
  userFacingMessage: string;
  requiresVerification: boolean;
  requiresReview: boolean;
  timestamp: string;
}

export interface ReviewQueueItem {
  id: string;
  businessId: string;
  businessName: string;
  userEmail: string;
  userPhone: string;
  riskScore: number;
  identityConfidence: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'VERIFICATION_REQUESTED';
  signals: RiskSignal[];
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface AntiAbuseAuditLog {
  id: string;
  action:
    | 'SIGNUP_ATTEMPT'
    | 'TRIAL_EVALUATED'
    | 'TRIAL_APPROVED'
    | 'TRIAL_VERIFIED'
    | 'TRIAL_BLOCKED'
    | 'TRIAL_CONVERTED_TO_PAID'
    | 'ADMIN_OVERRIDE'
    | 'QUOTA_INCREMENTED';
  businessId: string;
  userId?: string;
  decision?: EligibilityDecision;
  riskScore?: number;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface AntiAbuseFeatureFlags {
  ENABLE_TRIAL_RISK_SCORING: boolean;
  ENABLE_BUSINESS_MATCHING: boolean;
  ENABLE_DEVICE_SIGNAL: boolean;
  ENABLE_IP_SIGNAL: boolean;
  ENABLE_PHONE_VERIFICATION: boolean;
  ENABLE_BUSINESS_VERIFICATION: boolean;
  ENABLE_MANUAL_REVIEW: boolean;
  ENABLE_PAYMENT_IDENTITY_MATCHING: boolean;
  SHADOW_MODE: boolean; // If true, logs evaluations without hard blocking
}
