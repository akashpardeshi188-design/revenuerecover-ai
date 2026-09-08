# Testing & QA Verification Architecture

## 1. QA Smoke Test Suite (`QAAgent`)
The QA Agent continuously executes automated test suites validating critical business workflows:

1. **Lead Discovery & E.164 Normalization:** Tests parsing of international and US phone numbers.
2. **Explainable Revenue Leak Scoring:** Asserts 0–100 ICP bounds and accurate job ticket multipliers.
3. **TCPA Quiet Hours & Suppression Guard:** Confirms that contacts marked `SUPPRESSED` or contacted during quiet hours are blocked.
4. **12 Objection Playbook Classification:** Validates correct classification and rebuttal generation for all 12 objections.
5. **PayPal USD Order Capture Simulation:** Asserts correct handling of Starter ($59), Growth ($119), and Pro Annual ($990).
6. **Post-Payment Account Provisioning:** Verifies organization creation and ingestion of 150 local leads.
7. **Emergency Autopilot Kill-Switch:** Asserts that setting `GLOBAL_KILL_SWITCH="true"` halts all outbound communication.

## 2. Running Verification Tests
Execute automated tests using the QA Agent API:
```bash
curl -X GET http://localhost:3000/api/growth/agents
```
