import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleHelp,
  ShieldCheck,
  X,
  SearchIcon,
  TriangleAlert,
} from "lucide-react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MetricCard from "./components/overview/MetricCard";
const SpendChart = React.lazy(() => import("./components/overview/Charts").then((module) => ({ default: module.SpendChart })));
const DepartmentChart = React.lazy(() => import("./components/overview/Charts").then((module) => ({ default: module.DepartmentChart })));
const SpendByToolChart = React.lazy(() => import("./components/overview/Charts").then((module) => ({ default: module.SpendByToolChart })));
import { DetailDialog, ToolDrawer, ToolsTable } from "./components/shared/ToolsTable";
import RequestBudgetModal from "./components/shared/RequestBudgetModal";
import BudgetRequestsPage from "./components/governance/BudgetRequestsPage";
const AlertsPanel = React.lazy(() => import("./components/governance/AlertsPanel"));
const ModelAnalytics = React.lazy(() => import("./components/governance/ModelAnalytics"));
const LicensePanel = React.lazy(() => import("./components/governance/LicensePanel"));
const AnomalyPanel = React.lazy(() => import("./components/governance/AnomalyPanel"));
const IntegrationHealth = React.lazy(() => import("./components/governance/IntegrationHealth"));
const LimitPolicyPanel = React.lazy(() => import("./components/governance/LimitPolicyPanel"));
import Tour from "./components/shared/Tour";
const BehindDashboard = React.lazy(() => import("./components/documentation/BehindDashboard"));
import DashboardFilters from "./components/overview/DashboardFilters";
import ViewModeSwitch from "./components/overview/ViewModeSwitch";
import {
  auditEventCatalog,
  budgetRequestCatalog,
  departmentCatalog,
  formatMoney,
  periodOptions,
  sampleCycleDay,
  temporaryExceptionCatalog,
  toolCatalog,
} from "./data/demoData";
import {
  getAlerts,
  getAnomalyAlerts,
  getDepartmentMetrics,
  getIntegrationMetrics,
  getLicenseMetrics,
  getLicenseSummary,
  getModelMetrics,
  getProviderSpend,
  getSpendSeries,
  getSummary,
  getToolsForMonth,
  searchInventory,
} from "./services/dashboardData";

const isCaseStudyLocation = () => location.pathname.replace(/\/$/, "").endsWith("/case-study") || location.hash === "#case-study";
const workspacePath = () => location.pathname.replace(/\/case-study\/?$/, "") || "/";

