# Product decisions — CloudEagle.ai AI Governance prototype

## Product goal

The IT lead who owns the AI program is the primary user; finance gets a summary view. The dashboard answers which tools are in use, what they cost against limits, and what needs a human decision. Assumed: this extends the existing CloudEagle experience; to be validated with the team.

## Entry experience and information architecture

| Decision | User problem | Why it was chosen | Assumptions and trade-offs |
|---|---|---|---|
| Open the governance workspace first; keep the case study at `#case-study` | An IT owner needs to act on budgets before reading product rationale | The dashboard is the operational entry; case-study material is separated from customer-facing copy | The prototype has no authentication or real tenant routing |
| Organize UI by responsibility (`layout`, `overview`, `governance`, `shared`, `documentation`) | A monolithic component is hard to reason about and extend | Small feature components keep navigation, filters, analysis, help, and documentation focused | The main dashboard component still coordinates shared demo state; a future production implementation can move that state into domain hooks as live data contracts become known |
| Use a custom keyboard-operable select control | Browser-native select styling is inconsistent with the rest of the interface | A reusable listbox gives the month and filters one visual treatment and keyboard behavior | It supports the needed local option lists; a production app with richer selection behavior should adopt an established accessible primitive such as Radix UI |
| Keep the CloudEagle workspace name in the organization switcher | The demo should speak to the CloudEagle workspace context without repeating the company name in a separate top-level wordmark | Workspace context is visible where an organization is selected, leaving the compact app mark for product navigation | CloudEagle is a presentation label; no CloudEagle systems are connected |
| Offer quick overview and detailed analysis modes | Executives need a short scan while IT, finance, and security analysts need supporting detail | Quick view keeps four KPIs and the three decision charts; detailed view reveals telemetry, full inventory, models, licenses, anomaly signals, alerts, and integration health | Detailed mode is a progressive disclosure layer, not a separate permission role |
| Show recognizable provider logos with initials fallback | Familiar marks help people scan a mixed vendor inventory | Use the ChatGPT knot mark for OpenAI, with Simple Icons for other supported providers and provider names beside each mark | Logo assets load from public CDNs and may be unavailable offline; an initials fallback prevents broken or unlabeled images |

## P0 decisions

| Decision | User problem | Why it is in P0 | Assumptions and data dependencies | Trade-off / excluded scope |
|---|---|---|---|---|
| Show spend vs budget, departments approaching their limit, pending approvals, and idle assigned seats in Quick overview; move active people and connected tools to Detailed analysis | Stakeholders need an immediate view of financial exposure and work that needs action | These values surface budget position, near-limit departments, requests awaiting a decision, and unused assigned licenses | Budget and usage values come from fictional provider, department, approval, and license records | The summary foregrounds cost and exceptions; broader adoption and inventory counts require opening Detailed analysis |
| Show spend against a budget over time | A CFO or administrator needs to see whether spend is within the allowance | Budget visibility is the primary cost-control task | Tool spend is the source of monthly spend; budget is a separate configured value; weekly bars are a synthetic allocation of the selected month | The run-rate estimate is labeled and calculated from spend-to-date ÷ elapsed cycle days × cycle days only after day 7. It is not an invoice forecast. Subscription and API charges remain identifiable by tool type |
| Delay the run-rate estimate until after day 7 | A ratio based on only a few early-cycle days swings sharply and can prompt unnecessary action | The estimate uses sample spend-to-date divided by elapsed cycle days, multiplied by days in cycle | This seven-day rule is an illustrative noise guard, not a guarantee of forecast quality |
| Show department spend split by subscription and API, with Unattributed separate | IT needs to move budget without disguising costs that lack an owner | A stacked comparison preserves the cost type and keeps gaps visible | Unattributed share is computed from tool ownership in the sample catalog; current coverage is illustrative | Active people and tokens remain selectable supporting measures; they are not treated as productivity |
| Compare tool spend with its individual cap and show remaining allocation | A budget owner needs to see which product is nearing its own limit | Paired bars and the inventory status show the cap and remaining amount | Tool spend and caps are separate from department budget totals | Tool and department limits can conflict; resolving both remains an IT or Finance decision |
| Add tool search, sorting, detail drawer, and simulated governance review | Administrators need to investigate a tool without leaving the overview | These are the core drill-downs for an unapproved tool and spend-limit review | Mock inventory rows have owner team, provider, status, billing type, and renewal details | Approve/flag actions only update local demo state. They do not change provider access or notify employees |
| Add sample policy/usage alert details and follow-up state | Security needs a reason and a recommended next step, not only a red count | An alert list supports investigation and makes the screen actionable | Synthetic alerts include severity, department, change, baseline, related tool, and recommendation | Anomaly examples are signals for investigation, not proof of malicious activity. Baselines are illustrative |
| Search tools and departments, not individual activity | Administrators need to find a product or team quickly | Search supports budget review without exposing personal activity | Team attribution uses the sample owner mapping | Browsing history and individual usage timelines are intentionally excluded |
| Add a normalized mock-data service | Provider formats and coverage will differ when integrations are introduced | Separating calculation from presentation keeps future connectors manageable | The service consumes typed mock records and produces filtered summaries for the UI | No network requests, credentials, live provider actions, or real employee data are used |
| Add department budget review in a local dialog | An overspend signal should provide a next step | It demonstrates the review workflow | Department budgets are separate from observed spend and can be locally edited | Saving changes the prototype session only; it does not update a finance platform |

## P1 implementation decisions

