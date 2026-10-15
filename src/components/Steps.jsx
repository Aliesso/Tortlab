import { useRef, useState } from 'react';
import { CONFIG, DATA, PRESETS, SCATTER } from '../lib/data.js';
import { byId, describe, fmtDate, fmtKg, frostName, money, priceLines, readImageFile, servings, total } from '../lib/utils.js';
import DateTimePicker from './DateTimePicker.jsx';
import { emailLinks } from '../lib/send.js';
import { defaultImage } from '../lib/useCakeState.js';
import { makeShape } from '../cake/shapes.js';
import { Group, Opt, Plus, Range, Swatch } from './ui.jsx';

/* SVG ikonlar 3D-də istifadə olunan eyni konturdan yaradılır */
function shapePath(type, s = 36) {
  const pts = makeShape(type, s).getPoints(48);
  return 'M' + pts.map(p => `${(50 + p.x).toFixed(1)},${(52 - p.y).toFixed(1)}`).join('L') + 'Z';
}
const ShapeIcon = ({ type, fill, stroke }) => (
  <svg viewBox="0 0 100 100" aria-hidden="true"><path d={shapePath(type)} style={fill ? { fill, stroke } : undefined} /></svg>
);

const TOPPING_EMOJI = {
  rosette: '🍦', strawberry: '🍓', raspberry: '🫐', blueberry: '🫐', cherry: '🍒', macaron: '🍬',
  flower: '🌸', choco: '🍫', stars: '⭐', sprinkles: '🎊', gold: '✨',
};
const TOPPING_TINT = { raspberry: 'hue-rotate(110deg) saturate(1.6)' };

/* ---------------- 0. Forma ---------------- */
function StepShape({ state, update, toast }) {
  const setWeight = w => {
    const max = [...DATA.tiers].reverse().find(t => w >= t.min).n;
    if (state.tiers > max) toast(`${fmtKg(w)} üçün maksimum ${max} mərtəbə mümkündür`);
    update({ weight: w, tiers: Math.min(state.tiers, max) });
  };
  return (
    <>
      <Group title="Tez başla" hint="Hazır ideyanı seçin, sonra dəyişin">
        <div className="presets">
          {PRESETS.map(p => (
            <button key={p.id} type="button" className="preset" onClick={() => { update(JSON.parse(JSON.stringify(p.s))); toast(`“${p.name}” ideyası tətbiq olundu`); }}>
              <span className="preset-thumb" style={{ '--c': p.s.frost }}>
                <ShapeIcon type={p.s.shape} fill={p.s.frost} stroke="rgba(0,0,0,.15)" />
                <span className="preset-emoji">{p.s.toppings.filter(t => !SCATTER.includes(t)).slice(0, 2).map(t => TOPPING_EMOJI[t]).join('')}</span>
                {p.s.tiers > 1 && <span className="preset-badge">{p.s.tiers} mərtəbə</span>}
              </span>
              <span className="preset-name">{p.name}</span>
            </button>
          ))}
        </div>
      </Group>
      <Group title="Forma">
        <div className="grid grid-4">
          {DATA.shapes.map(s => (
            <Opt key={s.id} className="opt-center" active={state.shape === s.id} onClick={() => update({ shape: s.id })}>
              <span className="shape-ico"><ShapeIcon type={s.id} /></span>
              <span className="opt-title">{s.name}</span><Plus p={s.price} />
            </Opt>
          ))}
        </div>
      </Group>
      <Group title="Çəki" hint="Təxminən 1 kq ≈ 6 nəfər">
        <div className="chips">
          {DATA.weights.map(w => (
            <Opt key={w} className="chip" active={state.weight === w} onClick={() => setWeight(w)}>
              <span className="chip-main">{fmtKg(w)}</span><span className="chip-sub">~{servings(w)} nəfər</span>
            </Opt>
          ))}
        </div>
      </Group>
      <Group title="Mərtəbə" hint={state.weight < 2 ? 'Çox mərtəbə üçün çəkini artırın' : ''}>
        <div className="grid grid-3">
          {DATA.tiers.map(t => (
            <Opt key={t.n} className="opt-center" active={state.tiers === t.n} disabled={state.weight < t.min} onClick={() => update({ tiers: t.n })}>
              <span className="tier-ico" aria-hidden="true">{Array.from({ length: t.n }, (_, i) => <i key={i} />)}</span>
              <span className="opt-title">{t.n} mərtəbə</span>
              <span className="opt-desc">{t.min ? `min. ${fmtKg(t.min)}` : 'Klassik'}</span>
              <Plus p={t.price} />
            </Opt>
          ))}
        </div>
      </Group>
    </>
  );
}

