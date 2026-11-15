import React, { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, TriangleAlert } from 'lucide-react';
import HelpTip from '../shared/HelpTip';
import { formatMoney } from '../../data/demoData';

const numberLabel = (value) => Number(value || 0).toLocaleString('en-US');
const tokenLabel = (value) => value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1_000 ? `${(value / 1_000).toFixed(0)}K` : numberLabel(value);

export function SpendChart({ data, granularity, currentSpend, currentBudget, onPointSelect, elapsedDays = 21, cycleDays = 30 }) {
  const canEstimate = elapsedDays > 7;
  const estimated = canEstimate ? Math.round(currentSpend / elapsedDays * cycleDays) : null;
  const under = Math.max(0, currentBudget - currentSpend);
  return <article className="panel spend-panel" id="budget-chart">
    <div className="panel-head"><div className="heading-with-tip"><div><h2>AI spend vs. budget</h2><p><b>Use this to:</b> decide whether to approve an exception, tighten spend, or keep the limit.</p></div><HelpTip>Actual spend is calculated from the demo tool records for the selected period. The dashed line shows the budget. Run-rate estimate = spend to date ÷ elapsed cycle days × days in cycle. It is an estimate, not a forecast or invoice.</HelpTip></div></div>
    <div className="chart-legend"><span><i className="legend-spend"/> Actual spend</span><span><i className="legend-budget"/> Budget</span><b>{formatMoney(currentSpend)} <small>selected period</small></b></div>
    <div className="spend-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{top:10,right:8,left:-14,bottom:0}} onClick={(state)=>state?.activePayload?.[0]?.payload&&onPointSelect?.(state.activePayload[0].payload)}>
      <defs><linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#806cf1" stopOpacity={0.16}/><stop offset="95%" stopColor="#806cf1" stopOpacity={0}/></linearGradient></defs>
      <CartesianGrid vertical={false} stroke="#edf0f4"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#858b99',fontSize:10}} dy={8}/>
      <YAxis tickFormatter={(v)=>v>=1000000?`$${(v/1000000).toFixed(0)}m`:`$${Math.round(v/1000)}k`} axisLine={false} tickLine={false} tick={{fill:'#858b99',fontSize:10}}/>
      <Tooltip formatter={(v,n)=>[formatMoney(v),n==='spend'?'Actual spend':'Budget']} labelFormatter={(label)=>granularity==='week'?label:`${label} 2026`} contentStyle={{border:'1px solid #eceef3',borderRadius:9,fontSize:11}}/>
      <Area type="monotone" dataKey="budget" name="Budget" stroke="#d7d2fb" strokeWidth={2} strokeDasharray="5 5" fill="none"/>
      <Area type="monotone" dataKey="spend" name="Actual spend" stroke="#806cf1" strokeWidth={2.5} fill="url(#spendFill)" activeDot={{r:4,strokeWidth:0}}/>
    </AreaChart></ResponsiveContainer></div>
    <div className="panel-foot"><span className={canEstimate&&estimated>currentBudget&&currentSpend<=currentBudget?'foot-warning':'foot-check'}>{canEstimate&&estimated>currentBudget&&currentSpend<=currentBudget?<TriangleAlert size={15} aria-label="Warning"/>:<span aria-hidden="true">✓</span>}{currentSpend>currentBudget?'Over budget':canEstimate&&estimated>currentBudget?'Run-rate estimate exceeds budget':'Within budget'}</span>{canEstimate?<span>Run-rate estimate: <b>{formatMoney(estimated)}</b> <span className="under-budget">· estimate</span></span>:<span>Available after day 7</span>}</div>
    {currentSpend<=currentBudget&&<div className="chart-context">{formatMoney(under)} of the selected period’s budget remains.</div>}
  </article>;
}

