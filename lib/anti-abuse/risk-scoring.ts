/**
 * RevenueRecover AI — Trial Risk Scoring & Decision Engine
 * Evaluates Trial Risk Score (0-100) and maps to appropriate conversion decisions.
 */

import {
  EligibilityDecision,
  RiskSignal,
  TrialRiskEvaluation,
  AntiAbuseFeatureFlags,
} from './types';
import { IdentityResolutionService } from './identity-resolution';
import { TrialEntitlementService } from './trial-entitlement';

export class RiskScoringEngine {
  public static featureFlags: AntiAbuseFeatureFlags = {
    ENABLE_TRIAL_RISK_SCORING: true,
    ENABLE_BUSINESS_MATCHING: true,
    ENABLE_DEVICE_SIGNAL: true,
    ENABLE_IP_SIGNAL: true,
    ENABLE_PHONE_VERIFICATION: true,
    ENABLE_BUSINESS_VERIFICATION: true,
    ENABLE_MANUAL_REVIEW: true,
    ENABLE_PAYMENT_IDENTITY_MATCHING: true,
    SHADOW_MODE: false,
  };

  public static async evaluateTrialEligibility(input: {
    businessName: string;
    website?: string;
    email: string;
    phone: string;
    location?: string;
    country?: string;
    industry?: string;
    ipAddress?: string;
    deviceFingerprint?: string;
  }): Promise<TrialRiskEvaluation> {
    // 1. Resolve Canonical Business Identity
    const resolution = IdentityResolutionService.resolveBusinessIdentity(input);
    const business = resolution.business;
    const existingEntitlement = await TrialEntitlementService.getEntitlementForBusiness(business.id);

    const signals: RiskSignal[] = [];
    let riskScore = 0;

    // RULE 1: Existing Paid Customer attempting new free trial
    if (business.customerStatus === 'PAID') {
      riskScore += 100;
      signals.push({
        code: 'EXISTING_PAID_CUSTOMER',
        category: 'PREVIOUS_TRIAL',
        weight: 100,
        strength: 'VERY_STRONG',
        description: `Business identity ${business.id} is already an active paid customer.`,
      });
    }

    // RULE 2: Previous trial entitlement already consumed or active
    if (existingEntitlement) {
      if (existingEntitlement.status === 'CONVERTED') {
        riskScore += 100;
        signals.push({
          code: 'TRIAL_PREVIOUSLY_CONVERTED',
          category: 'PREVIOUS_TRIAL',
          weight: 100,
          strength: 'VERY_STRONG',
          description: `Business ${business.id} has already converted a trial to paid.`,
        });
      } else if (existingEntitlement.status === 'ACTIVE' || existingEntitlement.status === 'EXPIRED') {
        riskScore += 85;
        signals.push({
          code: 'TRIAL_PREVIOUSLY_USED',
          category: 'PREVIOUS_TRIAL',
          weight: 85,
          strength: 'VERY_STRONG',
          description: `Business ${business.id} already has trial entitlement (${existingEntitlement.status}) with ${existingEntitlement.leadsUsed} leads used.`,
        });
      }
    }

    // RULE 3: Multiple matching identity reasons
    if (resolution.isExisting) {
      signals.push({
        code: 'RESOLVED_EXISTING_BUSINESS',
        category: 'IDENTITY',
        weight: 40,
        strength: resolution.matchStrength,
        description: resolution.matchingReasons.join(', '),
      });
    }

    // RULE 4: Generic disposable email providers check
    const disposableDomains = ['tempmail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'yopmail.com'];
    const emailDomain = input.email.split('@')[1]?.toLowerCase();
    if (emailDomain && disposableDomains.includes(emailDomain)) {
      riskScore += 35;
      signals.push({
        code: 'DISPOSABLE_EMAIL_DOMAIN',
        category: 'BEHAVIOR',
        weight: 35,
        strength: 'STRONG',
        description: `Signup used temporary/disposable email provider: ${emailDomain}`,
      });
    }

    // Clamp risk score to 0 - 100
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Decision Logic
    let decision: EligibilityDecision = 'APPROVE';
    let userFacingMessage = 'Your RevenueRecover AI 1-Click Trial with 150–200 leads is ready!';
    let requiresVerification = false;
    let requiresReview = false;

    if (riskScore >= 80) {
      decision = 'BLOCK_PREVIOUS_TRIAL';
      userFacingMessage =
        'Our records show that this business identity has already activated its introductory trial. You can log in to your existing account or continue with the Growth plan.';
    } else if (riskScore >= 60) {
      decision = 'REVIEW';
      userFacingMessage =
        'We are reviewing your business details for 1-click lead ingestion. Your account will be activated within 10 minutes.';
      requiresReview = true;
    } else if (riskScore >= 30) {
      decision = 'VERIFY';
      userFacingMessage =
        'We need to quickly verify your dispatch phone or business website before unlocking your 150–200 lead trial quota.';
      requiresVerification = true;
    } else {
      decision = 'APPROVE';
      userFacingMessage =
        'Welcome! Your 1-Click Trial is approved. 150–200 verified local leads are ready for ingestion.';
    }

    // Shadow mode override for safety
    if (this.featureFlags.SHADOW_MODE && decision === 'BLOCK_PREVIOUS_TRIAL') {
      decision = 'APPROVE';
    }

    return {
      businessId: business.id,
      riskScore,
      decision,
      identityConfidence: resolution.confidence,
      signals,
      userFacingMessage,
      requiresVerification,
      requiresReview,
      timestamp: new Date().toISOString(),
    };
  }
}
