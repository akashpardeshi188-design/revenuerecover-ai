import { BusinessRules, Channel } from './types';

export interface ComplianceCheckResult {
  allowed: boolean;
  reason?: string;
  code?: 'KILL_SWITCH' | 'OPTED_OUT' | 'QUIET_HOURS' | 'FREQUENCY_CAP' | 'CHANNEL_DISABLED' | 'INVALID_TARGET';
}

export class ComplianceEngine {
  private suppressionList: Set<string> = new Set([
    '555-0199',
    'stop@example.com',
    'optout@test.com',
    '+15550009999',
  ]);

  private dailyContactCounts: Map<string, number> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rr_suppression_list');
        if (saved) {
          const list: string[] = JSON.parse(saved);
          list.forEach((item) => this.suppressionList.add(item.toLowerCase()));
        }
      } catch (e) {
        console.warn('Failed to load suppression list', e);
      }
    }
  }

  public checkCommunication(
    recipient: string,
    channel: Channel,
    rules: BusinessRules
  ): ComplianceCheckResult {
    // 1. Global Kill Switch check
    if (rules.kill_switch_active) {
      return {
        allowed: false,
        reason: 'Emergency Kill Switch is currently active across the organization.',
        code: 'KILL_SWITCH',
      };
    }

    // 2. Channel check
    if (!rules.allowed_channels.includes(channel)) {
      return {
        allowed: false,
        reason: `Channel ${channel.toUpperCase()} is currently disabled in business rules.`,
        code: 'CHANNEL_DISABLED',
      };
    }

    // 3. Opt-out / Suppression check
    const normalizedRecipient = recipient.toLowerCase().trim();
    if (this.suppressionList.has(normalizedRecipient)) {
      return {
        allowed: false,
        reason: `Recipient ${recipient} is on the opt-out / suppression list (TCPA/CAN-SPAM).`,
        code: 'OPTED_OUT',
      };
    }

    // 4. Quiet Hours check (TCPA 8am - 9pm local time rule)
    if (this.isQuietHours(rules)) {
      return {
        allowed: false,
        reason: `Current time falls within designated Quiet Hours (${rules.quiet_hours.start} to ${rules.quiet_hours.end}).`,
        code: 'QUIET_HOURS',
      };
    }

    // 5. Frequency Cap check
    const today = new Date().toISOString().split('T')[0];
    const key = `${today}_${normalizedRecipient}`;
    const currentCount = this.dailyContactCounts.get(key) || 0;

    if (currentCount >= rules.daily_message_limit) {
      return {
        allowed: false,
        reason: `Daily message limit of ${rules.daily_message_limit} reached for this recipient.`,
        code: 'FREQUENCY_CAP',
      };
    }

    return { allowed: true };
  }

  public recordMessageSent(recipient: string): void {
    const today = new Date().toISOString().split('T')[0];
    const key = `${today}_${recipient.toLowerCase().trim()}`;
    const current = this.dailyContactCounts.get(key) || 0;
    this.dailyContactCounts.set(key, current + 1);
  }

  public addOptOut(identifier: string): void {
    this.suppressionList.add(identifier.toLowerCase().trim());
    this.persist();
  }

  public removeOptOut(identifier: string): void {
    this.suppressionList.delete(identifier.toLowerCase().trim());
    this.persist();
  }

  public getSuppressionList(): string[] {
    return Array.from(this.suppressionList);
  }

  public isQuietHours(rules: BusinessRules): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    const [startH, startM] = rules.quiet_hours.start.split(':').map(Number);
    const [endH, endM] = rules.quiet_hours.end.split(':').map(Number);

    const startTimeMinutes = startH * 60 + startM;
    const endTimeMinutes = endH * 60 + endM;

    // e.g. 21:00 (9 PM) to 08:00 (8 AM)
    if (startTimeMinutes > endTimeMinutes) {
      return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes < endTimeMinutes;
    } else {
      return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes;
    }
  }

  private persist(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'rr_suppression_list',
          JSON.stringify(Array.from(this.suppressionList))
        );
      } catch (e) {
        // quota exceeded
      }
    }
  }
}

export const complianceEngine = new ComplianceEngine();
