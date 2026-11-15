import React from "react";
import { ArrowRight, CircleHelp, Scale, ShieldCheck } from "lucide-react";

const sections = [
  { id: "01", label: "User & fit" },
  { id: "02", label: "Data plan" },
  { id: "03", label: "Three charts" },
  { id: "04", label: "Trade-offs" },
  { id: "05", label: "Success & questions" },
  { id: "06", label: "User stories" },
];

function DataTable({ caption, columns, rows, className = "" }) {
  return <div className={`proposal-table-wrap ${className}`}>
    <table className="proposal-table">
      <caption className="sr-only">{caption}</caption>
      <thead><tr>{columns.map((column) => <th key={column.key} scope="col" className={column.tone || ""}>{column.label}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={`${caption}-${index}`}>{columns.map((column) => <td key={column.key} data-label={column.label} className={column.tone || ""}>{row[column.key]}</td>)}</tr>)}</tbody>
    </table>
    <div className="proposal-mobile-cards" aria-label={`${caption} (card view)`}>{rows.map((row, index) => <article className="proposal-mobile-card" key={`${caption}-card-${index}`}><dl>{columns.map((column) => <div key={column.key} className={column.tone || ""}><dt>{column.label}</dt><dd>{row[column.key]}</dd></div>)}</dl></article>)}</div>
  </div>;
}

const sourceColumns = [
  { key: "need", label: "Need" },
  { key: "source", label: "Source" },
  { key: "status", label: "In CloudEagle today (Assumed)" },
  { key: "gap", label: "Gap or fallback", tone: "cost-cell" },
];
const sourceRows = [
  { need: "Tokens, credits and cost per tool and model", source: "Vendor admin and usage APIs (OpenAI, Anthropic, Google, GitHub Copilot, Microsoft Copilot, Cursor)", status: "Assumed yes", gap: "Coverage depends on plan and permissions. If no usage API or price: invoices or a customer-set unit cost." },
  { need: "People, groups, departments, seats", source: "Entra ID or Okta; Microsoft 365 or Google Workspace admin reports", status: "Assumed partly", gap: "Show unattributed spend as its own bar." },
  { need: "Department, manager, level", source: "HRIS", status: "Unknown", gap: "Often stale. Level-based defaults are optional." },
  { need: "Budgets, contracts, invoices", source: "Finance, ERP, procurement, cloud billing exports", status: "Assumed partly", gap: "Reconcile currencies, billing periods, credits." },
  { need: "API key owner", source: "Owner field on each key", status: "Likely a gap", gap: "Flag keys with no owner. Shared keys attribute to a team." },
  { need: "Unsanctioned tools", source: "SSO and app catalog; optional security tooling", status: "Assumed yes", gap: "A signal, not proof of an account or a policy breach." },
  { need: "Approvals and audit trail", source: "Slack, Teams or email workflow", status: "New", gap: "Email approval with a log." },
];

const chartColumns = [
  { key: "chart", label: "Chart" },
  { key: "decision", label: "Decision it triggers" },
  { key: "rule", label: "Rule (Proposed)" },
  { key: "chosen", label: "Chosen over" },
  { key: "cost", label: "But", tone: "cost-cell" },
];
const chartRows = [
  { chart: "Spend vs limit by department (line with limit line and run-rate estimate)", decision: "Approve a top-up, tighten, or leave alone", rule: "Alert at 80% of limit. Flag if run-rate passes 100%. Hide the estimate in the first 7 days of a cycle.", chosen: "A forecast line", cost: "Run-rate is noisy early in a cycle and late spikes show up late." },
  { chart: "Usage by department, subscription vs API (ranked bar)", decision: "Move budget or enable a team", rule: "‘Unattributed’ is its own bar", chosen: "A donut", cost: "Low attribution makes this chart misleading, hence the 80% coverage rule." },
  { chart: "Tool spend vs per-tool limit (sorted bars)", decision: "Raise, hold or renegotiate one tool’s cap", rule: "Highlight tools above 80%", chosen: "Idle-license chart (kept in Detailed view)", cost: "Department and tool limits can conflict. See open question 3." },
];

