import React from "react";
import { ArrowRight, BarChart3, Boxes, Database, ShieldCheck, Wallet, Users, CircleHelp } from "lucide-react";

const sections = [
  {
    icon: Boxes,
    number: "01",
    title: "Start with the AI inventory",
    lead: "Built for finance, IT, and security teams that need a clear answer without digging through separate vendor reports.",
    points: [
      ["What is in use?", "A searchable inventory lists detected tools, provider, owner team, active people, approval state, and how spend compares with each limit."],
      ["What is it costing?", "Organization and tool totals combine subscription charges with API consumption when available. These cost types are called out separately."],
      ["What needs attention?", "Review alerts, unusual changes, unused assigned seats, and source sync issues are prompts for a human to investigate."],
    ],
  },
  {
    icon: Database,
    number: "02",
    title: "API and data source plan",
    lead: "No single source can show discovery, identity, usage, price, and policy together. Join records around a normalized tool, user, and time period.",
    points: [
      ["Vendor admin and usage APIs", "OpenAI organization usage/cost endpoints, Anthropic Console usage and spend exports, Google Gemini/Cloud billing, Microsoft Copilot usage reports, GitHub Copilot metrics, and other vendor admin APIs. Exact coverage depends on plan and tenant permissions."],
      ["Identity and seat assignment", "Microsoft Entra ID or Okta for people, groups, and departments; Microsoft 365 or Google Workspace admin reports for assigned and active seats. Use stable directory IDs and minimize personal data."],
      ["Spend and contracts", "Cloud billing exports, vendor invoices, procurement/ERP records, and approved budget configuration. Reconcile invoice periods, currencies, credits, and API versus seat charges."],
      ["Shadow AI discovery and controls", "CASB/SSE/SWG or endpoint/browser security events can reveal unsanctioned services; SSO and app catalog records identify managed access. Treat network discovery as a signal, not proof of an account or policy breach."],
      ["Ingestion requirements", "Use OAuth or service principals with read-only, least-privilege scopes; scheduled sync plus webhook support where offered; record source, last successful sync, coverage, and data freshness on every metric."],
    ],
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Three charts for the key decisions",
    lead: "The chart set should answer the highest-value spending, adoption, and action questions at a glance.",
    points: [
      ["Spend vs. approved budget (line chart)", "Shows actual monthly spend beside the limit, with remaining budget and a projected month-end estimate. This lets finance spot a rising trajectory before the cap is crossed."],
      ["Usage by department (ranked bar or compact donut)", "Shows where adoption sits and which teams may need enablement or budget ownership. A ranked bar is the more accessible and precise default; this demo also offers a department view."],
      ["Tool spend vs. per-tool limit (sorted bars/table)", "Ranks tools by spend and highlights tools near or over their cap, with owner and approval status beside each value. This gives IT a direct route from signal to action."],
    ],
  },
  {
    icon: Wallet,
    number: "04",
    title: "Decisions, assumptions, and trade-offs",
    lead: "This is a week-one product hypothesis and demo, not a live governance system.",
    points: [
      ["Prioritized for the MVP", "Start with a trustworthy inventory, spend against limits, adoption by team, and a short list of review actions. Put less common analysis behind details so the first view remains scannable."],
      ["Assumptions", "A customer can provide read-only admin/billing access; department mapping exists; spend limits are configured; and reports can be normalized to a common monthly period and currency."],
      ["Trade-offs", "Simple currency values are easier for executives than tokens, but can hide differences between subscription and usage charges. Therefore the UI separates them where possible and labels unavailable telemetry rather than implying zero."],
      ["Trust and privacy", "Unique active users are deduplicated at organization level. Provider totals may overlap. Alerts are investigation cues, and estimated savings are not a promise until contract terms and observed usage are checked."],
      ["Intentionally outside the demo", "No live vendor connections, automated blocking, employee surveillance, policy enforcement, contract negotiation, or finance-grade reconciliation. All on-screen values are fictional sample data."],
    ],
  },
];

export default function BehindDashboard({ onBack }) {
  return <main className="docs-page">
    <header className="docs-header">
      <div className="docs-kicker"><CircleHelp size={16}/> PRODUCT BRIEF <span>·</span> AI GOVERNANCE</div>
      <h1>AI usage and spend,<br/><em>in one view.</em></h1>
      <p>This prototype puts AI tools, spend limits, team activity, and review items in one place. This brief explains what it shows, what data could support it, and why these views matter.</p>
      <div className="docs-meta"><span><i/> Week-one product concept</span><span>CloudEagle workspace</span><span>Prototype data is fictional</span></div>
    </header>
    <nav className="docs-toc" aria-label="Brief sections">{sections.map(({number,title})=><a key={number} href={`#brief-${number}`}><b>{number}</b>{title}</a>)}</nav>
    <div className="docs-sections">{sections.map(({icon:Icon,number,title,lead,points})=><section className="docs-section" id={`brief-${number}`} key={number}>
      <div className="docs-section-icon"><Icon size={18}/><span>{number}</span></div><div className="docs-section-body"><h2>{title}</h2><p className="docs-lead">{lead}</p><div className="docs-points">{points.map(([heading,copy])=><article key={heading}><h3>{heading}</h3><p>{copy}</p></article>)}</div></div>
    </section>)}</div>
    <aside className="docs-callout"><ShieldCheck size={19}/><div><b>How to read the demo</b><p>All values are illustrative. “Unavailable” means the source does not provide that measure in this sample; it should never be interpreted as zero usage.</p></div></aside>
    <footer className="docs-footer"><div><b>See the sample dashboard</b><span>Change the period, review tool limits, and switch between the summary and analysis views.</span></div><button className="button primary" onClick={onBack}>Open the dashboard <ArrowRight size={16}/></button></footer>
  </main>;
}
