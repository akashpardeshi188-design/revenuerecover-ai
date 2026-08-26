import { SystemEvent, AuditLogEntry, Channel } from './types';

type EventCallback = (event: SystemEvent) => void | Promise<void>;

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private eventHistory: SystemEvent[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private maxHistory = 500;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load saved logs if available
      try {
        const savedHistory = localStorage.getItem('rr_event_history');
        if (savedHistory) this.eventHistory = JSON.parse(savedHistory);
        const savedAudit = localStorage.getItem('rr_audit_logs');
        if (savedAudit) this.auditLogs = JSON.parse(savedAudit);
      } catch (e) {
        console.warn('Failed to load event history from storage', e);
      }
    }
  }

  public subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  public async emit(
    eventType: string,
    payload: Record<string, unknown>,
    options?: {
      organizationId?: string;
      actorAgent?: string;
      actorUser?: string;
    }
  ): Promise<SystemEvent> {
    const event: SystemEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      organization_id: options?.organizationId || 'org_summit_hvac',
      actor_agent: options?.actorAgent,
      actor_user: options?.actorUser,
      payload,
    };

    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory = this.eventHistory.slice(0, this.maxHistory);
    }

    this.persist();

    // Notify listeners
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      for (const handler of handlers) {
        try {
          await handler(event);
        } catch (err) {
          console.error(`Error in event handler for ${eventType}:`, err);
        }
      }
    }

    // Also notify wildcard listeners
    const wildcardHandlers = this.listeners.get('*');
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        try {
          await handler(event);
        } catch (err) {
          console.error(`Error in wildcard handler for ${eventType}:`, err);
        }
      }
    }

    return event;
  }

  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const auditEntry: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    this.auditLogs.unshift(auditEntry);
    if (this.auditLogs.length > this.maxHistory) {
      this.auditLogs = this.auditLogs.slice(0, this.maxHistory);
    }

    this.persist();
    return auditEntry;
  }

  public getEvents(limit = 50): SystemEvent[] {
    return this.eventHistory.slice(0, limit);
  }

  public getAuditLogs(limit = 50): AuditLogEntry[] {
    return this.auditLogs.slice(0, limit);
  }

  public clear(): void {
    this.eventHistory = [];
    this.auditLogs = [];
    this.persist();
  }

  private persist(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rr_event_history', JSON.stringify(this.eventHistory));
        localStorage.setItem('rr_audit_logs', JSON.stringify(this.auditLogs));
      } catch (e) {
        // Storage quota full or unavailable
      }
    }
  }
}

export const eventBus = new EventBus();
