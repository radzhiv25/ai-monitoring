import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, CircleHelp, Ellipsis, X } from 'lucide-react';
import HelpTip from './HelpTip';
import ProviderLogo from './ProviderLogo';
import { formatMoney } from '../../data/demoData';

export function ToolsTable({ tools, onSelect, onShowAll, totalCount, maxRows }) {
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
      <td>{t.ownerDepartment}</td><td>{t.activeUsers.toLocaleString()}</td><td className="spend-cell">{formatMoney(t.spend)}</td><td><div className="limit-cell"><div className="limit-numbers"><span>{formatMoney(t.spend)}</span><span>{formatMoney(t.monthlyLimit)}</span></div><div className="progress slim"><i className={t.spend/t.monthlyLimit>=.9?'near':''} style={{width:`${Math.min(100,t.spend/t.monthlyLimit*100)}%`}}/></div></div></td>
      <td><span className={`status ${t.governance==='Approved'?'ok-status':'review-status'}`}><i/>{t.governance}</span></td><td><button className="row-more" aria-label={`Details for ${t.name}`} onClick={e=>{e.stopPropagation();onSelect(t)}}><Ellipsis size={17}/></button></td>
    </tr>)}{tools.length===0&&<tr><td colSpan="7" className="empty-results">No matching tools found. Try another search or filter.</td></tr>}</tbody></table></div>
    <div className="table-footer"><span>Showing <b>{visibleRows.length}</b> of <b>{totalCount ?? 12}</b> connected tools</span><span>Demo inventory · selecting a row opens details</span></div>
  </section>;
}

export function ToolDrawer({ tool, onClose, onGovernanceChange, onRequestBudget }) {
 const [confirmAction,setConfirmAction]=useState(null);
 if (!tool) return null;
 const needsReview=tool.governance!=='Approved';
 const finishAction=()=>{onGovernanceChange(tool.id,confirmAction==='approve'?'Approved':'Review needed');setConfirmAction(null);onClose()};
 return <div className="drawer-backdrop" onClick={onClose}><aside className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="tool-drawer-title" onClick={e=>e.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close tool details"><X size={18}/></button><ProviderLogo provider={tool.provider} className="drawer-logo tool-logo" /><div className="drawer-kicker">AI TOOL DETAILS</div><h2 id="tool-drawer-title">{tool.name}</h2><p className="drawer-sub">{tool.provider} · {tool.kind} · {tool.governance}</p>
    <div className="drawer-stat"><span>Spend this month</span><b>{formatMoney(tool.spend)} <small>of {formatMoney(tool.monthlyLimit)}</small></b><div className="progress slim"><i className={tool.spend/tool.monthlyLimit>=.9?'near':''} style={{width:`${Math.min(100,tool.spend/tool.monthlyLimit*100)}%`}}/></div><small className="plain-explain">{Math.round(tool.spend/tool.monthlyLimit*100)}% of the monthly limit used</small></div>
    <div className="drawer-detail"><span>Active users</span><b>{tool.activeUsers} people</b></div><div className="drawer-detail"><span>Responsible team</span><b>{tool.ownerDepartment}</b></div><div className="drawer-detail"><span>Renewal / billing</span><b>{tool.renewal}</b></div>
    {tool.requests!==null&&<><div className="drawer-detail"><span>Tracked API requests</span><b>{tool.requests.toLocaleString()}</b></div><div className="drawer-detail"><span>Input tokens</span><b>{tool.inputTokens.toLocaleString()}</b></div><div className="drawer-detail"><span>Output tokens</span><b>{tool.outputTokens.toLocaleString()}</b></div></>}
    <div className="drawer-note"><CircleHelp size={16}/><span><b>Suggested next step</b><br/>{needsReview?'Confirm business need and data handling with the listed team.':'Review spend against this tool’s cap before changing its budget.'} Actions here only change this local demo.</span></div>
    {confirmAction?<div className="confirm-action"><b>{confirmAction==='approve'?'Approve this tool in the demo?':'Flag this tool for review?'}</b><p>No external provider or employee access will change.</p><button className="button secondary" onClick={()=>setConfirmAction(null)}>Cancel</button><button className="button primary" onClick={finishAction}>Confirm demo action</button></div>:<div className="drawer-actions drawer-actions-stack"><button className="button secondary" onClick={()=>onRequestBudget(tool)}>Request extra budget</button><div><button className="button secondary" onClick={()=>setConfirmAction(needsReview?'approve':'flag')}>{needsReview?'Approve tool':'Flag for review'}</button><button className="button primary" onClick={onClose}>Done</button></div></div>}
  </aside></div>;
}

export function DetailDialog({ title, subtitle, onClose, children }) {
 return <div className="modal-backdrop" onClick={onClose}><section className="info-modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-dialog-title" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close details"><X size={17}/></button><h2 id="detail-dialog-title">{title}</h2>{subtitle&&<p>{subtitle}</p>}{children}<button className="button primary" onClick={onClose}>Close</button></section></div>;
}
