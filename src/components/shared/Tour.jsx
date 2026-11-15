import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, X, Sparkles } from 'lucide-react';
const steps = [
 { target: 'metric-spend', title: 'Start with the money', body: 'This card adds up estimated AI spending across connected tools. The small bar shows how much of your organization’s monthly budget is already used.' },
 { target: 'budget-chart', title: 'Check if spending is on track', body: 'The solid line shows actual spend over time. The dotted line is your budget. Hover over a point to see the numbers for that month.' },
 { target: 'people-chart', title: 'Compare teams, not individual activity', body: 'This chart summarizes spend, subscriptions, and API usage by department. It does not show browsing history or individual activity.' },
 { target: 'tools-table', title: 'Review individual tools', body: 'Each row shows a tool’s sample users, spend, spending cap, remaining amount, and limit status. The approaching threshold starts at 80% by default and can be adjusted in Limit policy.' },
 { target: 'policy-alerts', title: 'Follow up on alerts', body: 'Alerts flag activity that may need an IT or security review. In this demo, figures and alerts are sample data rather than live monitoring.' },
];
export default function Tour({ open, step, setStep, onClose }) {
 const [rect,setRect]=useState(null);
 useEffect(()=>{
   if(!open){setRect(null);return}
   const el=document.getElementById(steps[step]?.target);
   if(!el)return;
   el.scrollIntoView({behavior:'smooth',block:'center'});
   let frame;
   const measure=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=el.getBoundingClientRect();setRect({top:r.top,left:r.left,width:r.width,height:r.height})})};
   const timer=setTimeout(measure,220);window.addEventListener('resize',measure);window.addEventListener('scroll',measure,true);
   const escape=e=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',escape);
   return()=>{clearTimeout(timer);cancelAnimationFrame(frame);window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure,true);window.removeEventListener('keydown',escape)};
 },[open,step,onClose]);
 useEffect(()=>{if(!open)return;const bg=[...document.querySelectorAll('.sidebar,.main-area')];const prev=bg.map(el=>({el,inert:el.inert,hidden:el.getAttribute('aria-hidden')}));bg.forEach(el=>{el.inert=true;el.setAttribute('aria-hidden','true')});requestAnimationFrame(()=>document.querySelector('.tour-card button')?.focus());return()=>prev.forEach(({el,inert,hidden})=>{el.inert=inert;if(hidden===null)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden',hidden)})},[open]);
 if(!open)return null;
 const current=steps[step];
 const top=rect?Math.max(0,rect.top-7):0,left=rect?Math.max(0,rect.left-7):0,right=rect?Math.min(window.innerWidth,rect.left+rect.width+7):0,bottom=rect?Math.min(window.innerHeight,rect.top+rect.height+7):0;
 return <div className="tour-layer">{rect?<><div className="tour-shade" style={{top:0,left:0,width:'100%',height:top}} onClick={onClose}/><div className="tour-shade" style={{top,left:0,width:left,height:Math.max(0,bottom-top)}} onClick={onClose}/><div className="tour-shade" style={{top,left:right,width:Math.max(0,window.innerWidth-right),height:Math.max(0,bottom-top)}} onClick={onClose}/><div className="tour-shade" style={{top:bottom,left:0,width:'100%',height:Math.max(0,window.innerHeight-bottom)}} onClick={onClose}/><div className="tour-spotlight" style={{top,left,width:Math.max(0,right-left),height:Math.max(0,bottom-top)}} aria-hidden="true"/></>:<div className="tour-shade full" onClick={onClose}/>}<section className="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description"><div className="tour-card-top"><span className="tour-brand"><Sparkles size={15}/> QUICK TOUR</span><button onClick={onClose} aria-label="Close tour"><X size={17}/></button></div><div className="tour-progress-label" aria-live="polite">STEP {step+1} OF {steps.length}</div><div className="tour-progress" aria-hidden="true"><i style={{width:`${(step+1)/steps.length*100}%`}}/></div><h2 id="tour-title">{current.title}</h2><p id="tour-description">{current.body}</p><div className="tour-footer"><button className="tour-skip" onClick={onClose}>Skip tour</button><div>{step>0&&<button className="tour-back" onClick={()=>setStep(step-1)}><ArrowLeft size={14}/> Back</button>}<button className="button primary" onClick={()=>step===steps.length-1?onClose():setStep(step+1)}>{step===steps.length-1?'Finish tour':'Next'} <ArrowRight size={14}/></button></div></div></section></div>
}
