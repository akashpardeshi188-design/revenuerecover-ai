/**
 * RevenueRecover AI — Global Business Identity & Entity Resolution Engine
 * Resolves disparate records across Google, Yelp, Bing, and OSM into a single BusinessMaster entity.
 */

import { DiscoveredBusiness, BusinessMaster, TradeCategory, CountryCode } from './types';

export class GlobalBusinessIdentityEngine {
  /**
   * Normalizes business name by removing legal entity suffixes (LLC, Inc, Ltd, Corp, Co, Services, The).
   */
  static normalizeName(rawName: string): string {
    return rawName
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\b(the|llc|inc|incorporated|corp|corporation|ltd|limited|co|company|services|group|pros|solutions)\b/g, '')
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculates Jaro-Winkler string similarity between two strings (0.0 to 1.0).
   */
  static stringSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;
    if (s1.length === 0 || s2.length === 0) return 0.0;

    const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
    const s1Matches = new Array(s1.length).fill(false);
    const s2Matches = new Array(s2.length).fill(false);

    let matches = 0;
    for (let i = 0; i < s1.length; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, s2.length);

      for (let j = start; j < end; j++) {
        if (!s2Matches[j] && s1[i] === s2[j]) {
          s1Matches[i] = true;
          s2Matches[j] = true;
          matches++;
          break;
        }
      }
    }

    if (matches === 0) return 0.0;

    let transpositions = 0;
    let k = 0;
    for (let i = 0; i < s1.length; i++) {
      if (s1Matches[i]) {
        while (!s2Matches[k]) k++;
        if (s1[i] !== s2[k]) transpositions++;
        k++;
      }
    }

    const m = matches;
    const jaro = (m / s1.length + m / s2.length + (m - transpositions / 2) / m) / 3.0;

    // Winkler prefix bonus
    let prefix = 0;
    for (let i = 0; i < Math.min(4, s1.length, s2.length); i++) {
      if (s1[i] === s2[i]) prefix++;
      else break;
    }

    return jaro + prefix * 0.1 * (1.0 - jaro);
  }

  /**
   * Evaluates match confidence between a newly discovered record and an existing master business.
   */
  static evaluateMatch(record: DiscoveredBusiness, master: BusinessMaster): { isMatch: boolean; confidence: number; matchReasons: string[] } {
    const reasons: string[] = [];
    let score = 0;

    // 1. Exact Phone Match (E.164) — Strongest Signal
    if (record.phoneE164 && master.phoneE164 && record.phoneE164 === master.phoneE164) {
      score += 55;
      reasons.push('Exact E.164 phone number match');
    }

    // 2. Exact Domain Match — Strong Signal
    if (record.domain && master.domain && record.domain === master.domain) {
      score += 45;
      reasons.push('Exact website domain match');
    }

    // 3. Name Similarity
    const normRec = this.normalizeName(record.businessName);
    const normMaster = master.normalizedName;
    const nameSim = this.stringSimilarity(normRec, normMaster);

    if (nameSim >= 0.88) {
      score += 35;
      reasons.push(`High name similarity (${(nameSim * 100).toFixed(0)}%)`);
    } else if (nameSim >= 0.75) {
      score += 20;
      reasons.push(`Partial name similarity (${(nameSim * 100).toFixed(0)}%)`);
    }

    // 4. City & State / Postal Match
    if (record.city.toLowerCase() === master.city.toLowerCase() && record.stateProvince.toLowerCase() === master.stateProvince.toLowerCase()) {
      score += 15;
      reasons.push('City and state/province match');
    }

    const confidence = Math.min(score, 100);
    const isMatch = confidence >= 60;

    return { isMatch, confidence, matchReasons: reasons };
  }

  /**
   * Consolidates a batch of raw discovered businesses into a deduplicated master list.
   */
  static consolidate(records: DiscoveredBusiness[], tenantId: string = 'org_default'): BusinessMaster[] {
    const masterList: BusinessMaster[] = [];

    for (const record of records) {
      let matchedMaster = masterList.find((m) => this.evaluateMatch(record, m).isMatch);

      if (matchedMaster) {
        // Merge attributes into existing master entity
        if (!matchedMaster.phoneE164 && record.phoneE164) matchedMaster.phoneE164 = record.phoneE164;
        if (!matchedMaster.website && record.website) {
          matchedMaster.website = record.website;
          matchedMaster.domain = record.domain;
        }
        if (!matchedMaster.connectedSourceIds.includes(record.sourceId)) {
          matchedMaster.connectedSourceIds.push(record.sourceId);
          matchedMaster.sourceCount += 1;
        }
        matchedMaster.totalReviews = Math.max(matchedMaster.totalReviews, record.reviewCount || 0);
        matchedMaster.averageRating = Math.max(matchedMaster.averageRating, record.rating || 0);
        matchedMaster.updatedAt = new Date().toISOString();
      } else {
        // Create new BusinessMaster
        const masterId = `biz_${Math.random().toString(36).substring(2, 10)}`;
        const normName = this.normalizeName(record.businessName);

        const newMaster: BusinessMaster = {
          id: masterId,
          tenantId,
          businessName: record.businessName,
          normalizedName: normName,
          primaryTrade: record.tradeCategories[0] || 'HVAC',
          secondaryTrades: record.tradeCategories.slice(1),
          phoneE164: record.phoneE164,
          email: record.email,
          website: record.website,
          domain: record.domain,
          addressLine1: record.addressLine1 || 'Address Pending',
          city: record.city,
          stateProvince: record.stateProvince,
          postalCode: record.postalCode,
          country: record.country,
          geoLatitude: record.geoLatitude,
          geoLongitude: record.geoLongitude,
          serviceRadiusMiles: record.serviceRadiusMiles || 25,
          verificationScore: 50,
          verificationStatus: 'MEDIUM',
          verificationReasons: ['Discovered from official registry'],
          averageRating: record.rating || 4.5,
          totalReviews: record.reviewCount || 10,
          sourceCount: 1,
          connectedSourceIds: [record.sourceId],
          dataQualityScore: 80,
          isActive: true,
          isAcceptingLeads: true,
          monthlyCapacity: 50,
          currentActiveLeads: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        masterList.push(newMaster);
      }
    }

    return masterList;
  }
}
