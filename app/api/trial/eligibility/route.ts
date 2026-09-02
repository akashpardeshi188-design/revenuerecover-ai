import { NextRequest, NextResponse } from 'next/server';
import { RiskScoringEngine } from '@/lib/anti-abuse/risk-scoring';
import { TrialEntitlementService } from '@/lib/anti-abuse/trial-entitlement';
import { ReviewQueueService } from '@/lib/anti-abuse/review-queue';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, website, email, phone, location, country, industry } = body;

    if (!businessName || !email) {
      return NextResponse.json(
        { error: 'Business name and email are required for trial verification.' },
        { status: 400 }
      );
    }

    // 1. Evaluate Trial Eligibility & Risk Scoring
    const evaluation = await RiskScoringEngine.evaluateTrialEligibility({
      businessName,
      website,
      email,
      phone: phone || '',
      location,
      country,
      industry,
    });

    // 2. Handle Decision Cases
    if (evaluation.decision === 'APPROVE') {
      // Automatically issue trial entitlement with 150-200 lead quota
      const { entitlement } = await TrialEntitlementService.createTrialEntitlement({
        businessId: evaluation.businessId,
        leadQuota: 200,
        source: 'web_signup',
      });

      ReviewQueueService.logAudit({
        action: 'TRIAL_APPROVED',
        businessId: evaluation.businessId,
        decision: 'APPROVE',
        riskScore: evaluation.riskScore,
        details: { email, leadQuota: entitlement.leadQuota },
      });

      return NextResponse.json({
        eligible: true,
        decision: evaluation.decision,
        businessId: evaluation.businessId,
        leadQuota: entitlement.leadQuota,
        leadsRemaining: entitlement.leadsRemaining,
        message: evaluation.userFacingMessage,
      });
    }

    if (evaluation.decision === 'REVIEW') {
      ReviewQueueService.addToQueue({
        businessId: evaluation.businessId,
        businessName,
        userEmail: email,
        userPhone: phone || '',
        riskScore: evaluation.riskScore,
        identityConfidence: evaluation.identityConfidence,
        reason: 'Flagged for automated risk review before trial lead quota activation.',
        signals: evaluation.signals,
      });

      return NextResponse.json({
        eligible: false,
        requiresReview: true,
        decision: evaluation.decision,
        businessId: evaluation.businessId,
        message: evaluation.userFacingMessage,
      });
    }

    if (evaluation.decision === 'VERIFY') {
      return NextResponse.json({
        eligible: false,
        requiresVerification: true,
        decision: evaluation.decision,
        businessId: evaluation.businessId,
        message: evaluation.userFacingMessage,
      });
    }

    // Blocked Case (Already consumed trial or paid customer)
    ReviewQueueService.logAudit({
      action: 'TRIAL_BLOCKED',
      businessId: evaluation.businessId,
      decision: 'BLOCK_PREVIOUS_TRIAL',
      riskScore: evaluation.riskScore,
      details: { email, signals: evaluation.signals },
    });

    return NextResponse.json({
      eligible: false,
      blocked: true,
      decision: evaluation.decision,
      businessId: evaluation.businessId,
      message: evaluation.userFacingMessage,
    });
  } catch (error: any) {
    console.error('Error in trial eligibility endpoint:', error);
    return NextResponse.json({ error: error.message || 'Trial evaluation failed.' }, { status: 500 });
  }
}
