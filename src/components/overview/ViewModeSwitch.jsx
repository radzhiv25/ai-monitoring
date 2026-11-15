const modes = [
  { id: "quick", title: "Quick overview", description: "Key numbers and actions" },
  { id: "analysis", title: "Detailed analysis", description: "Usage signals and data health" },
];

export default function ViewModeSwitch({ value, onChange }) {
  return <>
    <div className="view-mode-switch" role="group" aria-label="Choose dashboard detail level">
      {modes.map((mode) => <button key={mode.id} type="button" className={value === mode.id ? "active" : ""} aria-pressed={value === mode.id} onClick={() => onChange(mode.id)}>
        <b>{mode.title}</b><small>{mode.description}</small>
      </button>)}
    </div>
    <span className="sr-only" aria-live="polite">{value === "quick" ? "Quick overview selected" : "Detailed analysis selected"}</span>
  </>;
}
