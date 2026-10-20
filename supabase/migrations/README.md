# Supabase migrations

The migration files in this folder are database changes applied to RevenueRecover AI staging on 2026-10-20.

- `20261020033053_017_paypal_recurring_billing_secure.sql`
- `20261020033358_018_prevent_duplicate_paypal_subscriptions_and_cancel.sql`
- `20261020033838_019_paypal_billing_status_guardrails.sql`

**Important:** The repository was missing migration scripts 001–016 before this branch. These three delta migrations assume the previously created tables, types, helper functions, and row-level security policies already exist. This is not yet a complete fresh-database migration chain. Do not use `supabase db reset` or push this folder into a blank database until the missing baseline migration history has been reconstructed and tested.
