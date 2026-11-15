import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Select from "./Select";

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export default function RequestBudgetModal({ open, target, tools = [], departments = [], threshold, onThresholdChange, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("cycle");
  const [endDate, setEndDate] = useState("");
  const [context, setContext] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [error, setError] = useState("");
  const targetOptions = [
    ...departments.map((item) => ({ value: `department:${item.name}`, label: `${item.name} department budget` })),
    ...tools.map((item) => ({ value: `tool:${item.id}`, label: `${item.name} · ${item.provider}` })),
  ];
  const numericAmount = Number(amount);
  const route = numericAmount > threshold ? "IT or Finance" : "a team lead";

  useEffect(() => {
    if (!open) return undefined;
    returnFocusRef.current = document.activeElement;
    setAmount("");
    setReason("");
    setDuration("cycle");
    setEndDate("");
    setContext("");
    setError("");
    const requestedTool = tools.find((item) => String(target).includes(item.name));
    const requestedDepartment = departments.find((item) => String(target).includes(item.name) && String(target).toLowerCase().includes("department"));
    setSelectedTarget(target?.startsWith("tool:") || target?.startsWith("department:") ? target : requestedTool ? `tool:${requestedTool.id}` : requestedDepartment ? `department:${requestedDepartment.name}` : targetOptions[0]?.value ?? "");
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector("input")?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusIsOutside = !dialogRef.current.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      requestAnimationFrame(() => returnFocusRef.current?.focus?.());
    };
  }, [open, onClose, target]);

  if (!open) return null;
  const submit = (event) => {
    event.preventDefault();
    if (!selectedTarget || !amount || numericAmount <= 0 || !reason.trim() || (duration === "custom" && !endDate)) { setError("Choose a tool or department, enter an amount above zero, add a reason, and complete the end date if selected."); return; }
    setError("");
    onSubmit({ amount: numericAmount, reason: reason.trim(), context: context.trim(), duration: duration === "cycle" ? "This cycle only" : `Until ${endDate}`, target: selectedTarget, route });
  };

  return <div className="modal-backdrop request-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="info-modal request-budget-modal" role="dialog" aria-modal="true" aria-labelledby="request-budget-title" aria-describedby="request-budget-description">
      <button type="button" className="modal-close" onClick={onClose} aria-label="Close budget request"><X size={17}/></button>
      <div className="modal-icon" aria-hidden="true">＋</div>
      <h2 id="request-budget-title">Request extra budget</h2>
      <p id="request-budget-description">Submit a sample request for additional room within the selected limit. It will be routed for review; it does not change a provider quota.</p>
      <form onSubmit={submit}>
        <label className="request-field">AI tool or department<Select label="AI tool or department" value={selectedTarget} options={targetOptions} onChange={setSelectedTarget}/></label>
        <label className="request-field request-amount">Amount requested (USD)<input autoComplete="off" inputMode="decimal" type="number" min="1" step="1" required value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 500"/></label>
        <label className="request-field">Reason<textarea required rows="3" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="What work needs the additional budget?"/></label>
        <label className="request-field">Supporting context (optional)<textarea rows="2" value={context} onChange={(event) => setContext(event.target.value)} placeholder="Project, customer commitment, or timing details"/></label>
        <fieldset className="request-duration"><legend>Duration</legend><label><input type="radio" name="request-duration" value="cycle" checked={duration === "cycle"} onChange={() => setDuration("cycle")}/> This cycle only</label><label><input type="radio" name="request-duration" value="custom" checked={duration === "custom"} onChange={() => setDuration("custom")}/> Choose an end date</label>{duration === "custom" && <label className="request-field">End date<input type="date" min={new Date().toISOString().slice(0,10)} required value={endDate} onChange={(event) => setEndDate(event.target.value)}/></label>}</fieldset>
        <div className="request-routing"><b>Approval route</b><span>{amount ? `${numericAmount > threshold ? "Above" : "At or below"} $${Number(threshold).toLocaleString()} threshold → ${route}` : `Requests up to $${Number(threshold).toLocaleString()} go to a department lead; larger requests go to IT or Finance.`}</span><label>Routing threshold (USD)<input aria-label="Routing threshold in USD" type="number" min="1" step="100" value={threshold} onChange={(event) => onThresholdChange(Number(event.target.value) || 1)}/></label></div>
        <p className="request-expiry">{duration === "cycle" ? "Expires at cycle end." : `Expires on ${endDate || "your selected end date"}.`}</p>
        {error && <p className="request-form-error" role="alert">{error}</p>}
        <div className="request-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button type="submit" className="button primary">Submit request</button></div>
      </form>
    </section>
  </div>;
}