| Capability | Product choice and user problem | Assumptions and dependencies | Trade-off / guardrail |
|---|---|---|---|
| Model analytics | Add GPT-4o, GPT-5, Claude Sonnet, Claude Opus, and Gemini Pro with requests, input/output tokens, cost, average cost per request, and share. Switch the visual between usage and spend. | Model-level sample records are available for some API usage; subscription fees remain separate. | Model totals do not reconcile to every API tool: some spend is known while model/request/token detail is unavailable. Missing telemetry is shown as unavailable, not zero. |
| License utilization | Report purchased, assigned, active, inactive-assigned, and unassigned seats; open per-license details and mark seats for a local reclamation review. | Sample license catalog includes per-seat costs and observed activity. | Potential savings is the monthly value of assigned inactive seats, not a guaranteed reduction. No seats are actually reclaimed. |
| Usage anomalies | Compare provider API request volume with the previous month; show severity, baseline, department, and investigation recommendation. | Baseline and current telemetry are fictional sample records. | Anomaly cards say “investigate”; they do not claim malicious activity or a policy violation. Individual usage baselines are not shown. |
| Integration health | Show sample source status, last sync, field coverage, and affected data types; delayed and partial sources are visible. | Sample sync metadata is attached to provider, identity, and finance sources. | No integration is connected. Stale or incomplete data must not appear fully current. |

## Budget exception workflow

| Decision | Product behavior | Assumption | Trade-off |
|---|---|---|---|
| Route requests by a configurable amount threshold | Requests at or below the threshold go to a department lead; larger requests go to IT or Finance | The organization can identify an approver by department and amount | The prototype shows a role label rather than integrating a directory or workflow service |
| Keep temporary exceptions separate from base limits | Approval creates a separately listed allocation with approver, decision note, and expiry | The selected cycle end is the default expiry | The exception is shown in the request view; it never silently changes tool, department, or organization budgets |
| Keep tool and department limits independent | Tool limit review displays the owning department’s budget alongside it; a simultaneous breach is surfaced as a conflict for IT or Finance | The organization has a named owner for each department and tool where possible | No automatic cascade or enforcement is proposed; providers may not support enforcement |
| Record actions in a local activity log | Request, approval, rejection, cancellation, and expiry have an actor, resource, timestamp, and note | The prototype session is the audit boundary | Records reset when the page reloads; production needs durable, permissioned audit storage |

## P2 candidates

- AI agents, service accounts, API keys, internal apps, and MCP-connected identities.
- Owner setup, permission review, and revocation workflow simulations.
- More advanced savings recommendations and reporting.

## Data assumptions and dependencies

- AI vendor admin/usage and cost endpoints; provider may expose only aggregate usage or may not expose employee attribution.
- Identity/SSO directories to map approved group membership to departments; the UI exposes aggregated team views.
- Finance/procurement data for invoices, subscriptions, and approved budgets.
- Security discovery signals for tools that do not appear in vendor admin consoles.
- Timestamps and sync metadata so stale/incomplete data can be labeled rather than shown as current.

Provider usage records should preserve provider, model, timestamp, department attribution when available, request count, input tokens, output tokens, and cost source. Subscription/licence charges and API consumption should stay separate to prevent double-counting. Missing attribution or usage data should be represented as unavailable, not zero.

## MVP exclusions

- Live provider or finance integrations and all credential handling.
- Automated access restriction, budget changes in external systems, or employee notifications.
- Production-grade anomaly detection or claims that an alert is a policy violation.
- Browsing history, individual usage timelines, or employee surveillance.
- Live license reclamation, agent governance, external permission changes, and production-grade optimization recommendations.

## Success criteria for the prototype

A stakeholder can identify the selected period’s spend and remaining budget, compare department costs, locate high-cost tools, review an exception, and distinguish demo data from live data.

## Decision log

- Replaced the old generic UI-description copy with a product proposal centered on the IT lead, limits, exceptions, data coverage, and decisions.
- Added a decision and trade-off table, a chart choice and trade-off table, and a success-metric table. The cost column is visually distinct; mobile layouts show the same information as stacked cards.
- Success metrics are proposed hypotheses for design-partner validation, not measured facts. CloudEagle capability statements are marked as assumptions.
- Kept the section-chip navigation, fictional sample-data note, and Open the dashboard action. User stories are collapsed by default.
- The governance workspace is the default entry; the case study is separated at `#case-study`.
- Budget requests now have a dedicated history, review comments, decision metadata, separate temporary allocations, expiry actions, and a local activity log. This remains sample-only state.
- The three primary charts compare spend with budget, split department spend by subscription/API, and compare tool spend with tool limits. Run-rate is calculated only after seven elapsed days and labeled as an estimate.
- 80%, 90%, and 100% are configurable threshold defaults. Alerting does not imply provider-side blocking.
- OpenRouter is a sample tool with unattributed spend and unavailable request/token telemetry; that spend remains separate and is not assigned to a team.
- A simultaneous tool and department limit breach is shown as a conflict; changing either allocation does not silently change the other or the organization budget.
- No real provider integrations, financial updates, or employee notifications were added.
- Aligned the latest sample source-sync timestamp to cycle day 21; alert, request-submission/decision, and activity timestamps are no later than that day. Nov 30 expiry dates remain cycle-end deadlines.
- Labeled the KPI comparison as “vs full [month]” because the sample cannot support a same-day prior-month comparison.
- Made the data-health status link to Detailed analysis, where source-level sync and coverage details are shown.
- Clarified that the header summarizes overall sync status while per-source sync and coverage live in Detailed analysis.
