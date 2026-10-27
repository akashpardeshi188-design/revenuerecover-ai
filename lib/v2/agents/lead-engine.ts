import { resolveMx } from 'node:dns/promises';
import type { LeadCandidate, LeadInput } from '@/lib/v2/types';

const GOOGLE_URL = 'https://places.googleapis.com/v1/places:searchText';
const YELP_URL = 'https://api.yelp.com/v3/businesses/search';

function normalizeUsPhone(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  const digits = raw.replace(/\D/g, '');
  const normalized = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : raw;
  return /^\+1\d{10}$/.test(normalized) ? normalized : null;
}

function hostnameFromUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

async function hasMxRecord(website: string | null): Promise<boolean> {
  const host = hostnameFromUrl(website);
  if (!host) return false;
  try {
    const records = await resolveMx(host);
    return records.length > 0;
  } catch {
    return false;
  }
}

async function websiteHasAiCompetitorSignals(website: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(website, {
      signal: controller.signal,
      headers: { 'user-agent': 'RevenueRecoverAI/2.0 (+public-business-audit)' },
    });
    clearTimeout(timer);
    if (!response.ok) return false;
    const html = (await response.text()).slice(0, 250_000).toLowerCase();
    return /(ai receptionist|ai answering|voice ai|ai chatbot|missed call text|text[- ]back|virtual receptionist)/i.test(html);
  } catch {
    return false;
  }
}

function scoreLead(reviewCount: number, rating: number, website: string, aiDetected: boolean) {
  const breakdown = {
    reviews: reviewCount > 20 ? 20 : 0,
    website: 20,
    rating: rating > 4.5 ? 20 : 0,
    ai_competitor_not_detected: aiDetected ? 0 : 40,
  };
  return { score: Object.values(breakdown).reduce((a, b) => a + b, 0), breakdown };
}

function estimateOpportunity(reviewCount: number) {
  // Model only: this does not claim the business actually missed this many calls.
  const estimatedMissedCalls = Math.max(1, Math.round(reviewCount * 0.1));
  return { estimatedMissedCalls, estimatedLostRevenue: estimatedMissedCalls * 350 };
}

async function googlePlaces(input: LeadInput): Promise<LeadCandidate[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return [];
  const industry = input.industry === 'plumbing' ? 'plumbing contractor' : 'HVAC contractor';
  const response = await fetch(GOOGLE_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': key,
      'x-goog-fieldmask': 'places.displayName,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: `${industry} in ${input.city}, ${input.state}`, pageSize: Math.min(input.limit ?? 20, 20) }),
  });
  if (!response.ok) throw new Error(`Google Places error: ${response.status}`);
  const data = await response.json() as { places?: Array<Record<string, unknown>> };
  const results: LeadCandidate[] = [];
  for (const place of data.places ?? []) {
    const phone = normalizeUsPhone(place.nationalPhoneNumber);
    const website = typeof place.websiteUri === 'string' ? place.websiteUri : null;
    const reviews = Number(place.userRatingCount ?? 0);
    const rating = Number(place.rating ?? 0);
    if (!phone || !website || reviews <= 10 || rating <= 4.0) continue;
    if (!(await hasMxRecord(website))) continue;
    const aiDetected = await websiteHasAiCompetitorSignals(website);
    const { score, breakdown } = scoreLead(reviews, rating, website, aiDetected);
    if (score <= 70) continue;
    const opportunity = estimateOpportunity(reviews);
    const name = typeof place.displayName === 'object' && place.displayName !== null
      ? String((place.displayName as { text?: unknown }).text ?? 'Unnamed business')
      : 'Unnamed business';
    results.push({
      business_name: name,
      phone,
      owner_name: null,
      website,
      review_count: reviews,
      rating,
      city: input.city,
      state: input.state,
      estimated_missed_calls: opportunity.estimatedMissedCalls,
      estimated_lost_revenue: opportunity.estimatedLostRevenue,
      score,
      score_breakdown: breakdown,
      source: 'google_places',
    });
  }
  return results;
}

async function yelp(input: LeadInput): Promise<LeadCandidate[]> {
  // Yelp Fusion search is retained as an enrichment source, but its search payload
  // does not provide a contractor-owned website field. We therefore do not promote
  // Yelp-only records into the qualified set until an owned domain can be verified.
  const key = process.env.YELP_FUSION_API_KEY;
  if (!key) return [];
  const industry = input.industry === 'plumbing' ? 'plumbing' : 'hvac';
  const url = new URL(YELP_URL);
  url.searchParams.set('term', industry);
  url.searchParams.set('location', `${input.city}, ${input.state}`);
  url.searchParams.set('limit', String(Math.min(input.limit ?? 20, 50)));
  const response = await fetch(url, { headers: { authorization: `Bearer ${key}` } });
  if (!response.ok) throw new Error(`Yelp Fusion error: ${response.status}`);
  // Intentionally return no qualified records until owned-domain verification is available.
  await response.json();
  return [];
}

export async function findQualifiedLeads(input: LeadInput): Promise<LeadCandidate[]> {
  const state = input.state.trim().toUpperCase();
  const city = input.city.trim();
  if (!city || !['TX', 'FL', 'TEXAS', 'FLORIDA'].includes(state)) {
    throw new Error('V2 Lead Engine currently supports Texas (TX) and Florida (FL) only.');
  }
  const normalized: LeadInput = {
    ...input,
    state: state === 'TEXAS' ? 'TX' : state === 'FLORIDA' ? 'FL' : state,
    city,
  };
  const [google, yelpResults] = await Promise.all([googlePlaces(normalized), yelp(normalized)]);
  const unique = new Map<string, LeadCandidate>();
  for (const lead of [...google, ...yelpResults]) unique.set(lead.phone, lead);
  return [...unique.values()].sort((a, b) => b.score - a.score).slice(0, input.limit ?? 20);
}