/* ---------------- 1. Dad ---------------- */
function StepTaste({ state, update, toast }) {
  const toggleFilling = id => {
    const arr = [...state.fillings];
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1);
    else {
      arr.push(id);
      if (arr.length > DATA.maxFillings) {
        const removed = arr.shift();
        toast(`Maksimum ${DATA.maxFillings} içlik — “${byId(DATA.fillings, removed).name}” çıxarıldı`);
      }
    }
    update({ fillings: arr });
  };
  return (
    <>
      <Group title="Biskvit" hint="Qiymət 1 kq üçün">
        <div className="grid grid-3">
          {DATA.sponges.map(s => (
            <Opt key={s.id} active={state.sponge === s.id} onClick={() => update({ sponge: s.id })}>
              <span className="swatch crumb" style={{ '--c': s.color }} />
              <span className="opt-title">{s.name}</span>
              <span className="opt-desc">{s.desc}</span>
              <span className="price-tag">{s.price} {CONFIG.currency}/kq</span>
            </Opt>
          ))}
        </div>
      </Group>
      <Group title="Krem">
        <div className="grid grid-2">
          {DATA.creams.map(c => (
            <Opt key={c.id} className="opt-row" active={state.cream === c.id} onClick={() => update({ cream: c.id })}>
              <span className="swatch cream" style={{ '--c': c.color }} />
              <span className="opt-title">{c.name}</span>
              <span className="opt-desc">{c.desc}</span>
              {c.price ? <span className="price-tag">+{c.price} {CONFIG.currency}/kq</span> : <Plus p={0} />}
            </Opt>
          ))}
        </div>
      </Group>
      <Group title="İçlik" hint={`${state.fillings.length} / ${DATA.maxFillings} seçilib`}>
        <div className="chips">
          {DATA.fillings.map(f => (
            <Opt key={f.id} className="chip chip-row" active={state.fillings.includes(f.id)} onClick={() => toggleFilling(f.id)}>
              <span className="dot" style={{ '--c': f.color }} />
              <span className="chip-main">{f.name}</span>
              <span className="chip-sub">+{f.price} {CONFIG.currency}</span>
            </Opt>
          ))}
        </div>
      </Group>
    </>
  );
}

/* ---------------- 2. Üzlük ---------------- */
function StepFrost({ state, update }) {
  const isCustom = !DATA.frostColors.some(c => c.hex.toLowerCase() === state.frost.toLowerCase());
  return (
    <>
      <Group title="Üzlük rəngi" hint={frostName(state.frost)}>
        <div className="swatches">
          {DATA.frostColors.map(c => (
            <Swatch key={c.hex} color={c.hex} name={c.name} active={state.frost === c.hex} onClick={() => update({ frost: c.hex })} />
          ))}
          <label className={`sw sw-custom ${isCustom ? 'is-on' : ''}`} title="Öz rənginiz" style={isCustom ? { '--c': state.frost } : undefined}>
            <input type="color" value={state.frost} onChange={e => update({ frost: e.target.value })} />
            <span className="sr">Öz rənginiz</span>
          </label>
        </div>
      </Group>
      <Group title="Drip — axan qlazur">
        <div className="grid grid-3">
          {DATA.drips.map(d => (
            <Opt key={d.id} className="opt-center" active={state.drip === d.id} onClick={() => update({ drip: d.id })}>
              <span className="drip-ico" style={{ '--c': d.color || 'transparent' }}>{d.color ? '' : '—'}</span>
              <span className="opt-title">{d.name}</span><Plus p={d.price} />
            </Opt>
          ))}
        </div>
      </Group>
    </>
  );
}

