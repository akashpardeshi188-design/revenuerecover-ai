# RevenueRecover AI — Troubleshooting & Diagnostics Guide

## Common Diagnostics & Resolutions

### 1. Discovery Search Returns Offline Test Fixtures
- **Cause:** `GOOGLE_MAPS_API_KEY` or `YELP_API_KEY` not yet set in `.env.local`.
- **Resolution:** The engine automatically fails over to clean, deterministic test fixtures clearly marked `MOCK/FIXTURE`. Once you provide live API keys in `.env.local`, the engine immediately queries the live endpoints.

### 2. TCPA / SMS Suppressed
- **Cause:** The recipient phone number is on the internal Opt-Out / DNC registry, or the timestamp falls during 8 PM–8 AM quiet hours.
- **Resolution:** Check `/growth/security-audit` for the exact compliance log. Emergency callbacks with explicit user consent can bypass quiet hours if marked `EXPRESS_WRITTEN`.

### 3. Duplicate Contractor Records
- **Cause:** Slight spelling variations across different directories (e.g. *Dallas Pro HVAC Inc* on Yelp vs *Dallas Pro HVAC LLC* on Google).
- **Resolution:** The `GlobalBusinessIdentityEngine` automatically calculates Jaro-Winkler string similarity and matches E.164 phone numbers or root domain names, collapsing them into a single `BusinessMaster` entity.
