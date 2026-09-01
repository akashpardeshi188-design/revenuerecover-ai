/**
 * RevenueRecover AI — 24/7 Ultra-High-Velocity Autonomous Recurring Marketing Engine
 * Fires automated global outreach dispatches every 1.5 Hours (90 Minutes) continuously
 * Target: 2,000 Global Subscribers ($238,000/mo MRR | ₹2 Crore/mo | $7,933/day)
 */

import { spawn } from 'child_process';
import path from 'path';

const INTERVAL_HOURS = 1.5; // 1 Hour 30 Minutes (90 Minutes)
const INTERVAL_MINUTES = 90;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000; // 90 mins in ms (5,400,000 ms)

console.log(`
========================================================================
🚀 REVENUERECOVER AI — 24/7 ULTRA-VELOCITY GLOBAL MARKETING RUNNER
========================================================================
Schedule: Every ${INTERVAL_HOURS} Hours (Every 90 Minutes / 1 तास 30 मिनिटे 24/7/365)
Global Markets: 🇺🇸 USA, 🇬🇧 UK, 🇨🇦 Canada, 🇦🇺 Australia, 🇦🇪 UAE, 🇪🇺 Europe, 🇮🇳 India
Target: 2,000 Global Subscribers ($238,000/mo MRR | ₹2 Crore/mo | $7,933/day)
Compliance: TCPA, CAN-SPAM, GDPR, CASL, SPAM ACT Fully Active
========================================================================
`);

let cycleCount = 1;

async function executeCycle() {
  const timestampUS = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' });
  const timestampUK = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London' });
  const timestampIST = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

  console.log(`\n⏰ [${new Date().toISOString()}] TRIGGERING ULTRA-VELOCITY CYCLE #${cycleCount}`);
  console.log(`    → Global Time Snapshot: US Central: ${timestampUS} | London: ${timestampUK} | India: ${timestampIST}`);

  try {
    const dispatchProcess = spawn('node', ['scripts/dispatch-outreach.mjs'], {
      stdio: 'inherit',
    });

    dispatchProcess.on('close', (code) => {
      console.log(`✓ Global Cycle #${cycleCount} completed with exit code: ${code}`);
      console.log(`⏳ Next automated 1.5-hour marketing cycle will execute in exactly 90 minutes (${new Date(Date.now() + INTERVAL_MS).toLocaleTimeString()})...\n`);
      cycleCount++;
    });
  } catch (err) {
    console.error(`❌ Global Cycle #${cycleCount} error:`, err);
  }
}

// Execute first cycle immediately
executeCycle();

// Set recurring 1.5-hour (90-minute) timer
setInterval(executeCycle, INTERVAL_MS);
