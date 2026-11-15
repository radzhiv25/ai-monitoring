import React from 'react';
import { Ellipsis, ArrowDownRight, ArrowUpRight, Wallet, Users, Zap, ShieldCheck, ClipboardCheck } from 'lucide-react';
import HelpTip from '../shared/HelpTip';
const icons = { Wallet, Users, Zap, ShieldCheck, ClipboardCheck };
export default function MetricCard({ kind, label, value, unit, trend, trendText, foot, progress, status, onClick }) {
  const Icon = icons[kind];
  return <article className={`metric-card ${kind==='ShieldCheck'?'alert-card':''}`} onClick={onClick} role={onClick?'button':undefined} tabIndex={onClick?0:undefined} onKeyDown={onClick?(e=>{if(e.key==='Enter'||e.key===' ')onClick()}):undefined}>
    <div className="metric-top"><span className={`metric-icon ${kind==='Wallet'?'purple':kind==='Users'?'green':kind==='Zap'||kind==='ClipboardCheck'?'orange':'red'}`}><Icon size={17}/></span><span className="metric-label">{label}</span><HelpTip>{status}</HelpTip><Ellipsis size={17} className="metric-menu"/></div>
    <div className="metric-number">{value}<span className="metric-period">{unit}</span></div>
    {trend ? <div className="metric-foot"><span className="trend neutral" aria-label={trend}>{trend.startsWith('Down')?<ArrowDownRight size={14}/>:<ArrowUpRight size={14}/>} {trend}</span><span>{trendText}</span><span className="foot-right">{foot}</span></div> : <div className="metric-foot">{foot}</div>}
    {progress!==undefined&&<div className="progress"><i style={{width:`${progress}%`,background:kind==='Wallet'?'#806cf1':'#38b99a'}}/></div>}
  </article>
}
