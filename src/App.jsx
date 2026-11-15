import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleHelp,
  ShieldCheck,
  X,
  SearchIcon
} from "lucide-react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MetricCard from "./components/overview/MetricCard";
const SpendChart = React.lazy(() => import("./components/overview/Charts").then((module) => ({ default: module.SpendChart })));
const DepartmentChart = React.lazy(() => import("./components/overview/Charts").then((module) => ({ default: module.DepartmentChart })));
const SpendByToolChart = React.lazy(() => import("./components/overview/Charts").then((module) => ({ default: module.SpendByToolChart })));
import { DetailDialog, ToolDrawer, ToolsTable } from "./components/shared/ToolsTable";
import RequestBudgetModal from "./components/shared/RequestBudgetModal";
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
  departmentCatalog,
  employees,
  formatMoney,
  periodOptions,
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

export default function App() {
  const [active, setActive] = useState("Overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [displayMode, setDisplayMode] = useState("quick");
  const [page, setPage] = useState(location.hash === "#dashboard" ? "dashboard" : "docs");
  const [selectedMonth, setSelectedMonth] = useState("Nov");
  const [range, setRange] = useState("Last 6 months");
  const [granularity, setGranularity] = useState("month");
  const [department, setDepartment] = useState("All departments");
  const [provider, setProvider] = useState("All providers");
  const [departmentMetric, setDepartmentMetric] = useState("users");
  const [spendGroup, setSpendGroup] = useState("tool");
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [licenseReviewIds, setLicenseReviewIds] = useState([]);
  const [notice, setNotice] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [followedAlerts, setFollowedAlerts] = useState([]);
  const [governanceOverrides, setGovernanceOverrides] = useState({});
  const [departmentBudgetOverrides, setDepartmentBudgetOverrides] = useState(
    {},
  );
  const [budgetRequests, setBudgetRequests] = useState([]);
  const [requestTarget, setRequestTarget] = useState(null);
  const [routingThreshold, setRoutingThreshold] = useState(2500);

  useEffect(() => {
    if (
      location.hash === "#dashboard" &&
      !localStorage.getItem("cloudeagle-ai-governance-tour-seen")
    )
      setTourOpen(true);
  }, []);
  useEffect(() => {
    const syncRoute = () =>
      setPage(
        location.hash === "#dashboard" ? "dashboard" : "docs",
      );
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
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
      ? `${current >= previous ? "↑" : "↓"} ${Math.abs(((current - previous) / Math.max(1, previous)) * 100).toFixed(1)}%`
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
            toolId: tool.id,
            provider: tool.provider,
          })),
    [spendGroup, providersSpend, filteredTools],
  );
  const alerts = useMemo(
    () => getAlerts({ month, department, provider }),
    [month, department, provider],
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
  const integrations = useMemo(
    () => getIntegrationMetrics({ provider }),
    [provider],
  );
  const apiTools = getToolsForMonth(month, { department, provider }).filter(
    (tool) => tool.kind === "API consumption",
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
    localStorage.setItem("cloudeagle-ai-governance-tour-seen", "1");
  }, []);
  const closeBudgetRequest = useCallback(() => setRequestTarget(null), []);
  const submitBudgetRequest = ({ amount, reason, duration, target, route }) => {
    setBudgetRequests((current) => [{
      id: `request-${Date.now()}`,
      target,
      amount,
      reason,
      duration,
      route,
      requester: "Jordan Davis · IT Operations",
      status: "Pending approval",
      expiresAt: duration === "This cycle only" ? "Expires at cycle end" : `Expires ${duration.replace("Until ", "on ")}`,
    }, ...current]);
    closeBudgetRequest();
  };
  const decideBudgetRequest = (id, status) => setBudgetRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
  const goBack = () => {
    history.replaceState(null, "", location.pathname + location.search + "#dashboard");
    setPage("dashboard");
  };
  const startTour = () => {
    setDisplayMode("analysis");
    setTourStep(0);
    if (page === "behind") {
      goBack();
      setTimeout(() => setTourOpen(true), 120);
    } else setTourOpen(true);
  };
  const openBehind = () => {
    history.replaceState(null, "", location.pathname + location.search);
    setPage("docs");
    setTourOpen(false);
  };
  const goToDetailedSection = (id) => {
    setDisplayMode("analysis");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };
  const navigate = (section) => {
    setActive(section);
    if (section === "Integrations") {
      goToDetailedSection("integration-health");
      return;
    }
    if (section === "Access controls") {
      setNotice("Access controls");
      return;
    }
    if (section === "Policies") {
      goToDetailedSection("policy-alert-list");
      return;
    }
    const targets = {
      Overview: "page-top",
      "AI tools": "tools-table",
      People: "people-chart",
      Budgets: "budget-chart",
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
  const onSearchEmployee = (employee) => {
    setQuery("");
    setSelectedEmployee(employee);
  };
  const onDepartmentSelect = (name) => {
    setDepartment(name);
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
  const filteredSpend = summary.spend;
  const filteredBudget = summary.budget;
  const toolCount = toolCatalog.length;
  const activeAPIProviders = [
    ...new Set(apiTools.map((tool) => tool.provider)),
  ];
  const markedAlerts = followedAlerts.length;

  return (
    page === "docs" ? <React.Suspense fallback={<main className="docs-loading" aria-live="polite">Loading product brief…</main>}><BehindDashboard onBack={goBack} /></React.Suspense> :
    <div
      className={`app-shell ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`}
    >
      <Sidebar
        active={active}
        onNavigate={navigate}
        onHelp={startTour}
        collapsed={sidebarCollapsed}
      />
      <main className="main-area">
        <Header
          query={query}
          setQuery={setQuery}
          searchResults={searchResults}
          onSelectTool={onSearchTool}
          onSelectEmployee={onSearchEmployee}
          onHelp={startTour}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
          sidebarCollapsed={sidebarCollapsed}
          onBehind={openBehind}
          currentPage="dashboard"
          onAlerts={() => goToDetailedSection("policy-alert-list")}
        />
        {
          <div className="content" id="page-top">
            <section className="page-heading">
              <div>
                <div className="eyebrow">
                  <span className="live-dot" /> AI GOVERNANCE{" "}
                  <span className="eyebrow-sep">·</span>{" "}
                  {month.month.toUpperCase()} {month.year}{" "}
                  <span className="demo-tag">DEMO DATA</span>
                </div>
                <h1>
                  AI usage &amp; spend
                </h1>
                <p>
                  See where teams use AI, what it costs, and what needs a closer look.
                </p>
                <ViewModeSwitch value={displayMode} onChange={setDisplayMode} />
              </div>
              <DashboardFilters selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} range={range} setRange={setRange} granularity={granularity} setGranularity={setGranularity} department={department} setDepartment={setDepartment} provider={provider} setProvider={setProvider} onExport={exportCsv} detailed={displayMode === "analysis"} />
            </section>
            <div className="plain-banner">
              <CircleHelp size={15} />
              <span>
                <b>This period:</b> {formatMoney(summary.spend)} spent of {formatMoney(summary.budget)} budget. {summary.reviewCount} tools need review.
              </span>
              <button onClick={startTour}>
                Take the quick tour <span>→</span>
              </button>
            </div>
            <section className="metrics" aria-label="Organization summary">
              <div id="metric-spend">
                <MetricCard
                  kind="Wallet"
                  label="AI SPEND"
                  value={formatMoney(summary.spend)}
                  unit="USD"
                  trend={delta(
                    summary.spend,
                    monthIndex > 0 ? previousSummary.spend : null,
                  )}
                  trendText={`vs. ${previousMonth.month}`}
                  foot={`of ${formatMoney(summary.budget)} budget`}
                  progress={
                    summary.budget
                      ? Math.min(100, (summary.spend / summary.budget) * 100)
                      : 0
                  }
                  status="Spend combines the mock subscription charges and API consumption records for the current filters. Budget is a separate configured allowance."
                  onClick={() =>
                    document
                      .getElementById("budget-chart")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                />
              </div>
              <div>
                <MetricCard
                  kind="Users"
                  label="ACTIVE USERS"
                  value={summary.users.toLocaleString()}
                  unit="in selected period"
                  trend={delta(
                    summary.users,
                    monthIndex > 0 ? previousSummary.users : null,
                  )}
                  trendText={`vs. ${previousMonth.month}`}
                  foot="People, not requests or tokens"
                  progress={(summary.users / 620) * 100}
                  status="Organization active users are unique in the sample. Provider-filtered counts are estimates; people can use more than one provider, so provider counts should not be added together."
                  onClick={() =>
                    document
                      .getElementById("people-chart")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                />
              </div>
              <div>
                <MetricCard
                  kind="Zap"
                  label="AI TOOLS FOUND"
                  value={summary.toolCount.toLocaleString()}
                  unit="in selected filters"
                  foot={
                    <>
                      <span className="tool-status">
                        <i className="status-dot" /> {summary.approvedCount}{" "}
                        approved
                      </span>
                      <span className="tool-status warn">
                        <i /> {summary.reviewCount} need review
                      </span>
                    </>
                  }
                  status="Count of tools visible with the selected department and provider filters. Tools marked review needed require a human to confirm their use."
                  onClick={() =>
                    document
                      .getElementById("tools-table")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                />
              </div>
              <div>
                <MetricCard
                  kind="ShieldCheck"
                  label="ITEMS TO REVIEW"
                  value={alerts.length.toLocaleString()}
                  unit="for review"
                  foot={
                    <>
                      <span className="alert-pill">
                        {
                          alerts.filter((alert) => alert.severity === "High")
                            .length
                        }{" "}
                        high priority
                      </span>
                      <span>
                        {markedAlerts
                          ? `${markedAlerts} followed up locally`
                          : "sample signals"}
                      </span>
                    </>
                  }
                  status="Sample signals that may require investigation. An anomaly is not proof of malicious or policy-violating behavior."
                  onClick={() => goToDetailedSection("policy-alert-list")}
                />
              </div>
            </section>
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
              />
              <DepartmentChart
                data={departmentMetrics}
                metric={departmentMetric}
                setMetric={setDepartmentMetric}
                activeUsers={summary.users}
                onDepartmentSelect={onDepartmentSelect}
              /></React.Suspense>
            </section>
            {displayMode === "analysis" && <React.Suspense fallback={<div className="panel chart-loading" aria-live="polite">Loading spend analysis…</div>}><div className="analysis-enter"><SpendByToolChart
              data={spendChartData}
              groupBy={spendGroup}
              setGroupBy={setSpendGroup}
              onSelect={onBarSelect}
            /></div></React.Suspense>}
            <ToolsTable
              tools={filteredTools}
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
            <AlertsPanel alerts={alerts} onSelect={setSelectedAlert} budgetRequests={budgetRequests} onRequestDecision={decideBudgetRequest} />
            <LimitPolicyPanel departmentCatalog={departmentCatalog} departmentBudgetOverrides={departmentBudgetOverrides} onDepartmentBudgetChange={(name, value) => setDepartmentBudgetOverrides((current) => ({ ...current, [name]: value }))} />
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
          </div>
        }
      </main>
      <ToolDrawer
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
        onGovernanceChange={updateGovernance}
        onRequestBudget={(tool) => setRequestTarget(`${tool.name} (${tool.ownerDepartment})`)}
      />
      <Tour
        open={tourOpen}
        step={tourStep}
        setStep={setTourStep}
        onClose={onCloseTour}
      />
      {selectedEmployee && (
        <DetailDialog
          title={selectedEmployee.name}
          subtitle={`${selectedEmployee.role} · ${selectedEmployee.department} · illustrative employee data`}
          onClose={() => setSelectedEmployee(null)}
        >
          <div className="employee-detail">
            <b>Observed tool activity</b>
            <p>
              {selectedEmployee.activeDays} active days in the sample period ·{" "}
              {formatMoney(selectedEmployee.monthlySpend)} associated sample
              spend
            </p>
            <b>Tools</b>
            <ul>
              {selectedEmployee.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
            <small>
              Person-level visibility depends on provider attribution and
              organization access rules.
            </small>
          </div>
        </DetailDialog>
      )}
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
                {departmentMetrics.find(
                  (item) => item.name === selectedDepartment,
                )?.activeUsers || 0}
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
            <h3>People to review</h3>
            <ul>
              {employees
                .filter((person) => person.department === selectedDepartment)
                .map((person) => (
                  <li key={person.id}>
                    {person.name}{" "}
                    <small>
                      · {person.role} · {person.activeDays} active days
                    </small>
                  </li>
                ))}
            </ul>
            <label className="budget-edit">
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
            </label>
            <button
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
                setNotice("Demo budget updated");
              }}
            >
              Save demo budget
            </button>
            <button className="button secondary" onClick={() => setRequestTarget(`${selectedDepartment} department budget`)}>Request extra budget</button>
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
      <RequestBudgetModal open={Boolean(requestTarget)} target={requestTarget || ""} threshold={routingThreshold} onThresholdChange={setRoutingThreshold} onClose={closeBudgetRequest} onSubmit={submitBudgetRequest} />
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
