import { NextRequest, NextResponse } from 'next/server';
import { GlobalBusinessIdentityEngine } from '@/lib/discovery/identity-engine';
import { BusinessVerificationEngine } from '@/lib/discovery/verification-engine';
import { DiscoveredBusiness } from '@/lib/discovery/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawRecords: DiscoveredBusiness[] = body.records || [];
    const tenantId: string = body.tenantId || 'org_default';

    if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
      return NextResponse.json({ success: false, error: 'No records provided for import' }, { status: 400 });
    }

    const consolidated = GlobalBusinessIdentityEngine.consolidate(rawRecords, tenantId);

    // Verify consolidated records
    for (const biz of consolidated) {
      const vResult = BusinessVerificationEngine.evaluate(biz);
      biz.verificationScore = vResult.score;
      biz.verificationStatus = vResult.status;
      biz.verificationReasons = vResult.reasons;
    }

    return NextResponse.json({
      success: true,
      importedCount: rawRecords.length,
      masterEntitiesCreated: consolidated.length,
      businesses: consolidated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
