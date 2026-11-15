import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const levelDefaults = [
  { level: "Individual contributor", initial: 500 },
  { level: "Team lead", initial: 2000 },
  { level: "Department owner", initial: 8000 },
];

export default function LimitPolicyPanel({ departmentCatalog, departmentBudgetOverrides, onDepartmentBudgetChange }) {
  const [levels, setLevels] = useState(levelDefaults);
  const [guardrail, setGuardrail] = useState(500);
  const [peopleCap, setPeopleCap] = useState("Soft");
  const [apiCap, setApiCap] = useState("Hard");
  return <section className="panel limit-policy-panel" id="limit-policy">
    <div className="panel-head"><div><div className="heading-with-tip"><div><h2><SlidersHorizontal size={14}/> Limit policy</h2><p>Illustrative defaults for the detailed view. Edits stay in this browser session.</p></div></div></div><span className="license-demo-badge">LOCAL DEMO SETTINGS</span></div>
    <div className="limit-policy-grid">
      <div className="limit-policy-group"><h3>Default limit by department</h3><div className="limit-policy-list">{departmentCatalog.map((department) => <label key={department.name}><span>{department.name}</span><span className="policy-money"><span>$</span><input aria-label={`${department.name} default monthly limit`} type="number" min="0" step="500" value={departmentBudgetOverrides[department.name] ?? department.monthlyBudget} onChange={(event) => onDepartmentBudgetChange(department.name, Number(event.target.value))}/></span></label>)}</div></div>
      <div className="limit-policy-group"><h3>Default limit by access level</h3><div className="limit-policy-list">{levels.map((item) => <label key={item.level}><span>{item.level}</span><span className="policy-money"><span>$</span><input aria-label={`${item.level} default monthly limit`} type="number" min="0" step="100" value={item.initial} onChange={(event) => setLevels((current) => current.map((level) => level.level === item.level ? { ...level, initial: Number(event.target.value) } : level))}/></span></label>)}</div><label className="guardrail-field">Per-user guardrail <span className="policy-money"><span>$</span><input aria-label="Per-user monthly guardrail" type="number" min="0" step="50" value={guardrail} onChange={(event) => setGuardrail(Number(event.target.value))}/><small>/ month</small></span></label></div>
      <div className="limit-policy-group cap-policy-group"><h3>Cap behavior</h3><p>Choose whether reaching a limit warns or stops API usage.</p><label className="cap-toggle"><span><b>People</b><small>Warn before the limit</small></span><button type="button" className={`policy-switch ${peopleCap === "Hard" ? "is-on" : ""}`} role="switch" aria-checked={peopleCap === "Hard"} aria-label="Use a hard cap for people" onClick={() => setPeopleCap((value) => value === "Soft" ? "Hard" : "Soft")}><i/></button><strong>{peopleCap} cap</strong></label><label className="cap-toggle"><span><b>API keys</b><small>Stop API usage at the limit</small></span><button type="button" className={`policy-switch ${apiCap === "Hard" ? "is-on" : ""}`} role="switch" aria-checked={apiCap === "Hard"} aria-label="Use a hard cap for API keys" onClick={() => setApiCap((value) => value === "Soft" ? "Hard" : "Soft")}><i/></button><strong>{apiCap} cap</strong></label></div>
    </div>
    <p className="limit-policy-note">Soft caps show a warning. Hard caps stop usage at the limit. These settings only illustrate policy behavior; they do not enforce access.</p>
  </section>;
}
