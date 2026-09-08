# Analytics, Attribution & Economic Models

## 1. Unit Economics
- **Pricing:**
  - Starter: $59/mo (Solo contractors, 50 local leads)
  - Growth: $119/mo (Full recovery suite + 150-200 local leads)
  - Pro Annual VIP: $990/yr ($82.50/mo annualized)
- **Blended CAC Benchmark:** $142 (Organic discovery + AI SDR outreach).
- **Average Customer Retention (LTV):** 14 months = ~$1,666 LTV on Growth plan.
- **LTV / CAC Ratio:** 11.7x.

## 2. Real-Time Token Cost Accounting (`lib/ai/provider.ts`)
Every AI completion tracks:
- Provider (`gemini`, `openai`, `anthropic`, `deterministic_fallback`)
- Model name
- Input & output token count
- Exact USD cost calculated per token
- Historical cost logs saved to database / persistent storage.
