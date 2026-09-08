# Lead Discovery & Intelligence Engine

## 1. Multi-Source Architecture
The Lead Engine discovers, normalizes, verifies, and scores contractor candidates across multiple legal data sources:

- **Google Places API:** Local business entities, phone numbers, rating counts, opening hours.
- **OpenStreetMap Overpass API:** Geo-spatial contractor points of interest across USA, UK, and Canada.
- **Yelp Fusion API:** Review sentiment, service category tagging, address validation.
- **UK Companies House API:** Official registrar validation for UK electrical/plumbing contractors.

## 2. Explainable Lead Scoring Algorithm
Every candidate receives an explainable 0–100 score:
- **Core Trade Alignment:** +25 points (HVAC, Plumbing, Electrical).
- **Direct Phone Verification:** +15 points (E.164 normalized format).
- **Active Web Presence:** +10 points (Verified website / domain MX records).
- **Review Volume & Fleet Signals:** Up to +30 points.
- **Classification Tiers:**
  - **Tier A (85–100):** Immediate high-priority personalized multi-channel outreach.
  - **Tier B (70–84):** Standard automated drip sequence.
  - **Tier C (<70):** Nurture list / free scanner retargeting.
