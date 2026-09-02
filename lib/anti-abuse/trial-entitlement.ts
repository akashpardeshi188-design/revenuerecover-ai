/**
 * RevenueRecover AI — Trial Entitlement Service
 * Enforces server-side: ONE BUSINESS IDENTITY = ONE TRIAL ENTITLEMENT
 * Manages 150–200 lead quota limits with race condition protection.
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
      leadQuota: 200,
      leadsUsed: 142,
      leadsRemaining: 58,
      startedAt: '2026-08-28T10:00:00Z',
      expiredAt: '2026-09-11T10:00:00Z',
      source: 'web_signup',
      createdAt: '2026-08-28T10:00:00Z',
      updatedAt: '2026-09-02T16:00:00Z',
    });

    this.entitlements.set('BIZ-94112', {
      id: 'ENT-94112',
      businessId: 'BIZ-94112',
      status: 'CONVERTED',
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

  public static async getEntitlementForBusiness(businessId: string): Promise<TrialEntitlement | null> {
    return this.entitlements.get(businessId) || null;
  }

  public static async createTrialEntitlement(input: {
    businessId: string;
    leadQuota?: number;
    source?: 'web_signup' | 'scanner_inbound' | 'sdr_invite' | 'referral';
  }): Promise<{ entitlement: TrialEntitlement; isNewlyCreated: boolean }> {
    const quota = input.leadQuota || 200;
    const businessId = input.businessId;

    // Concurrency Lock to prevent race conditions
    if (this.locks.has(businessId)) {
      throw new Error(`Concurrent trial creation detected for business ${businessId}. Operation locked.`);
    }

    try {
      this.locks.add(businessId);

      // Check if entitlement already exists
      const existing = this.entitlements.get(businessId);
      if (existing) {
        return {
          entitlement: existing,
          isNewlyCreated: false,
        };
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

      const newEntitlement: TrialEntitlement = {
        id: `ENT-${Math.floor(10000 + Math.random() * 90000)}`,
        businessId,
        status: 'ACTIVE',
        leadQuota: quota,
        leadsUsed: 0,
        leadsRemaining: quota,
        startedAt: now.toISOString(),
        expiredAt: expiresAt.toISOString(),
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
    const entitlement = this.entitlements.get(businessId);
    if (!entitlement) {
      return { success: false, leadsUsed: 0, leadsRemaining: 0, error: 'No active trial entitlement found.' };
    }

    if (entitlement.status !== 'ACTIVE' && entitlement.status !== 'CONVERTED') {
      return {
        success: false,
        leadsUsed: entitlement.leadsUsed,
        leadsRemaining: entitlement.leadsRemaining,
        error: `Trial is ${entitlement.status}. Lead consumption not allowed.`,
      };
    }

    // For paid/converted customers, unlimited access is allowed
    if (entitlement.status === 'CONVERTED') {
      entitlement.leadsUsed += leadCount;
      entitlement.updatedAt = new Date().toISOString();
      return { success: true, leadsUsed: entitlement.leadsUsed, leadsRemaining: 999999 };
    }

    // For trial accounts, strictly enforce quota server-side
    if (entitlement.leadsRemaining < leadCount) {
      return {
        success: false,
        leadsUsed: entitlement.leadsUsed,
        leadsRemaining: entitlement.leadsRemaining,
        error: `Insufficient trial quota. Requested: ${leadCount}, Remaining: ${entitlement.leadsRemaining}. Upgrade to $119/mo Growth plan for unlimited leads.`,
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
    return Array.from(this.entitlements.values());
  }
}
