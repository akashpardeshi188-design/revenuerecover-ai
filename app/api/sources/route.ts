import { NextRequest, NextResponse } from 'next/server';
import { getSourceRegistry } from '@/lib/discovery/registry';
import { AISourceOptimizer } from '@/lib/discovery/source-optimizer';

export async function GET() {
  const sources = getSourceRegistry();
  const optimizationMetrics = AISourceOptimizer.evaluateSources();

  return NextResponse.json({
    success: true,
    totalSources: sources.length,
    sources,
    optimizationMetrics,
  });
}