/* ---------------- 3. Dekor ---------------- */
function StepDecor({ state, update }) {
  const toggle = id => update({ toppings: state.toppings.includes(id) ? state.toppings.filter(t => t !== id) : [...state.toppings, id] });
  return (
    <>
      <Group title="Üstünə dekor" hint="İstədiyiniz qədər seçin">
        <div className="grid grid-4">
          {DATA.toppings.map(t => (
            <Opt key={t.id} className="opt-center" active={state.toppings.includes(t.id)} onClick={() => toggle(t.id)}>
              <span className="top-ico" style={{ filter: TOPPING_TINT[t.id] }}>{TOPPING_EMOJI[t.id]}</span>
              <span className="opt-title">{t.name}</span><Plus p={t.price} />
            </Opt>
          ))}
        </div>
      </Group>
      <Group title="Şamlar" hint={`${DATA.candlePrice} ${CONFIG.currency} / ədəd`}>
        <div className="stepper-input">
          <button type="button" className="round-btn" aria-label="Azalt" onClick={() => update({ candles: Math.max(0, state.candles - 1) })}>−</button>
          <output>{state.candles}</output>
          <button type="button" className="round-btn" aria-label="Artır" onClick={() => update({ candles: Math.min(20, state.candles + 1) })}>+</button>
          <span className="hint">0–20 ədəd</span>
        </div>
      </Group>
      <Group title="Əlavə istəklər" hint="İstəyə bağlı">
        <textarea className="input" rows={3} maxLength={400} value={state.notes} onChange={e => update({ notes: e.target.value })}
          placeholder="Məs: üstündə uşaq üçün oyuncaq fiqur, şəkərsiz krem, xüsusi rəng tonu…" />
      </Group>
    </>
  );
}

/* ---------------- 4. Foto ---------------- */
function StepPhoto({ state, update, toast }) {
  const input = useRef();
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const img = state.image;
  const setImg = patch => update(s => ({ image: { ...s.image, ...patch } }));

  const handle = async file => {
    if (!file) return;
    setBusy(true);
    try {
      const src = await readImageFile(file);
      update(s => ({
        image: { ...defaultImage(src), ...(s.image ? { crop: s.image.crop } : {}), y: s.text.trim() ? -0.15 : 0 },
        textY: s.text.trim() && s.textY === 0 ? 0.42 : s.textY,
      }));
      toast('Şəkil yerləşdirildi — tortun üzərində sürüşdürün');
    } catch (e) {
      toast(e.message || 'Şəkli oxumaq alınmadı');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Group title="Şəkil" hint={`Yeməli kağıza çap · +${DATA.photoPrice} ${CONFIG.currency}`}>
        <label
          className={`drop ${over ? 'is-over' : ''} ${img ? 'has-img' : ''}`}
          onDragOver={e => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files[0]); }}
        >
          <input ref={input} type="file" accept="image/*" onChange={e => { handle(e.target.files[0]); e.target.value = ''; }} />
          {img ? (
            <>
              <img src={img.src} alt="Yüklənmiş şəkil" className="drop-thumb" />
              <span className="drop-text"><b>Şəkli dəyiş</b><small>Başqa şəkil seçin və ya bura atın</small></span>
            </>
          ) : (
            <>
              <span className="drop-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></svg>
              </span>
              <span className="drop-text">
                <b>{busy ? 'Yüklənir…' : 'Cihazınızdan şəkil seçin'}</b>
                <small>və ya faylı bura sürüşdürün · JPG, PNG, WEBP · 15 MB-a qədər</small>
              </span>
            </>
          )}
        </label>
      </Group>

      {img && (
        <>
          <div className="howto">
            <span className="howto-ico" aria-hidden="true">✋</span>
            <p><b>Yerini dəyişmək üçün</b> 3D önizləmədə şəkli siçan və ya barmaqla sürüşdürün. Siçanın təkəri ilə böyüdüb-kiçildə bilərsiniz.</p>
          </div>
          <Group title="Kəsim forması">
            <div className="grid grid-2">
              <Opt className="opt-row" active={img.crop === 'rect'} onClick={() => setImg({ crop: 'rect' })}>
                <span className="crop-ico" aria-hidden="true" /><span className="opt-title">Düzbucaq</span><span className="opt-desc">Şəklin öz nisbəti</span>
              </Opt>
              <Opt className="opt-row" active={img.crop === 'circle'} onClick={() => setImg({ crop: 'circle' })}>
                <span className="crop-ico round" aria-hidden="true" /><span className="opt-title">Dairə</span><span className="opt-desc">Medalyon kimi</span>
              </Opt>
            </div>
          </Group>
          <Group title="Tənzimləmə">
            <div className="ranges">
              <Range label="Ölçü" value={img.scale} min={0.2} max={2.2} step={0.01} onChange={v => setImg({ scale: v })} format={v => `${Math.round(v * 100)}%`} />
              <Range label="Döndər" value={img.rot} min={-180} max={180} step={1} onChange={v => setImg({ rot: v })} format={v => `${v}°`} />
              <Range label="Sağa / sola" value={img.x} min={-1.1} max={1.1} step={0.01} onChange={v => setImg({ x: v })} format={v => (v * 100).toFixed(0)} />
              <Range label="Önə / arxaya" value={img.y} min={-1.1} max={1.1} step={0.01} onChange={v => setImg({ y: v })} format={v => (v * 100).toFixed(0)} />
            </div>
            <div className="tool-row">
              <button type="button" className="pill" onClick={() => setImg({ x: 0, y: 0, rot: 0 })}>⌖ Mərkəzlə</button>
              <button type="button" className="pill" onClick={() => setImg({ scale: 1.55, x: 0, y: 0 })}>⤢ Bütün üzü örtsün</button>
              <button type="button" className="pill pill-danger" onClick={() => update({ image: null })}>✕ Şəkli sil</button>
            </div>
          </Group>
        </>
      )}
      {!img && <p className="fine">Foto istəmirsinizsə bu addımı keçə bilərsiniz.</p>}
    </>
  );
}

