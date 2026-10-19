import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { DailyGrowthOperationsScheduler, type GrowthLead } from '@/lib/growth-engine';

export const runtime = 'nodejs';

function isAuthorized(req: Request, secret: string): boolean {
  const supplied = req.headers.get('authorization') || '';
  const expected = `Bearer ${secret}`;
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  // HMAC both values first so timingSafeEqual can be used with fixed-length buffers.
  const actualDigest = createHmac('sha256', secret).update(suppliedBuffer).digest();
  const expectedDigest = createHmac('sha256', secret).update(expectedBuffer).digest();
  return timingSafeEqual(actualDigest, expectedDigest);
}

function authorizeCron(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ success: false, error: 'Cron endpoint is not configured.' }, { status: 503 });
  }
  if (!isAuthorized(req, secret)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function POST(req: Request) {
  const denied = authorizeCron(req);
  if (denied) return denied;

  try {
    const body = await req.json().catch(() => ({}));
    const existingLeads = Array.isArray(body?.leads) ? body.leads as GrowthLead[] : [];
    const result = await DailyGrowthOperationsScheduler.executeDailyGrowthCycle(existingLeads);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      report: result.report,
      updatedLeads: result.updatedLeads,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Daily growth cycle execution failed.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const denied = authorizeCron(req);
  if (denied) return denied;
  const latest = DailyGrowthOperationsScheduler.getLatestReport();
  return NextResponse.json({
    success: true,
    latestReport: latest || {
      date: new Date().toISOString().split('T')[0],
      status: 'Awaiting first scheduled cycle execution',
    },
  });
}
