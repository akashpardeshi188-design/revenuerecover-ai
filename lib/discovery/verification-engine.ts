/**
 * RevenueRecover AI — Business Verification Engine
 * Multi-factor verification scoring (0-100) and qualification status.
 */

import { BusinessMaster, VerificationCheckResult, VerificationStatus } from './types';

export class BusinessVerificationEngine {
  /**
   * Evaluates complete multi-factor verification on a BusinessMaster record.
   */
  static evaluate(business: BusinessMaster): VerificationCheckResult {
    let score = 0;
    const checksPassed: string[] = [];
    const checksFailed: string[] = [];
    const reasons: string[] = [];

    // 1. Phone Deliverability Check (Weight: 25 pts)
    const isDeliverablePhone = Boolean(business.phoneE164 && business.phoneE164.length >= 10);
    if (isDeliverablePhone) {
      score += 25;
      checksPassed.push('PHONE_E164_FORMAT_VALID');
      reasons.push('Valid international E.164 phone number configured');
    } else {
      checksFailed.push('PHONE_MISSING_OR_INVALID');
      reasons.push('Phone number is missing or not formatted to standard E.164');
    }

    // 2. Active Website / Domain Check (Weight: 20 pts)
    const isLiveWebsite = Boolean((business.website || business.domain) && (business.domain ? business.domain.includes('.') : true));
    if (isLiveWebsite) {
      score += 20;
      checksPassed.push('WEBSITE_DOMAIN_VALID');
      reasons.push(`Verified digital presence on ${business.domain || business.website}`);
    } else {
      checksFailed.push('WEBSITE_MISSING');
      reasons.push('Website URL or domain not found');
    }

    // 3. Complete Physical Address Check (Weight: 20 pts)
    const isCompleteAddress = Boolean(
      business.addressLine1 &&
      business.addressLine1.length > 5 &&
      business.city &&
      business.stateProvince &&
      business.postalCode
    );
    if (isCompleteAddress) {
      score += 20;
      checksPassed.push('ADDRESS_COMPLETE');
      reasons.push('Complete physical street address, city, state, and postal code verified');
    } else {
      checksFailed.push('ADDRESS_INCOMPLETE');
      reasons.push('Address is missing street line, city, or postal code');
    }

    // 4. Multi-Source Corroboration (Weight: Up to 25 pts)
    const sourceCount = business.connectedSourceIds?.length || 1;
    if (sourceCount >= 3) {
      score += 25;
      checksPassed.push('MULTI_SOURCE_TRIPLE_CORROBORATION');
      reasons.push(`Cross-verified across ${sourceCount} independent source directories`);
    } else if (sourceCount === 2) {
      score += 15;
      checksPassed.push('MULTI_SOURCE_DUAL_CORROBORATION');
      reasons.push('Cross-verified across 2 independent directories');
    } else {
      score += 5;
      checksPassed.push('SINGLE_SOURCE_FOUND');
      reasons.push('Verified on 1 primary directory');
    }

    // 5. Customer Review Confidence (Weight: 10 pts)
    if (business.totalReviews >= 10 && business.averageRating >= 4.0) {
      score += 10;
      checksPassed.push('REPUTATION_HIGH_VOLUME');
      reasons.push(`Strong public reputation (${business.averageRating}★ with ${business.totalReviews}+ reviews)`);
    } else if (business.totalReviews > 0) {
      score += 5;
      checksPassed.push('REPUTATION_PRESENT');
    }

    const finalScore = Math.min(Math.max(score, 0), 100);

    let status: VerificationStatus = 'UNVERIFIED';
    if (finalScore >= 80) status = 'VERIFIED';
    else if (finalScore >= 65) status = 'HIGH';
    else if (finalScore >= 45) status = 'MEDIUM';
    else if (finalScore >= 25) status = 'LOW';

    return {
      score: finalScore,
      status,
      checksPassed,
      checksFailed,
      reasons,
      isDeliverablePhone,
      isLiveWebsite,
      isCompleteAddress,
      sourceCorroborationCount: sourceCount,
    };
  }
}
