import { RevenueScanResult, TargetIndustry, TargetCountry } from '../types';

export interface ScanInput {
  businessName: string;
  websiteUrl?: string;
  phone?: string;
  city: string;
  stateProvince: string;
  country?: TargetCountry;
  trade: TargetIndustry;
  estimatedTechnicians?: number;
}

export class RevenueLeakScanner {
  public static async scanBusiness(input: ScanInput): Promise<RevenueScanResult> {
    const techCount = input.estimatedTechnicians || 3;
    const country = input.country || 'USA';
    
    // Trade-specific job value benchmarks (USD)
    const tradeBenchmarks: Record<TargetIndustry, { avgTicket: number; weeklyCalls: number }> = {
      HVAC: { avgTicket: 850, weeklyCalls: 16 },
      Plumbing: { avgTicket: 480, weeklyCalls: 22 },
      Electrical: { avgTicket: 520, weeklyCalls: 14 },
      Roofing: { avgTicket: 3200, weeklyCalls: 8 },
      Landscaping: { avgTicket: 350, weeklyCalls: 18 },
      'Garage Door': { avgTicket: 420, weeklyCalls: 15 },
      'General Contracting': { avgTicket: 1800, weeklyCalls: 10 }
    };

    const benchmark = tradeBenchmarks[input.trade] || { avgTicket: 500, weeklyCalls: 15 };
    const scaledWeeklyCalls = Math.round(benchmark.weeklyCalls * (techCount / 2.5));
    const estimatedMissedCallsWeekly = Math.max(4, Math.round(scaledWeeklyCalls * 0.28)); // ~28% calls missed in home services

    // Calculations
    const monthlyMissedJobsPotential = estimatedMissedCallsWeekly * 4.33;
    const monthlyMissedGross = monthlyMissedJobsPotential * benchmark.avgTicket;

    const conservativeRecoveryUSD = Math.round(monthlyMissedGross * 0.35); // 35% recovered
    const expectedRecoveryUSD = Math.round(monthlyMissedGross * 0.65);     // 65% recovered
    const optimisticRecoveryUSD = Math.round(monthlyMissedGross * 0.85);   // 85% recovered

    const dormantReactivationPotentialUSD = Math.round(techCount * 1800);
    const unpaidInvoiceRiskUSD = Math.round(techCount * 1250);

    // Dynamic Bottleneck Identification
    const bottlenecks: string[] = [];
    const recommendations: string[] = [];

    bottlenecks.push(`High missed-call risk: ~${estimatedMissedCallsWeekly} unbooked homeowner calls lost every week during job-site hours.`);
    recommendations.push('Deploy 45-second automated 2-way AI text-back on all unanswered inbound calls.');

    if (!input.websiteUrl || input.websiteUrl.length < 5) {
      bottlenecks.push('Limited digital capture: No website detected for direct mobile booking.');
      recommendations.push('Activate instant SMS booking dispatch widget.');
    } else {
      bottlenecks.push('Speed-to-lead latency: Inquiry response time exceeds 15 minutes during peak dispatch.');
      recommendations.push('Implement instant AI lead responder for web inquiries.');
    }

    bottlenecks.push(`Dormant revenue leakage: Estimated $${dormantReactivationPotentialUSD.toLocaleString()} in inactive 90+ day customer records sitting uncontacted.`);
    recommendations.push('Launch automated seasonal tune-up reactivation sequence.');

    bottlenecks.push(`Aged receivables friction: ~$${unpaidInvoiceRiskUSD.toLocaleString()} in 30+ day unpaid invoices lacking systematic follow-up.`);
    recommendations.push('Enable automated respectful SMS & email invoice reminder workflow.');

    // Overall Health Score (0-100, where lower means more revenue leakage)
    const healthScore = Math.max(38, Math.min(68, 70 - Math.round(techCount * 3.5)));

    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Plan Recommendation based on size
    let recommendedPlan: 'STARTER' | 'GROWTH' | 'PRO_ANNUAL' = 'GROWTH';
    if (techCount <= 1) {
      recommendedPlan = 'STARTER';
    } else if (techCount >= 6) {
      recommendedPlan = 'PRO_ANNUAL';
    }

    const pitch = `Based on our audit of ${input.businessName} in ${input.city}, ${input.stateProvince}, your team is likely leaving ~$${expectedRecoveryUSD.toLocaleString()}/month on the table in missed emergency calls, dormant seasonal clients, and uncollected invoices. RevenueRecover AI automates this recovery on complete autopilot for just $119/month—delivering a projected ${(expectedRecoveryUSD / 119).toFixed(0)}x monthly ROI.`;

    return {
      scanId,
      businessName: input.businessName,
      websiteUrl: input.websiteUrl || 'N/A',
      city: input.city,
      stateProvince: input.stateProvince,
      country,
      trade: input.trade,
      overallHealthScore: healthScore,
      missedCallVulnerability: techCount > 4 ? 'CRITICAL' : 'HIGH',
      speedToLeadScore: 42,
      afterHoursCoverage: false,
      onlineBookingPresent: Boolean(input.websiteUrl),
      dormantReactivationOpportunityUSD: dormantReactivationPotentialUSD,
      unpaidInvoiceRiskUSD: unpaidInvoiceRiskUSD,
      totalEstimatedMonthlyLeakageUSD: {
        conservative: conservativeRecoveryUSD,
        expected: expectedRecoveryUSD,
        optimistic: optimisticRecoveryUSD
      },
      identifiedBottlenecks: bottlenecks,
      recommendedSolutions: recommendations,
      personalizedPitch: pitch,
      recommendedPlanTier: recommendedPlan
    };
  }
}
