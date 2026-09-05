import { NextRequest, NextResponse } from 'next/server';
import { GlobalBusinessDiscoveryEngine } from '@/lib/discovery/discovery-engine';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = (searchParams.get('country') as any) || 'USA';
  const city = searchParams.get('city') || 'Dallas';
  const category = (searchParams.get('category') as any) || 'HVAC';

  const discovery = await GlobalBusinessDiscoveryEngine.runDiscoveryJob({
    country,
    city,
    category,
    radiusMiles: 25,
    limitPerSource: 5,
  });

  return NextResponse.json({
    success: true,
    total: discovery.businesses.length,
    businesses: discovery.businesses,
  });
}
