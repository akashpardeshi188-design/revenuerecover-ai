import { NextResponse } from 'next/server';
import { RevenueLeakScanner, ScanInput } from '@/lib/growth-engine';

export async function POST(req: Request) {
  try {
    const body: ScanInput = await req.json();

    if (!body.businessName || !body.city || !body.trade) {
      return NextResponse.json(
        { success: false, error: 'Business name, trade, and city are required fields' },
        { status: 400 }
      );
    }

    const scanResult = await RevenueLeakScanner.scanBusiness(body);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      scanResult
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Revenue scan failed' },
      { status: 500 }
    );
  }
}
