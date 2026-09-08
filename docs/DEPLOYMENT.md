# Deployment & Hosting Architecture

## 1. Hosting Environment
- **Platform:** Vercel Edge Network (`vercel.json`)
- **Node Runtime:** Node.js 20+ / Next.js 16.3 App Router with Turbopack.
- **Database:** Managed PostgreSQL (Supabase / Neon / AWS RDS).

## 2. Production Checklist
1. Verify all 13 categories of `.env.example` are set in Vercel project settings.
2. Confirm `DISCOVERY_DRY_RUN="false"` only when live carrier SMS credentials (Twilio) and PayPal live client keys are verified.
3. Verify PayPal REST webhook endpoint (`/api/checkout/paypal/capture-order`) is registered in the PayPal Developer Dashboard.
4. Set daily cron triggers via Vercel Cron or GitHub Actions against `/api/growth/cron`.
