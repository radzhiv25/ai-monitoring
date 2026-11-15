import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, CircleHelp, Ellipsis, X } from 'lucide-react';
import HelpTip from './HelpTip';
import ProviderLogo from './ProviderLogo';
import { departmentCatalog, formatMoney, licenseCatalog } from '../../data/demoData';

export function ToolsTable({ tools, onSelect, onShowAll, totalCount, maxRows, thresholds = { approaching: .8, high: .9, reached: 1 } }) {
  const [sortKey,setSortKey]=useState('spend');
  const [direction,setDirection]=useState('desc');
  const sorted=useMemo(()=>[...tools].sort((a,b)=>{
    const aVal=a[sortKey]??'';const bVal=b[sortKey]??'';
    const result=typeof aVal==='number'?aVal-bVal:String(aVal).localeCompare(String(bVal));
    return direction==='asc'?result:-result;
  }),[tools,sortKey,direction]);
  const visibleRows = maxRows ? sorted.slice(0, maxRows) : sorted;
  const sort=(key)=>{if(key===sortKey)setDirection(direction==='asc'?'desc':'asc');else{setSortKey(key);setDirection(key==='name'?'asc':'desc')}};
  const SortButton=({label,field})=><button className="sort-button" onClick={()=>sort(field)}>{label}{sortKey===field&&(direction==='asc'?<ArrowUp size={11}/>:<ArrowDown size={11}/>)}</button>;
  return <section className="panel tools-panel" id="tools-table"><div className="panel-head tools-head"><div className="heading-with-tip"><div><h2>AI tools &amp; spend limits</h2><p>{maxRows ? `Top 5 by spend · ${totalCount} match your filters` : "Spend, approval status, and ownership for connected AI services."}</p></div><HelpTip>Subscription costs and API consumption costs are displayed as separate tool types. A provider may not report employee attribution for every kind of usage.</HelpTip></div>{(!maxRows || totalCount > maxRows) && <button className="button view-all" onClick={onShowAll}>{maxRows ? `View all ${totalCount} tools` : "View all tools"} <ArrowUpRight size={14}/></button>}</div>
    <div className="table-wrap"><table><thead><tr><th><SortButton label="TOOL" field="name"/></th><th><SortButton label="OWNER / TEAM" field="ownerDepartment"/></th><th><SortButton label="ACTIVE USERS" field="activeUsers"/></th><th><SortButton label="MONTHLY SPEND" field="spend"/></th><th><SortButton label="SPEND LIMIT" field="monthlyLimit"/></th><th><SortButton label="GOVERNANCE" field="governance"/></th><th/></tr></thead><tbody>{visibleRows.map(t=><tr key={t.id} onClick={()=>onSelect(t)} tabIndex="0" aria-label={`View details for ${t.name}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(t)}}}>
      <td><div className="tool-cell"><ProviderLogo provider={t.provider} className={`tool-logo ${t.tone||'mint'}`} /><div><b>{t.name}</b><small>{t.provider} · {t.kind}</small></div></div></td>
      <td>{t.ownerDepartment||<span className="unattributed-label">Unattributed</span>}</td><td>{t.activeUsers.toLocaleString()}</td><td className="spend-cell">{formatMoney(t.spend)}</td><td><div className="limit-cell"><div className="limit-numbers"><span>{formatMoney(t.spend)}</span><span>{formatMoney(t.monthlyLimit)}</span></div><div className="progress slim"><i className={t.spend/t.monthlyLimit>=thresholds.approaching?'near':''} style={{width:`${Math.min(100,t.spend/t.monthlyLimit*100)}%`}}/></div><div className="tool-budget-status"><span>{formatMoney(Math.max(0,t.monthlyLimit-t.spend))} remaining</span><b>{t.spend>t.monthlyLimit?'Over limit':t.spend/t.monthlyLimit>=thresholds.reached?'Limit reached':t.spend/t.monthlyLimit>=thresholds.high?'High utilization':t.spend/t.monthlyLimit>=thresholds.approaching?'Approaching limit':'Within limit'}</b></div></div></td>
      <td><span className={`status ${t.governance==='Approved'?'ok-status':'review-status'}`}><i/>{t.governance}</span></td><td><button className="row-more" aria-label={`Details for ${t.name}`} onClick={e=>{e.stopPropagation();onSelect(t)}}><Ellipsis size={17}/></button></td>
    </tr>)}{tools.length===0&&<tr><td colSpan="7" className="empty-results">No matching tools found. Try another search or filter.</td></tr>}</tbody></table></div>
    <div className="table-footer"><span>Showing <b>{visibleRows.length}</b> of <b>{totalCount ?? 12}</b> connected tools</span><span>Demo inventory · selecting a row opens details</span></div>
  </section>;
}

export function ToolDrawer({ tool, onClose, onGovernanceChange, onRequestBudget, thresholds = { approaching: .8, high: .9, reached: 1 }, departmentMetrics = [], departmentBudgetOverrides = {}, temporaryExceptions = [] }) {
 const [confirmAction,setConfirmAction]=useState(null);
 if (!tool) return null;
 const needsReview=tool.governance!=='Approved';
 const license=licenseCatalog.find((item)=>item.product===tool.name);
 const departmentMetric=departmentMetrics.find((item)=>item.name===tool.ownerDepartment);
 const departmentLimit=departmentBudgetOverrides[tool.ownerDepartment]??departmentCatalog.find((item)=>item.name===tool.ownerDepartment)?.monthlyBudget;
 const relatedExceptions=temporaryExceptions.filter((item)=>item.status==='Active'&&(item.target===tool.name||item.department===tool.ownerDepartment));
 const hasBudgetConflict=tool.spend>=tool.monthlyLimit&&departmentMetric&&departmentLimit&&departmentMetric.spend>=departmentLimit;
 const finishAction=()=>{onGovernanceChange(tool.id,confirmAction==='approve'?'Approved':'Review needed');setConfirmAction(null);onClose()};
 return <div className="drawer-backdrop" onClick={onClose}><aside className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="tool-drawer-title" onClick={e=>e.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close tool details"><X size={18}/></button><ProviderLogo provider={tool.provider} className="drawer-logo tool-logo" /><div className="drawer-kicker">AI TOOL DETAILS</div><h2 id="tool-drawer-title">{tool.name}</h2><p className="drawer-sub">{tool.provider} · {tool.kind} · {tool.governance}</p>
    <div className="drawer-stat"><span>{tool.kind==='Subscription'?'Subscription cost':'API consumption cost'}</span><b>{formatMoney(tool.spend)} <small>of {formatMoney(tool.monthlyLimit)} tool limit</small></b><div className="progress slim"><i className={tool.spend/tool.monthlyLimit>=thresholds.approaching?'near':''} style={{width:`${Math.min(100,tool.spend/tool.monthlyLimit*100)}%`}}/></div><small className="plain-explain">{Math.round(tool.spend/tool.monthlyLimit*100)}% used · {formatMoney(Math.max(0,tool.monthlyLimit-tool.spend))} remaining</small></div>
    {departmentLimit&&<div className="drawer-detail"><span>{tool.ownerDepartment} department limit (separate)</span><b>{formatMoney(departmentMetric?.spend??0)} of {formatMoney(departmentLimit)} · {Math.round((departmentMetric?.spend??0)/departmentLimit*100)}%</b></div>}
    <div className="drawer-detail"><span>Application category</span><b>{tool.kind==='Subscription'?'AI subscription':'API consumption'}</b></div><div className="drawer-detail"><span>Owner and department</span><b>{tool.ownerDepartment||'Unattributed'}</b></div><div className="drawer-detail"><span>Discovery source</span><b>{tool.kind==='Subscription'?'Vendor / subscription sample':'Provider usage sample'}</b></div><div className="drawer-detail"><span>Approval status</span><b>{tool.governance}</b></div><div className="drawer-detail"><span>Active users</span><b>{tool.activeUsers} people{tool.ownerDepartment?"":" · unavailable attribution"}</b></div><div className="drawer-detail"><span>Renewal / billing</span><b>{tool.renewal}</b></div>
    {license&&<><div className="drawer-detail"><span>Assigned seats</span><b>{license.assigned} of {license.purchased} purchased</b></div><div className="drawer-detail"><span>Observed active seats</span><b>{tool.usageDataAvailable===false?'Unavailable':license.active}</b></div></>}
    {tool.kind==='API consumption'&&(tool.requests!==null?<><div className="drawer-detail"><span>Tracked API requests</span><b>{tool.requests.toLocaleString()}</b></div><div className="drawer-detail"><span>Input tokens</span><b>{tool.inputTokens.toLocaleString()}</b></div><div className="drawer-detail"><span>Output tokens</span><b>{tool.outputTokens.toLocaleString()}</b></div></>:<div className="drawer-detail"><span>Usage telemetry</span><b>Unavailable in this sample</b></div>)}
    {relatedExceptions.length>0&&<div className="drawer-exceptions"><b>Temporary allocations (separate)</b>{relatedExceptions.map((item)=><span key={item.id}>+{formatMoney(item.amount)} · {item.scope} exception · expires {item.expiresAt}</span>)}</div>}
    {hasBudgetConflict&&<div className="budget-conflict-note" role="note"><b>Two independent limits are reached.</b><span>A tool-limit increase does not change the department allocation. IT or Finance should decide which limit to adjust.</span></div>}
    <div className="drawer-note"><CircleHelp size={16}/><span><b>Suggested next step</b><br/>{needsReview?'Confirm business need and data handling with the listed team.':'Review spend against this tool’s cap before changing its budget.'} Actions here only change this local demo.</span></div>
    {confirmAction?<div className="confirm-action"><b>{confirmAction==='approve'?'Approve this tool in the demo?':'Flag this tool for review?'}</b><p>No external provider or employee access will change.</p><button className="button secondary" onClick={()=>setConfirmAction(null)}>Cancel</button><button className="button primary" onClick={finishAction}>Confirm demo action</button></div>:<div className="drawer-actions drawer-actions-stack"><button className="button secondary" onClick={()=>onRequestBudget(tool)}>Request extra budget</button><div><button className="button secondary" onClick={()=>setConfirmAction(needsReview?'approve':'flag')}>{needsReview?'Approve tool':'Flag for review'}</button><button className="button primary" onClick={onClose}>Done</button></div></div>}
  </aside></div>;
}

export function DetailDialog({ title, subtitle, onClose, children }) {
 return <div className="modal-backdrop" onClick={onClose}><section className="info-modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-dialog-title" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close details"><X size={17}/></button><h2 id="detail-dialog-title">{title}</h2>{subtitle&&<p>{subtitle}</p>}{children}<button className="button primary" onClick={onClose}>Close</button></section></div>;
}
