import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export default function RequestBudgetModal({ open, target, threshold, onThresholdChange, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("cycle");
  const [endDate, setEndDate] = useState("");
  const numericAmount = Number(amount);
  const route = numericAmount > threshold ? "IT or Finance" : "a team lead";

  useEffect(() => {
    if (!open) return undefined;
    returnFocusRef.current = document.activeElement;
    setAmount("");
    setReason("");
    setDuration("cycle");
    setEndDate("");
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
  }, [open, onClose]);

  if (!open) return null;
  const submit = (event) => {
    event.preventDefault();
    if (!amount || numericAmount <= 0 || !reason.trim() || (duration === "custom" && !endDate)) return;
    onSubmit({ amount: numericAmount, reason: reason.trim(), duration: duration === "cycle" ? "This cycle only" : `Until ${endDate}`, target, route });
  };

  return <div className="modal-backdrop request-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="info-modal request-budget-modal" role="dialog" aria-modal="true" aria-labelledby="request-budget-title" aria-describedby="request-budget-description">
      <button type="button" className="modal-close" onClick={onClose} aria-label="Close budget request"><X size={17}/></button>
      <div className="modal-icon" aria-hidden="true">＋</div>
      <h2 id="request-budget-title">Request extra budget</h2>
      <p id="request-budget-description">Create a local demo request for <b>{target}</b>. No budget or access changes until a reviewer acts.</p>
      <form onSubmit={submit}>
        <label className="request-field">Amount requested (USD)<input autoComplete="off" inputMode="decimal" type="number" min="1" step="1" required value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 500"/></label>
        <label className="request-field">Reason<textarea required rows="3" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="What work needs the additional budget?"/></label>
        <fieldset className="request-duration"><legend>Duration</legend><label><input type="radio" name="request-duration" value="cycle" checked={duration === "cycle"} onChange={() => setDuration("cycle")}/> This cycle only</label><label><input type="radio" name="request-duration" value="custom" checked={duration === "custom"} onChange={() => setDuration("custom")}/> Choose an end date</label>{duration === "custom" && <label className="request-field">End date<input type="date" required value={endDate} onChange={(event) => setEndDate(event.target.value)}/></label>}</fieldset>
        <div className="request-routing"><b>Approval route</b><span>{amount ? `${numericAmount > threshold ? "Above" : "At or below"} $${Number(threshold).toLocaleString()} threshold → ${route}` : `Requests up to $${Number(threshold).toLocaleString()} go to a team lead; larger requests go to IT or Finance.`}</span><label>Routing threshold (USD)<input aria-label="Routing threshold in USD" type="number" min="1" step="100" value={threshold} onChange={(event) => onThresholdChange(Number(event.target.value) || 1)}/></label></div>
        <p className="request-expiry">{duration === "cycle" ? "Expires at cycle end." : `Expires on ${endDate || "your selected end date"}.`}</p>
        <div className="request-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button type="submit" className="button primary">Submit request</button></div>
      </form>
    </section>
  </div>;
}