export function DepartmentChart({ data, metric, setMetric, activeUsers, onDepartmentSelect, attributionCoverage = 1, unattributedSpend = 0 }) {
  const config = {
    users: { label:'Active users', key:'users', color:'#7766e8', format:numberLabel },
    tokens: { label:'Tokens', key:'tokens', color:'#40b89b', format:tokenLabel },
    spend: { label:'Spend', key:'spend', color:'#f2a76f', format:formatMoney },
  }[metric];
  return <article className="panel adoption-panel" id="people-chart">
    <div className="panel-head"><div className="heading-with-tip"><div><h2>AI usage by department</h2><p><b>Use this to:</b> decide where to move budget or follow up on spend with no owner.</p></div><HelpTip>Active users, API requests, and token totals are different measures. Token totals only include sample API usage where token data is available.</HelpTip></div></div>
    <div className="chart-tabs" role="group" aria-label="Department chart metric">{[['spend','Spend by type'],['users','Active users'],['tokens','Tokens']].map(([key,label])=><button key={key} className={metric===key?'selected':''} aria-pressed={metric===key} onClick={()=>setMetric(key)}>{label}</button>)}</div>
    {metric==='spend'&&<div className="chart-legend department-spend-legend"><span><i className="legend-spend"/> Subscription spend</span><span><i className="legend-api"/> API spend</span><span className="coverage-readout">Owner attribution: {Math.round(attributionCoverage*100)}%</span></div>}
    {attributionCoverage<.8&&<div className="coverage-warning" role="status">Only {Math.round(attributionCoverage*100)}% of measurable spend is attributed to a department. {formatMoney(unattributedSpend)} remains in Unattributed; it is not spread across teams.</div>}
    <div className="department-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{top:3,right:22,left:2,bottom:0}}>
      <CartesianGrid horizontal={false} stroke="#edf0f4"/><XAxis type="number" axisLine={false} tickLine={false} tick={{fill:'#9298a5',fontSize:9}} tickFormatter={config.format}/><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#747a89',fontSize:9}} width={95}/>
      <Tooltip formatter={(v,name)=>[config.format(v),name==='subscriptionSpend'?'Subscription spend':name==='apiSpend'?'API spend':config.label]} contentStyle={{border:'1px solid #eceef3',borderRadius:9,fontSize:11}}/>
      {metric==='spend'?<><Bar dataKey="subscriptionSpend" name="Subscription spend" stackId="spend" fill="#7766e8" radius={[0,0,0,0]} barSize={13} onClick={(row)=>onDepartmentSelect?.(row?.payload?.name||row?.name)} cursor="pointer"/><Bar dataKey="apiSpend" name="API spend" stackId="spend" fill="#40b89b" radius={[0,5,5,0]} barSize={13} onClick={(row)=>onDepartmentSelect?.(row?.payload?.name||row?.name)} cursor="pointer"/></>:<Bar dataKey={config.key} name={config.label} fill={config.color} radius={[0,5,5,0]} barSize={13} onClick={(row)=>onDepartmentSelect?.(row?.payload?.name||row?.name)} cursor="pointer"/>}
    </BarChart></ResponsiveContainer></div>
    <div className="chart-caption"><span>{numberLabel(activeUsers)} active people in the selected period</span><button onClick={()=>onDepartmentSelect?.('Engineering')}>View team details <ArrowUpRight size={12}/></button></div>
  </article>;
}

export function SpendByToolChart({ data, groupBy, setGroupBy, onSelect, thresholds = { approaching: .8 } }) {
  const key=groupBy==='provider'?'provider':'name';
  const chartData=[...data].sort((a,b)=>b.spend-a.spend).slice(0,7);
  return <article className="panel tool-spend-panel" id="tool-spend-chart">
    <div className="panel-head"><div className="heading-with-tip"><div><h2>Tool spend vs. limit</h2><p><b>Use this to:</b> decide which tool&apos;s cap to raise, hold, or review.</p></div><HelpTip>Each tool shows observed spend against its own configured limit. Department limits remain separate. Select a bar to inspect the related tool.</HelpTip></div><div className="chart-tabs compact" role="group" aria-label="Group spending by">{[['tool','Tool'],['provider','Provider']].map(([keyName,label])=><button key={keyName} className={groupBy===keyName?'selected':''} aria-pressed={groupBy===keyName} onClick={()=>setGroupBy(keyName)}>{label}</button>)}</div></div>
    <div className="chart-legend department-spend-legend"><span><i className="legend-spend"/> Actual spend</span><span><i className="legend-budget"/> Tool limit</span></div>
    <div className="tool-spend-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{top:8,right:10,left:0,bottom:4}}>
      <CartesianGrid vertical={false} stroke="#edf0f4"/><XAxis dataKey={key} axisLine={false} tickLine={false} tick={{fill:'#7e8493',fontSize:9}} interval={0} angle={-14} textAnchor="end" height={45}/><YAxis tickFormatter={(v)=>`$${Math.round(v/1000)}k`} axisLine={false} tickLine={false} tick={{fill:'#9298a5',fontSize:9}}/>
      <Tooltip formatter={(v,name)=>[formatMoney(v),name==='monthlyLimit'?'Configured limit':'Actual spend']} contentStyle={{border:'1px solid #eceef3',borderRadius:9,fontSize:11}}/>
      <Bar dataKey="spend" name="Actual spend" fill="#806cf1" radius={[5,5,0,0]} barSize={18} onClick={(row)=>onSelect?.(row?.payload||row)} cursor="pointer">{chartData.map((row,index)=><Cell key={row[key]} fill={row.monthlyLimit&&row.spend/row.monthlyLimit>=thresholds.approaching?'#e79b5f':['#7766e8','#40b89b','#f2a76f','#76a9e8','#a293e9','#51b7a0','#edaa79'][index%7]}/>)}</Bar>
      <Bar dataKey="monthlyLimit" name="Configured limit" fill="#d9d4f8" radius={[5,5,0,0]} barSize={18} onClick={(row)=>onSelect?.(row?.payload||row)} cursor="pointer"/>
    </BarChart></ResponsiveContainer></div>
  </article>;
}
