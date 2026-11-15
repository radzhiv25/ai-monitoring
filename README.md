# AI Governance Dashboard

[Live demo](https://ai-monitoring-khaki.vercel.app) · [Case study (#case-study)](https://ai-monitoring-khaki.vercel.app/#case-study)

Design principles:
- Answer first, detail second: Quick overview surfaces the budget picture; Detailed analysis keeps the deeper signals available.
- Make cost and uncertainty clear: subscription and API spend stay separate; missing data is unavailable, never zero.
- Keep decisions accountable: requests show a reason, route, expiry, and local decision history; sample actions never change live systems.

A responsive React + Vite prototype for an AI governance dashboard. **All figures and organizations are illustrative demo data.** No company accounts are connected.

## Project structure

```text
src/
  App.jsx                      Dashboard state, data orchestration, and interactions
  main.jsx                     React entry point
  style.css                    Shared dashboard theme and responsive layout
  styles/
    docs.css                   Documentation landing-page styles
    select.css                 Shared custom listbox styles
  data/demoData.js             Central fictional tools, departments, alerts, and usage samples
  services/dashboardData.js    Filtering and aggregation for the dashboard mock-data service
  components/
    documentation/             Case-study documentation, data-source plan, chart rationale, and decisions
    governance/BudgetRequestsPage.jsx
                                Request history, approval decisions, exceptions, and activity log
    governance/                Alerts, model analytics, licenses, anomaly review, and source health
    layout/                    Search header and collapsible workspace navigation
    overview/                  Dashboard filters, KPIs, and charts
    shared/                    Provider marks, accessible select, tool details, help tips, and guided tour
```

## Run locally

```bash
npm install
npm run dev
```

## Interactive prototype

- Use the sidebar or the top-bar control to collapse or expand navigation.
- A first-visit guided tour spotlights one dashboard area at a time; reopen it with **Take the quick tour**, **Help & tour**, or the profile shortcut.
- Hover or keyboard-focus the question-mark icons for plain-language definitions.
- Filter by department or provider, and search tools or departments by name, vendor, or status. `⌘ K` / `Ctrl K` focuses search.
- Select a sample month to recalculate the summary, department counts, tool spend, and API telemetry. Set the spend chart to the selected month, last three months, or last six months, and switch the spend series between monthly and weekly views.
- Select a department bar to inspect its tool and spend breakdown or edit its demo budget. Select a tool row to inspect its cap and owner, then simulate a local approval/review action.
- Export the currently filtered sample tool records as CSV. API request and input/output-token metrics stay separate from seat counts and subscription spend.
- In Detailed analysis, inspect reported model-level requests, input/output tokens, cost, average cost per request, and share; unavailable telemetry is not treated as zero.
- Review assigned inactive licenses and mark them for a local reclamation review; the displayed savings are estimates, not guaranteed savings.
- Inspect aggregate anomaly signals against sample baselines and review source sync health and coverage.
- The governance workspace opens first. The separate case study is available at `/case-study` or `/#case-study`; the workspace is `/`.
- Switch between **Quick overview** (four headline metrics, three decision charts, and a five-tool preview) and **Detailed analysis** (API telemetry, full inventory, model usage, license utilization, anomalies, alerts, and data-source health). The quick tour automatically opens the detailed view so every tour stop is available.
- Quick overview shows spend vs budget, departments at or above 80% of limit, pending approvals, and idle assigned seats. Active people and connected AI tools are in Detailed analysis.
- From a tool detail drawer, department budget dialog, or **Budget Requests** page, submit a sample amount, reason, duration, and optional context. The local request includes requester, current spend and limit, approval route, decision, approver, comments, and expiry.
- The **Budget Requests** page shows pending, approved, rejected, cancelled, and expired examples, records local approval decisions in an activity log, and represents approved top-ups as temporary allocations separate from the original limits. No provider quota or finance record changes.
- Detailed analysis includes local sample limit-policy controls for department and access-level defaults, a per-user guardrail, configurable 80% / 90% / 100% alert thresholds, and separate soft/hard cap switches for people and API keys. These controls do not enforce real access limits. Provider-side blocking depends on provider capability and is not simulated.
- The OpenAI row uses the ChatGPT knot mark from Lobe Icons; other supported providers use Simple Icons. If an asset is unavailable or the browser is offline, a provider initial appears instead.
- Usage metrics are department-level aggregates. The prototype does not expose browsing history or individual usage timelines. Requester names appear only on submitted budget requests so an approver can understand and track the request.
- Product rationale and source assumptions live in `PRODUCT_BRIEF.md`, `PRD.md`, `DATA_INTEGRATION.md`, and `PRODUCT_DECISIONS.md`.

Dashboard filters use a custom keyboard-accessible listbox rather than browser-native select styling. Focus it and press Enter/Space, use the arrow keys to choose an option, Enter to apply, and Escape to close.

The tour supports Escape, restores the previous focus context, and makes the underlying screen inert while open. Focus indicators and reduced-motion preferences are supported.

## Customize

Edit `src/data/demoData.js` to change sample tools, spend, or department information. The service layer is a mock adapter, not a live integration. Dashboard figures and decisions are fictional and local to the prototype. Read [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md), [PRD.md](./PRD.md), [DATA_INTEGRATION.md](./DATA_INTEGRATION.md), and [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) for the product rationale, requirements, source plan, assumptions, and trade-offs.
