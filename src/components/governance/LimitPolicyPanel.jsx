import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const levelDefaults = [
  { level: "Individual contributor", initial: 500 },
  { level: "Team lead", initial: 2000 },
  { level: "Department owner", initial: 8000 },
];

export default function LimitPolicyPanel({ departmentCatalog, departmentBudgetOverrides, onDepartmentBudgetChange, thresholds, onThresholdChange }) {
  const [levels, setLevels] = useState(levelDefaults);
  const [guardrail, setGuardrail] = useState(500);
  const [peopleCap, setPeopleCap] = useState("Soft");
  const [apiCap, setApiCap] = useState("Hard");
  return <section className="panel limit-policy-panel" id="limit-policy">
    <div className="panel-head"><div><div className="heading-with-tip"><div><h2><SlidersHorizontal size={14}/> Limit policy</h2><p>Illustrative defaults for the detailed view. Edits stay in this browser session.</p></div></div></div><span className="license-demo-badge">LOCAL DEMO SETTINGS</span></div>
    <div className="limit-policy-grid">
      <div className="limit-policy-group"><h3>Default limit by department</h3><div className="limit-policy-list">{departmentCatalog.map((department) => <label key={department.name}><span>{department.name}</span><span className="policy-money"><span>$</span><input aria-label={`${department.name} default monthly limit`} type="number" min="0" step="500" value={departmentBudgetOverrides[department.name] ?? department.monthlyBudget} onChange={(event) => onDepartmentBudgetChange(department.name, Number(event.target.value))}/></span></label>)}</div></div>
      <div className="limit-policy-group"><h3>Default limit by access level</h3><div className="limit-policy-list">{levels.map((item) => <label key={item.level}><span>{item.level}</span><span className="policy-money"><span>$</span><input aria-label={`${item.level} default monthly limit`} type="number" min="0" step="100" value={item.initial} onChange={(event) => setLevels((current) => current.map((level) => level.level === item.level ? { ...level, initial: Number(event.target.value) } : level))}/></span></label>)}</div><label className="guardrail-field">Per-user guardrail <span className="policy-money"><span>$</span><input aria-label="Per-user monthly guardrail" type="number" min="0" step="50" value={guardrail} onChange={(event) => setGuardrail(Number(event.target.value))}/><small>/ month</small></span></label></div>
      <div className="limit-policy-group cap-policy-group"><h3>Cap behavior</h3><p>Monitoring and alerts work in this prototype. Provider-side blocking is not simulated.</p><label className="cap-toggle"><span><b>People</b><small>Soft warnings for people</small></span><button type="button" className={`policy-switch ${peopleCap === "Hard" ? "is-on" : ""}`} role="switch" aria-checked={peopleCap === "Hard"} aria-label="Use a hard cap for people" onClick={() => setPeopleCap((value) => value === "Soft" ? "Hard" : "Soft")}><i/></button><strong>{peopleCap} cap</strong></label><label className="cap-toggle"><span><b>API keys</b><small>Hard caps only where a provider supports it</small></span><button type="button" className={`policy-switch ${apiCap === "Hard" ? "is-on" : ""}`} role="switch" aria-checked={apiCap === "Hard"} aria-label="Use a hard cap for API keys" onClick={() => setApiCap((value) => value === "Soft" ? "Hard" : "Soft")}><i/></button><strong>{apiCap} cap</strong></label></div>
      {thresholds && <div className="limit-policy-group threshold-policy-group"><h3>Alert thresholds</h3><p>Illustrative thresholds used by the overview and tool inventory.</p>{[["approaching","Approaching limit"],["high","High utilization"],["reached","Limit reached"]].map(([key,label])=><label key={key} className="threshold-row"><span>{label}</span><span className="policy-money"><input aria-label={`${label} percent`} type="number" min="1" max="200" step="1" value={Math.round(thresholds[key]*100)} onChange={(event)=>onThresholdChange(key,Math.max(1,Number(event.target.value)||1)/100)}/><small>%</small></span></label>)}</div>}
    </div>
    <p className="limit-policy-note">These local controls illustrate intended policy behavior. They do not enforce access, change a provider quota, or guarantee that a provider supports a hard limit.</p>
  </section>;
}
