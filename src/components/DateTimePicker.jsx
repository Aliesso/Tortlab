import { useEffect, useMemo, useRef, useState } from 'react';
import { DATA } from '../lib/data.js';
import { MONTHS, WEEKDAYS, addDays, fromIso, minOrderDate, toIso } from '../lib/utils.js';

const STRIP_DAYS = 14;
const MAX_DAYS = 90;
const WD_SHORT = ['Baz', 'B.e', 'Ç.a', 'Çər', 'C.a', 'Cüm', 'Şən'];
const WD_HEAD = ['B.e', 'Ç.a', 'Çər', 'C.a', 'Cüm', 'Şən', 'Baz'];

const PERIODS = [
  { id: 'morning', name: 'Səhər', icon: '🌤', from: 10, to: 12 },
  { id: 'day', name: 'Günorta', icon: '☀️', from: 13, to: 16 },
  { id: 'evening', name: 'Axşam', icon: '🌙', from: 17, to: 20 },
];

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} /></svg>
);

function MonthCalendar({ value, min, max, onPick }) {
  const start = value ? fromIso(value) : fromIso(min);
  const [cursor, setCursor] = useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const y = cursor.getFullYear(), m = cursor.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // həftə bazar ertəsindən başlayır
  const days = new Date(y, m + 1, 0).getDate();
  const minD = fromIso(min), maxD = fromIso(max);
  const canPrev = new Date(y, m, 1) > new Date(minD.getFullYear(), minD.getMonth(), 1);
  const canNext = new Date(y, m + 1, 1) <= maxD;

  return (
    <div className="cal" role="dialog" aria-label="Təqvim">
      <div className="cal-head">
        <button type="button" className="cal-nav" disabled={!canPrev} onClick={() => setCursor(new Date(y, m - 1, 1))} aria-label="Əvvəlki ay"><Chevron dir="left" /></button>
        <b>{MONTHS[m][0].toUpperCase() + MONTHS[m].slice(1)} {y}</b>
        <button type="button" className="cal-nav" disabled={!canNext} onClick={() => setCursor(new Date(y, m + 1, 1))} aria-label="Növbəti ay"><Chevron /></button>
      </div>
      <div className="cal-grid">
        {WD_HEAD.map(d => <span key={d} className="cal-wd">{d}</span>)}
        {Array.from({ length: offset }, (_, i) => <span key={'e' + i} />)}
        {Array.from({ length: days }, (_, i) => {
          const iso = toIso(new Date(y, m, i + 1));
          const disabled = iso < min || iso > max;
          return (
            <button key={iso} type="button" className={`cal-day ${iso === value ? 'is-on' : ''} ${iso === toIso(new Date()) ? 'is-today' : ''}`}
              disabled={disabled} onClick={() => onPick(iso)} aria-pressed={iso === value}>
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateTimePicker({ date, time, onDate, onTime, error }) {
  const min = minOrderDate();
  const max = toIso(addDays(new Date(), MAX_DAYS));
  const strip = useMemo(() => Array.from({ length: STRIP_DAYS }, (_, i) => addDays(fromIso(min), i)), [min]);
  const inStrip = date && strip.some(d => toIso(d) === date);
  const [calOpen, setCalOpen] = useState(false);
  const scroller = useRef();
  const wrap = useRef();

  // Seçilmiş günü görünən sahəyə gətir
  useEffect(() => {
    const el = scroller.current?.querySelector('.day[aria-pressed="true"]');
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [date]);

  // Kənara klikləyəndə təqvimi bağla
  useEffect(() => {
    if (!calOpen) return;
    const close = e => { if (!wrap.current?.contains(e.target)) setCalOpen(false); };
    const esc = e => e.key === 'Escape' && setCalOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [calOpen]);

  const scrollBy = dir => scroller.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  const picked = date ? fromIso(date) : null;
  const relative = d => {
    const diff = Math.round((d - fromIso(toIso(new Date()))) / 864e5);
    return diff === 1 ? 'Sabah' : diff === 2 ? 'Birigün' : WD_SHORT[d.getDay()];
  };

  return (
    <div className="dtp" ref={wrap}>
      {/* ---------- Tarix ---------- */}
      <div className="dtp-head">
        <span className="label">Tarix *</span>
        <div className="dtp-arrows">
          <button type="button" className="cal-btn" aria-expanded={calOpen} onClick={() => setCalOpen(o => !o)}>
            <CalendarIcon />Təqvim
          </button>
          <button type="button" className="cal-nav hide-sm" onClick={() => scrollBy(-1)} aria-label="Geri sürüşdür"><Chevron dir="left" /></button>
          <button type="button" className="cal-nav hide-sm" onClick={() => scrollBy(1)} aria-label="İrəli sürüşdür"><Chevron /></button>
        </div>
      </div>
      <div className={`days ${error ? 'invalid' : ''}`} ref={scroller} role="listbox" aria-label="Tarix seçin">
        {date && !inStrip && (
          <button type="button" role="option" className="day day-picked" aria-pressed="true" aria-selected="true" onClick={() => setCalOpen(true)}>
            <span className="day-wd">{WD_SHORT[picked.getDay()]}</span>
            <span className="day-n">{picked.getDate()}</span>
            <span className="day-m">{MONTHS[picked.getMonth()].slice(0, 3)}</span>
          </button>
        )}
        {strip.map(d => {
          const iso = toIso(d);
          const weekend = d.getDay() === 0 || d.getDay() === 6;
          return (
            <button key={iso} type="button" role="option" className={`day ${weekend ? 'is-weekend' : ''}`}
              aria-pressed={iso === date} aria-selected={iso === date} onClick={() => { onDate(iso); setCalOpen(false); }}>
              <span className="day-wd">{relative(d)}</span>
              <span className="day-n">{d.getDate()}</span>
              <span className="day-m">{MONTHS[d.getMonth()].slice(0, 3)}</span>
            </button>
          );
        })}
        <button type="button" className="day day-more" aria-expanded={calOpen} onClick={() => setCalOpen(o => !o)}>
          <CalendarIcon />
          <span className="day-m">Başqa<br />tarix</span>
        </button>
      </div>
      {calOpen && (
        <div className="cal-pop">
          <MonthCalendar value={date} min={min} max={max} onPick={iso => { onDate(iso); setCalOpen(false); }} />
        </div>
      )}
      {error && <small className="err">{error}</small>}

      {/* ---------- Saat ---------- */}
      <span className="label dtp-time-label">Saat</span>
      <div className="periods">
        {PERIODS.map(p => (
          <div key={p.id} className="period">
            <span className="period-name"><span aria-hidden="true">{p.icon}</span>{p.name}</span>
            <div className="slots">
              {DATA.times.filter(t => { const h = parseInt(t, 10); return h >= p.from && h <= p.to; }).map(t => (
                <button key={t} type="button" className="slot" aria-pressed={t === time} onClick={() => onTime(t)}>{t}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {date && (
        <div className="dtp-summary" aria-live="polite">
          <CalendarIcon />
          <span><b>{WEEKDAYS[picked.getDay()]}, {picked.getDate()} {MONTHS[picked.getMonth()]}</b> · saat {time}</span>
        </div>
      )}
    </div>
  );
}
