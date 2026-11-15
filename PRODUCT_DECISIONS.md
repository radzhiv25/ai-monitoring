# Product decisions — CloudEagle.ai AI Governance prototype

## Product goal

P0 and P1 prototype scope is implemented. P2 remains deferred for a later review.

Help finance, IT, and security stakeholders answer three questions quickly: which AI tools are in use, what the organization spends, and what deserves a human review. The dashboard follows a Visibility → Insight → Action sequence. It extends the existing SaaS management and governance experience instead of introducing a separate product concept.

## Entry experience and information architecture

| Decision | User problem | Why it was chosen | Assumptions and trade-offs |
|---|---|---|---|
| Open the assignment brief before the dashboard | A reviewer needs to understand the prototype and what it answers before interpreting sample metrics | The opening page explains the problem, data plan, three chart choices, and scope, then provides a direct dashboard CTA | Adds one navigation step for returning users; the dashboard remains one click away and is directly addressable with `#dashboard` |
| Organize UI by responsibility (`layout`, `overview`, `governance`, `shared`, `documentation`) | A monolithic component is hard to reason about and extend | Small feature components keep navigation, filters, analysis, help, and documentation focused | The main dashboard component still coordinates shared demo state; a future production implementation can move that state into domain hooks as live data contracts become known |
| Use a custom keyboard-operable select control | Browser-native select styling is inconsistent with the rest of the interface | A reusable listbox gives the month and filters one visual treatment and keyboard behavior | It supports the needed local option lists; a production app with richer selection behavior should adopt an established accessible primitive such as Radix UI |
| Keep the CloudEagle workspace name in the organization switcher | The demo should speak to the assignment context without repeating the company name in a separate top-level wordmark | Workspace context is visible where an organization is selected, leaving the compact app mark for product navigation | CloudEagle is a presentation label; no CloudEagle systems are connected |
| Offer quick overview and detailed analysis modes | Executives need a short scan while IT, finance, and security analysts need supporting detail | Quick view keeps four KPIs, two core charts, and the five highest-spend tools; detailed view reveals telemetry, ranked spend, full inventory, models, licenses, anomaly signals, alerts, and integration health | Default to quick overview so first-time users get a plain-language summary; detail remains one click away. Tour switches to detailed view to ensure its stops are visible |
| Show recognizable provider logos with initials fallback | Familiar marks help people scan a mixed vendor inventory | Use Simple Icons brand SVGs for supported providers, with provider names retained beside each logo | Logo requests use the public Simple Icons CDN and may be unavailable offline; the initials fallback avoids a broken or unlabeled image |

## P0 decisions

| Decision | User problem | Why it is in P0 | Assumptions and data dependencies | Trade-off / excluded scope |
|---|---|---|---|---|
| Keep four overview KPIs: AI spend, active people, connected tools, and alerts | Stakeholders need a fast read on cost, adoption, inventory, and governance work | These directly answer the assignment’s core visibility questions and preserve existing working UI | The demo has monthly provider/tool spend, organization and tool budgets, estimated active-user counts, and review statuses | Potential savings is not shown as a headline KPI yet; without license activity or comparable pricing evidence, a savings figure would be speculative |
| Show spend against a budget over time | A CFO or administrator needs to see whether spend is within the allowance | Budget visibility is the primary cost-control task | Tool spend is the source of monthly spend; budget is a separate configured value; weekly bars are a synthetic allocation of the selected month | Projection is labeled as an estimate. It is not an invoice forecast. Subscription and API charges remain identifiable by tool type |
| Let the department chart switch between active people, tokens, and spend | Department managers need to see where adoption and consumption originate | One chart can answer several related questions without adding three separate panels | Active people are unique at organization level in the demo. API tokens are only available for three sample API providers. Tool spend is attributed to the tool’s owning department | Usage metrics are not interchangeable. The UI labels the selected measure and separates people, requests, and tokens |
| Add spend by tool/provider | A user needs to find the product driving the bill and inspect its owner and limit | It makes the overview actionable and fits the existing inventory | Each demo tool has a provider, type, owning team, spend, monthly cap, and governance status | Model-level breakdown is deferred to P1 to keep the first implementation focused on tool/provider cost drivers |
| Add tool search, sorting, detail drawer, and simulated governance review | Administrators need to investigate a tool without leaving the overview | These are the core drill-downs for an unapproved tool and spend-limit review | Mock inventory rows have owner team, provider, status, billing type, and renewal details | Approve/flag actions only update local demo state. They do not change provider access or notify employees |
| Add sample policy/usage alert details and follow-up state | Security needs a reason and a recommended next step, not only a red count | An alert list supports investigation and makes the screen actionable | Synthetic alerts include severity, department, change, baseline, related tool, and recommendation | Anomaly examples are signals for investigation, not proof of malicious activity. Baselines are illustrative |
| Add search for tools and employees | Users need to locate an asset or person quickly in a larger inventory | Search prevents a long inventory from becoming a passive report | Demo people include name, department, role, tools, active days, and associated sample spend | Only a small set of fictional employee records is present; this does not represent full workforce coverage |
| Add a normalized mock-data service | Provider formats and coverage will differ when integrations are introduced | Separating calculation from presentation keeps future connectors manageable | The service consumes typed mock records and produces filtered summaries for the UI | No network requests, credentials, live provider actions, or real employee data are used |
| Add department budget review in a local dialog | An overspend signal should provide a next step | It demonstrates the review workflow for the assignment | Department budgets are separate from observed spend and can be locally edited | Saving changes the prototype session only; it does not update a finance platform |

