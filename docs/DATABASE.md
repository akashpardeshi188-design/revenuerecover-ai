# PostgreSQL / Prisma Database Architecture

## 1. Multi-Tenant Schema Map (`prisma/schema.prisma`)

### Core SaaS Entities
- `Organization`: Multi-tenant root entity with subscription tier (`STARTER`, `GROWTH`, `PRO`, `ENTERPRISE`), billing status, and monthly/lifetime recovered metrics.
- `User` & `OrganizationMember`: Role-based user memberships (`OWNER`, `ADMIN`, `MANAGER`, `AGENT`, `VIEWER`).
- `Customer`: Home service contractor's end-clients with total LTV and purchase history.
- `Opportunity`: Granular recovery opportunities (`MISSED_CALL`, `DORMANT_CUSTOMER`, `OVERDUE_INVOICE`, `ABANDONED_QUOTE`).
- `Conversation` & `ChatMessage`: 2-way SMS/email communication logs.
- `Campaign`: Outbound re-engagement and marketing campaigns.
- `Integration`: ServiceTitan, Housecall Pro, and Jobber webhook connectors.

### Discovery & Growth Entities
- `SourceRegistry`: External data providers (Google Places, OSM, Yelp, Companies House).
- `BusinessMaster`: Normalized contractor entity with verification scores and geocoding.
- `Lead`: Ingested contractor prospect opportunities.
- `DiscoveryJobRun`: Historical discovery execution metrics and cost tracking.
