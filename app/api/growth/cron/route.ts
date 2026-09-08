import { NextResponse } from 'next/server';
import { DailyGrowthOperationsScheduler, GrowthLead } from '@/lib/growth-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const existingLeads: GrowthLead[] = body.leads || [];

    const result = await DailyGrowthOperationsScheduler.executeDailyGrowthCycle(existingLeads);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      report: result.report,
      updatedLeads: result.updatedLeads
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Daily growth cycle execution failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const latest = DailyGrowthOperationsScheduler.getLatestReport();
  return NextResponse.json({
    success: true,
    latestReport: latest || {
      date: new Date().toISOString().split('T')[0],
      status: 'Awaiting first scheduled cycle execution'
    }
  });
}
