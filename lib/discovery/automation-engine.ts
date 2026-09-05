/**
 * RevenueRecover AI — Event-Driven Automation Engine
 * Listens for system events (lead.created, missed_call.detected, etc.) and triggers automations.
 */

export type AutomationEventType =
  | 'lead.created'
  | 'lead.updated'
  | 'lead.duplicate_detected'
  | 'lead.hot'
  | 'missed_call.detected'
  | 'website_form.received'
  | 'booking.created'
  | 'booking.completed'
  | 'contractor.matched';

export interface AutomationEvent {
  id: string;
  type: AutomationEventType;
  tenantId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export type AutomationHandler = (event: AutomationEvent) => Promise<void>;

export class AutomationEngine {
  private static handlers: Map<AutomationEventType, AutomationHandler[]> = new Map();
  private static executionLogs: Array<{
    runId: string;
    eventType: AutomationEventType;
    status: 'SUCCESS' | 'FAILED';
    timestamp: string;
    durationMs: number;
    error?: string;
  }> = [];

  /**
   * Registers a subscriber for an automation event.
   */
  static subscribe(type: AutomationEventType, handler: AutomationHandler): void {
    const list = this.handlers.get(type) || [];
    list.push(handler);
    this.handlers.set(type, list);
  }

  /**
   * Publishes an event and triggers all registered handlers.
   */
  static async publish(type: AutomationEventType, tenantId: string, payload: Record<string, any>): Promise<void> {
    const event: AutomationEvent = {
      id: `evt_auto_${Math.random().toString(36).substring(2, 8)}`,
      type,
      tenantId,
      payload,
      timestamp: new Date().toISOString(),
    };

    const listeners = this.handlers.get(type) || [];

    for (const listener of listeners) {
      const runId = `run_${Math.random().toString(36).substring(2, 8)}`;
      const start = Date.now();
      try {
        await listener(event);
        this.executionLogs.unshift({
          runId,
          eventType: type,
          status: 'SUCCESS',
          timestamp: new Date().toISOString(),
          durationMs: Date.now() - start,
        });
      } catch (err: any) {
        this.executionLogs.unshift({
          runId,
          eventType: type,
          status: 'FAILED',
          timestamp: new Date().toISOString(),
          durationMs: Date.now() - start,
          error: err.message,
        });
      }
    }
  }

  static getRecentLogs(limit = 20) {
    return this.executionLogs.slice(0, limit);
  }
}