const decisionColumns = [
  { key: "decision", label: "Decision" },
  { key: "why", label: "Why" },
  { key: "cost", label: "But (cost)", tone: "cost-cell" },
  { key: "revisit", label: "Revisit if" },
];
const decisionRows = [
  { decision: "IT lead is the primary user, not the CFO", why: "They act on limits; the CFO mostly reads", cost: "CFO gets a thinner view", revisit: "Discovery shows Finance owns the AI budget in target accounts" },
  { decision: "Show spend in currency, split subscription vs API", why: "Executives read money, not tokens", cost: "Hides model-level efficiency", revisit: "Customers are mostly usage-billed; promote the token view" },
  { decision: "Run-rate estimate, not a forecast", why: "It can be explained and defended", cost: "Late-month spikes appear late", revisit: "Months of history exist and customers ask for forecasts" },
  { decision: "Soft cap for people, hard cap for API keys", why: "Soft keeps work moving; hard protects budget", cost: "Soft allows overspend; hard can push people to personal accounts", revisit: "A vendor cannot enforce limits, so alert-only" },
  { decision: "Approvals routed by size, not everything to IT", why: "Avoids an IT bottleneck", cost: "More configuration; thresholds unclear", revisit: "Median approval time exceeds one business day" },
  { decision: "Shadow AI is a KPI and alert, not a chart", why: "Leans toward policy and security", cost: "A security-led buyer is underserved", revisit: "Security becomes the primary persona; swap it in for chart 3" },
  { decision: "Outcome tracking deferred", why: "Tokens are not productivity; needs Jira or GitHub data", cost: "CFO cannot yet see cost per result", revisit: "A design partner defines a success metric" },
];

const metricColumns = [
  { key: "metric", label: "Metric" },
  { key: "target", label: "Target (Proposed)" },
  { key: "measure", label: "Measured by" },
  { key: "cost", label: "But", tone: "cost-cell" },
];
const metricRows = [
  { metric: "Spend attributed to an owner", target: "85% within 30 days of connecting", measure: "Attributed spend / total spend", cost: "Shared keys and contractors lower it" },
  { metric: "Approval turnaround", target: "Median under 1 business day", measure: "Request to decision time", cost: "Fast approvals can mean weak review" },
  { metric: "Idle seats actioned", target: "Majority actioned within 1 renewal cycle", measure: "Seats marked for reclaim / idle seats", cost: "Seats may be idle for a legitimate seasonal reason" },
];

function Section({ id, icon: Icon, title, children }) {
  return <section className="proposal-section" id={`brief-${id}`} aria-labelledby={`brief-heading-${id}`}>
    <div className="proposal-section-heading"><span className="proposal-section-icon"><Icon size={17}/></span><div><span className="proposal-section-number">SECTION {id}</span><h2 id={`brief-heading-${id}`}>{title}</h2></div></div>
    <div className="proposal-section-content">{children}</div>
  </section>;
}

