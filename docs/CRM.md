# 15-Stage Relational CRM Engine

## Lifecycle State Machine

```
[ NEW ] ──> [ VERIFIED ] ──> [ QUALIFIED ] ──> [ CONTACTED ] ──> [ ENGAGED ]
                                                                       │
                                                                       ▼
[ DEMO COMPLETED ] <── [ DEMO BOOKED ] <── [ SALES_QUALIFIED ] <───────┘
        │
        ▼
[ TRIAL ] ──> [ PAYMENT_PENDING ] ──> [ CUSTOMER ] ──> [ ACTIVATED ]
                                                              │
                                                              ▼
[ CHURNED ] <─────────────────────────────────── [ RETENTION / EXPANSION ]
```

### Stage Definitions & Audit Rules
- Every transition creates an immutable `StageTransitionLog` entry with `fromStage`, `toStage`, `reason`, `actor`, and `timestamp`.
- Outreach drip sequences are automatically suppressed upon reaching `SALES_QUALIFIED`, `DEMO_BOOKED`, `TRIAL`, or `CUSTOMER`.
- Reaching `CUSTOMER` triggers the Onboarding Agent to provision the tenant organization and deliver 150 local leads.
