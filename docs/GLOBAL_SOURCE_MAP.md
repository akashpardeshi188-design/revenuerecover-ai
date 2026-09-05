# RevenueRecover AI — Global Source Map

## Overview
This document catalogs all evaluated business discovery and lead capture sources across our primary markets (USA, UK, Canada, Australia, India).

---

## Source Matrix

| Source ID | Source Name | Primary Market | Access Type | Rate Limit | Primary Data Fields | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `src_google_places` | Google Places & Maps API | GLOBAL (USA/UK/CA) | Official API Key | 600 req/min | Business Name, Phone (E.164), Website, Formatted Address, Rating, Reviews, Operating Hours | **CONNECTED** |
| `src_yelp_fusion` | Yelp Fusion API | USA / Canada / UK | Official API Key | 300 req/min | Trade Categories, Business URL, Phone, Rating, Review Count, Geo Coordinates | **CONNECTED** |
| `src_foursquare_places` | Foursquare Places API | GLOBAL | Official API Key | 500 req/min | Venue Name, Telephone, Website, Geocodes, Categories | **CONNECTED** |
| `src_osm_overpass` | OpenStreetMap Overpass | GLOBAL | Public (ODbL) | 60 req/min | Craft Tags, Street Address, City, Postal Code, Phone | **CONNECTED** |
| `src_uk_companies_house` | UK Companies House API | GBR (United Kingdom) | Official Basic Auth | 600 req/min | Registered Corporate Name, Number, Registered Office, SIC Trade Code | **CONNECTED** |
| `src_canada_corporate` | Canada Corporations Registry | CAN (Canada) | Official API Key | 120 req/min | Corporate Name, Corporation Number, Registered Address | **CONNECTED** |
| `src_inbound_missed_calls` | Inbound Missed Call Webhook | GLOBAL | Webhook (JWT) | 1,000 req/min | Caller Phone, Contractor ID, Call Duration, City, State | **CONNECTED** |
| `src_inbound_web_forms` | Inbound Web Form Ingestor | GLOBAL | REST API | 1,000 req/min | Customer Name, Phone, Email, Service Requested, Postal Code | **CONNECTED** |
| `src_angi_lead_hub` | Angi / HomeAdvisor | USA | Commercial Partner | N/A | Proprietary Directory (No Public API) | **PARTNER_ONLY** |
| `src_thumbtack_pro` | Thumbtack Pro Network | USA | Commercial Partner | N/A | Closed Marketplace | **PARTNER_ONLY** |
| `src_checkatrade_uk` | Checkatrade UK | GBR | Commercial Partner | N/A | Closed Directory | **PARTNER_ONLY** |

---

## Access & Governance Rules
1. **Zero Web Scraping of Prohibited Directories:** Sources marked `PARTNER_ONLY` or `NOT_SUPPORTED` are never scraped. We only interface via official API keys or explicit data partnerships.
2. **Data Retention:** Raw discovery payloads are retained for 30 days and refreshed continuously to guarantee operational accuracy.