/* ---------------- 5. Yazı ---------------- */
function StepText({ state, update }) {
  // Foto varsa, ilk yazı fotonun altına düşsün ki üst-üstə gəlməsin
  const setText = text => update(s => (
    s.image && !s.text.trim() && text.trim() && s.textY === 0
      ? { text, textY: 0.42, image: { ...s.image, y: Math.min(s.image.y, -0.18) } }
      : { text }
  ));
  return (
    <>
      <Group title="Yazı mətni" hint={`${state.text.length} / 32`}>
        <input className="input input-lg" maxLength={32} placeholder="Məs: Ad günün mübarək, Leyla!" value={state.text}
          onChange={e => setText(e.target.value)} autoComplete="off" />
        <div className="suggest">
          {DATA.suggestions.map(s => <button key={s} type="button" className="pill" onClick={() => setText(s)}>{s}</button>)}
          <button type="button" className="pill pill-ghost" onClick={() => update({ text: '' })}>Təmizlə</button>
        </div>
      </Group>
      <Group title="Şrift">
        <div className="grid grid-3">
          {DATA.fonts.map(f => (
            <Opt key={f.id} className="opt-center" active={state.font === f.id} onClick={() => update({ font: f.id })}>
              <span className="font-sample" style={{ fontFamily: f.css, fontWeight: f.weight }}>Aa</span>
              <span className="opt-title">{f.name}</span>
            </Opt>
          ))}
        </div>
      </Group>
      <Group title="Yazının rəngi">
        <div className="swatches">
          {DATA.textColors.map(c => <Swatch key={c.hex} color={c.hex} name={c.name} active={state.textColor === c.hex} onClick={() => update({ textColor: c.hex })} />)}
        </div>
      </Group>
      <Group title="Ölçü və mövqe">
        <div className="ranges">
          <Range label="Ölçü" value={state.textSize} min={0.5} max={1.6} step={0.01} onChange={v => update({ textSize: v })} format={v => `${Math.round(v * 100)}%`} />
          <Range label="Önə / arxaya" value={state.textY} min={-0.85} max={0.85} step={0.01} onChange={v => update({ textY: v })} format={v => (v * 100).toFixed(0)} />
        </div>
      </Group>
    </>
  );
}

