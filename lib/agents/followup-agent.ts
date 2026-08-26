import { ProspectLead } from '../types';

export interface FollowUpSequenceStep {
  day: number;
  type: 'Initial Outreach' | 'Value Reminder' | 'Demo Invitation' | 'ROI Case Study' | 'Final Check-in';
  channel: 'email' | 'sms';
  subject?: string;
  body: string;
}

export class FollowUpAgent {
  public static generateSequence(prospect: ProspectLead): FollowUpSequenceStep[] {
    const biz = prospect.business_name;
    const ind = prospect.industry;
    const city = prospect.city;

    return [
      {
        day: 0,
        type: 'Initial Outreach',
        channel: 'email',
        subject: `Quick idea for ${biz}`,
        body: `Hi team,\n\nI noticed ${biz} offers online service requests in ${city}. We built RevenueRecover AI to help ${ind} businesses recover missed calls, abandoned quotes, and dormant customers automatically.\n\nFor businesses with high-value jobs, even recovering 2-3 extra jobs per month makes a huge difference.\n\nYou can see an estimated revenue leak scan here.`,
      },
      {
        day: 2,
        type: 'Value Reminder',
        channel: 'sms',
        body: `Hi! Following up on our note to ${biz}. Did you know that 68% of homeowners who call a contractor and reach voicemail immediately call the next company on Google? Our 45-second AI text-back captures those calls before they leave.`,
      },
      {
        day: 5,
        type: 'Demo Invitation',
        channel: 'email',
        subject: `Interactive ${ind} revenue simulation for ${biz}`,
        body: `Hi folks,\n\nWe set up a quick 60-second interactive sandbox where you can plug in your current monthly lead volume and see exactly how much revenue our AI employee can recover for ${biz}.\n\nTry the live simulation here with zero login required.`,
      },
      {
        day: 9,
        type: 'ROI Case Study',
        channel: 'email',
        subject: `How a Texas HVAC contractor recovered $38,400 in 60 days`,
        body: `Hi team,\n\nSummit HVAC & Plumbing in Dallas activated RevenueRecover AI in Copilot Mode (1-click approvals). In their first 60 days, they recovered 14 high-ticket replacement quotes that were previously considered dead.\n\nWould you be open to testing a 14-day free trial on your next 5 unbooked quotes?`,
      },
      {
        day: 14,
        type: 'Final Check-in',
        channel: 'sms',
        body: `Hi from RevenueRecover AI! Checking in one last time for ${biz}. If you are all set with your current lead follow-up process, no worries at all. Feel free to reach back anytime!`,
      },
    ];
  }
}
