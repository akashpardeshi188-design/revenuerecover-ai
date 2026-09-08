# Security, RBAC & Anti-Abuse Architecture

## 1. Multi-Tenant Isolation
- Strict organizational data boundaries: all customer, lead, and recovery records are keyed by `tenantId` / `organizationId`.
- Role-Based Access Control (RBAC): `OWNER`, `ADMIN`, `MANAGER`, `AGENT`, `VIEWER`.

## 2. API Key & Secrets Protection
- Zero client-side leakage: all third-party credentials (PayPal, Twilio, Gemini, Stripe) are strictly loaded server-side.
- Secure environment template (`.env.example`) provided without hardcoded production keys.

## 3. Resilience & Fallbacks
- Deterministic heuristic AI fallback engine prevents complete service failure if upstream AI API rate limits occur.
- Emergency Autopilot Kill-Switch (`GLOBAL_KILL_SWITCH`) halts all automated outbound messages instantly with 1 click.