export default function BehindDashboard({ onBack }) {
  return <main className="docs-page proposal-page">
    <header className="docs-header proposal-hero">
      <div className="docs-kicker"><CircleHelp size={16}/> PRODUCT PROPOSAL <span>·</span> AI GOVERNANCE</div>
      <h1>AI budgets, limits,<br/><em>and exceptions</em></h1>
      <p>A week-one proposal: who it is for, what it decides, what each choice costs, and what would change my mind.</p>
      <div className="docs-meta"><span><i/> Week-one product concept</span><span>CloudEagle workspace</span><span>Prototype data is fictional</span></div>
      <div className="proposal-legend" role="note" aria-label="Proposal legend"><b>How to read this proposal</b><span><strong>Proposed</strong> = my default to test with customers.</span><span><strong>Assumed</strong> = needs validation with the CloudEagle team.</span></div>
    </header>

    <nav className="docs-toc proposal-toc" aria-label="Brief sections">{sections.map(({ id, label }) => <a key={id} href={`#brief-${id}`}><b>{id}</b><span>{label}</span></a>)}</nav>

    <div className="proposal-sections">
      <Section id="01" icon={ShieldCheck} title="User, problem, and fit with CloudEagle">
        <div className="proposal-callout"><p><b>Primary user:</b> the IT lead who owns the company&apos;s AI program. The CFO gets a summary strip, not a separate product.</p><p><b>Core question:</b> Are we within our AI budget, who is about to exceed a limit, and where are we paying for AI nobody uses?</p></div>
        <h3 className="proposal-subhead">Problem</h3><p>AI spend sits in many vendor consoles. Owners learn about overspend from the invoice. The hard question is not &quot;how much&quot; but &quot;who is near their limit and what should happen next&quot;.</p>
        <h3 className="proposal-subhead">Fit with CloudEagle <span>(all Assumed, validate with the team)</span></h3>
        <ul className="proposal-list"><li><b>Assumed to exist today:</b> connectors to major AI vendors, token and cost tracking, idle-license detection, budgets and alerts.</li><li><b>Proposed new value:</b> an exception workflow. A person requests extra budget with a reason and duration, small requests go to a team lead, large ones to IT or Finance, and every approval expires at cycle end.</li><li><b>Not proposed:</b> a second usage dashboard. If this duplicates what exists, cut it.</li></ul>
      </Section>

      <Section id="02" icon={Scale} title="API and data source plan">
        <DataTable caption="API and data sources required for the proposal" columns={sourceColumns} rows={sourceRows}/>
        <h3 className="proposal-subhead">Data rules <span>(Proposed)</span></h3>
        <ul className="proposal-list"><li>If less than 80% of spend can be attributed to an owner, show a coverage banner on the department chart instead of hiding the gap.</li><li>Missing data is shown as &quot;Unavailable&quot;, never as zero.</li><li>Every metric shows its source and last successful sync. Daily sync is enough for the MVP.</li><li>Collect consumption data, not browsing data. Department view by default; individual drill-down only for authorised roles.</li></ul>
        <aside className="proposal-question"><b>Verify before building</b><p>Which vendors let an outside tool enforce a limit through their API? If a vendor only reports usage, the product can alert and route approvals but cannot block.</p></aside>
      </Section>

      <Section id="03" icon={Scale} title="Three charts, each tied to a decision">
        <DataTable caption="Three selected charts and the decisions they support" columns={chartColumns} rows={chartRows} className="chart-decision-table"/>
        <aside className="proposal-out-of-scope"><b>Left out on purpose</b><span>Top spenders by person (blame and privacy risk)</span><span>Next-month forecast (cannot be defended)</span><span>Cost per outcome (needs data we do not have)</span></aside>
      </Section>

      <Section id="04" icon={Scale} title="Decisions and trade-offs">
        <DataTable caption="Product decisions, costs, and reasons to revisit them" columns={decisionColumns} rows={decisionRows} className="decision-table"/>
      </Section>

      <Section id="05" icon={Scale} title="Success metrics and open questions">
        <p className="proposal-note"><b>Success metrics</b> (Proposed starting hypotheses to validate with design partners, not facts).</p>
        <DataTable caption="Proposed success metrics and their trade-offs" columns={metricColumns} rows={metricRows} className="metrics-table"/>
        <h3 className="proposal-subhead">Open questions</h3>
        <ol className="proposal-list numbered"><li>Which vendors allow limit enforcement through their API?</li><li>Who approves for contractors and shared keys?</li><li>If a department is under budget but one of its tools is over its cap, which limit wins and who approves?</li><li>How fresh must data be: daily, or near real time close to a limit?</li><li>If the CloudEagle team already has parts of this, which piece is genuinely new?</li></ol>
      </Section>

      <Section id="06" icon={ShieldCheck} title="User stories">
        <p className="proposal-note">Acceptance criteria for the first version. Expand a story to review its checks.</p>
        <div className="proposal-stories">
          <details><summary>As an IT lead, I want a monthly budget per department so spend stays within what Finance approved.</summary><div><b>Acceptance criteria (Proposed)</b><ul><li>Alert at 80%.</li><li>At 100% with a soft cap new requests are flagged for approval, not blocked.</li><li>Every budget change is logged with who and when.</li></ul></div></details>
          <details><summary>As an engineer, I want to request extra budget with a reason so I am not blocked mid-project.</summary><div><b>Acceptance criteria (Proposed)</b><ul><li>The form requires reason, amount and duration.</li><li>Small requests go to a team lead, larger ones to IT or Finance.</li><li>Approvals expire at cycle end; the requester sees the decision and reason.</li></ul></div></details>
          <details><summary>As a finance lead, I want spend against budget by department so I can plan renewals.</summary><div><b>Acceptance criteria (Proposed)</b><ul><li>Subscription and API spend shown separately with the limit line.</li><li>Last refresh time shown.</li><li>Exportable to CSV.</li></ul></div></details>
        </div>
        <aside className="proposal-question later-phases"><b>Later phases</b><p>Project-level budgets, then comparing spend with progress from Jira or GitHub using a customer-defined success metric. Tokens are not productivity, so this is not in the MVP.</p></aside>
      </Section>
    </div>

    <aside className="docs-callout proposal-demo-note"><ShieldCheck size={19}/><div><b>How to read the demo</b><p>All dashboard values are fictional sample data. &quot;Unavailable&quot; means the sample source does not provide that measure; it should never be read as zero usage.</p></div></aside>
    <footer className="docs-footer"><div><b>See the sample dashboard</b><span>All figures and interactions are illustrative. Nothing is connected to a live vendor account.</span></div><button className="button primary" onClick={onBack}>Open the dashboard <ArrowRight size={16}/></button></footer>
  </main>;
}
