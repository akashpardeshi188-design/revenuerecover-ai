# RevenueRecover AI — Production Deployment & Cloud Guide

This guide walks through deploying the **RevenueRecover AI & Growth Engine** ecosystem to production on **Vercel**, **Cloudflare**, or **Render/Railway**.

---

## 1. Quick Deploy on Vercel (Recommended)

Vercel provides zero-config hosting for Next.js App Router with edge caching and serverless API execution.

### Method A: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project root
cd C:\Users\Lenovo\.gemini\antigravity\scratch\revenuerecover-ai-ecosystem

# 3. Deploy
vercel --prod
```

### Method B: Deploy via GitHub & Vercel Dashboard
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete RevenueRecover AI & Growth Engine ecosystem"
   git branch -M main
   git remote add origin https://github.com/your-username/revenuerecover-ai.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add the keys from `.env.example`.
4. Click **Deploy**.

---

## 2. Environment Variables Checklist for Cloud Deployment

Add these variables in your hosting provider's **Environment Variables** dashboard:

| Variable | Description | Example / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Live production domain | `https://revenuerecover.ai` |
| `GEMINI_API_KEY` | Google Gemini Generative AI Key | Free from [AI Studio](https://aistudio.google.com) |
| `OPENAI_API_KEY` | OpenAI API Key (Optional) | `sk-proj-...` |
| `ANTHROPIC_API_KEY` | Anthropic Claude Key (Optional) | `sk-ant-...` |
| `STRIPE_SECRET_KEY` | Stripe Production Secret Key | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Public Key | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` |
| `TWILIO_ACCOUNT_SID` | Twilio SMS Account SID | `AC...` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | `...` |
| `TWILIO_PHONE_NUMBER` | 10DLC Registered Number | `+15550192345` |
| `DATABASE_URL` | PostgreSQL Database URL | Supabase / Neon / AWS RDS |

> [!NOTE]
> If any API keys are omitted, the system continues running automatically on the **Deterministic Simulation Engine** without throwing errors.

---

## 3. Stripe Production Webhook Configuration

1. In your [Stripe Dashboard](https://dashboard.stripe.com/webhooks), click **Add Endpoint**.
2. Set Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing Secret** (`whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET`.

---

## 4. Custom Domain & DNS Setup

1. In Vercel Project Settings > **Domains**, add your custom domain (e.g. `revenuerecover.ai` or `app.revenuerecover.ai`).
2. Add the provided `CNAME` or `A` records in your DNS registrar (Cloudflare, GoDaddy, Namecheap).
3. SSL certificate will be automatically provisioned within 60 seconds.

---

## 5. Production Health Check

Verify your deployment status at any time:
```bash
curl https://your-domain.com/api/health
```
Output:
```json
{
  "status": "healthy",
  "environment": "production",
  "activeAgents": ["RevenueRecoveryAgent", "LeadGenerationAgent", ...],
  "totalAgentActionsExecuted": 142
}
```
