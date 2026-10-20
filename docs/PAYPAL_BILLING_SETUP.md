# PayPal recurring subscription setup

## Preview setup required before an end-to-end test

Configure the following variables for the **Preview** deployment only first:

- `PAYPAL_MODE=sandbox`
- `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` from the PayPal sandbox REST app
- `PAYPAL_PLAN_ID_STARTER`, `PAYPAL_PLAN_ID_GROWTH`, `PAYPAL_PLAN_ID_REVENUE_PARTNER` — each must be an **active USD monthly plan** priced at the matching staging price
- `PAYPAL_WEBHOOK_ID` — the webhook ID registered for the Preview listener
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for the Supabase staging project
- `SUPABASE_SERVICE_ROLE_KEY` for staging, stored as a server-only encrypted variable and **never** prefixed with `NEXT_PUBLIC_`
- `APP_BASE_URL` if the default Preview hostname is not the correct return URL

The default prices in the staging database are Starter **$497/month**, Growth **$997/month**, and Revenue Partner **$1,997/month**. The server reads the current plan quote from the staging database and checks the PayPal plan's status, monthly billing cycle, currency, and fixed amount before it creates a subscription. If these do not match, checkout is rejected.

PayPal plan creation and access permissions must be completed in the PayPal account before testing. PayPal's official API uses the plan ID when creating a subscription. See [PayPal subscriptions](https://developer.paypal.com/platforms/subscriptions/) and [Subscriptions REST API](https://developer.paypal.com/api/subscriptions/v1).

## Webhook configuration

Register the listener:

`https://YOUR_PREVIEW_HOST/api/webhooks/paypal`

Subscribe the PayPal app to these events:

- `BILLING.SUBSCRIPTION.CREATED`
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.UPDATED`
- `BILLING.SUBSCRIPTION.RE-ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.EXPIRED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
- `PAYMENT.SALE.COMPLETED`
- `PAYMENT.SALE.REFUNDED`
- `PAYMENT.SALE.REVERSED`

The route sends the original event body to PayPal's webhook signature verification API. Only a successful verification is processed; event IDs are stored for duplicate protection. The route requires the correct `PAYPAL_WEBHOOK_ID` for that sandbox/live app. See [PayPal webhook verification](https://developer.paypal.com/api/rest/webhooks/rest/).

## Payment and tenant guarantees implemented

- Checkout accepts only a fixed plan key and a UUID checkout idempotency key; clients cannot submit a price or company ID.
- Company ownership is derived from the authenticated Supabase profile; onboarding must be complete.
- A subscription is linked through a service-role-only RPC, not a client-writable table.
- Webhook event persistence and subscription/payment changes happen in a database transaction.
- The database rejects duplicate event IDs and protects against multiple live PayPal subscriptions per company.
- Cancellation first calls PayPal, then updates the company-scoped row through a service-role-only RPC.

## Testing still required

1. Add sandbox plan IDs and webhook ID to Preview environment variables.
2. Sign up with a test mailbox and complete onboarding.
3. Approve each plan in PayPal sandbox; verify one subscription row and a `PAYMENT.SALE.COMPLETED` payment row appear for the same company.
4. Re-send a webhook event and confirm it is marked duplicate with no duplicate payment record.
5. Test cancellation and confirm both PayPal and the billing page show canceled.
6. Test two different companies and make sure neither can read or mutate the other's billing.
7. Only after all Preview checks pass, prepare a separate production cutover with real plan IDs and production webhook ID.

## Migration repository limitation

The existing repository did not previously contain `supabase/migrations`. This branch records migrations 017 and 018, which were applied to the **staging** project, but migration scripts 001–016 still need to be recovered/synced. Do not reset a database or run a fresh-database migration sequence from this folder until the earlier baseline migrations have been added and reviewed.
