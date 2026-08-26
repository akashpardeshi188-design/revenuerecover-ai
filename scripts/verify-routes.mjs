const routes = [
  '/',
  '/free-revenue-scan',
  '/demo',
  '/pricing',
  '/how-it-works',
  '/industries',
  '/industries/hvac',
  '/industries/plumbing',
  '/industries/electrical',
  '/industries/roofing',
  '/integrations',
  '/security',
  '/faq',
  '/blog',
  '/login',
  '/onboarding',
  '/dashboard',
  '/dashboard/opportunities',
  '/dashboard/inbox',
  '/dashboard/customers',
  '/dashboard/campaigns',
  '/dashboard/integrations',
  '/dashboard/success-agent',
  '/dashboard/settings',
  '/growth',
  '/growth/lead-gen',
  '/growth/pipeline',
  '/growth/outreach',
  '/growth/sales-agent',
  '/growth/analyst',
  '/growth/referrals',
  '/growth/security-audit',
];

async function run() {
  console.log('--- STARTING LIVE ECOSYSTEM HEALTH CHECK ---');
  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      if (res.status === 200) {
        console.log(`[PASS] ${route.padEnd(30)} HTTP ${res.status}`);
        passed++;
      } else {
        console.error(`[FAIL] ${route.padEnd(30)} HTTP ${res.status}`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERROR] ${route.padEnd(30)} ${e.message}`);
      failed++;
    }
  }

  // Check API routes
  console.log('\n--- TESTING CORE API ENDPOINTS ---');
  try {
    const scanRes = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName: 'Dallas Air', monthlyLeads: 100, avgJobValue: 1600, industry: 'HVAC' }),
    });
    const scanData = await scanRes.json();
    if (scanData.success && scanData.total_estimated_leakage > 0) {
      console.log(`[PASS] /api/scan                      HTTP 200 (Total Leakage: $${scanData.total_estimated_leakage.toLocaleString()})`);
      passed++;
    } else {
      console.error('[FAIL] /api/scan failed response', scanData);
      failed++;
    }
  } catch (e) {
    console.error('[ERROR] /api/scan', e.message);
    failed++;
  }

  try {
    const salesRes = await fetch('http://localhost:3000/api/agents/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'What is the price of the Growth Plan?' }),
    });
    const salesData = await salesRes.json();
    if (salesData.success && salesData.answer) {
      console.log(`[PASS] /api/agents/sales              HTTP 200 (AI Confidence: ${salesData.confidence}%)`);
      passed++;
    } else {
      console.error('[FAIL] /api/agents/sales failed response', salesData);
      failed++;
    }
  } catch (e) {
    console.error('[ERROR] /api/agents/sales', e.message);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`TOTAL PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

run();
