import { ObjectionResponse } from '../types';

export class ObjectionKnowledgeBase {
  private static playbooks: Record<string, ObjectionResponse> = {
    too_expensive: {
      objectionKey: 'too_expensive',
      prospectStatement: 'It costs too much / we do not have budget for software right now.',
      rebuttal: 'I completely understand budget caution. Most contractors look at our Growth plan ($119/month) as an investment rather than an expense because a single recovered HVAC or plumbing repair job ($350–$1,400) pays for 3 to 12 months of the entire platform on Day 1.',
      socialProofPoint: 'Summit Mechanical recovered $4,200 in their first 14 days simply by texting back 3 after-hours emergency calls they missed on a Saturday.',
      clarifyingQuestion: 'How many missed calls or unbooked service estimates do you estimate slip through during your peak weekly jobs?',
      recommendedCTA: 'Would you be open to running our free 14-day trial on 10 missed calls to see if it covers itself before you pay a dime?',
      confidenceScore: 96
    },
    already_have_crm: {
      objectionKey: 'already_have_crm',
      prospectStatement: 'We already use ServiceTitan / Housecall Pro / Jobber / HubSpot.',
      rebuttal: 'That is great news! RevenueRecover AI is not a CRM replacement—it is a purpose-built revenue acceleration layer that plugs directly into ServiceTitan, Housecall Pro, and Jobber via instant webhooks.',
      socialProofPoint: 'Your CRM stores the records, but when a homeowner calls and your tech is on a ladder, our AI detects the missed ring and initiates a 45-second SMS conversation to lock in the appointment before they call the next contractor.',
      clarifyingQuestion: 'When an unbooked quote sits in your CRM for 48 hours without a reply, does someone manually text them every time, or does it sit idle?',
      recommendedCTA: 'Can I show you a 3-minute interactive preview of how the ServiceTitan/Jobber webhook triggers instant re-engagement?',
      confidenceScore: 98
    },
    already_have_answering_service: {
      objectionKey: 'already_have_answering_service',
      prospectStatement: 'We already pay a call center / live virtual receptionist.',
      rebuttal: 'Live answering services are helpful for general reception, but they often put callers on hold or take a message for a callback 2 hours later. By then, 78% of homeowners needing urgent repairs have already booked with the first competitor who texted them back.',
      socialProofPoint: 'RevenueRecover AI responds within 45 seconds via 2-way AI SMS, answers pricing and availability questions accurately, and books the dispatch slot directly.',
      clarifyingQuestion: 'What is your current cost per call with the answering service, and do they book directly into your technician dispatch schedule in real time?',
      recommendedCTA: 'You can run RevenueRecover AI alongside your answering service as a 45-second backup layer. Would you like to test it side-by-side?',
      confidenceScore: 95
    },
    dont_need_ai: {
      objectionKey: 'dont_need_ai',
      prospectStatement: 'We do not believe in AI / we prefer human touch.',
      rebuttal: 'We agree 100% that home services require real human craftsmanship. Our AI never attempts to pretend to replace your technicians—it simply acts as an instant digital assistant that says "Hi [Name], saw we missed your call! How can our team help?" so your customer knows they are cared for immediately.',
      socialProofPoint: 'You have full Copilot control: you can approve every message with 1 click, or set custom guidelines and quiet hours with an instant kill-switch.',
      clarifyingQuestion: 'When your team is on a job site with loud equipment, what is your current backup system to ensure that caller does not call your competitor down the road?',
      recommendedCTA: 'Let me send you a sample 2-message transcript showing how friendly and natural the customer experience feels.',
      confidenceScore: 92
    },
    send_information: {
      objectionKey: 'send_information',
      prospectStatement: 'Just email me some information / send a brochure.',
      rebuttal: 'I will gladly send over our 1-page executive summary and contractor ROI breakdown right now.',
      socialProofPoint: 'To ensure I include the exact numbers relevant to you, our typical HVAC/Plumbing partners recover between $3,500 and $12,000 monthly.',
      clarifyingQuestion: 'What email address is best, and roughly how many service trucks or technicians do you currently dispatch?',
      recommendedCTA: 'I will email the PDF right now, and include a 1-click link to a customized 60-second video demo of your exact trade.',
      confidenceScore: 94
    },
    need_talk_to_owner: {
      objectionKey: 'need_talk_to_owner',
      prospectStatement: 'I need to check with the business owner / general manager.',
      rebuttal: 'Understood. We frequently work with office managers and dispatchers to prepare a quick revenue summary so the owner can review the bottom-line numbers without wasting time.',
      socialProofPoint: 'Owners love seeing the exact estimate of missed revenue in their specific zip code before spending time on a call.',
      clarifyingQuestion: 'Who is the owner or principal, and would it help if I prepared a 1-page customized Revenue Leak Audit under your company name for them to review?',
      recommendedCTA: 'What is the owner’s name or email so I can send the executive audit directly, copying you?',
      confidenceScore: 93
    },
    not_interested: {
      objectionKey: 'not_interested',
      prospectStatement: 'Not interested / take us off your list.',
      rebuttal: 'Completely respect that! I have updated our records immediately and you will not receive any further unsolicited outreach.',
      socialProofPoint: 'If you ever find your team missing calls during peak seasonal surges (summer AC rush or winter freeze), our self-service scanner at revenuerecover-ai.vercel.app is always freely available.',
      clarifyingQuestion: 'Is timing simply bad right now, or is missed-call volume genuinely not a bottleneck for your shop?',
      recommendedCTA: 'Wishing you continued success this season. No further action needed!',
      confidenceScore: 99
    },
    how_does_it_work: {
      objectionKey: 'how_does_it_work',
      prospectStatement: 'How does the system actually work technically?',
      rebuttal: 'It works in 3 simple steps: 1) You forward your missed calls or connect your existing phone/CRM in 2 minutes. 2) When a call goes unanswered, our AI texts the caller within 45 seconds with a friendly greeting. 3) The AI qualifies the service need, answers basic questions, and books the appointment directly into your calendar.',
      socialProofPoint: 'Zero hardware to buy, no apps to install on your techs’ phones, and works with any existing phone carrier (AT&T, Verizon, RingCentral, Grasshopper, etc.).',
      clarifyingQuestion: 'Which phone provider or dispatch software are you currently using for inbound customer calls?',
      recommendedCTA: 'Would you like to test-call our live demo number right now from your mobile phone to experience the 45-second text-back firsthand?',
      confidenceScore: 97
    },
    is_this_compliant: {
      objectionKey: 'is_this_compliant',
      prospectStatement: 'Is this compliant with TCPA, CAN-SPAM, and privacy laws?',
      rebuttal: 'Yes, 100% compliant by design. We strictly adhere to TCPA 10DLC registration, CAN-SPAM, and GDPR regulations.',
      socialProofPoint: 'The AI only responds to inbound inquiries initiated by the homeowner (implied consent), includes automatic STOP opt-out handling on every SMS thread, and respects local legal quiet hours (no outreach before 8 AM or after 8 PM local time).',
      clarifyingQuestion: 'Are there any specific state-level compliance mandates or internal company communication guidelines your shop follows?',
      recommendedCTA: 'I can attach our legal compliance whitepaper and 10DLC registration certificate along with your onboarding invite.',
      confidenceScore: 99
    },
    can_i_cancel: {
      objectionKey: 'can_i_cancel',
      prospectStatement: 'Am I locked into a contract? Can I cancel anytime?',
      rebuttal: 'There are zero long-term lock-in contracts on our monthly plans ($59/mo Starter or $119/mo Growth). You can cancel anytime with 1 click directly inside your billing portal.',
      socialProofPoint: 'We earn our clients’ business every single month through measurable recovered revenue logged transparently on your dashboard.',
      clarifyingQuestion: 'Would you prefer the flexibility of the monthly Growth plan, or the 30% discount on the Pro Annual VIP tier?',
      recommendedCTA: 'You can start your 14-day zero-risk trial today without being billed. Shall I activate your portal?',
      confidenceScore: 98
    },
    what_happens_after_signup: {
      objectionKey: 'what_happens_after_signup',
      prospectStatement: 'What happens immediately after I sign up?',
      rebuttal: 'Within 60 seconds of checkout: 1) Your secure multi-tenant portal is provisioned. 2) 150–200 verified local homeowner leads in your exact zip codes are delivered to your inbox. 3) You connect your phone forwarding or CRM with a 3-click wizard. 4) Our AI starts monitoring and recovering missed calls immediately.',
      socialProofPoint: 'Most contractors receive their first recovered job within 48 to 72 hours of going live.',
      clarifyingQuestion: 'What primary trade and zip codes would you like your initial 150–200 verified leads generated for?',
      recommendedCTA: 'Let’s get your zip codes registered so the leads can be generated right away.',
      confidenceScore: 96
    },
    what_is_the_roi: {
      objectionKey: 'what_is_the_roi',
      prospectStatement: 'What kind of return on investment (ROI) can we realistically expect?',
      rebuttal: 'For an average home service contractor missing 12 calls a week with an average ticket of $450, you are losing ~$5,400 per week. Recovering just 2 of those missed calls per month generates $900 in new revenue against a $119/mo subscription—a 7.5x direct ROI.',
      socialProofPoint: 'Contractors using our full suite (missed call text-back + 90-day dormant reactivation + overdue invoice recovery) average a 24x to 35x monthly ROI.',
      clarifyingQuestion: 'What is your average ticket size for a repair vs. a full system replacement?',
      recommendedCTA: 'Would you like to plug your exact numbers into our live Interactive ROI Calculator on a quick 3-minute screen share?',
      confidenceScore: 98
    }
  };

