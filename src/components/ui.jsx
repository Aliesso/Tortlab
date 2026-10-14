import { CONFIG } from '../lib/data.js';

export const Tick = () => (
  <span className="tick" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  </span>
);

export function Opt({ active, onClick, disabled, className = '', children, title }) {
  return (
    <button type="button" className={`opt ${className}`} aria-pressed={!!active} disabled={disabled} onClick={onClick} title={title}>
      {children}
      <Tick />
    </button>
  );
}

export function Group({ title, hint, children }) {
  return (
    <section className="group">
      <div className="group-head">
        <h3>{title}</h3>
        {hint ? <span className="hint">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

export const Plus = ({ p }) =>
  p ? <span className="price-tag">+{Math.round(p)} {CONFIG.currency}</span> : <span className="price-tag muted">daxildir</span>;

export function Swatch({ color, name, active, onClick }) {
  return (
    <button type="button" className="sw" aria-pressed={!!active} title={name} style={{ '--c': color }} onClick={onClick}>
      <span className="sr">{name}</span>
    </button>
  );
}

export function Range({ label, value, min, max, step, onChange, format = v => v }) {
  return (
    <label className="range">
      <span className="range-head"><span>{label}</span><output>{format(value)}</output></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ '--p': `${((value - min) / (max - min)) * 100}%` }} />
    </label>
  );
}
