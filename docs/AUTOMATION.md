# RevenueRecover AI — Event Automation Architecture

## Event Engine Specifications

```
  Inbound Event (Missed Call / Web Form)
                │
                ▼
      [AutomationEngine.publish()]
                │
    ┌───────────┼───────────┬───────────┐
    ▼           ▼           ▼           ▼
 AI Intent   Deduplicate   Match Tech  Send SMS
  Scorer     into Master    by Geo    Text-Back
 (Gemini)    Opportunity   Radius     (45-sec)
```

## Supported Event Triggers

1. **`lead.created`**: Ingests new lead and initiates AI intent scoring.
2. **`lead.hot`**: Triggers high-priority push notification and immediate SMS alert to on-duty technician.
3. **`missed_call.detected`**: Runs compliance guard -> generates personalized text -> dispatches 45-second recovery message.
4. **`booking.created`**: Syncs appointment with ServiceTitan / Housecall Pro CRM webhooks.
