/**
 * RevenueRecover AI — Trial Entitlement Service
 * Enforces: ONE BUSINESS IDENTITY = ONE TRIAL ENTITLEMENT
 * Features: 30-Day 25% Decaying Trial Quota (200 -> 150 -> 100 -> 50 -> 0)
 */

import { TrialEntitlement, TrialStatus } from './types';

export class TrialEntitlementService {
  private static entitlements: Map<string, TrialEntitlement> = new Map();
  private static locks: Set<string> = new Set(); // Concurrency lock per businessId

  static {
    // Seed initial entitlements for test accounts
    this.entitlements.set('BIZ-83920', {
      id: 'ENT-83920',
      businessId: 'BIZ-83920',
      status: 'ACTIVE',
      baseLeadQuota: 200,
      currentDecayCycle: 1,
      decayPercentage: 0,
      leadQuota: 200,
      leadsUsed: 142,
      leadsRemaining: 58,
      startedAt: '2026-08-28T10:00:00Z',
      nextDecayDate: '2026-09-27T10:00:00Z',
      expiredAt: '2026-12-26T10:00:00Z',
      source: 'web_signup',
      createdAt: '2026-08-28T10:00:00Z',
      updatedAt: '2026-09-02T16:00:00Z',
    });

    this.entitlements.set('BIZ-94112', {
      id: 'ENT-94112',
      businessId: 'BIZ-94112',
      status: 'CONVERTED',
      baseLeadQuota: 200,
      currentDecayCycle: 1,
      decayPercentage: 0,
      leadQuota: 200,
      leadsUsed: 200,
      leadsRemaining: 0,
      startedAt: '2026-08-20T14:30:00Z',
      usedAt: '2026-08-25T11:00:00Z',
      source: 'scanner_inbound',
      paymentGatewayRef: 'pay_live_TWDRpZeKPQbMrq',
      createdAt: '2026-08-20T14:30:00Z',
      updatedAt: '2026-09-01T09:00:00Z',
    });
  }

  /**
   * Recalculates 25% 30-day quota decay dynamically
   */
  private static applyMonthlyDecay(entitlement: TrialEntitlement): TrialEntitlement {
    if (entitlement.status === 'CONVERTED') return entitlement;

    const startDate = entitlement.startedAt ? new Date(entitlement.startedAt) : new Date(entitlement.createdAt);
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Determine cycle: 1 = Days 0-30, 2 = Days 31-60, 3 = Days 61-90, 4 = Days 91-120
    const cycle = Math.min(5, Math.floor(daysElapsed / 30) + 1);
    entitlement.currentDecayCycle = cycle;

    // Decay percentage increases by 25% per 30-day window
    let decayPct = 0;
    if (cycle === 2) decayPct = 25;
    else if (cycle === 3) decayPct = 50;
    else if (cycle === 4) decayPct = 75;
    else if (cycle >= 5) decayPct = 100;

    entitlement.decayPercentage = decayPct;

    // Effective quota calculation (200 -> 150 -> 100 -> 50 -> 0)
    const effectiveQuota = Math.round(entitlement.baseLeadQuota * (1 - decayPct / 100));
    entitlement.leadQuota = effectiveQuota;

    // Adjust remaining leads
    entitlement.leadsRemaining = Math.max(0, effectiveQuota - entitlement.leadsUsed);

    if (decayPct >= 100 && entitlement.status === 'ACTIVE') {
      entitlement.status = 'EXPIRED';
    }

    // Next decay date calculation
    const nextDecay = new Date(startDate.getTime() + cycle * 30 * 24 * 60 * 60 * 1000);
    entitlement.nextDecayDate = nextDecay.toISOString();

    return entitlement;
  }

  public static async getEntitlementForBusiness(businessId: string): Promise<TrialEntitlement | null> {
    const raw = this.entitlements.get(businessId);
    if (!raw) return null;
    return this.applyMonthlyDecay(raw);
  }

