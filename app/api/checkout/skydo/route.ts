import { NextRequest, NextResponse } from 'next/server';

/**
 * RevenueRecover AI — Skydo Cross-Border Payment & Virtual Account API
 * Generates official B2B SaaS Invoices and US ACH / Fedwire payment instructions.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, currency = 'USD', businessName, email, amountUSD = 119 } = body;

    const invoiceId = `INV-SKYDO-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Official Beneficiary Virtual Account details under Akash Bhagwansingh Pardeshi
    const skydoAccountDetails = {
      beneficiaryName: 'AKASH BHAGWANSINGH PARDESHI',
      accountType: 'USD Checking / Commercial SaaS Receiving Account',
      bankCountry: 'United States',
      paymentRail: 'ACH or Fedwire (Zero Commission)',
      referenceNote: `Invoice ${invoiceId} - ${businessName || 'RevenueRecover AI License'}`,
      supportEmail: 'contact@revenuerecover-ai.com',
    };

    return NextResponse.json({
      success: true,
      invoiceId,
      planId: planId || 'growth_tier',
      amountUSD,
      currency,
      businessName: businessName || 'Valued Trade Contractor',
      skydoAccountDetails,
      issuedAt: now.toISOString(),
      dueDate: dueDate.toISOString(),
      instructions:
        'Please execute the ACH / Wire transfer using the beneficiary details above. Upon transfer, your AI Revenue Recovery Employee is activated instantly.',
    });
  } catch (error: any) {
    console.error('Error generating Skydo invoice details:', error);
    return NextResponse.json({ error: 'Failed to generate Skydo payment details.' }, { status: 500 });
  }
}
