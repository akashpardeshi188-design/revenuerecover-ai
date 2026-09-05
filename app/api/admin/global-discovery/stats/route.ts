import { NextResponse } from 'next/server';
import { getSourceRegistry } from '@/lib/discovery/registry';
import { AISourceOptimizer } from '@/lib/discovery/source-optimizer';
import { CostTracker } from '@/lib/discovery/cost-tracker';
import { LeadDeduplicationEngine } from '@/lib/discovery/lead-deduplication';

export async function GET() {
  const sources = getSourceRegistry();
  const optimization = AISourceOptimizer.evaluateSources();
  const costSummary = CostTracker.getMetricsSummary();
  const opportunities = LeadDeduplicationEngine.getAllOpportunities();

  return NextResponse.json({
    success: true,
    systemStatus: 'OPERATIONAL',
    stats: {
      totalSourcesConfigured: sources.length,
      activeConnectedSources: sources.filter((s) => s.integrationStatus === 'CONNECTED').length,
      awaitingCredentialsSources: sources.filter((s) => s.integrationStatus === 'AWAITING_CREDENTIALS').length,
      unsupportedSources: sources.filter((s) => s.integrationStatus === 'NOT_SUPPORTED').length,
      totalOpportunities: opportunities.length,
      hotOpportunities: opportunities.filter((o) => o.classification === 'HOT').length,
      totalPipelineValueUSD: opportunities.reduce((sum, o) => sum + o.estimatedPipelineValueUSD, 0),
      costSummary,
      sourceOptimization: optimization,
    },
  });
}