export default function App() {
  const [active, setActive] = useState("Overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [displayMode, setDisplayMode] = useState("quick");
  const [page, setPage] = useState(() => isCaseStudyLocation() ? "case-study" : "dashboard");
  const [selectedMonth, setSelectedMonth] = useState("Nov");
  const [range, setRange] = useState("Last 6 months");
  const [granularity, setGranularity] = useState("month");
  const [department, setDepartment] = useState("All departments");
  const [provider, setProvider] = useState("All providers");
  const [departmentMetric, setDepartmentMetric] = useState("spend");
  const [spendGroup, setSpendGroup] = useState("tool");
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [licenseReviewIds, setLicenseReviewIds] = useState([]);
  const [notice, setNotice] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourResolved, setTourResolved] = useState(() => isCaseStudyLocation() || localStorage.getItem("cloudeagle-ai-governance-tour-seen") === "1");
  const [welcomeVisible, setWelcomeVisible] = useState(() => localStorage.getItem("cloudeagle-case-study-strip-dismissed") !== "1");
  const [tourStep, setTourStep] = useState(0);
  const [followedAlerts, setFollowedAlerts] = useState([]);
  const [governanceOverrides, setGovernanceOverrides] = useState({});
  const [departmentBudgetOverrides, setDepartmentBudgetOverrides] = useState(
    {},
  );
  const [budgetRequests, setBudgetRequests] = useState(budgetRequestCatalog);
  const [temporaryExceptions, setTemporaryExceptions] = useState(temporaryExceptionCatalog);
  const [auditEvents, setAuditEvents] = useState(auditEventCatalog);
  const [requestTarget, setRequestTarget] = useState(null);
  const [routingThreshold, setRoutingThreshold] = useState(2500);
  const [thresholds, setThresholds] = useState({ approaching: 0.8, high: 0.9, reached: 1 });

  useEffect(() => {
    if (
      !isCaseStudyLocation() &&
      !localStorage.getItem("cloudeagle-ai-governance-tour-seen")
    )
      setTourOpen(true);
  }, []);
  useEffect(() => {
    const syncRoute = () => setPage(isCaseStudyLocation() ? "case-study" : "dashboard");
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => { window.removeEventListener("hashchange", syncRoute); window.removeEventListener("popstate", syncRoute); };
  }, []);
  useEffect(() => {
    const shortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.querySelector(".search input")?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const month =
    periodOptions.find((item) => item.month === selectedMonth) ||
    periodOptions.at(-1);
  const monthIndex = periodOptions.findIndex(
    (item) => item.month === month.month,
  );
  const previousMonth = periodOptions[Math.max(0, monthIndex - 1)];
  const cycleDays = new Date(month.year, monthIndex + 1, 0).getDate();
  const elapsedCycleDay = Math.min(sampleCycleDay, cycleDays);
  const summary = useMemo(
    () =>
      getSummary(month, {
        department,
        provider,
        governanceOverrides,
        departmentBudgetOverrides,
      }),
    [
      month,
      department,
      provider,
      governanceOverrides,
      departmentBudgetOverrides,
    ],
  );
  const previousSummary = useMemo(
    () =>
      getSummary(previousMonth, {
        department,
        provider,
        governanceOverrides,
        departmentBudgetOverrides,
      }),
    [
      previousMonth,
      department,
      provider,
      governanceOverrides,
      departmentBudgetOverrides,
    ],
  );
  const delta = (current, previous) =>
    previous
      ? `${current >= previous ? "Up" : "Down"} ${Math.abs(((current - previous) / Math.max(1, previous)) * 100).toFixed(1)}%`
      : undefined;
  const timeSeries = useMemo(
    () =>
      getSpendSeries({
        throughMonth: month,
        granularity,
        range,
        department,
        provider,
        departmentBudgetOverrides,
      }),
    [
      month,
      granularity,
      range,
      department,
      provider,
      departmentBudgetOverrides,
    ],
  );
  const departmentMetrics = useMemo(
    () => getDepartmentMetrics(month, departmentMetric, provider),
    [month, departmentMetric, provider],
  );
  const departmentSpendMetrics = useMemo(
    () => getDepartmentMetrics(month, "spend", provider),
    [month, provider],
  );
  const filteredTools = useMemo(
    () =>
      getToolsForMonth(month, {
        department,
        provider,
        governanceOverrides,
      }).filter(
        (tool) =>
          !query.trim() ||
          [tool.name, tool.provider, tool.ownerDepartment, tool.governance]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [month, department, provider, governanceOverrides, query],
  );
  const searchResults = useMemo(() => searchInventory(query), [query]);
  const providersSpend = useMemo(
    () =>
      getProviderSpend(month, { department }).filter(
        (item) => provider === "All providers" || item.provider === provider,
      ),
    [month, provider, department],
  );
  const spendChartData = useMemo(
    () =>
      spendGroup === "provider"
        ? providersSpend
        : filteredTools.map((tool) => ({
            name: tool.name,
            spend: tool.spend,
            monthlyLimit: tool.monthlyLimit,
            toolId: tool.id,
            provider: tool.provider,
          })),
    [spendGroup, providersSpend, filteredTools],
  );
  const alerts = useMemo(
    () => getAlerts({ month, department, provider, departmentBudgetOverrides, thresholds }),
    [month, department, provider, departmentBudgetOverrides, thresholds],
  );
  const anomalies = useMemo(
    () => getAnomalyAlerts(month, { department, provider }),
    [month, department, provider],
  );
  const modelMetrics = useMemo(
    () => getModelMetrics(month, { department, provider }),
    [month, department, provider],
  );
  const licenseMetrics = useMemo(
    () => getLicenseMetrics(month, { department, provider }),
    [month, department, provider],
  );
  const licenseSummary = useMemo(
    () => getLicenseSummary(licenseMetrics),
    [licenseMetrics],
  );
  const departmentsInScope = departmentSpendMetrics.filter(
    (team) => team.name !== "Unattributed" && (department === "All departments" || team.name === department),
  );
  const departmentsOverLimit = departmentsInScope.filter((team) => {
    const limit = departmentBudgetOverrides[team.name] ?? team.monthlyBudget;
    return limit > 0 && team.spend / limit >= thresholds.approaching;
  });
  const pendingApprovalsCount = budgetRequests.filter((request) => request.status === "Pending approval").length;
  const integrations = useMemo(
    () => getIntegrationMetrics({ provider }),
    [provider],
  );
  const latestSync = integrations.map((item) => ({ ...item, timestamp: new Date(item.lastSync.replace(" · ", " ")).getTime() })).sort((a, b) => b.timestamp - a.timestamp)[0]?.lastSync ?? "Unavailable";
  const healthySources = integrations.filter((item) => item.status === "Healthy").length;
  const apiTools = getToolsForMonth(month, { department, provider }).filter(
    (tool) => tool.kind === "API consumption" && tool.requests !== null,
  );
  const requests = apiTools.reduce(
    (sum, tool) => sum + (tool.requests || 0),
    0,
  );
  const inputTokens = apiTools.reduce(
    (sum, tool) => sum + (tool.inputTokens || 0),
    0,
  );
  const outputTokens = apiTools.reduce(
    (sum, tool) => sum + (tool.outputTokens || 0),
    0,
  );
  const onCloseTour = useCallback(() => {
    setTourOpen(false);
    setTourResolved(true);
    localStorage.setItem("cloudeagle-ai-governance-tour-seen", "1");
  }, []);
  const closeBudgetRequest = useCallback(() => setRequestTarget(null), []);
  const submitBudgetRequest = ({ amount, reason, duration, target, route, context }) => {
    const [scopeType, targetId] = String(target).split(":");
    const tool = scopeType === "tool" ? toolCatalog.find((item) => item.id === targetId) : null;
    const departmentName = tool?.ownerDepartment ?? (scopeType === "department" ? targetId : "Unattributed");
    const currentSpend = tool ? getToolsForMonth(month).find((item) => item.id === tool.id)?.spend ?? 0 : getToolsForMonth(month, { department: departmentName }).reduce((sum, item) => sum + item.spend, 0);
    const currentBudget = tool?.monthlyLimit ?? departmentBudgetOverrides[departmentName] ?? departmentCatalog.find((item) => item.name === departmentName)?.monthlyBudget ?? 0;
    const cycleEnd = new Date(`${month.month} 1, ${month.year}`);
    cycleEnd.setMonth(cycleEnd.getMonth() + 1, 0);
    const expiresAt = duration === "This cycle only" ? `${cycleEnd.getFullYear()}-${String(cycleEnd.getMonth()+1).padStart(2,"0")}-${String(cycleEnd.getDate()).padStart(2,"0")}` : duration.replace("Until ", "");
    const submittedAt = new Date().toISOString();
    const request = {
      id: `REQ-${Date.now().toString().slice(-6)}`, target, toolName: tool?.name ?? `${departmentName} department budget`, provider: tool?.provider ?? "Multiple tools", scope: tool ? "Tool" : "Department", department: departmentName,
      currentBudget, currentSpend, amount, reason, context, duration, route, requester: "Jordan Davis · IT Operations", approver: route === "a team lead" ? "Department team lead" : "IT or Finance approver",
      submittedAt, status: "Pending approval", decisionComments: "", expiresAt,
    };
    setBudgetRequests((current) => [request, ...current]);
    setAuditEvents((current) => [{ id: `event-${Date.now()}`, actor: request.requester, action: "Exception requested", resource: `${request.toolName} · ${formatMoney(amount)}`, timestamp: submittedAt }, ...current]);
    closeBudgetRequest();
  };
  const decideBudgetRequest = (id, status, decisionComments = "") => {
    const decidedAt = new Date().toISOString();
    const request = budgetRequests.find((item) => item.id === id);
    if (!request || (request.status !== "Pending approval" && !(request.status === "Approved" && status === "Expired"))) return;
    setBudgetRequests((current) => current.map((item) => item.id === id ? { ...item, status, decisionComments, decidedAt } : item));
    if (status === "Approved") setTemporaryExceptions((current) => [{ id: `exception-${id}`, requestId: id, scope: request.scope, target: request.toolName, department: request.department, amount: request.amount, approver: request.approver, startsAt: decidedAt, expiresAt: request.expiresAt, status: "Active" }, ...current]);
    if (status === "Expired") setTemporaryExceptions((current) => current.map((item) => item.requestId === id ? { ...item, status: "Expired" } : item));
    const actor = status === "Cancelled" ? request.requester : status === "Expired" ? "System · sample lifecycle" : request.approver;
    setAuditEvents((current) => [{ id: `event-${Date.now()}`, actor, action: status === "Expired" ? "Temporary allocation expired" : `Exception ${status.toLowerCase()}`, resource: `${request.toolName} · ${formatMoney(request.amount)}`, timestamp: decidedAt, note: decisionComments }, ...current]);
  };
  const goBack = () => {
    history.replaceState(null, "", `${workspacePath()}${location.search}`);
    setPage("dashboard");
  };
  const startTour = () => {
    setDisplayMode("analysis");
    setTourStep(0);
    if (page === "case-study") {
      goBack();
      setTimeout(() => setTourOpen(true), 120);
    } else setTourOpen(true);
  };
  const goToDetailedSection = (id) => {
    setDisplayMode("analysis");
    const scrollWhenReady = (attempt = 0) => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (attempt < 10) window.setTimeout(() => scrollWhenReady(attempt + 1), 50);
    };
    window.setTimeout(() => scrollWhenReady(), 40);
  };
  const navigate = (section) => {
    setActive(section);
    if (section === "Budget Requests") { setDisplayMode("analysis"); return; }
    if (section === "Integrations") {
      goToDetailedSection("integration-health");
      return;
    }
    if (section === "Policies & Alerts") {
      goToDetailedSection("policy-alert-list");
      return;
    }
    const targets = {
      Overview: "page-top",
      "AI Tools": "tools-table",
      People: "people-chart",
      "Budgets & Limits": "budget-chart",
    };
    document
      .getElementById(targets[section])
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const exportCsv = () => {
    const rows = [
      [
        "Tool",
        "Provider",
        "Type",
        "Owner department",
        "Active users",
        "Spend USD",
        "Monthly limit USD",
        "Governance status",
        "API requests",
        "Input tokens",
        "Output tokens",
      ],
      ...filteredTools.map((tool) => [
        tool.name,
        tool.provider,
        tool.kind,
        tool.ownerDepartment,
        tool.activeUsers,
        tool.spend,
        tool.monthlyLimit,
        tool.governance,
        tool.requests ?? "Unavailable",
        tool.inputTokens ?? "Unavailable",
        tool.outputTokens ?? "Unavailable",
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ai-governance-${month.month.toLowerCase()}-${month.year}-demo.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const onSearchTool = (tool) => {
    setQuery("");
    setSelectedTool(
      getToolsForMonth(month, {
        department: "All departments",
        provider: "All providers",
        governanceOverrides,
      }).find((item) => item.id === tool.id) || tool,
    );
  };
  const onSearchTeam = (team) => {
    setQuery("");
    setDepartment(team.name);
    setDepartmentMetric("spend");
    setActive("Overview");
    window.setTimeout(() => document.getElementById("people-chart")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
  };
  const onDepartmentSelect = (name) => {
    if (name !== "Unattributed") setDepartment(name);
    setSelectedDepartment(name);
    document
      .getElementById("tools-table")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const onBarSelect = (row) => {
    if (spendGroup === "tool")
      setSelectedTool(
        getToolsForMonth(month, {
          department: "All departments",
          provider: "All providers",
          governanceOverrides,
        }).find((tool) => tool.id === row.toolId),
      );
    else setProvider(row.provider);
  };
  const updateGovernance = (id, status) =>
    setGovernanceOverrides((current) => ({ ...current, [id]: status }));
  const updateThreshold = (key, value) => setThresholds((current) => {
    const step = 0.01;
    if (key === "approaching") return { ...current, approaching: Math.min(value, current.high - step) };
    if (key === "high") return { ...current, high: Math.max(current.approaching + step, Math.min(value, current.reached - step)) };
    if (key === "reached") return { ...current, reached: Math.max(value, current.high + step) };
    return current;
  });
  const filteredSpend = summary.spend;
  const filteredBudget = summary.budget;
  const toolCount = toolCatalog.length;
  const activeAPIProviders = [
    ...new Set(apiTools.map((tool) => tool.provider)),
  ];

  return (
    page === "case-study" ? <React.Suspense fallback={<main className="docs-loading" aria-live="polite">Loading case study…</main>}><BehindDashboard onBack={goBack} /></React.Suspense> :
    <div
      className={`app-shell ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`}
    >
      <Sidebar
        active={active}
        onNavigate={navigate}
        onHelp={startTour}
        collapsed={sidebarCollapsed}
        toolCount={toolCatalog.length}
      />
      <main className="main-area">
        <Header
          query={query}
          setQuery={setQuery}
          searchResults={searchResults}
          onSelectTool={onSearchTool}
          onSelectTeam={onSearchTeam}
          onHelp={startTour}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
          sidebarCollapsed={sidebarCollapsed}
          currentPage={active}
          onAlerts={() => { setActive("Policies & Alerts"); goToDetailedSection("policy-alert-list"); }}
        />
        {active === "Budget Requests" ? <BudgetRequestsPage requests={budgetRequests} exceptions={temporaryExceptions} auditEvents={auditEvents} onDecision={decideBudgetRequest} onCreate={() => setRequestTarget("New request")} /> : <div className="content" id="page-top">
            <section className="page-heading">
              <div>
                <div className="eyebrow">
                  <span className="live-dot" /> AI GOVERNANCE{" "}
                  <span className="eyebrow-sep">·</span>{" "}
                  {month.month.toUpperCase()} {month.year}{" "}
                  <span className="demo-tag">DEMO DATA</span>
                </div>
                <h1>AI budgets &amp; exceptions</h1>
                <p>See whether spend fits its limits, which budgets need attention, and where an approval is waiting.</p>
                <div className="dashboard-freshness"><span>Cycle day {elapsedCycleDay} of {cycleDays}</span><span className="data-health-group"><button type="button" className="data-health-chip" onClick={() => goToDetailedSection("integration-health")}>Data last synced {latestSync} · {healthySources} of {integrations.length} sources healthy</button>{healthySources < integrations.length && <span className="data-health-secondary">Some figures may be incomplete. <button type="button" onClick={() => goToDetailedSection("integration-health")}>See data health.</button></span>}</span></div>
                <ViewModeSwitch value={displayMode} onChange={setDisplayMode} />
              </div>
              <DashboardFilters selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} range={range} setRange={setRange} granularity={granularity} setGranularity={setGranularity} department={department} setDepartment={setDepartment} provider={provider} setProvider={setProvider} onExport={exportCsv} detailed={displayMode === "analysis"} />
            </section>
            {welcomeVisible && tourResolved && !tourOpen && <aside className="welcome-strip" aria-label="Getting started"><span>New here? <a href="/#case-study">Read the 2-minute case study</a>, or <button type="button" onClick={startTour}>take the 5-step tour</button>.</span><button type="button" className="welcome-dismiss" aria-label="Dismiss getting started message" onClick={() => { localStorage.setItem("cloudeagle-case-study-strip-dismissed", "1"); setWelcomeVisible(false); }}><X size={15}/></button></aside>}
            <div className="plain-banner">
              <CircleHelp size={15} />
              <span>
                <b>At a glance:</b> {formatMoney(summary.spend)} of {formatMoney(summary.budget)} tracked budget · {departmentsOverLimit.length} {departmentsOverLimit.length === 1 ? "department" : "departments"} approaching a limit · {pendingApprovalsCount} {pendingApprovalsCount === 1 ? "request" : "requests"} waiting for review.
              </span>
              <button onClick={startTour}>
                Take the quick tour <span>→</span>
              </button>
            </div>
            <section className="metrics" aria-label="Organization summary">
              <div id="metric-spend">
                <MetricCard
                  kind="Wallet"
                  label="SPEND VS BUDGET"
                  value={formatMoney(summary.spend)}
                  unit="USD"
                  trend={delta(
                    summary.spend,
                    monthIndex > 0 ? previousSummary.spend : null,
                  )}
                  trendText={`vs full ${previousMonth.month}`}
                  foot={<>{formatMoney(summary.subscriptionSpend)} subscriptions · {formatMoney(summary.apiSpend)} API · of {formatMoney(summary.budget)} budget</>}
                  progress={
                    summary.budget
                      ? Math.min(100, (summary.spend / summary.budget) * 100)
                      : 0
                  }
                  status="Fictional subscription charges and API costs compared with the configured budget for the selected filters."
                  onClick={() =>
                    document
                      .getElementById("budget-chart")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                />
              </div>
              <div>
                <MetricCard
                  kind="ShieldCheck"
                  label={`DEPARTMENTS OVER ${Math.round(thresholds.approaching * 100)}%`}
                  value={departmentsOverLimit.length.toLocaleString()}
                  unit={departmentsOverLimit.length === 1 ? "department" : "departments"}
                  foot={`${departmentsInScope.length} departments in selected filters`}
                  status={`Departments counted here have used at least ${Math.round(thresholds.approaching * 100)}% of their configured budget in this sample period. The summary does not block spending.`}
                  onClick={() => { setDepartmentMetric("spend"); goToDetailedSection("people-chart"); }}
                />
              </div>
              <div>
                <MetricCard
                  kind="ClipboardCheck"
                  label="PENDING APPROVALS"
                  value={pendingApprovalsCount.toLocaleString()}
                  unit={pendingApprovalsCount === 1 ? "request" : "requests"}
                  foot="Local sample requests awaiting a decision"
                  status="Only extra-budget requests created in this prototype and still awaiting a decision are counted."
                  onClick={() => goToDetailedSection("policy-alert-list")}
                />
              </div>
              <div>
                <MetricCard
                  kind="Users"
                  label="IDLE ASSIGNED SEATS"
                  value={licenseSummary.inactiveAssigned.toLocaleString()}
                  unit={licenseSummary.inactiveAssigned === 1 ? "seat" : "seats"}
                  foot={`${formatMoney(licenseSummary.estimatedMonthlySavings)} estimated monthly value in inactive assigned seats`}
                  status="Sample assigned seats with no observed activity in the selected period. Confirm owners and contract terms before taking action."
                  onClick={() => goToDetailedSection("license-utilization")}
                />
              </div>
            </section>
            {displayMode === "analysis" && <section className="metrics detail-metrics" aria-label="Additional organization summary">
              <div><MetricCard kind="Users" label="ACTIVE PEOPLE" value={summary.users.toLocaleString()} unit="in selected period" trend={delta(summary.users, monthIndex > 0 ? previousSummary.users : null)} trendText={`vs. ${previousMonth.month}`} foot="People, not requests or tokens" progress={(summary.users / 620) * 100} status="Organization active users are unique in the sample. Provider-filtered counts are estimates and should not be added across vendors." onClick={() => document.getElementById("people-chart")?.scrollIntoView({ behavior: "smooth", block: "center" })}/></div>
              <div><MetricCard kind="Zap" label="CONNECTED AI TOOLS" value={summary.toolCount.toLocaleString()} unit="in selected filters" foot={<><span className="tool-status"><i className="status-dot"/> {summary.approvedCount} approved</span><span className="tool-status warn"><i/> {summary.reviewCount} need review</span></>} status="Count of tools visible with the selected department and provider filters." onClick={() => document.getElementById("tools-table")?.scrollIntoView({ behavior: "smooth", block: "center" })}/></div>
            </section>}
            {displayMode === "analysis" && <section className="telemetry-strip" aria-label="Tracked API usage">
              <div>
                <span className="telemetry-icon">
                  <SearchIcon size={14} />
                </span>
                <span>
                  <b>{requests.toLocaleString()} API requests</b>
                  <small>not employee count</small>
                </span>
              </div>
              <div>
                <span className="telemetry-icon tokens">
                  <CircleHelp size={14} />
                </span>
                <span>
                  <b>{inputTokens.toLocaleString()} input tokens</b>
                  <small>sent to API models</small>
                </span>
              </div>
              <div>
                <span className="telemetry-icon output">
                  <CircleHelp size={14} />
                </span>
                <span>
                  <b>{outputTokens.toLocaleString()} output tokens</b>
                  <small>returned by API models</small>
                </span>
              </div>
              <span className="telemetry-coverage">
                Coverage: {activeAPIProviders.length} demo API providers
              </span>
            </section>}
            <section className="charts-grid core-charts">
              <React.Suspense fallback={<div className="panel chart-loading" aria-live="polite">Loading chart…</div>}><SpendChart
                data={timeSeries}
                granularity={granularity}
                currentSpend={filteredSpend}
                currentBudget={filteredBudget}
                elapsedDays={elapsedCycleDay}
                cycleDays={cycleDays}
                cycleDays={new Date(month.year, new Date(`${month.month} 1, ${month.year}`).getMonth() + 1, 0).getDate()}
              />
              <DepartmentChart
                data={departmentMetrics}
                metric={departmentMetric}
                setMetric={setDepartmentMetric}
                activeUsers={summary.users}
                attributionCoverage={departmentMetrics[0]?.attributionCoverage ?? 1}
                unattributedSpend={departmentMetrics[0]?.unattributedSpend ?? 0}
                onDepartmentSelect={onDepartmentSelect}
              /></React.Suspense>
            </section>
            <React.Suspense fallback={<div className="panel chart-loading" aria-live="polite">Loading spend analysis…</div>}><div className="analysis-enter"><SpendByToolChart
              data={spendChartData}
              groupBy={spendGroup}
              setGroupBy={setSpendGroup}
              onSelect={onBarSelect}
              thresholds={thresholds}
            /></div></React.Suspense>
            <ToolsTable
              tools={filteredTools}
              thresholds={thresholds}
              onSelect={setSelectedTool}
              totalCount={filteredTools.length}
              maxRows={displayMode === "quick" ? 5 : undefined}
              onShowAll={() => {
                setDisplayMode("analysis");
                setDepartment("All departments");
                setProvider("All providers");
                setQuery("");
                document
                  .getElementById("tools-table")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
            {displayMode === "analysis" && <React.Suspense fallback={<div className="panel chart-loading" aria-live="polite">Loading detailed analysis…</div>}><div className="analysis-enter">
            <ModelAnalytics data={modelMetrics} onSelect={setSelectedModel} />
            <LicensePanel
              licenses={licenseMetrics}
              summary={licenseSummary}
              reviewedIds={licenseReviewIds}
              onSelect={setSelectedLicense}
            />
            <AnomalyPanel alerts={anomalies} onSelect={setSelectedAlert} />
            <AlertsPanel alerts={alerts} onSelect={setSelectedAlert} budgetRequests={budgetRequests} onReviewRequest={() => setActive("Budget Requests")} />
            <LimitPolicyPanel departmentCatalog={departmentCatalog} departmentBudgetOverrides={departmentBudgetOverrides} onDepartmentBudgetChange={(name, value) => setDepartmentBudgetOverrides((current) => ({ ...current, [name]: value }))} thresholds={thresholds} onThresholdChange={updateThreshold} />
            <IntegrationHealth integrations={integrations} onSelect={setSelectedIntegration} />
            </div></React.Suspense>}
            <footer>
              <span>
                Illustrative data · No live provider or employee actions
              </span>
              <span>
                {displayMode === "analysis" ? <><i className="sync-dot" /> {activeAPIProviders.length} sample API sources include telemetry{" "}<span className="footer-sep">·</span></> : null}
                <button onClick={startTour}>Help &amp; tour</button>
              </span>
            </footer>
          </div>}
      </main>
      <ToolDrawer
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
        onGovernanceChange={updateGovernance}
        onRequestBudget={(tool) => setRequestTarget(`tool:${tool.id}`)}
        thresholds={thresholds}
        departmentMetrics={departmentSpendMetrics}
        departmentBudgetOverrides={departmentBudgetOverrides}
        temporaryExceptions={temporaryExceptions}
      />
      <Tour
        open={tourOpen}
        step={tourStep}
        setStep={setTourStep}
        onClose={onCloseTour}
      />
      {selectedAlert && (
        <DetailDialog
          title={selectedAlert.title}
          subtitle={`${selectedAlert.severity} priority · ${selectedAlert.department} · ${selectedAlert.tool}`}
          onClose={() => setSelectedAlert(null)}
        >
          <div className="alert-detail">
            <div>
              <b>Observed change</b>
              <p>
                {selectedAlert.change} — {selectedAlert.baseline}
              </p>
            </div>
            <div>
              <b>Suggested investigation</b>
              <p>{selectedAlert.recommendation}</p>
            </div>
            <div className="demo-action-note">
              This is a sample signal. It is not a finding of wrongdoing and no
              external action is taken.
            </div>
            <button
              className="button secondary"
              onClick={() =>
                setFollowedAlerts((current) =>
                  current.includes(selectedAlert.id)
                    ? current
                    : [...current, selectedAlert.id],
                )
              }
            >
              {followedAlerts.includes(selectedAlert.id)
                ? "Added to follow-up"
                : "Mark for follow-up"}
            </button>
          </div>
        </DetailDialog>
      )}
      {selectedDepartment && (
        <DetailDialog
          title={`${selectedDepartment} usage`}
          subtitle="Department drill-down · sample data"
          onClose={() => setSelectedDepartment(null)}
        >
          <div className="department-detail">
            <div className="detail-stat-row">
              <span>Active users</span>
              <b>
                {departmentMetrics.find((item) => item.name === selectedDepartment)?.activeUsers == null ? "Unavailable" : departmentMetrics.find((item) => item.name === selectedDepartment)?.activeUsers}
              </b>
            </div>
            <div className="detail-stat-row">
              <span>Spend</span>
              <b>
                {formatMoney(
                  departmentMetrics.find(
                    (item) => item.name === selectedDepartment,
                  )?.spend || 0,
                )}
              </b>
            </div>
            <div className="detail-stat-row">
              <span>Monthly budget</span>
              <b>
                {formatMoney(
                  departmentBudgetOverrides[selectedDepartment] ??
                    departmentCatalog.find(
                      (item) => item.name === selectedDepartment,
                    )?.monthlyBudget ??
                    0,
                )}
              </b>
            </div>
            {selectedDepartment === "Unattributed" ? <><h3>Unattributed tools</h3><ul>{getToolsForMonth(month).filter((tool) => !tool.ownerDepartment).map((tool) => <li key={tool.id}><button className="text-button" onClick={() => setSelectedTool(tool)}>{tool.name}</button><small> · {formatMoney(tool.spend)} · {tool.provider}</small></li>)}</ul><p className="demo-action-note">Costs remain here until an owner is confirmed. They are not spread across departments.</p></> : <><h3>Tools used by this department</h3><ul>{getToolsForMonth(month, { department: selectedDepartment }).map((tool) => <li key={tool.id}><button className="text-button" onClick={() => setSelectedTool(tool)}>{tool.name}</button><small> · {tool.kind} · {formatMoney(tool.spend)}</small></li>)}</ul><p className="demo-action-note">Usage is shown at team level. Individual browsing and activity history are not part of this prototype.</p></>}
            {selectedDepartment !== "Unattributed" && <label className="budget-edit">
              Demo budget limit{" "}
              <input
                type="number"
                min="0"
                step="500"
                defaultValue={
                  departmentBudgetOverrides[selectedDepartment] ??
                  departmentCatalog.find(
                    (item) => item.name === selectedDepartment,
                  )?.monthlyBudget ??
                  0
                }
                onChange={(event) =>
                  (event.target.dataset.pending = event.target.value)
                }
              />
            </label>}
            {selectedDepartment !== "Unattributed" && <button
              className="button secondary"
              onClick={(event) => {
                const input =
                  event.currentTarget.previousElementSibling.querySelector(
                    "input",
                  );
                setDepartmentBudgetOverrides((current) => ({
                  ...current,
                  [selectedDepartment]: Number(
                    input.dataset.pending ?? input.value,
                  ),
                }));
                const updatedBudget = Number(input.dataset.pending ?? input.value);
                setAuditEvents((current) => [{ id: `event-${Date.now()}`, actor: "Jordan Davis · IT Operations", action: "Department budget updated", resource: `${selectedDepartment} · ${formatMoney(updatedBudget)}`, timestamp: new Date().toISOString() }, ...current]);
                setNotice("Demo budget updated");
              }}
            >
              Save demo budget
            </button>}
            {selectedDepartment !== "Unattributed" && <button className="button secondary" onClick={() => setRequestTarget(`department:${selectedDepartment}`)}>Request extra budget</button>}
            <p className="demo-action-note">
              Budget changes are stored only in this browser session; no finance
              system is updated.
            </p>
          </div>
        </DetailDialog>
      )}
      {selectedModel && (
        <DetailDialog
          title={selectedModel.model}
          subtitle={`${selectedModel.provider} · ${selectedModel.department} · sample telemetry`}
          onClose={() => setSelectedModel(null)}
        >
          <div className="model-detail">
            <div className="detail-stat-row"><span>API requests</span><b>{selectedModel.requests.toLocaleString()}</b></div>
            <div className="detail-stat-row"><span>Input tokens</span><b>{selectedModel.inputTokens.toLocaleString()}</b></div>
            <div className="detail-stat-row"><span>Output tokens</span><b>{selectedModel.outputTokens.toLocaleString()}</b></div>
            <div className="detail-stat-row"><span>Associated API cost</span><b>{formatMoney(selectedModel.spend)}</b></div>
            <div className="detail-stat-row"><span>Average cost per request</span><b>${selectedModel.averageCostPerRequest.toFixed(4)}</b></div>
            <p className="demo-action-note">Costs are sample estimates attached to API usage. Subscription fees are recorded separately at the tool level.</p>
          </div>
        </DetailDialog>
      )}
      {selectedLicense && (
        <DetailDialog
          title={selectedLicense.product}
          subtitle={`${selectedLicense.provider} · ${selectedLicense.department} · sample license data`}
          onClose={() => setSelectedLicense(null)}
        >
          <div className="license-detail">
            <div className="detail-stat-row"><span>Purchased seats</span><b>{selectedLicense.purchased}</b></div>
            <div className="detail-stat-row"><span>Assigned seats</span><b>{selectedLicense.assigned}</b></div>
            <div className="detail-stat-row"><span>Observed active</span><b>{selectedLicense.active}</b></div>
            <div className="detail-stat-row"><span>Assigned with no observed activity</span><b>{selectedLicense.inactiveAssigned}</b></div>
            <div className="detail-stat-row"><span>Estimated potential monthly value</span><b>{formatMoney(selectedLicense.estimatedMonthlySavings)}</b></div>
            <p className="demo-action-note">This estimate uses sample seat prices. Confirm activity, owner, and contract terms before reclaiming a seat.</p>
            <button className="button secondary" onClick={() => setLicenseReviewIds(current => current.includes(selectedLicense.id) ? current : [...current, selectedLicense.id])}>
              {licenseReviewIds.includes(selectedLicense.id) ? "Added to reclamation review" : "Mark for reclamation review"}
            </button>
          </div>
        </DetailDialog>
      )}
      {selectedIntegration && (
        <DetailDialog
          title={selectedIntegration.name}
          subtitle={`${selectedIntegration.provider} · ${selectedIntegration.status}`}
          onClose={() => setSelectedIntegration(null)}
        >
          <div className="integration-detail">
            <div className="detail-stat-row"><span>Last successful sync</span><b>{selectedIntegration.lastSync}</b></div>
            <div className="detail-stat-row"><span>Field coverage</span><b>{selectedIntegration.coveragePercent}%</b></div>
            <b>Sample data available</b>
            <ul>{selectedIntegration.coverage.map(item => <li key={item}>{item}</li>)}</ul>
            <p className="demo-action-note">{selectedIntegration.status === "Healthy" ? "Sample status only. This prototype has no live integration." : "This source is delayed or partial; a real dashboard should qualify affected totals until the source recovers."}</p>
          </div>
        </DetailDialog>
      )}
      <RequestBudgetModal open={Boolean(requestTarget)} target={requestTarget || ""} tools={getToolsForMonth(month)} departments={departmentCatalog} threshold={routingThreshold} onThresholdChange={setRoutingThreshold} onClose={closeBudgetRequest} onSubmit={submitBudgetRequest} />
      {notice && (
        <div className="modal-backdrop" onClick={() => setNotice(null)}>
          <section
            className="info-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setNotice(null)}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <div className="modal-icon">
              <ShieldCheck size={19} />
            </div>
            <h2 id="notice-title">{notice}</h2>
            <p>
              {notice === "Demo budget updated"
                ? "The sample department budget was updated in this prototype only. No external system was changed."
                : `${notice} is represented with sample data. A live implementation would show source, coverage, last sync time, and any review actions supported by that system.`}
            </p>
            <div className="modal-example">
              <b>Potential source types</b>
              <span>AI vendor admin and usage reports</span>
              <span>Company sign-in directory (SSO)</span>
              <span>Billing and procurement records</span>
              <span>Security tools that identify AI services</span>
            </div>
            <button className="button primary" onClick={() => setNotice(null)}>
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
