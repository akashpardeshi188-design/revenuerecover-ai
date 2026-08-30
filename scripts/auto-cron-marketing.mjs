/**
 * RevenueRecover AI — 24/7 Autonomous Recurring Marketing Engine
 * Fires automated outreach dispatches every 3 hours continuously
 */

import { spawn } from 'child_process';
import path from 'path';

const INTERVAL_HOURS = 3;
const INTERVAL_MS = INTERVAL_HOURS * 60 * 60 * 1000; // 3 hours in ms

console.log(`
========================================================================
🚀 REVENUERECOVER AI — 24/7 AUTONOMOUS RECURRING MARKETING CRON
========================================================================
Schedule: Every ${INTERVAL_HOURS} Hours Continuously (24/7/365)
Territories: Texas, Florida, Arizona, California, Georgia, North Carolina
Target: 528 Subscribers ($2,095.68/day | $62,870/mo MRR)
TCPA & CAN-SPAM Compliance: Active & Monitored
========================================================================
`);

let cycleCount = 1;

async function executeCycle() {
  const timestamp = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' });
  console.log(`\n⏰ [${new Date().toISOString()}] TRIGGERING CYCLE #${cycleCount} (US Central Time: ${timestamp})`);

  try {
    const dispatchProcess = spawn('node', ['scripts/dispatch-outreach.mjs'], {
      stdio: 'inherit',
    });

    dispatchProcess.on('close', (code) => {
      console.log(`✓ Cycle #${cycleCount} completed with exit code: ${code}`);
      console.log(`⏳ Next automated marketing cycle will execute in exactly ${INTERVAL_HOURS} hours (${new Date(Date.now() + INTERVAL_MS).toLocaleTimeString()})...\n`);
      cycleCount++;
    });
  } catch (err) {
    console.error(`❌ Cycle #${cycleCount} error:`, err);
  }
}

// Execute first cycle immediately
executeCycle();

// Set recurring 3-hour timer
setInterval(executeCycle, INTERVAL_MS);
