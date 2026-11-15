# Data integration plan

## Status key

- **Implemented in prototype:** fictional records and local calculations only.
- **Assumption to validate:** a plausible source category, not a verified CloudEagle capability or confirmed API contract.
- **Proposed:** a future integration or workflow, subject to vendor permissions and customer requirements.

No live API connections are implemented in this repository.

| Product data | Potential source | Status and limitation |
|---|---|---|
| Tool catalog, provider, billing type, owner, tool limit | SaaS catalog, procurement, provider admin reports | Assumption to validate. Coverage and owner fields vary by source. |
| Subscription spend and renewal | Invoice, procurement, contract, or SaaS billing exports | Proposed. Normalize currency, billing period, credits, and committed seats before comparing. |
| API spend and request/token totals | Provider usage or billing exports | Assumption to validate per provider and plan. Some records may include cost but not user, model, or request detail. |
| Department membership | Identity groups or customer-maintained department mapping | Proposed. Use aggregate department attribution; do not ingest browsing history. Shared identities and missing groups remain unattributed. |
| Organization, department, and tool budgets | Finance-approved budget records and local policy configuration | Implemented only as fictional/local values. Production source and ownership need validation. |
| Temporary exception request and decision | Product workflow with approver identity, comments, timestamps, and expiry | Prototype uses in-memory mock state. Durable storage, authorization, notifications, and audit retention are not implemented. |
| Subscription activity and idle seats | Provider license reports, when available | Assumption to validate. “Idle” depends on the provider’s activity definition and observation window. |
| Shadow AI discovery | SSO/app catalog or optional security signals | Proposed signal only. Discovery does not prove an account, user intent, or policy violation. |

## Metric definitions

- **Subscription spend:** sample fixed subscription charge for the selected period.
- **API spend:** sample consumption cost. It stays separate from subscription charges.
- **Unattributed spend:** measurable cost records without a department owner; never allocated across teams by estimate.
- **Department attribution coverage:** attributed measurable spend ÷ all measurable spend.
- **Run-rate estimate:** spend-to-date ÷ elapsed budget-cycle days × total days in cycle, shown only after day 7. It is a simple estimate, not a forecast or invoice amount.
- **Idle assigned seat:** an assigned license without activity observed in the sample 90-day window. Vendor definitions and recency vary; validate before using for reclamation.

## Known limitations to validate

- Availability of department attribution, model-level usage, API keys, and user-level fields varies by provider and contract.
- Shared API keys and personal AI accounts may not map to a department.
- A reporting API does not imply an enforcement API. Do not represent an alert as a provider-side block.
- Subscription charges and API usage can overlap in some billing exports; reconciliation must prevent double counting.
- Source health must carry last-successful-sync time and affected fields. Failed or missing data must show “Unavailable,” not zero.
