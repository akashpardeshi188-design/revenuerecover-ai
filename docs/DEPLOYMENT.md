# RevenueRecover AI — Environment Setup & Deployment Guide

## 1. Environment Variables (.env.local)

```bash
# App Configuration
NEXT_PUBLIC_APP_URL="https://revenuerecover-ai.vercel.app"
DISCOVERY_DRY_RUN="true" # Set to false in production

# AI Providers
GEMINI_API_KEY="AIzaSy..."

# Discovery Source API Keys (Optional - System uses deterministic fixtures if keys are absent)
GOOGLE_MAPS_API_KEY=""
YELP_API_KEY=""
FOURSQUARE_API_KEY=""
UK_COMPANIES_HOUSE_API_KEY=""

# Payments
PAYPAL_MODE="live"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="BAAPGFKrr_..."
PAYPAL_CLIENT_SECRET="EI2SgRc_..."

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/revenuerecover?schema=public"
```

## 2. Deployment Steps

```bash
# 1. Install dependencies
npm install

# 2. Run Test Suite
node scripts/test-discovery-engine.mjs

# 3. Compile Production Next.js Build
npm run build

# 4. Deploy to Vercel
git push origin main
```