/* ---------------- 6. Məlumat ---------------- */
function StepDetails({ state, update, errors, clearError }) {
  const c = state.customer;
  const set = (k, v) => { update(s => ({ customer: { ...s.customer, [k]: v } })); clearError(k); };
  const field = (k, label, props = {}, span = false) => (
    <div className={`field ${span ? 'span-2' : ''}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} className={`input ${errors[k] ? 'invalid' : ''}`} aria-invalid={!!errors[k]} value={c[k]}
        onChange={e => set(k, e.target.value)} {...props} />
      {errors[k] && <small className="err">{errors[k]}</small>}
    </div>
  );
  return (
    <form className="form" noValidate onSubmit={e => e.preventDefault()}>
      {field('name', 'Ad, soyad *', { autoComplete: 'name', placeholder: 'Adınız' })}
      {field('phone', 'Telefon *', { type: 'tel', autoComplete: 'tel', placeholder: '+994 50 123 45 67' })}
      {field('email', <>Email <span className="muted">(istəyə bağlı — surət sizə də gəlsin)</span></>, { type: 'email', autoComplete: 'email', placeholder: 'ad@mail.com' }, true)}
      <div className="field span-2">
        <DateTimePicker date={c.date} time={c.time} error={errors.date}
          onDate={v => set('date', v)} onTime={v => set('time', v)} />
      </div>
      <div className="field span-2">
        <span className="label">Təhvil üsulu</span>
        <div className="grid grid-2">
          <Opt className="opt-row" active={c.method === 'pickup'} onClick={() => set('method', 'pickup')}>
            <span className="opt-title">🏪 Mağazadan götürəcəyəm</span><span className="opt-desc">Pulsuz</span>
          </Opt>
          <Opt className="opt-row" active={c.method === 'delivery'} onClick={() => set('method', 'delivery')}>
            <span className="opt-title">🚚 Çatdırılma</span><span className="opt-desc">Qiyməti operator dəqiqləşdirəcək</span>
          </Opt>
        </div>
      </div>
      {c.method === 'delivery' && field('address', 'Ünvan *', { autoComplete: 'street-address', placeholder: 'Şəhər, küçə, ev, mənzil' }, true)}
      <p className="fine span-2">Tortlar ən azı 1 gün əvvəldən sifariş olunur.</p>
    </form>
  );
}

/* ---------------- 7. Təsdiq ---------------- */
function StepReview({ state, goTo, actions, sent }) {
  const c = state.customer;
  return (
    <div className="review">
      <div className="card">
        <div className="card-head"><h3>Tortunuz</h3><span className="order-id">#{state.orderId}</span></div>
        {describe(state).map(r => (
          <div className="rv-row" key={r.label}>
            <span>{r.label}</span><b>{r.value}</b>
            <button type="button" className="link" onClick={() => goTo(r.step)}>Dəyiş</button>
          </div>
        ))}
        {state.image && (
          <div className="rv-photo"><img src={state.image.src} alt="Tort üçün foto" /><span>Bu şəkil yeməli kağıza çap olunacaq</span></div>
        )}
      </div>
      <div className="card">
        <div className="card-head"><h3>Əlaqə və təhvil</h3><button type="button" className="link" onClick={() => goTo(6)}>Dəyiş</button></div>
        <div className="rv-row"><span>Müştəri</span><b>{c.name}</b></div>
        <div className="rv-row"><span>Telefon</span><b>{c.phone}</b></div>
        {c.email && <div className="rv-row"><span>Email</span><b>{c.email}</b></div>}
        <div className="rv-row"><span>Tarix</span><b>{fmtDate(c.date)}, {c.time}</b></div>
        <div className="rv-row"><span>Təhvil</span><b>{c.method === 'delivery' ? `Çatdırılma — ${c.address}` : 'Mağazadan götürmə'}</b></div>
      </div>
      <div className="card bill">
        {priceLines(state).map(([n, p]) => <div className="bill-row" key={n}><span>{n}</span><span>{money(p)}</span></div>)}
        <div className="bill-total"><span>Təxmini cəmi</span><strong>{money(total(state))}</strong></div>
      </div>

      <div className="send">
        <button type="button" className="btn btn-wa" onClick={actions.whatsapp} disabled={!!actions.busy}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.8-2.8l.9-1-1-2z" className="fill" /></svg>
          {actions.busy === 'wa' ? 'Şəkillər yüklənir…' : 'WhatsApp ilə göndər'}
        </button>
        <button type="button" className="btn btn-dark" onClick={actions.email} disabled={!!actions.busy}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7l8 6 8-6" /></svg>
          {actions.busy === 'mail' ? 'Şəkillərlə göndərilir…' : 'Email ilə göndər'}
        </button>
        <div className="send-files">
          <span className="send-files-label">Sifarişlə birlikdə gedəcək şəkillər:</span>
          <span className="send-file">🎂 3D dizayn</span>
          {state.image && <span className="send-file"><img src={state.image.src} alt="" />Çap fotosu</span>}
        </div>
        <div className="send-extra">
          <button type="button" className="link" onClick={actions.download}>⬇ 3D dizayn şəklini yüklə</button>
          {state.image && <button type="button" className="link" onClick={actions.downloadPhoto}>⬇ Foto faylını yüklə</button>}
          {actions.canShare && <button type="button" className="link" onClick={actions.share}>↗ Şəkillərlə paylaş</button>}
          <button type="button" className="link" onClick={actions.copy}>⧉ Mətni kopyala</button>
        </div>
        <p className="fine">Qiymət təxminidir — dəqiq məbləği qənnadçımız sizinlə əlaqə saxlayaraq təsdiqləyəcək.</p>
      </div>

      {sent === 'wa-attach' && (
        <div className="sent card">
          <div className="sent-ico warn">🖼</div>
          <h3>Son addım: şəkilləri də göndərin</h3>
          <p>WhatsApp-da sifariş mətni hazırdır — onu göndərin. Sonra eyni söhbətə {state.image ? '3D dizaynı və çap fotosunu' : '3D dizayn şəklini'} əlavə edin.</p>
          <div className="fallback-actions">
            {actions.canShare
              ? <button type="button" className="btn btn-wa" onClick={actions.shareImages}>Şəkilləri WhatsApp-a paylaş</button>
              : <button type="button" className="btn btn-dark" onClick={actions.downloadAll}>⬇ Şəkilləri yüklə</button>}
          </div>
          <p className="fine">{actions.canShare
            ? 'Açılan siyahıdan WhatsApp-ı və bizim söhbəti seçin.'
            : 'Şəkillər kompüterinizə yüklənəcək — WhatsApp-da 📎 düyməsi ilə əlavə edin.'}</p>
          <button type="button" className="btn btn-ghost" onClick={actions.reset}>Yeni tort yarat</button>
        </div>
      )}
      {sent === 'fallback' && (
        <div className="sent card">
          <div className="sent-ico warn">✉</div>
          <h3>Emaili özünüz göndərin</h3>
          <p>Avtomatik göndərmə alınmadı. Sifariş mətni hazırdır — aşağıdakı düymələrdən biri ilə açıb “Göndər”ə basın. Şəkilləri yükləyib mailə qoşun.</p>
          <div className="fallback-actions">
            <a className="btn btn-dark" href={emailLinks(state).gmail} target="_blank" rel="noopener noreferrer">Gmail-də aç</a>
            <a className="btn btn-ghost" href={emailLinks(state).mailto}>Mail proqramında aç</a>
            <button type="button" className="btn btn-ghost" onClick={actions.downloadAll}>⬇ Şəkilləri yüklə</button>
          </div>
          <p className="fine">Mətni kopyalayıb {CONFIG.email} ünvanına istənilən mail xidmətindən də göndərə bilərsiniz.</p>
        </div>
      )}
      {(sent === 'wa' || sent === 'auto') && (
        <div className="sent card">
          <div className="sent-ico">✓</div>
          <h3>Sifarişiniz hazırdır!</h3>
          <p>{sent === 'wa'
            ? 'WhatsApp açıldı — mesajı göndərməyi unutmayın. Şəkillərin linkləri mesaja əlavə olunub.'
            : 'Sifarişiniz şəkillərlə birlikdə emailə göndərildi. Qənnadçımız tezliklə sizinlə əlaqə saxlayacaq.'}</p>
          <button type="button" className="btn btn-ghost" onClick={actions.reset}>Yeni tort yarat</button>
        </div>
      )}
    </div>
  );
}

export const STEP_COMPONENTS = [StepShape, StepTaste, StepFrost, StepDecor, StepPhoto, StepText, StepDetails, StepReview];
