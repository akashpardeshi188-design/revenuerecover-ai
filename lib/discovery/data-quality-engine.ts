/**
 * RevenueRecover AI — Data Quality Engine
 * Validates, cleanses, and assigns Data Quality Scores (0-100) to business and lead records.
 */

import { DiscoveredBusiness, Lead } from './types';

export class DataQualityEngine {
  /**
   * Scores and validates a DiscoveredBusiness record.
   */
  static assessBusinessQuality(biz: DiscoveredBusiness): { score: number; passed: boolean; issues: string[] } {
    let score = 0;
    const issues: string[] = [];

    // Business Name
    if (biz.businessName && biz.businessName.length >= 3) {
      score += 20;
    } else {
      issues.push('Invalid or missing business name');
    }

    // Phone
    if (biz.phoneE164 && biz.phoneE164.length >= 10) {
      score += 25;
    } else {
      issues.push('Missing or invalid E.164 phone number');
    }

    // Address
    if (biz.city && biz.country) {
      score += 20;
      if (biz.postalCode) score += 5;
    } else {
      issues.push('Missing city or country location');
    }

    // Web / Domain
    if (biz.domain && biz.domain.includes('.')) {
      score += 20;
    } else {
      issues.push('Missing website domain');
    }

    // Category / Services
    if (biz.tradeCategories && biz.tradeCategories.length > 0) {
      score += 10;
    } else {
      issues.push('Missing trade category classification');
    }

    const finalScore = Math.min(score, 100);
    return {
      score: finalScore,
      passed: finalScore >= 60,
      issues,
    };
  }

  /**
   * Scores and validates a Lead record.
   */
  static assessLeadQuality(lead: Lead): { score: number; passed: boolean; issues: string[] } {
    let score = 0;
    const issues: string[] = [];

    if (lead.customerPhoneE164 || lead.customerEmail) {
      score += 40;
    } else {
      issues.push('No direct contact channel (phone or email) provided');
    }

    if (lead.serviceRequested && lead.serviceRequested.length >= 3) {
      score += 30;
    } else {
      issues.push('Missing service request description');
    }

    if (lead.city && lead.country) {
      score += 30;
    } else {
      issues.push('Missing location information');
    }

    const finalScore = Math.min(score, 100);
    return {
      score: finalScore,
      passed: finalScore >= 70,
      issues,
    };
  }
}
