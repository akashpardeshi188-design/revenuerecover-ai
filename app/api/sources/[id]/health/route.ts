import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/lib/discovery/adapters/adapter-factory';
import { getSourceById } from '@/lib/discovery/registry';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const source = getSourceById(id);

  if (!source) {
    return NextResponse.json({ success: false, error: 'Source not found in registry' }, { status: 404 });
  }

  const adapter = getAdapter(id);
  if (!adapter) {
    return NextResponse.json({
      success: true,
      sourceId: id,
      sourceName: source.sourceName,
      status: 'NOT_SUPPORTED',
      configured: false,
      message: 'No official API adapter or access permitted for this source',
    });
  }

  const health = await adapter.healthCheck();

  return NextResponse.json({
    success: true,
    sourceId: id,
    sourceName: source.sourceName,
    configured: adapter.isConfigured(),
    health,
  });
}
