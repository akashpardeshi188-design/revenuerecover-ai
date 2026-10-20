import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseProfile,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
  supabaseRestRequest,
} from '@/lib/supabase-rest';

const ALLOWED_STATUSES = new Set(['in_progress', 'recovered', 'lost', 'dismissed']);

type UpdatedOpportunity = {
  id: string;
  company_id: string;
  status: string;
  recovered_value: number | null;
  updated_at?: string;
};

export async function PATCH(request: NextRequest) {
  const auth = await resolveAuthContext(request).catch(() => null);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const profile = await getSupabaseProfile(auth.user.id, auth.accessToken);
  if (!profile?.company_id) {
    const response = NextResponse.json(
      { error: 'Complete company onboarding before updating recovery opportunities.' },
      { status: 409 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const id = payload.id;
  const status = payload.status;
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'A valid opportunity ID is required.' }, { status: 400 });
  }
  if (typeof status !== 'string' || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Choose an allowed recovery status.' }, { status: 400 });
  }

  const patch: Record<string, string | number> = { status };
  if (status === 'recovered') {
    const recoveredValue = payload.recoveredValue;
    if (
      typeof recoveredValue !== 'number' ||
      !Number.isFinite(recoveredValue) ||
      !Number.isInteger(recoveredValue) ||
      recoveredValue <= 0 ||
      recoveredValue > 100_000_000
    ) {
      return NextResponse.json(
        { error: 'Enter the actual recovered amount in USD as a positive whole number.' },
        { status: 400 }
      );
    }
    patch.recovered_value = recoveredValue;
  }

  const query = new URLSearchParams({
    id: 'eq.' + id,
    company_id: 'eq.' + profile.company_id,
    select: 'id,company_id,status,recovered_value,updated_at',
  });

  const updateResponse = await supabaseRestRequest(
    'recovery_opportunities?' + query.toString(),
    auth.accessToken,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(patch),
    }
  ).catch(() => null);

  if (!updateResponse) {
    const response = NextResponse.json({ error: 'Staging database is temporarily unavailable.' }, { status: 502 });
    return setRefreshedSessionIfNeeded(response, auth);
  }

  const rows = (await updateResponse.json().catch(() => [])) as UpdatedOpportunity[] | { message?: string };
  if (!updateResponse.ok) {
    const response = NextResponse.json(
      { error: 'The recovery status could not be saved. Check the database permissions and try again.' },
      { status: 502 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  if (!Array.isArray(rows) || rows.length !== 1) {
    // A non-existent ID and a cross-tenant ID deliberately produce the same response.
    const response = NextResponse.json({ error: 'Opportunity not found for this company.' }, { status: 404 });
    return setRefreshedSessionIfNeeded(response, auth);
  }

  const response = NextResponse.json({ success: true, opportunity: rows[0] }, {
    headers: { 'Cache-Control': 'no-store' },
  });
  return setRefreshedSessionIfNeeded(response, auth);
}
