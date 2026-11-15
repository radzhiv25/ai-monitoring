import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

/** Small, keyboard accessible listbox select styled to match the dashboard. */
export default function Select({ label, value, options, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const trigger = useRef(null);
  const id = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];
  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  useEffect(() => {
    if (open) setActive(Math.max(0, options.findIndex((item) => item.value === value)));
  }, [open, value, options]);
  const keyDown = (event) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) event.preventDefault();
    if (event.key === "Escape") { setOpen(false); return; }
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      setActive(Math.max(0, options.findIndex((item) => item.value === value)));
      setOpen(true); return;
    }
    if (!open) return;
    if (event.key === "ArrowDown") setActive((index) => (index + 1) % options.length);
    if (event.key === "ArrowUp") setActive((index) => (index - 1 + options.length) % options.length);
    if (event.key === "Enter" || event.key === " ") { onChange(options[active].value); setOpen(false); }
  };
  return <div className={`select-control ${className}`} ref={root}>
    <span className="sr-only" id={`${id}-label`}>{label}</span>
    <button ref={trigger} type="button" className="select-trigger" aria-labelledby={`${id}-label`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((state) => !state)} onKeyDown={keyDown}>
      <span>{selected?.label}</span><ChevronDown size={14} aria-hidden="true" />
    </button>
    {open && <div className="select-menu" role="listbox" aria-labelledby={`${id}-label`}>
      {options.map((option, index) => <button type="button" role="option" aria-selected={option.value === value} className={`select-option ${index === active ? "is-active" : ""}`} key={option.value} onMouseEnter={() => setActive(index)} onClick={() => { onChange(option.value); setOpen(false); trigger.current?.focus(); }}>
        <span>{option.label}</span>{option.value === value && <Check size={14} aria-hidden="true" />}
      </button>)}
    </div>}
  </div>;
}
