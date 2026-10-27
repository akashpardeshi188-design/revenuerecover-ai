export interface OutreachMessage {
  channel: 'email' | 'sms';
  subject?: string;
  body: string;
  allowed: boolean;
  reason: string;
}

export function buildEmailSequence(companyName: string, painLine: string, roiLine: string): OutreachMessage[] {
  const safeName = companyName.trim() || 'your team';
  return [
    {
      channel: 'email',
      subject: `Quick question about missed calls at ${safeName}`,
      body: `${painLine}\n\n${roiLine}\n\nWould you be open to a 15-minute demo showing the missed-call text-back flow?\n\nYou can unsubscribe at any time.`,
      allowed: true,
      reason: 'Primary outreach channel; include a real unsubscribe mechanism and physical mailing address before sending.',
    },
    {
      channel: 'email',
      subject: `A simple missed-call recovery example for ${safeName}`,
      body: `Following up with one concrete example of how a missed inbound call can become a booked service request.\n\nIf this is not relevant, unsubscribe and we will stop emailing you.`,
      allowed: true,
      reason: 'Follow-up email.',
    },
    {
      channel: 'email',
      subject: `45-second missed-call recovery demo`,
      body: `Here is the short demo flow: missed call → instant text-back → customer reply → appointment request.\n\nIf you want to see it on your own workflow, book a 15-minute demo.\n\nUnsubscribe anytime.`,
      allowed: true,
      reason: 'Value follow-up email.',
    },
  ];
}

export function buildConsentSms(message: string, consentRecorded: boolean, recipientLocalHour: number): OutreachMessage {
  const quietHours = recipientLocalHour >= 20 || recipientLocalHour < 8;
  const allowed = consentRecorded && !quietHours;
  return {
    channel: 'sms',
    body: `${message} Reply STOP to opt out.`,
    allowed,
    reason: !consentRecorded
      ? 'SMS requires documented opt-in consent.'
      : quietHours
        ? 'SMS blocked during 8 PM–8 AM recipient-local quiet hours.'
        : 'Consent and quiet-hour checks passed; production sending also requires the configured A2P 10DLC/Twilio setup.',
  };
}
