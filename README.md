# AI Governance Dashboard

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
  data/demoData.js             Normalized fictional tools, departments, people, alerts, and usage
  services/dashboardData.js    Filtering and aggregation for the dashboard mock-data service
  components/
    documentation/             Assignment brief, data-source plan, chart rationale, and decisions
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
- Filter by department or provider, and search tools and employees by name, vendor, team, or status. `⌘ K` / `Ctrl K` focuses search.
- Select a sample month to recalculate the summary, department counts, tool spend, and API telemetry. Set the spend chart to the selected month, last three months, or last six months, and switch the spend series between monthly and weekly views.
- Select a department bar to inspect people and edit its demo budget. Select a tool row to inspect its cap and owner, then simulate a local approval/review action.
- Export the currently filtered sample tool records as CSV. API request and input/output-token metrics stay separate from seat counts and subscription spend.
- Inspect model-level requests, input/output tokens, cost, average cost per request, and share; switch the chart between usage and spend.
- Review assigned inactive licenses and mark them for a local reclamation review; the displayed savings are estimates, not guaranteed savings.
- Inspect anomaly signals against sample baselines and review source sync health and coverage.
- The assignment brief is the opening page. Use its **Open the dashboard** action to explore the prototype; use **Behind the dashboard** to return to the brief.
- Switch between **Quick overview** (four headline metrics, two core charts, and a five-tool preview) and **Detailed analysis** (API telemetry, spend ranking, full inventory, model usage, license utilization, anomalies, alerts, and data-source health). The quick tour automatically opens the detailed view so every tour stop is available.
- The OpenAI row uses the ChatGPT knot mark from Lobe Icons; other supported providers use Simple Icons. If an asset is unavailable or the browser is offline, a provider initial appears instead.

Dashboard filters use a custom keyboard-accessible listbox rather than browser-native select styling. Focus it and press Enter/Space, use the arrow keys to choose an option, Enter to apply, and Escape to close.

The tour supports Escape, restores the previous focus context, and makes the underlying screen inert while open. Focus indicators and reduced-motion preferences are supported.

## Customize

Edit `src/data/demoData.js` to change sample tools, spend, or department information. The service layer is a mock adapter, not a live integration. Values and actions remain fictional/local; some sample activity is illustrative and has limited identity attribution. Read [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) for assumptions, priorities, trade-offs, and deferred scope.
