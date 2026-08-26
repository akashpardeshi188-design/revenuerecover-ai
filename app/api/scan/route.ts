import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const leads = Number(body.monthlyLeads) || 80;
    const val = Number(body.avgJobValue) || 1200;

    const missed_leads = Math.round(leads * 0.18 * val);
    const abandoned_quotes = Math.round(leads * 0.12 * val);
    const dormant_customers = Math.round(leads * 0.08 * (val * 0.6));
    const failed_payments = Math.round(leads * 0.04 * (val * 0.9));
    const no_show_loss = Math.round(leads * 0.06 * (val * 0.5));

    const total_estimated_leakage =
      missed_leads + abandoned_quotes + dormant_customers + failed_payments + no_show_loss;

    return NextResponse.json({
      success: true,
      scan_id: `scan_${Date.now()}`,
      business_name: body.businessName || 'Your Business',
      industry: body.industry || 'HVAC',
      total_estimated_leakage,
      breakdown: {
        missed_leads,
        abandoned_quotes,
        dormant_customers,
        failed_payments,
        no_show_loss,
      },
      confidence_score: 88,
      disclaimer: 'This is an engineering projection based on industry averages, not a guaranteed return.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
