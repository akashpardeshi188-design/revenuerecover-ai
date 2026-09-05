/**
 * RevenueRecover AI — Autonomous Global Discovery Ingestor Daemon
 * Periodically searches target cities across USA, UK, and Canada,
 * normalizes trade entities, resolves deduplications, and updates the discovery registry.
 */

import { GlobalBusinessDiscoveryEngine } from '../lib/discovery/discovery-engine.js';
import { LeadCaptureEngine } from '../lib/discovery/lead-engine.js';
import { ContractorMatchingEngine } from '../lib/discovery/contractor-matcher.js';
import { MissedCallRecoveryEngine } from '../lib/discovery/missed-call-recovery.js';

const TARGET_MARKETS = [
  { country: 'USA', stateProvince: 'TX', city: 'Dallas', category: 'HVAC', radiusMiles: 25 },
  { country: 'USA', stateProvince: 'FL', city: 'Miami', category: 'PLUMBING', radiusMiles: 25 },
  { country: 'GBR', stateProvince: 'Greater London', city: 'London', category: 'PLUMBING', radiusMiles: 20 },
  { country: 'CAN', stateProvince: 'ON', city: 'Toronto', category: 'ELECTRICAL', radiusMiles: 30 },
  { country: 'USA', stateProvince: 'CA', city: 'Los Angeles', category: 'HVAC', radiusMiles: 25 },
];

console.log(`
========================================================================
🌍 REVENUERECOVER AI — AUTONOMOUS DISCOVERY & LEAD ENGINE DAEMON
========================================================================
Target Markets: USA, UK, Canada
Categories: HVAC, Plumbing, Electrical
Engine: Multi-Source Adapters • Entity Resolution • AI Intent Scoring
========================================================================
`);

let cycleCount = 1;

async function runAutonomousCycle() {
  const target = TARGET_MARKETS[(cycleCount - 1) % TARGET_MARKETS.length];
  console.log(`\n⏰ [${new Date().toISOString()}] CYCLE #${cycleCount} — EXECUTING DISCOVERY FOR: ${target.city}, ${target.country} (${target.category})`);

  try {
    // 1. Run Global Discovery Job
    const { report, businesses } = await GlobalBusinessDiscoveryEngine.runDiscoveryJob({
      country: target.country,
      stateProvince: target.stateProvince,
      city: target.city,
      radiusMiles: target.radiusMiles,
      category: target.category,
      limitPerSource: 5,
    });

    console.log(`  ✓ Raw Discovered: ${report.totalRawDiscovered}`);
    console.log(`  ✓ Unique Master Entities: ${report.totalUniqueEntities}`);
    console.log(`  ✓ Duplicates Consolidated: ${report.duplicatesConsolidated}`);
    console.log(`  ✓ High-Trust Verified: ${report.verifiedCount}`);
    console.log(`  ✓ Estimated API Cost: $${report.estimatedCostUSD} USD`);

    // 2. Ingest Sample Real-Time Inbound Missed Call Lead
    if (businesses.length > 0) {
      const contractor = businesses[0];
      console.log(`\n  📞 Simulating Inbound Missed Call for: ${contractor.businessName}...`);

      const leadResult = await LeadCaptureEngine.ingestLead({
        tenantId: contractor.tenantId,
        sourceType: 'SEARCH_MAPS',
        sourceChannel: 'MISSED_PHONE_CALL',
        customerName: 'Verified Inbound Homeowner',
        customerPhone: '+12145550999',
        customerEmail: 'homeowner@gmail.com',
        serviceCategory: target.category,
        serviceRequested: `Emergency ${target.category} repair service needed in ${target.city}`,
        city: target.city,
        stateProvince: target.stateProvince,
        postalCode: '75001',
        country: target.country,
        urgency: 'HIGH',
      });

      console.log(`  ✓ Lead Ingested: ${leadResult.lead.id} | Score: ${leadResult.lead.leadScore}/100 (${leadResult.lead.leadClassification})`);
      console.log(`  ✓ Master Opportunity ID: ${leadResult.lead.masterOpportunityId}`);

      // 3. Trigger 45-Second Missed Call Recovery
      const recoveryResult = await MissedCallRecoveryEngine.processMissedCall({
        tenantId: contractor.tenantId,
        contractorId: contractor.id,
        contractorName: contractor.businessName,
        tradeCategory: target.category,
        callerPhoneE164: '+12145550999',
        callerCity: target.city,
        country: target.country,
        callDurationSeconds: 14,
        timestamp: new Date().toISOString(),
      });

      console.log(`  ✓ Recovery Status: ${recoveryResult.status}`);
      console.log(`  ✓ Compliant Text Message: "${recoveryResult.responseMessageText.substring(0, 80)}..."`);
    }

    cycleCount++;
  } catch (err) {
    console.error('Cycle Error:', err.message);
  }
}

// Run immediately, then schedule every 15 minutes
runAutonomousCycle();
setInterval(runAutonomousCycle, 15 * 60 * 1000);
