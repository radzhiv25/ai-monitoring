import React, { useMemo, useState } from "react";
import { ArrowRight, CircleHelp, Plus } from "lucide-react";
import { formatMoney } from "../../data/demoData";

const filters = ["All requests", "Pending approval", "Approved", "Rejected", "Cancelled", "Expired"];
const when = (value) => value ? /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`).toLocaleDateString() : new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

export default function BudgetRequestsPage({ requests, exceptions, auditEvents, onDecision, onCreate }) {
  const [filter, setFilter] = useState("All requests");
  const [editing, setEditing] = useState(null);
  const [comments, setComments] = useState("");
  const visible = useMemo(() => filter === "All requests" ? requests : requests.filter((request) => request.status === filter), [filter, requests]);
  const pending = requests.filter((request) => request.status === "Pending approval").length;
  const approvedTotal = exceptions.reduce((sum, exception) => sum + exception.amount, 0);
  const requestedTotal = requests.reduce((sum, request) => sum + request.amount, 0);

  const decide = (request, status) => {
    if (!comments.trim()) return;
    onDecision(request.id, status, comments.trim());
    setEditing(null);
    setComments("");
  };

  return <main className="content request-page" id="page-top">
    <header className="page-heading request-page-heading">
      <div><div className="eyebrow"><span className="live-dot"/> BUDGET GOVERNANCE <span className="demo-tag">DEMO DATA</span></div><h1>Budget requests</h1><p>Review exceptions, see who made each decision, and track temporary allocations through the selected budget cycle.</p></div>
      <button className="button primary" onClick={onCreate}><Plus size={16}/> New request</button>
    </header>
    <div className="request-summary-grid" aria-label="Budget request summary">
      <article><span>Total requested</span><b>{formatMoney(requestedTotal)}</b><small>Across {requests.length} local sample requests</small></article>
      <article><span>Awaiting a decision</span><b>{pending}</b><small>Requests routed to an approver</small></article>
      <article><span>Approved additional allocation</span><b>{formatMoney(approvedTotal)}</b><small>Separate from base budgets</small></article>
      <article><span>Active allocations</span><b>{exceptions.filter((item) => item.status === "Active").length}</b><small>Expire at the date shown below</small></article>
    </div>
    <section className="panel request-history-panel">
      <div className="panel-head"><div><h2>Request history</h2><p>Decisions here change this demo only; they do not change provider limits or Finance records.</p></div><span className="demo-tag">LOCAL SAMPLE STATE</span></div>
      <div className="request-filters" role="group" aria-label="Filter budget requests">{filters.map((item) => <button key={item} className={filter === item ? "selected" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
      {visible.length ? <div className="request-record-list">{visible.map((request) => {
        const exception = exceptions.find((item) => item.requestId === request.id);
        return <article className="request-record" key={request.id}>
          <div className="request-record-top"><div><span className="request-id">{request.id}</span><h3>{request.toolName}</h3><p>{request.provider} · {request.department} · {request.scope} limit</p></div><span className={`request-state ${request.status.toLowerCase().replaceAll(" ", "-")}`}>{request.status}</span></div>
          <div className="request-record-grid">
            <div><span>Requester</span><b>{request.requester}</b></div><div><span>Requested</span><b>{formatMoney(request.amount)}</b></div><div><span>Current limit used</span><b>{formatMoney(request.currentSpend)} of {formatMoney(request.currentBudget)} · {request.currentBudget ? Math.round(request.currentSpend/request.currentBudget*100) : "Unavailable"}{request.currentBudget?"%":""}</b></div><div><span>Approver route / role</span><b>{request.approver}</b></div>
          </div>
          <p className="request-reason"><b>Reason</b> {request.reason}</p>
          {request.context && <p className="request-reason"><b>Context</b> {request.context}</p>}
          <div className="request-meta"><span>Submitted {when(request.submittedAt)}</span><span>Duration: {request.duration}</span><span>Expires: {request.expiresAt}</span>{request.decidedAt && <span>Decision: {when(request.decidedAt)}</span>}</div>
          {request.decisionComments && <div className="decision-note"><b>Decision note · {request.approver}</b><p>{request.decisionComments}</p></div>}
          {exception && <div className={`exception-note ${exception.status === "Active" ? "" : "is-expired"}`}><b>{exception.status} temporary exception</b><span>+{formatMoney(exception.amount)} allocated separately to {exception.scope.toLowerCase()} limit · Expires {exception.expiresAt}</span>{exception.status === "Active" && <button className="text-button" onClick={() => onDecision(request.id, "Expired", "Temporary exception closed in the demo.")}>Mark expired</button>}</div>}
          {request.status === "Pending approval" && <div className="request-decision">
            {editing === request.id ? <><label>Decision comment <textarea rows="2" value={comments} onChange={(event) => setComments(event.target.value)} placeholder="Add a short reason for this decision"/></label><div><button className="button secondary" onClick={() => { setEditing(null); setComments(""); }}>Cancel</button><button className="button secondary" onClick={() => decide(request, "Rejected")}>Reject request</button><button className="button primary" onClick={() => decide(request, "Approved")}>Approve exception</button></div></> : <button className="button secondary" onClick={() => setEditing(request.id)}>Review request <ArrowRight size={14}/></button>}
          </div>}
          {request.status === "Pending approval" && <button className="text-button request-cancel" onClick={() => onDecision(request.id, "Cancelled", "Cancelled by requester in the demo.")}>Cancel request</button>}
        </article>;
      })}</div> : <div className="request-empty"><CircleHelp size={22}/><b>No requests in this view</b><span>Submit a sample request to see the review and decision flow.</span><button className="button secondary" onClick={onCreate}>Create a request</button></div>}
    </section>
    <section className="panel exception-history-panel"><div className="panel-head"><div><h2>Temporary allocations</h2><p>Approved exceptions do not increase the organization or base department budget.</p></div></div>{exceptions.length ? <div className="table-wrap"><table><thead><tr><th>Scope</th><th>Allocation</th><th>Approver</th><th>Start</th><th>Expiry</th><th>Status</th></tr></thead><tbody>{exceptions.map((item) => <tr key={item.id}><td>{item.target} · {item.department}</td><td>+{formatMoney(item.amount)}</td><td>{item.approver}</td><td>{when(item.startsAt)}</td><td>{item.expiresAt}</td><td>{item.status}</td></tr>)}</tbody></table></div> : <div className="request-empty compact"><span>Approved requests will appear here as separate, time-limited allocations.</span></div>}</section>
    <section className="panel audit-history-panel"><div className="panel-head"><div><h2>Decision activity</h2><p>A local log of request and approval actions in this browser session.</p></div></div>{auditEvents.length ? <ol className="audit-event-list">{auditEvents.map((event) => <li key={event.id}><b>{event.action}</b><span>{event.resource}</span><small>{event.actor} · {when(event.timestamp)}{event.note ? ` · ${event.note}` : ""}</small></li>)}</ol> : <div className="request-empty compact"><span>Activity will appear after a request or decision.</span></div>}</section>
  </main>;
}
