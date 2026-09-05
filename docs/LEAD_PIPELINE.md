# RevenueRecover AI — Lead Pipeline & AI Scoring Architecture

## 1. Separation of Concerns: Discovery vs. Lead Ingestion
- **Contractor Discovery:** Identifies existing HVAC, Plumbing, and Electrical service businesses in a specific metropolitan region.
- **Lead Ingestion:** Captures active homeowner / property manager service requests (emergency repairs, quote requests, missed phone calls).

## 2. Multi-Touch Lead Deduplication Engine
When a customer submits a web inquiry, then calls 3 minutes later (missed call), the system:
1. Computes the customer identifier (`cust_phone_XXXX` or `cust_email_XXXX`).
2. Checks for an active `MasterOpportunity` for the current tenant.
3. If found, appends the touchpoint event, recalculates composite urgency, and updates stage to `HOT`.
4. If not found, creates a new `MasterOpportunity` and matches to the highest-ranking local contractor.

## 3. AI Lead Scoring Framework (0-100)

| Factor | Weight | Evaluation Criteria |
| :--- | :--- | :--- |
| **Urgency** | 25 pts | Emergency breakdown (e.g. AC failure on 95°F day) = +25 pts |
| **Channel Intent** | 15 pts | Inbound missed call = +15 pts (Highest buyer intent) |
| **Contactability** | 10 pts | Verified E.164 callback number available = +10 pts |
| **Job Value** | 20 pts | Major replacement / commercial job ticket = +20 pts |
| **Location Match**| 30 pts | Customer ZIP code within contractor primary service radius = +30 pts |
