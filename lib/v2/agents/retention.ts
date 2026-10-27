export interface RetentionSignal {
  type: 'no_recovery_7d' | 'inactive_5d' | 'high_stop_rate' | 'upsell';
  action: string;
}

export function evaluateRetention(input: {
  recoveredRevenue30d: number;
  daysSinceLogin: number;
  daysSinceRecovery: number;
  stopRatePercent: number;
}): RetentionSignal[] {
  const signals: RetentionSignal[] = [];
  if (input.daysSinceRecovery >= 7) signals.push({ type: 'no_recovery_7d', action: 'Alert Customer Success and review call/text delivery.' });
  if (input.daysSinceLogin >= 5) signals.push({ type: 'inactive_5d', action: 'Start a helpful re-engagement sequence; do not send SMS without consent.' });
  if (input.stopRatePercent > 5) signals.push({ type: 'high_stop_rate', action: 'Pause promotional messaging and review consent/content quality.' });
  if (input.recoveredRevenue30d > 10000) signals.push({ type: 'upsell', action: 'Offer the Scale plan with a human-reviewed upgrade conversation.' });
  return signals;
}
