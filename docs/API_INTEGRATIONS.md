# RevenueRecover AI — API Integrations Specification

## REST API Surface

### 1. Business Discovery
- **`POST /api/discovery/search`**
  - **Body:** `{ country: "USA", city: "Dallas", category: "HVAC", radiusMiles: 25 }`
  - **Returns:** `{ report: DiscoveryJobReport, businesses: BusinessMaster[] }`
- **`POST /api/discovery/import`**
  - **Body:** `{ records: DiscoveredBusiness[], tenantId: "org_123" }`
  - **Returns:** `{ importedCount: number, masterEntitiesCreated: number, businesses: BusinessMaster[] }`

### 2. Master Businesses
- **`GET /api/businesses`**
  - **Query:** `?country=USA&city=Dallas&category=HVAC`
  - **Returns:** List of verified master contractors.
- **`POST /api/businesses/:id/verify`**
  - **Action:** Evaluates multi-factor verification (phone, website, address, corroboration).
  - **Returns:** `{ verification: VerificationCheckResult }`

### 3. Customer Leads & AI Scoring
- **`GET /api/leads`**
  - **Query:** `?tenantId=org_default`
  - **Returns:** List of active MasterOpportunities.
- **`POST /api/leads`**
  - **Body:** Ingests raw customer lead signal (missed call, web form, inbound email).
  - **Action:** Automatically classifies intent (0-100), deduplicates into MasterOpportunity, and triggers real-time events.
- **`POST /api/leads/:id/score`**
  - **Action:** AI intent classification & estimated job value calculation.
- **`POST /api/leads/:id/match`**
  - **Action:** Ranks best matching local contractors by trade category, proximity, and capacity.

### 4. Sources & System Health
- **`GET /api/sources`**
  - **Returns:** Active registry & AI Source Optimizer recommendations.
- **`GET /api/sources/:id/health`**
  - **Returns:** Connection status, latency, and credentials check.
- **`GET /api/admin/global-discovery/stats`**
  - **Returns:** System-wide metrics, opportunities, and cost breakdown.