  public static getPlaybook(objectionKey: string): ObjectionResponse | null {
    return this.playbooks[objectionKey] || null;
  }

  public static classifyAndRespond(incomingText: string): ObjectionResponse {
    const text = incomingText.toLowerCase();

    if (text.includes('expensive') || text.includes('cost') || text.includes('price') || text.includes('budget') || text.includes('afford') || text.includes('too high')) {
      return this.playbooks.too_expensive;
    }
    if (text.includes('servicetitan') || text.includes('housecall') || text.includes('jobber') || text.includes('crm') || text.includes('already have software')) {
      return this.playbooks.already_have_crm;
    }
    if (text.includes('answering service') || text.includes('call center') || text.includes('receptionist') || text.includes('live agent')) {
      return this.playbooks.already_have_answering_service;
    }
    if (text.includes('dont need ai') || text.includes("don't need ai") || text.includes('human') || text.includes('robots') || text.includes('dont trust ai')) {
      return this.playbooks.dont_need_ai;
    }
    if (text.includes('send info') || text.includes('send information') || text.includes('brochure') || text.includes('email me details') || text.includes('pdf')) {
      return this.playbooks.send_information;
    }
    if (text.includes('owner') || text.includes('boss') || text.includes('manager') || text.includes('partner') || text.includes('talk to')) {
      return this.playbooks.need_talk_to_owner;
    }
    if (text.includes('not interested') || text.includes('stop') || text.includes('unsubscribe') || text.includes('remove') || text.includes('take off')) {
      return this.playbooks.not_interested;
    }
    if (text.includes('how does it work') || text.includes('how it works') || text.includes('technical') || text.includes('explain')) {
      return this.playbooks.how_does_it_work;
    }
    if (text.includes('compliant') || text.includes('tcpa') || text.includes('spam') || text.includes('legal') || text.includes('gdpr')) {
      return this.playbooks.is_this_compliant;
    }
    if (text.includes('cancel') || text.includes('contract') || text.includes('lock in') || text.includes('term')) {
      return this.playbooks.can_i_cancel;
    }
    if (text.includes('after signup') || text.includes('onboarding') || text.includes('setup time') || text.includes('how long')) {
      return this.playbooks.what_happens_after_signup;
    }
    if (text.includes('roi') || text.includes('return') || text.includes('worth it') || text.includes('guarantee') || text.includes('results')) {
      return this.playbooks.what_is_the_roi;
    }

    // Default conversational response fallback
    return {
      objectionKey: 'general_inquiry',
      prospectStatement: incomingText,
      rebuttal: 'RevenueRecover AI is an automated missed-call recovery and revenue acceleration engine built specifically for HVAC, Plumbing, and Electrical contractors. We instantly text back missed callers within 45 seconds so you never lose high-value jobs to competitors.',
      socialProofPoint: 'Our contractors recover an average of $3,500–$8,000 every month with zero extra staff.',
      clarifyingQuestion: 'What is the biggest source of lost revenue in your shop today: missed inbound calls, dormant past customers, or uncollected invoices?',
      recommendedCTA: 'Can I show you a 60-second preview of how it works for your specific trade?',
      confidenceScore: 88
    };
  }

  public static getAllPlaybooks(): ObjectionResponse[] {
    return Object.values(this.playbooks);
  }
}
