import { NextResponse } from 'next/server';
import { getDemoEvent, DEMO_EVENTS } from '@/lib/v2/agents/sales-demo';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const step = Number(url.searchParams.get('step') ?? '0');
  const event = getDemoEvent(Number.isFinite(step) ? step : 0);
  return NextResponse.json({ success: true, totalSteps: DEMO_EVENTS.length, event });
}
