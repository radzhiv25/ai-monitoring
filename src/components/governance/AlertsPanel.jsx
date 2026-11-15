import React from 'react';
import { ArrowUpRight, ShieldAlert } from 'lucide-react';
import HelpTip from '../shared/HelpTip';
export default function AlertsPanel({ alerts, onSelect }) {
 return <section className="panel alerts-panel" id="policy-alert-list"><div className="panel-head"><div className="heading-with-tip"><div><h2>Policy and usage alerts</h2><p>Signals for a person to investigate. An alert is not a finding of wrongdoing.</p></div><HelpTip>These examples compare observed sample activity against a simple baseline. A real product would disclose the source data and baseline quality.</HelpTip></div><span className="alerts-count">{alerts.length} items</span></div><div className="alert-list">{alerts.map(alert=><button key={alert.id} className="alert-row" onClick={()=>onSelect(alert)}><span className={`severity-dot ${alert.severity.toLowerCase()}`}/><span className="alert-main"><b>{alert.title}</b><small>{alert.department} · {alert.tool}</small></span><span className="alert-change"><b>{alert.change}</b><small>{alert.baseline}</small></span><ArrowUpRight size={15}/></button>)}</div></section>
}
