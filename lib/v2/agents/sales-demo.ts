import type { DemoEvent } from '@/lib/v2/types';

export const DEMO_EVENTS: DemoEvent[] = [
  {
    id: 'missed-call',
    label: '1. Missed call detected',
    message: 'Incoming call was not answered. RevenueRecover starts the recovery workflow.',
    revenue: 0,
  },
  {
    id: 'text-back',
    label: '2. AI text-back',
    message: "Hi, this is the team. We saw your call and want to help. What do you need help with? Reply STOP to opt out.",
    revenue: 0,
  },
  {
    id: 'customer-reply',
    label: '3. Customer replies',
    message: 'Customer says: “My AC stopped working. Can someone come tomorrow?” AI qualifies the request.',
    revenue: 350,
  },
  {
    id: 'booking',
    label: '4. Job booked',
    message: 'AI confirms an appointment window and records a modeled $350 recovered-job value.',
    revenue: 350,
  },
];

export function getDemoEvent(index: number): DemoEvent {
  return DEMO_EVENTS[Math.min(Math.max(index, 0), DEMO_EVENTS.length - 1)];
}
