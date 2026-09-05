/**
 * RevenueRecover AI — Global Business Discovery Engine
 * Multi-source querying, consolidation, verification, and discovery job execution.
 */

import { DiscoveryJobParams, DiscoveryJobReport, BusinessMaster, DiscoveredBusiness } from './types';
import { getActiveDiscoverySources, getSourceById } from './registry';
import { getAdapter } from './adapters/adapter-factory';
import { GlobalBusinessIdentityEngine } from './identity-engine';
import { BusinessVerificationEngine } from './verification-engine';

export class GlobalBusinessDiscoveryEngine {
  /**
   * Executes an end-to-end discovery job across all active geographical source adapters.
   */
  static async runDiscoveryJob(params: DiscoveryJobParams): Promise<{
    report: DiscoveryJobReport;
    businesses: BusinessMaster[];
  }> {
    const startedAt = new Date().toISOString();
    const jobId = `disc_job_${Math.random().toString(36).substring(2, 10)}`;
    const errors: string[] = [];
    let totalCostUSD = 0;

    // 1. Select eligible sources
    const eligibleSources = params.sourceIds && params.sourceIds.length > 0
      ? params.sourceIds.map((id) => getSourceById(id)).filter(Boolean)
      : getActiveDiscoverySources(params.country);

    const rawDiscovered: DiscoveredBusiness[] = [];
    const sourcesQueried: string[] = [];

    for (const sourceEntry of eligibleSources) {
      if (!sourceEntry) continue;
      sourcesQueried.push(sourceEntry.sourceName);
      totalCostUSD += sourceEntry.estimatedCostPerCallUSD || 0;

      const adapter = getAdapter(sourceEntry.id);
      if (!adapter) {
        errors.push(`Adapter for ${sourceEntry.sourceName} (${sourceEntry.id}) not implemented`);
        continue;
      }

      try {
        const records = await adapter.discoverBusinesses({
          country: params.country,
          stateProvince: params.stateProvince,
          city: params.city,
          postalCode: params.postalCode,
          radiusMiles: params.radiusMiles,
          category: params.category,
          limit: params.limitPerSource || 10,
        });

        rawDiscovered.push(...records);
      } catch (err: any) {
        errors.push(`Error querying ${sourceEntry.sourceName}: ${err.message}`);
      }
    }

    // 2. Consolidate and Deduplicate into Master Entities
    const consolidatedMasters = GlobalBusinessIdentityEngine.consolidate(rawDiscovered, 'org_default');

    // 3. Run Multi-Factor Verification Engine on each master entity
    let verifiedCount = 0;
    for (const master of consolidatedMasters) {
      const vResult = BusinessVerificationEngine.evaluate(master);
      master.verificationScore = vResult.score;
      master.verificationStatus = vResult.status;
      master.verificationReasons = vResult.reasons;
      if (vResult.status === 'VERIFIED' || vResult.status === 'HIGH') {
        verifiedCount++;
      }
    }

    const completedAt = new Date().toISOString();

    const report: DiscoveryJobReport = {
      jobId,
      startedAt,
      completedAt,
      params,
      sourcesQueried,
      totalRawDiscovered: rawDiscovered.length,
      totalNormalized: rawDiscovered.length,
      totalUniqueEntities: consolidatedMasters.length,
      duplicatesConsolidated: Math.max(0, rawDiscovered.length - consolidatedMasters.length),
      verifiedCount,
      estimatedCostUSD: Number(totalCostUSD.toFixed(4)),
      errors,
    };

    return { report, businesses: consolidatedMasters };
  }
}
