/**
 * RevenueRecover AI — Review Queue & Audit Log Engine
 * Provides manual review capability and full audit trail for all trial events.
 */

import { ReviewQueueItem, AntiAbuseAuditLog, EligibilityDecision } from './types';
import { TrialEntitlementService } from './trial-entitlement';

export class ReviewQueueService {
  private static queue: Map<string, ReviewQueueItem> = new Map();
  private static auditLogs: AntiAbuseAuditLog[] = [];

  static {
    // Seed initial review items
    const item1: ReviewQueueItem = {
      id: 'REV-1049',
      businessId: 'BIZ-83920',
      businessName: 'Lone Star Climate Pros',
      userEmail: 'manager@lonestarheating.example.com',
      userPhone: '(817) 555-0192',
      riskScore: 65,
      identityConfidence: 0.88,
      reason: 'Multiple email signups under same verified phone and domain.',
      status: 'PENDING',
      signals: [
        {
          code: 'RESOLVED_EXISTING_BUSINESS',
          category: 'IDENTITY',
          weight: 40,
          strength: 'STRONG',
          description: 'Same verified business phone: +18175550192',
        },
      ],
      createdAt: '2026-09-02T22:15:00Z',
    };

    this.queue.set(item1.id, item1);

    this.auditLogs.push({
      id: 'AUD-901',
      action: 'SIGNUP_ATTEMPT',
      businessId: 'BIZ-83920',
      riskScore: 65,
      decision: 'REVIEW',
      details: { email: 'manager@lonestarheating.example.com', source: 'web_signup' },
      timestamp: '2026-09-02T22:15:00Z',
    });
  }

  public static addToQueue(item: Omit<ReviewQueueItem, 'id' | 'createdAt' | 'status'>): ReviewQueueItem {
    const id = `REV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newItem: ReviewQueueItem = {
      ...item,
      id,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.queue.set(id, newItem);
    this.logAudit({
      action: 'TRIAL_EVALUATED',
      businessId: item.businessId,
      riskScore: item.riskScore,
      decision: 'REVIEW',
      details: { reason: item.reason },
    });
    return newItem;
  }

  public static async resolveReview(input: {
    reviewId: string;
    decision: 'APPROVE' | 'DENY' | 'VERIFICATION_REQUESTED';
    adminId: string;
    notes: string;
  }): Promise<{ success: boolean; item?: ReviewQueueItem; error?: string }> {
    const item = this.queue.get(input.reviewId);
    if (!item) return { success: false, error: 'Review item not found.' };

    item.status = input.decision === 'APPROVE' ? 'APPROVED' : input.decision === 'DENY' ? 'DENIED' : 'VERIFICATION_REQUESTED';
    item.reviewedBy = input.adminId;
    item.reviewedAt = new Date().toISOString();
    item.reviewNotes = input.notes;

    if (input.decision === 'APPROVE') {
      await TrialEntitlementService.createTrialEntitlement({
        businessId: item.businessId,
        leadQuota: 200,
        source: 'sdr_invite',
      });
    }

    this.logAudit({
      action: 'ADMIN_OVERRIDE',
      businessId: item.businessId,
      decision: input.decision === 'APPROVE' ? 'APPROVE' : 'BLOCK_PREVIOUS_TRIAL',
      details: { reviewId: input.reviewId, adminId: input.adminId, notes: input.notes },
    });

    return { success: true, item };
  }

  public static logAudit(log: Omit<AntiAbuseAuditLog, 'id' | 'timestamp'>): void {
    this.auditLogs.unshift({
      ...log,
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
    });
    // Cap at last 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  public static getQueue(): ReviewQueueItem[] {
    return Array.from(this.queue.values());
  }

  public static getAuditLogs(): AntiAbuseAuditLog[] {
    return this.auditLogs;
  }
}
