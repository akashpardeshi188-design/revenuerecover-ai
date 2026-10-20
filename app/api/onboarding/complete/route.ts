import { NextRequest, NextResponse } from 'next/server';
import {
  getSafeSupabaseError,
  resolveAuthContext,
  setRefreshedSessionIfNeeded,
  supabaseRestRequest,
} from '@/lib/supabase-rest';

const BUSINESS_TYPE_MAP: Record<string, string> = {
  'HVAC & Plumbing Services': 'hvac_plumbing',
  Plumbing: 'plumbing',
  Electrical: 'electrical',
  'General Contractors': 'general_contractor',
  'General Contractors / Remodeling': 'general_contractor',
};

function stringField(
  body: Record<string, unknown>,
  key: string,
  maxLength: number,
  required = false
): string | null {
  const value = body[key];
  if (typeof value !== 'string') return required ? null : '';
  const trimmed = value.trim();
  if (trimmed.length > maxLength || (required && trimmed.length === 0)) return null;
  return trimmed;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid onboarding form.' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid onboarding form.' }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const companyName = stringField(data, 'businessName', 160, true);
  const website = stringField(data, 'website', 2048, true);
  const industry = stringField(data, 'industry', 120, true);
  const city = stringField(data, 'city', 100) ?? '';
  const state = stringField(data, 'state', 100) ?? '';
  const phone = stringField(data, 'businessPhone', 80) ?? '';
  const email = stringField(data, 'businessEmail', 254) ?? '';
  const startTime = stringField(data, 'startTime', 5) ?? '08:00';
  const endTime = stringField(data, 'endTime', 5) ?? '18:00';
  const selectedCrm = stringField(data, 'selectedCrm', 120) ?? '';

  if (!companyName || !website || !industry) {
    return NextResponse.json({ error: 'Company name, website and industry are required.' }, { status: 400 });
  }

  let parsedWebsite: URL;
  try {
    parsedWebsite = new URL(website);
  } catch {
    return NextResponse.json({ error: 'Enter a valid website URL.' }, { status: 400 });
  }
  if (!['http:', 'https:'].includes(parsedWebsite.protocol) || !parsedWebsite.hostname) {
    return NextResponse.json({ error: 'Website must start with http:// or https://.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid business email.' }, { status: 400 });
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime)) {
    return NextResponse.json({ error: 'Enter valid business hours.' }, { status: 400 });
  }

  const auth = await resolveAuthContext(request).catch(() => null);
  if (!auth) {
    return NextResponse.json({ error: 'Please sign in again to save onboarding.' }, { status: 401 });
  }

  const companyResponse = await supabaseRestRequest('rpc/complete_client_onboarding', auth.accessToken, {
    method: 'POST',
    body: JSON.stringify({
      p_company_name: companyName,
      p_website: parsedWebsite.toString(),
      p_business_type: BUSINESS_TYPE_MAP[industry] ?? 'other',
      p_city: city,
      p_state: state,
      p_phone: phone || null,
      p_email: email || null,
    }),
  }).catch(() => null);

  if (!companyResponse?.ok) {
    const payload = await companyResponse?.json().catch(() => ({}));
    const response = NextResponse.json(
      { error: getSafeSupabaseError(payload, 'Could not save company details. Please try again.') },
      { status: companyResponse?.status === 401 ? 401 : companyResponse?.status === 403 ? 403 : 400 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  const companyId = (await companyResponse.json().catch(() => null)) as unknown;
  if (typeof companyId !== 'string' || !/^[0-9a-f-]{36}$/i.test(companyId)) {
    const response = NextResponse.json(
      { error: 'Company was saved, but its ID could not be confirmed. Please refresh and sign in again.' },
      { status: 502 }
    );
    return setRefreshedSessionIfNeeded(response, auth);
  }

  const detailResponse = await supabaseRestRequest('rpc/save_client_onboarding_details', auth.accessToken, {
    method: 'POST',
    body: JSON.stringify({
      p_primary_contact_phone: phone || null,
      p_service_areas: city || state ? [`${city}${city && state ? ', ' : ''}${state}`] : [],
      p_emergency_hours: `${startTime}-${endTime}`,
      p_primary_services: [industry],
      p_booking_software_name: selectedCrm || null,
      p_ninety_day_revenue_goal: null,
    }),
  }).catch(() => null);

  const response = NextResponse.json({
    success: true,
    companyId,
    warning: detailResponse?.ok
      ? null
      : 'Company saved. Some extended onboarding details could not be saved; they can be updated later.',
  });
  return setRefreshedSessionIfNeeded(response, auth);
}
