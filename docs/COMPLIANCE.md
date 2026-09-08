# Compliance-by-Design Architecture

## 1. Regulatory Frameworks Enforced

### TCPA & 10DLC Regulations (USA)
- **Implied Inquiry Basis:** Automated text-backs are only triggered in response to an inbound customer call or direct lead form submission.
- **Quiet Hours Enforcement:** No automated SMS or voice drops dispatched before 8:00 AM or after 8:00 PM recipient local time.
- **Opt-Out Handling:** Any reply containing `STOP`, `UNSUBSCRIBE`, `CANCEL`, or `REMOVE` immediately revokes consent, updates the CRM, and adds the contact to the permanent suppression list.

### CAN-SPAM Act (USA)
- Clear, non-deceptive subject lines and sender identification (`outreach@revenuerecover.ai`).
- Physical postal address and 1-click unsubscribe link included in every outbound marketing email.

### GDPR & UK GDPR (UK & Europe)
- B2B Legitimate Interest justification documented for public business directories.
- Right to erasure (Right to be Forgotten) honored via automated suppression and data purging.
