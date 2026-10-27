-- AI REVENUE AGENT DATABASE SCHEMA
-- Supabase PostgreSQL Migration
-- Multi-Tenant with Row-Level Security (RLS)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ORGANIZATIONS (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{
        "default_niche": "dental",
        "target_country": "USA",
        "outreach_daily_limit": 50,
        "auto_approval": false,
        "currency": "USD"
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS / PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- References auth.users(id) in Supabase
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'manager' CHECK (role IN ('owner', 'admin', 'manager', 'sales', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORGANIZATION MEMBERS
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'sales' CHECK (role IN ('owner', 'admin', 'manager', 'sales', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- 4. INDUSTRIES / NICHES
CREATE TABLE IF NOT EXISTS industries (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avg_deal_size NUMERIC DEFAULT 3000,
    scoring_weights JSONB NOT NULL,
    typical_pain_points JSONB DEFAULT '[]'::jsonb,
    recommended_offers JSONB DEFAULT '[]'::jsonb,
    qualification_questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROSPECTS
CREATE TABLE IF NOT EXISTS prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    industry VARCHAR(50) NOT NULL DEFAULT 'dental',
    website TEXT,
    phone VARCHAR(100),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'USA',
    rating NUMERIC(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    social_links JSONB DEFAULT '{}'::jsonb,
    booking_url TEXT,
    source VARCHAR(100) DEFAULT 'Manual Discovery',
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN (
        'New', 'Researching', 'Qualified', 'Contacted', 'Replied',
        'Interested', 'Demo Booked', 'Proposal', 'Won', 'Lost', 'Do Not Contact'
    )),
    opportunity_score INT DEFAULT 0,
    pain_points JSONB DEFAULT '[]'::jsonb,
    research_summary TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROSPECT RESEARCH
CREATE TABLE IF NOT EXISTS prospect_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
    business_summary TEXT,
    services_offered JSONB DEFAULT '[]'::jsonb,
    customer_profile TEXT,
    marketing_strength VARCHAR(50) DEFAULT 'Moderate',
    website_quality_notes TEXT,
    online_booking_present BOOLEAN DEFAULT FALSE,
    online_booking_details TEXT,
    lead_capture_opportunities JSONB DEFAULT '[]'::jsonb,
    possible_revenue_leakage JSONB DEFAULT '[]'::jsonb,
    potential_automations JSONB DEFAULT '[]'::jsonb,
    recommended_offer TEXT,
    recommended_outreach_angle TEXT,
    score_breakdown JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LEADS (CRM PIPELINE)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    prospect_id UUID REFERENCES prospects(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Unqualified' CHECK (status IN (
        'Unqualified', 'Qualified', 'Hot', 'Demo Ready', 'Proposal', 'Won', 'Lost'
    )),
    monthly_lead_volume INT,
    current_response_system TEXT,
    current_crm VARCHAR(100),
    avg_customer_value NUMERIC,
    main_pain_point TEXT,
    budget_range VARCHAR(100),
    decision_maker_confirmed BOOLEAN DEFAULT FALSE,
    timeline VARCHAR(100),
    notes TEXT,
    last_contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LEAD SCORES
CREATE TABLE IF NOT EXISTS lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    score INT NOT NULL,
    reasoning JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. OUTREACH CAMPAIGNS
CREATE TABLE IF NOT EXISTS outreach_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(50) NOT NULL DEFAULT 'dental',
    target_location VARCHAR(255) NOT NULL,
    offer TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    message_style VARCHAR(50) DEFAULT 'consultative',
    daily_limit INT DEFAULT 30,
    requires_approval BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    sequence JSONB NOT NULL DEFAULT '[]'::jsonb,
    prospects_enrolled INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    interested_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. OUTREACH MESSAGES
CREATE TABLE IF NOT EXISTS outreach_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES outreach_campaigns(id) ON DELETE CASCADE,
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
    step INT NOT NULL DEFAULT 1,
    channel VARCHAR(50) NOT NULL DEFAULT 'email',
    subject TEXT,
    body TEXT NOT NULL,
    pain_point_focus TEXT,
    call_to_action TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_approval' CHECK (status IN (
        'draft', 'pending_approval', 'approved', 'sent', 'replied', 'bounced', 'failed'
    )),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    prospect_id UUID REFERENCES prospects(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    channel VARCHAR(50) DEFAULT 'website_chat',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'handoff_requested', 'closed')),
    summary TEXT,
    extracted_qualification JSONB DEFAULT '{}'::jsonb,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CONVERSATION MESSAGES
CREATE TABLE IF NOT EXISTS conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL CHECK (sender IN ('ai', 'prospect', 'human_agent')),
    content TEXT NOT NULL,
    intent VARCHAR(100),
    qualification_data_extracted JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    prospect_id UUID REFERENCES prospects(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    meeting_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show'
    )),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PROPOSALS
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    business_name VARCHAR(255) NOT NULL,
    client_contact VARCHAR(255) NOT NULL,
    executive_summary TEXT NOT NULL,
    identified_problems JSONB DEFAULT '[]'::jsonb,
    proposed_solution TEXT NOT NULL,
    deliverables JSONB DEFAULT '[]'::jsonb,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'Growth',
    monthly_price NUMERIC NOT NULL DEFAULT 999,
    setup_fee NUMERIC NOT NULL DEFAULT 1500,
    estimated_monthly_roi_multiplier VARCHAR(50) DEFAULT '4.8x - 7.2x',
    contract_duration_months INT DEFAULT 12,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN (
        'draft', 'sent', 'viewed', 'accepted', 'declined', 'paid'
    )),
    stripe_checkout_url TEXT,
    payment_received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CLIENTS
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    industry VARCHAR(50) NOT NULL DEFAULT 'dental',
    website TEXT,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'Growth',
    mrr NUMERIC NOT NULL DEFAULT 999,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'onboarding', 'past_due', 'cancelled')),
    health VARCHAR(50) DEFAULT 'Healthy' CHECK (health IN ('Healthy', 'Attention Needed', 'At Risk')),
    health_score INT DEFAULT 95,
    health_factors JSONB DEFAULT '{"engagement": 95, "lead_volume": 85, "ai_utilization": 90, "payment_status": "ok"}'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    onboarding_step INT DEFAULT 1,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    ai_agent_id UUID,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CLIENT SETTINGS & AI AGENTS
