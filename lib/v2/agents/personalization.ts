import type { LeadCandidate, PersonalizationResult } from '@/lib/v2/types';

export function personalizeLead(lead: LeadCandidate): PersonalizationResult {
  const reviews = lead.review_count;
  const revenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lead.estimated_lost_revenue);
  const trade = lead.source === 'google_places' ? 'HVAC/plumbing' : 'service';
  return {
    painLine: `Your ${reviews} customer reviews suggest a strong call-driven ${trade} business. Even a few unanswered calls can create meaningful lost-job opportunity.`,
    roiLine: `Our screening model estimates about ${revenue}/month of potential revenue opportunity. This is an estimate, not a measured loss.`,
    icebreaker: `${lead.city} customers with urgent heating, cooling, or plumbing problems often contact the first contractor who responds.`,
    disclaimer: 'Personalization uses only verified lead fields and clearly labels modeled revenue as an estimate.',
  };
}
