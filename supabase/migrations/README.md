# Supabase migrations

The migration files in this folder are database changes applied to RevenueRecover AI staging on 2026-10-20.

- `20261020033053_017_paypal_recurring_billing_secure.sql`
- `20261020033358_018_prevent_duplicate_paypal_subscriptions_and_cancel.sql`
- `20261020033838_019_paypal_billing_status_guardrails.sql`

A follow-up remediation file has been prepared but **not applied** to staging:

- `20261020050500_020_enable_rls_on_private_paypal_webhook_events.sql` — enables RLS on the internal PayPal webhook event log. Before applying, re-check the staging security/performance advisors; the server-owned webhook processor remains able to write because the function/table owner bypasses RLS. Anonymous and authenticated table grants should remain absent.

**Important:** The repository was missing migration scripts 001–016 before this branch. These three delta migrations assume the previously created tables, types, helper functions, and row-level security policies already exist. This is not yet a complete fresh-database migration chain. Do not use `supabase db reset` or push this folder into a blank database until the missing baseline migration history has been reconstructed and tested.
