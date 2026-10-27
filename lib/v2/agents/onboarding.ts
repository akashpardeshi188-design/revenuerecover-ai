export interface OnboardingChecklist {
  createCrmAccount: boolean;
  configurePhone: boolean;
  deliverLeadBonus: boolean;
  sendWelcome: boolean;
}

export function buildOnboardingChecklist(): OnboardingChecklist {
  return {
    createCrmAccount: true,
    configurePhone: false,
    // Do not automatically distribute homeowner personal data. Supply only from a documented, lawful source.
    deliverLeadBonus: false,
    sendWelcome: true,
  };
}

export function onboardingSequence(): string[] {
  return [
    'Create contractor account and tenant record after verified payment webhook.',
    'Collect business details and service area.',
    'Configure Twilio/A2P number or provide call-forwarding setup instructions.',
    'Run a test missed-call → text-back workflow.',
    'Send welcome video and setup checklist.',
  ];
}
