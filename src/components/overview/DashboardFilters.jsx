import { CalendarDays, Download } from "lucide-react";
import Select from "../shared/Select";
import { departmentCatalog, periodOptions, toolCatalog } from "../../data/demoData";

const providers = ["All providers", ...new Set(toolCatalog.map((tool) => tool.provider))];
const departments = ["All departments", ...departmentCatalog.map((department) => department.name)];

export default function DashboardFilters({ selectedMonth, setSelectedMonth, range, setRange, granularity, setGranularity, department, setDepartment, provider, setProvider, onExport }) {
  return <div className="heading-actions">
    <div className="filter-wrap"><CalendarDays size={14} /><Select label="Select month" value={selectedMonth} onChange={setSelectedMonth} options={periodOptions.map((item) => ({ value: item.month, label: `${item.month} ${item.year}` }))} /></div>
    <div className="filter-wrap"><Select label="Chart date range" value={range} onChange={setRange} options={["Selected month", "Last 3 months", "Last 6 months"].map((item) => ({ value: item, label: item }))} /></div>
    <div className="filter-wrap"><Select label="Group chart by time" value={granularity} onChange={setGranularity} options={[{ value: "month", label: "Monthly" }, { value: "week", label: "Weekly" }]} /></div>
    <div className="filter-wrap"><Select label="Filter by department" value={department} onChange={setDepartment} options={departments.map((item) => ({ value: item, label: item }))} /></div>
    <div className="filter-wrap"><Select label="Filter by provider" value={provider} onChange={setProvider} options={providers.map((item) => ({ value: item, label: item }))} /></div>
    <button className="button primary" onClick={onExport}><Download size={15} /> Export report</button>
  </div>;
}
