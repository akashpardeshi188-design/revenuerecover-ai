export type OperatingMode = 'demo' | 'mock' | 'live';

export type UserRole = 'owner' | 'admin' | 'manager' | 'agent' | 'viewer';

export type AutopilotMode = 'copilot' | 'supervised' | 'autopilot';

export type OpportunityType =
  | 'missed_lead'
  | 'missed_call'
  | 'uncontacted_lead'
  | 'unresponsive_lead'
  | 'abandoned_quote'
  | 'rejected_quote'
  | 'failed_payment'
  | 'overdue_invoice'
  | 'cancelled_appointment'
  | 'no_show'
  | 'dormant_customer'
  | 'lost_customer'
  | 'upsell'
  | 'cross_sell'
  | 'repeat_purchase'
  | 'high_value_risk';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type OpportunityStatus =
  | 'detected'
  | 'in_progress'
  | 'awaiting_approval'
  | 'contacted'
  | 'recovered'
  | 'dismissed';

export type Channel = 'sms' | 'email' | 'webchat' | 'call';

export interface Opportunity {
  id: string;
  organization_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  type: OpportunityType;
  estimated_value: number;
  confidence_score: number; // 0-100
  urgency: UrgencyLevel;
  recovery_score: number; // 0-100
  score_reasons: string[];
  recommended_action: string;
  recommended_channel: Channel;
  status: OpportunityStatus;
  source: string;
  created_at: string;
  updated_at: string;
  last_message_sent?: string;
  recovered_amount?: number;
  recovered_at?: string;
}

export interface Customer {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  lifetime_value: number;
  total_purchases: number;
  last_purchase_date: string;
  last_contact_date: string;
  status: 'active' | 'dormant' | 'at_risk' | 'churned';
  tags: string[];
  open_opportunities_count: number;
  ai_summary: string;
  next_recommended_action: string;
}

export type AIResponseClassification =
  | 'interested'
  | 'ready_to_book'
  | 'pricing_question'
  | 'information_request'
  | 'objection'
  | 'not_interested'
  | 'already_purchased'
  | 'wrong_number'
  | 'stop_unsubscribe'
  | 'angry_customer'
  | 'human_assistance'
  | 'appointment_request'
  | 'payment_issue'
  | 'unknown';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai_agent' | 'human_agent';
  text: string;
  timestamp: string;
  channel: Channel;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Conversation {
  id: string;
  organization_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  channel: Channel;
  status: 'needs_reply' | 'ai_handling' | 'human_required' | 'recovered' | 'closed' | 'opted_out';
  ai_classification: AIResponseClassification;
  ai_suggested_reply?: string;
  ai_confidence?: number;
  messages: ChatMessage[];
  updated_at: string;
}

export interface CampaignStep {
  id: string;
  delay_days: number;
  channel: Channel;
  template: string;
  condition?: string;
}

export interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  type:
    | 'lead_recovery'
    | 'quote_recovery'
    | 'payment_recovery'
    | 'customer_reactivation'
    | 'appointment_recovery'
    | 'no_show_recovery'
    | 'repeat_customer'
    | 'upsell';
  status: 'active' | 'paused' | 'draft';
  steps: CampaignStep[];
  stats: {
    sent: number;
    opened: number;
    replied: number;
    recovered_count: number;
    recovered_revenue: number;
  };
}

export interface Integration {
  id: string;
  organization_id: string;
  provider:
    | 'servicetitan'
    | 'housecall_pro'
    | 'jobber'
    | 'stripe'
    | 'twilio'
    | 'quickbooks'
    | 'hubspot'
    | 'google_calendar'
    | 'zapier';
  name: string;
  category: 'CRM' | 'Payments' | 'Communication' | 'Calendar' | 'Accounting';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  mode: OperatingMode;
  last_sync_at?: string;
  sync_count?: number;
  config?: Record<string, string>;
}

export interface BusinessRules {
  business_hours: {
    start: string;
    end: string;
    timezone: string;
    work_days: number[];
  };
  quiet_hours: {
    start: string;
    end: string;
  };
  autopilot_mode: AutopilotMode;
  max_followups: number;
  followup_interval_days: number;
  allowed_channels: Channel[];
  daily_message_limit: number;
  monthly_message_limit: number;
  kill_switch_active: boolean;
  discount_rules: {
    max_discount_pct: number;
    auto_offer_enabled: boolean;
  };
  escalation_rules: {
    auto_escalate_angry: boolean;
    auto_escalate_high_ticket: number;
  };
}

export type PipelineStage =
  | 'new_lead'
  | 'researching'
  | 'qualified'
  | 'contacted'
  | 'engaged'
  | 'demo'
  | 'trial'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'nurture';

export interface ProspectLead {
  id: string;
  business_name: string;
  website: string;
  industry: string;
  city: string;
  state: string;
  business_size?: string;
  public_email?: string;
  public_phone?: string;
  source: 'public_directory' | 'verified_api' | 'scanner_inbound' | 'csv_import' | 'referral';
  lead_score: number; // 0-100
  tier: 'hot' | 'warm' | 'cold';
  estimated_leakage: number;
  confidence: number;
  stage: PipelineStage;
  research_dossier?: {
    signals: string[];
    missed_call_risk: string;
    quote_workflow: string;
    online_booking_present: boolean;
    recommended_pitch: string;
  };
  personalized_outreach?: {
    subject: string;
    email_body: string;
    sms_body: string;
  };
  last_contacted_at?: string;
  next_action: string;
  opt_out: boolean;
  created_at: string;
}

export interface GrowthMetrics {
  visitors: number;
  scans: number;
  leads: number;
  qualified_leads: number;
  demos: number;
  trials: number;
  paid_customers: number;
  mrr: number;
  cac: number;
  ltv: number;
  churn_rate: number;
  ai_generated_leads: number;
  ai_qualified_leads: number;
  ai_assisted_sales: number;
  ai_compute_cost: number;
}

export interface RevenueScanResult {
  scan_id: string;
  business_name: string;
  website: string;
  industry: string;
  location: string;
  monthly_leads: number;
  avg_job_value: number;
  current_process: string;
  total_estimated_leakage: number;
  breakdown: {
    missed_leads: number;
    abandoned_quotes: number;
    dormant_customers: number;
    failed_payments: number;
    no_show_loss: number;
  };
  confidence_score: number;
  action_plan: string[];
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_org_id: string;
  referrer_name: string;
  referral_code: string;
  referred_business: string;
  referred_email: string;
  status: 'invited' | 'signed_up' | 'active_customer' | 'rewarded';
  reward: string;
  created_at: string;
}

export interface SystemEvent {
  id: string;
  event_type: string;
  timestamp: string;
  organization_id?: string;
  actor_agent?: string;
  actor_user?: string;
  payload: Record<string, unknown>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  channel: Channel;
  recipient: string;
  consent_basis: string;
  message_snippet: string;
  status: 'delivered' | 'suppressed' | 'blocked_by_killswitch' | 'approved';
  agent: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  owner_email: string;
  plan: 'starter' | 'growth' | 'pro' | 'enterprise';
  plan_status: 'trialing' | 'active' | 'past_due' | 'canceled';
  monthly_recovered: number;
  lifetime_recovered: number;
  created_at: string;
}
