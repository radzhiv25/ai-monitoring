import React from 'react';
import { Activity, CircleHelp, LayoutDashboard, Settings2, ShieldCheck, Sparkles, Wallet, ChevronDown } from 'lucide-react';
const navGroups = [
  { label: 'WORKSPACE', items: [['Overview', LayoutDashboard], ['Budgets & Limits', Wallet], ['Budget Requests', Activity], ['AI Tools', Sparkles], ['Policies & Alerts', ShieldCheck], ['Integrations', Settings2]] },
];
export default function Sidebar({ active, onNavigate, onHelp, collapsed, toolCount = 14 }) {
  return <aside className={`sidebar ${collapsed?'collapsed':''}`}><div className="brand" aria-label="AI Governance"><div className="brand-mark"><Sparkles size={18}/></div><span className="brand-tag">AI GOVERNANCE</span></div>
    <div className="workspace"><span className="workspace-icon">C</span><span className="workspace-text"><b>CloudEagle</b><small>Enterprise workspace</small></span><ChevronDown size={15}/></div>
    {navGroups.map(group => <div key={group.label}><div className={`nav-label ${group.label==='MANAGE'?'secondary-label':''}`}>{group.label}</div><nav>{group.items.map(([name, Icon])=><button key={name} title={collapsed?name:undefined} aria-label={name} className={active===name?'active':''} onClick={()=>onNavigate(name)}><Icon size={17}/><span className="nav-text">{name}</span>{name==='AI Tools'&&<span className="nav-count">{toolCount}</span>}{name==='Policies & Alerts'&&<span className="nav-dot"/>}</button>)}</nav></div>)}
    <div className="sidebar-bottom"><button className="help-card" onClick={onHelp} title={collapsed?'Take a quick product tour':undefined}><span className="help-icon"><CircleHelp size={17}/></span><span className="help-copy"><b>Need a hand?</b><small>Take a quick product tour</small></span></button><div className="profile"><div className="avatar" title="Jordan Davis">JD</div><div className="profile-text"><b>Jordan Davis</b><small>Admin · IT Operations</small></div></div></div>
  </aside>
}
