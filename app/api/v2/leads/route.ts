import { NextResponse } from 'next/server';
import { findQualifiedLeads } from '@/lib/v2/agents/lead-engine';
import type { LeadInput } from '@/lib/v2/types';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<LeadInput>;
    if (!body.city || !body.state) {
      return NextResponse.json({ success: false, error: 'city and state are required' }, { status: 400 });
    }
    const leads = await findQualifiedLeads({
      city: body.city,
      state: body.state,
      industry: body.industry === 'plumbing' ? 'plumbing' : 'hvac',
      limit: Math.min(Math.max(Number(body.limit ?? 10), 1), 20),
    });
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lead engine failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