  public static async createTrialEntitlement(input: {
    businessId: string;
    leadQuota?: number;
    source?: 'web_signup' | 'scanner_inbound' | 'sdr_invite' | 'referral';
  }): Promise<{ entitlement: TrialEntitlement; isNewlyCreated: boolean }> {
    const baseQuota = input.leadQuota || 200;
    const businessId = input.businessId;

    if (this.locks.has(businessId)) {
      throw new Error(`Concurrent trial creation detected for business ${businessId}. Operation locked.`);
    }

    try {
      this.locks.add(businessId);

      const existing = this.entitlements.get(businessId);
      if (existing) {
        return {
          entitlement: this.applyMonthlyDecay(existing),
          isNewlyCreated: false,
        };
      }

      const now = new Date();
      const nextDecay = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days first window
      const finalExpiry = new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000); // 120 days total

      const newEntitlement: TrialEntitlement = {
        id: `ENT-${Math.floor(10000 + Math.random() * 90000)}`,
        businessId,
        status: 'ACTIVE',
        baseLeadQuota: baseQuota,
        currentDecayCycle: 1,
        decayPercentage: 0,
        leadQuota: baseQuota,
        leadsUsed: 0,
        leadsRemaining: baseQuota,
        startedAt: now.toISOString(),
        nextDecayDate: nextDecay.toISOString(),
        expiredAt: finalExpiry.toISOString(),
        source: input.source || 'web_signup',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      this.entitlements.set(businessId, newEntitlement);

      return {
        entitlement: newEntitlement,
        isNewlyCreated: true,
      };
    } finally {
      this.locks.delete(businessId);
    }
  }

  public static async consumeLeadQuota(
    businessId: string,
    leadCount: number
  ): Promise<{ success: boolean; leadsUsed: number; leadsRemaining: number; error?: string }> {
    const raw = this.entitlements.get(businessId);
    if (!raw) {
      return { success: false, leadsUsed: 0, leadsRemaining: 0, error: 'No active trial entitlement found.' };
    }

    const entitlement = this.applyMonthlyDecay(raw);

    if (entitlement.status !== 'ACTIVE' && entitlement.status !== 'CONVERTED') {
      return {
        success: false,
        leadsUsed: entitlement.leadsUsed,
        leadsRemaining: entitlement.leadsRemaining,
        error: `Trial is ${entitlement.status}. Lead consumption not allowed. Upgrade to Growth plan to unlock unlimited leads.`,
      };
    }

    // For paid/converted customers, unlimited access is allowed
    if (entitlement.status === 'CONVERTED') {
      entitlement.leadsUsed += leadCount;
      entitlement.updatedAt = new Date().toISOString();
      return { success: true, leadsUsed: entitlement.leadsUsed, leadsRemaining: 999999 };
    }

    // For trial accounts, strictly enforce decaying quota server-side
    if (entitlement.leadsRemaining < leadCount) {
      return {
        success: false,
        leadsUsed: entitlement.leadsUsed,
        leadsRemaining: entitlement.leadsRemaining,
        error: `Insufficient trial quota. Remaining: ${entitlement.leadsRemaining} leads (Month ${entitlement.currentDecayCycle}: ${entitlement.decayPercentage}% decayed). Upgrade to $119/mo Growth plan for unlimited capacity.`,
      };
    }

    entitlement.leadsUsed += leadCount;
    entitlement.leadsRemaining -= leadCount;
    entitlement.updatedAt = new Date().toISOString();

    if (entitlement.leadsRemaining === 0) {
      entitlement.status = 'EXPIRED';
      entitlement.usedAt = new Date().toISOString();
    }

    return {
      success: true,
      leadsUsed: entitlement.leadsUsed,
      leadsRemaining: entitlement.leadsRemaining,
    };
  }

  public static async markConvertedToPaid(businessId: string, gatewayRef: string): Promise<TrialEntitlement | null> {
    const entitlement = this.entitlements.get(businessId);
    if (!entitlement) return null;

    entitlement.status = 'CONVERTED';
    entitlement.paymentGatewayRef = gatewayRef;
    entitlement.updatedAt = new Date().toISOString();
    return entitlement;
  }

  public static getAllEntitlements(): TrialEntitlement[] {
    return Array.from(this.entitlements.values()).map((e) => this.applyMonthlyDecay(e));
  }
}
