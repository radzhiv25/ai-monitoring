import React from 'react';
import { ArrowUpRight, CircleHelp } from 'lucide-react';
import HelpTip from '../shared/HelpTip';
export default function IntegrationHealth({ integrations, onSelect }) {
 const issueCount=integrations.filter(item=>item.status!=='Healthy').length;
 return <section className="panel integration-panel" id="integration-health"><div className="panel-head"><div className="heading-with-tip"><div><h2>Data source health</h2><p>Sync status and coverage for the data behind this view.</p></div><HelpTip>Coverage is the sample estimate of fields available from each source. Delayed or partial sources can make totals incomplete; they should not be shown as fully current.</HelpTip></div><span className={`integration-overall ${issueCount?'has-issues':''}`}>{issueCount?`${issueCount} need attention`:'All healthy'}</span></div>
  <div className="integration-list">{integrations.map(item=><button className="integration-row" key={item.id} onClick={()=>onSelect(item)}><span className={`integration-status-dot ${item.status==='Healthy'?'healthy':item.status==='Delayed'?'delayed':'partial'}`}/><span className="integration-name"><b>{item.name}</b><small>{item.provider} · {item.lastSync}</small></span><span className="coverage-cell"><span>{item.coveragePercent}% coverage</span><i><b style={{width:`${item.coveragePercent}%`}}/></i></span><span className={`integration-status ${item.status==='Healthy'?'healthy':item.status==='Delayed'?'delayed':'partial'}`}>{item.status}</span><ArrowUpRight size={14}/></button>)}</div>
  <div className="integration-foot"><CircleHelp size={13}/>Demo sync times are illustrative; no integrations are connected.</div>
 </section>;
}
