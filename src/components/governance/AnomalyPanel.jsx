import React from 'react';
import { ArrowUpRight, Activity } from 'lucide-react';
import HelpTip from '../shared/HelpTip';
export default function AnomalyPanel({ alerts, onSelect }) {
 return <section className="panel anomaly-panel" id="usage-anomalies"><div className="panel-head"><div className="heading-with-tip"><div><h2>Usage changes to investigate</h2><p>Changes against the prior sample period that may deserve a closer look.</p></div><HelpTip>Signals compare sample requests or token counts with the prior month or personal baseline. They highlight unusual change; they do not decide whether the activity is allowed.</HelpTip></div><span className="anomaly-count"><Activity size={13}/>{alerts.length} signals</span></div>
  {alerts.length?<div className="anomaly-grid">{alerts.map(alert=><button key={alert.id} className="anomaly-card" onClick={()=>onSelect(alert)}><span className={`severity-tag ${alert.severity.toLowerCase()}`}>{alert.severity} · investigate</span><b>{alert.title}</b><span className="anomaly-delta">{alert.change}</span><small>{alert.department} · {alert.tool}</small><span className="anomaly-baseline">Baseline: {alert.baseline}</span><span className="anomaly-action">Inspect signal <ArrowUpRight size={12}/></span></button>)}</div>:<div className="anomaly-empty">No sample anomalies meet the selected filters and baseline threshold.</div>}
  <div className="anomaly-disclaimer">An anomaly is not a finding of malicious activity or a policy violation. Confirm data coverage and context with the owner.</div>
 </section>;
}
