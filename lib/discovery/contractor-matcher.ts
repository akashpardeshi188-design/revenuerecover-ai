/**
 * RevenueRecover AI — AI Contractor Matching Engine
 * Matches incoming customer leads to the highest-ranking verified local contractor.
 */

import { Lead, BusinessMaster, ContractorMatchResult } from './types';

export class ContractorMatchingEngine {
  /**
   * Matches a Lead to a list of candidate BusinessMasters and returns ranked matches.
   */
  static matchLeadToContractors(lead: Lead, contractors: BusinessMaster[]): ContractorMatchResult[] {
    const results: ContractorMatchResult[] = [];

    for (const contractor of contractors) {
      if (!contractor.isActive || !contractor.isAcceptingLeads) continue;

      let matchScore = 0;
      const reasons: string[] = [];

      // 1. Trade Category Match (Critical)
      const categoryMatch =
        contractor.primaryTrade === lead.serviceCategory ||
        contractor.secondaryTrades.includes(lead.serviceCategory);

      if (!categoryMatch) continue; // Skip incompatible trades
      matchScore += 40;
      reasons.push(`Direct trade specialty match: ${lead.serviceCategory}`);

      // 2. Location & Geographic Proximity
      let distanceMiles = 10;
      if (contractor.city.toLowerCase() === lead.city.toLowerCase()) {
        matchScore += 30;
        distanceMiles = 5;
        reasons.push(`Direct city coverage in ${lead.city}`);
      } else if (contractor.stateProvince.toLowerCase() === lead.stateProvince.toLowerCase()) {
        matchScore += 15;
        distanceMiles = 22;
        reasons.push(`Regional state coverage in ${lead.stateProvince}`);
      }

      // 3. Verification Score Multiplier
      if (contractor.verificationScore >= 80) {
        matchScore += 20;
        reasons.push('High-trust verified contractor badge (Score: 80+)');
      } else if (contractor.verificationScore >= 50) {
        matchScore += 10;
      }

      // 4. Capacity Availability
      const capacityAvailable = contractor.currentActiveLeads < contractor.monthlyCapacity;
      if (capacityAvailable) {
        matchScore += 10;
        reasons.push('Immediate technician dispatch capacity available');
      }

      results.push({
        leadId: lead.id,
        contractor,
        matchScore: Math.min(matchScore, 100),
        distanceMiles,
        categoryMatch,
        capacityAvailable,
        reasons,
      });
    }

    // Sort descending by match score
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }
}