CREATE TABLE IF NOT EXISTS client_ai_agent_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    agent_name VARCHAR(255) NOT NULL,
    system_instructions TEXT NOT NULL,
    brand_tone VARCHAR(100) DEFAULT 'Professional & Empathetic',
    services_offered JSONB DEFAULT '[]'::jsonb,
    faq JSONB DEFAULT '[]'::jsonb,
    booking_link TEXT,
    phone VARCHAR(100),
    office_hours TEXT,
    qualification_rules JSONB DEFAULT '[]'::jsonb,
    escalation_email VARCHAR(255),
    embed_widget_token VARCHAR(100) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUTOMATIONS
CREATE TABLE IF NOT EXISTS automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(100) NOT NULL,
    conditions JSONB DEFAULT '[]'::jsonb,
    actions JSONB DEFAULT '[]'::jsonb,
    requires_human_approval BOOLEAN DEFAULT TRUE,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AUTOMATION RUNS
CREATE TABLE IF NOT EXISTS automation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    automation_id UUID REFERENCES automations(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'running' CHECK (status IN ('success', 'failed', 'pending_approval', 'running')),
    input JSONB NOT NULL,
    output JSONB,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    plan_id VARCHAR(50) NOT NULL DEFAULT 'growth',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. PAYMENTS & INVOICES
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    stripe_payment_intent_id VARCHAR(255),
    amount NUMERIC NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'succeeded',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255),
    amount NUMERIC NOT NULL,
    due_date DATE,
    paid_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'paid' CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. REVENUE & ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS revenue_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('new_subscription', 'mrr_expansion', 'setup_fee', 'churn')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AI TOKEN & COST TRACKING
CREATE TABLE IF NOT EXISTS ai_token_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    tokens_input INT NOT NULL DEFAULT 0,
    tokens_output INT NOT NULL DEFAULT 0,
    estimated_cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. AUTOPILOT ACTIONS
CREATE TABLE IF NOT EXISTS autopilot_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    priority VARCHAR(50) NOT NULL DEFAULT 'high' CHECK (priority IN ('critical', 'high', 'medium', 'info')),
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'follow_up', 'hot_lead', 'demo', 'proposal', 'invoice', 'churn_risk', 'campaign'
    )),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    suggested_ai_action TEXT NOT NULL,
    action_handler VARCHAR(100) NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'urgent')),
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. TEMPLATES
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('outreach', 'objection', 'proposal', 'onboarding')),
    industry VARCHAR(50) DEFAULT 'all',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. SUPPRESSION & DO-NOT-CONTACT LIST
CREATE TABLE IF NOT EXISTS suppression_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255),
    domain VARCHAR(255),
    phone VARCHAR(100),
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE & TENANT ISOLATION
CREATE INDEX IF NOT EXISTS idx_profiles_org ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_prospects_org ON prospects(organization_id);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_leads_org ON leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_appointments_org ON appointments(organization_id);
CREATE INDEX IF NOT EXISTS idx_proposals_org ON proposals(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_org ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_org ON outreach_campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_autopilot_org ON autopilot_actions(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_tokens_org ON ai_token_usage(organization_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_ai_agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE autopilot_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppression_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper to fetch current user's organization_id
CREATE OR REPLACE FUNCTION get_current_user_org_id() 
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Sample RLS policy pattern for tenant isolation
CREATE POLICY org_isolation_prospects ON prospects
    FOR ALL
    USING (organization_id = get_current_user_org_id());

CREATE POLICY org_isolation_leads ON leads
    FOR ALL
    USING (organization_id = get_current_user_org_id());

CREATE POLICY org_isolation_clients ON clients
    FOR ALL
    USING (organization_id = get_current_user_org_id());

CREATE POLICY org_isolation_proposals ON proposals
    FOR ALL
    USING (organization_id = get_current_user_org_id());
