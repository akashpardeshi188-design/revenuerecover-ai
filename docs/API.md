# REST API Reference

## Growth Engine Endpoints

### 1. `POST /api/growth/cron`
Executes the full 15-step daily autonomous growth cycle.
- **Request Body:** `{ "leads": GrowthLead[] }` (Optional)
- **Response:** `{ success: true, report: DailyGrowthReport, updatedLeads: GrowthLead[] }`

### 2. `POST /api/growth/ai-advisor`
Executes natural language queries for the AI Executive Command Center.
- **Request Body:** `{ "query": string, "leads": GrowthLead[] }`
- **Response:** `{ success: true, advisorResponse: AIAdvisorResponse }`

### 3. `POST /api/growth/scanner`
Executes the Free AI Revenue Leak Scanner.
- **Request Body:** `{ "businessName": string, "city": string, "trade": string, "websiteUrl"?: string }`
- **Response:** `{ success: true, scanResult: RevenueScanResult }`

### 4. `POST /api/growth/sdr`
Processes inbound prospect replies through the AI SDR dialogue engine and 12 objection playbooks.
- **Request Body:** `{ "lead": GrowthLead, "message": string }`
- **Response:** `{ success: true, sdrResult: SDRResult }`

### 5. `GET /api/growth/agents`
Returns real-time health and execution status for all 25 autonomous AI growth agents.
- **Response:** `{ success: true, totalAgents: 25, agents: AgentStatus[], security: any, qa: any }`