## P1 implementation decisions

| Capability | Product choice and user problem | Assumptions and dependencies | Trade-off / guardrail |
|---|---|---|---|
| Model analytics | Add GPT-4o, GPT-5, Claude Sonnet, Claude Opus, and Gemini Pro with requests, input/output tokens, cost, average cost per request, and share. Switch the visual between usage and spend. | Model cost and token records roll up exactly to the API tool records; subscription fees remain separate. | Only models with sample telemetry appear. Missing model reporting is shown as unavailable, not zero. |
| License utilization | Report purchased, assigned, active, inactive-assigned, and unassigned seats; open per-license details and mark seats for a local reclamation review. | Sample license catalog includes per-seat costs and observed activity. | Potential savings is the monthly value of assigned inactive seats, not a guaranteed reduction. No seats are actually reclaimed. |
| Usage anomalies | Compare provider API request volume with the previous month and one employee’s tokens with a personal baseline; show severity, baseline, department, and investigation recommendation. | Baseline and current telemetry are fictional sample records. | Anomaly cards say “investigate”; they do not claim malicious activity or a policy violation. |
| Integration health | Show sample source status, last sync, field coverage, and affected data types; delayed and partial sources are visible. | Sample sync metadata is attached to provider, identity, and finance sources. | No integration is connected. Stale or incomplete data must not appear fully current. |

## P2 candidates

- AI agents, service accounts, API keys, internal apps, and MCP-connected identities.
- Owner assignment, permission review, and revocation workflow simulations.
- More advanced savings recommendations and reporting.

## Data assumptions and dependencies

- AI vendor admin/usage and cost endpoints; provider may expose only aggregate usage or may not expose employee attribution.
- Identity/SSO directories to map accounts to people and departments.
- Finance/procurement data for invoices, subscriptions, and approved budgets.
- Security discovery signals for tools that do not appear in vendor admin consoles.
- Timestamps and sync metadata so stale/incomplete data can be labeled rather than shown as current.

Provider usage records should preserve provider, model, timestamp, employee/team attribution when available, request count, input tokens, output tokens, and cost source. Subscription/licence charges and API consumption should stay separate to prevent double-counting. Missing attribution or usage data should be represented as unavailable, not zero.

## MVP exclusions

- Live provider or finance integrations and all credential handling.
- Automated access restriction, budget changes in external systems, or employee notifications.
- Production-grade anomaly detection or claims that an alert is a policy violation.
- Live license reclamation, agent governance, external permission changes, and production-grade optimization recommendations.

## Success criteria for the prototype

A stakeholder can identify the selected period’s total spend and remaining budget, compare team activity by people/tokens/spend, locate the highest-cost tools/providers, search for an employee or tool, inspect an alert’s basis and next step, and distinguish demo data from live data.
