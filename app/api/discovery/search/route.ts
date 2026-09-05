import { NextRequest, NextResponse } from 'next/server';
import { GlobalBusinessDiscoveryEngine } from '@/lib/discovery/discovery-engine';
import { CountryCode, TradeCategory } from '@/lib/discovery/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const country: CountryCode = body.country || 'USA';
    const city: string = body.city || 'Dallas';
    const stateProvince: string = body.stateProvince || (country === 'USA' ? 'TX' : country === 'GBR' ? 'London' : 'ON');
    const category: TradeCategory = body.category || 'HVAC';
    const radiusMiles: number = Number(body.radiusMiles) || 25;
    const limitPerSource: number = Number(body.limitPerSource) || 10;
    const sourceIds: string[] | undefined = body.sourceIds;

    const result = await GlobalBusinessDiscoveryEngine.runDiscoveryJob({
      country,
      stateProvince,
      city,
      postalCode: body.postalCode,
      radiusMiles,
      category,
      sourceIds,
      limitPerSource,
    });

    return NextResponse.json({
      success: true,
      report: result.report,
      businesses: result.businesses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Discovery search failed' },
      { status: 500 }
    );
  }
}
