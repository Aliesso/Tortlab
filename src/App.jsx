import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DATA, DETAILS_STEP, IMAGE_STEP, REVIEW_STEP, STEPS, TEXT_STEP } from './lib/data.js';
import { byId, fmtKg, money, orderMessage, servings, sliceMarkup, total, validateDetails } from './lib/utils.js';
import { defaultState, useCakeState } from './lib/useCakeState.js';
import { dataUrlToFile, downloadBlob, orderFiles, renderPng, sendEmail, sendWhatsApp } from './lib/send.js';
import { STEP_COMPONENTS } from './components/Steps.jsx';

const Cake3D = lazy(() => import('./cake/Cake3D.jsx'));

function useToast() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const t = useRef();
  const toast = useCallback(m => {
    setMsg(m); setShow(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setShow(false), 2600);
  }, []);
  return [<div key="toast" className={`toast ${show ? 'show' : ''}`} role="status" aria-live="polite">{msg}</div>, toast];
}

const VIEWS = [
  { id: 'front', label: 'Ön', icon: <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" /> },
  { id: 'top', label: 'Yuxarıdan', icon: <path d="M12 3v6M9 6l3 3 3-3M4 14h16M6 18h12" /> },
  { id: 'spin', label: '360°', icon: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4" /> },
];

export default function App() {
  const [state, update, replace] = useCakeState();
  const [toastEl, toast] = useToast();
  const [errors, setErrors] = useState({});
  const [view, setView] = useState('front');
  const [viewKey, setViewKey] = useState(0);
  const [sent, setSent] = useState(null);
  const [busy, setBusy] = useState(false);
  const glRef = useRef(null);
  const builderRef = useRef(null);
  const step = state.step;
  const editingPhoto = step === IMAGE_STEP;

  // Foto və yazı addımlarında kamera avtomatik yuxarıdan baxır
  useEffect(() => {
    setView(step === IMAGE_STEP || step === TEXT_STEP ? 'top' : 'front');
    setViewKey(k => k + 1);
  }, [step]);

  const goTo = useCallback(n => {
    n = Math.max(0, Math.min(STEPS.length - 1, n));
    if (n > DETAILS_STEP) {
      const e = validateDetails(state.customer);
      if (Object.keys(e).length) {
        setErrors(e);
        update({ step: DETAILS_STEP });
        toast('Zəhmət olmasa məlumatları tamamlayın');
        return;
      }
    }
    setSent(null);
    update(s => ({
      step: n,
      maxStep: Math.max(s.maxStep, n),
      orderId: n === REVIEW_STEP && !s.orderId ? 'TL-' + Date.now().toString().slice(-6) : s.orderId,
    }));
    const el = builderRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - (window.innerWidth < 960 ? 0 : 90);
      if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }, [state.customer, update, toast]);

  // Başlanğıcda təsdiq addımındadırsa, amma məlumat natamamdırsa — geri qaytar
  useEffect(() => {
    if (state.step === REVIEW_STEP && Object.keys(validateDetails(state.customer)).length) update({ step: DETAILS_STEP });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step === REVIEW_STEP && !state.orderId) update({ orderId: 'TL-' + Date.now().toString().slice(-6) });
  }, [step, state.orderId, update]);

  const onImageChange = useCallback(patch => update(s => (s.image ? { image: { ...s.image, ...patch } } : {})), [update]);

  const canShare = useMemo(() => {
    try { return !!navigator.canShare?.({ files: [new File([''], 'x.png', { type: 'image/png' })] }); } catch { return false; }
  }, []);

  const shot = async () => {
    if (!glRef.current) throw new Error('3D hazır deyil');
    return renderPng(glRef.current, state);
  };

  const actions = {
    busy, canShare,
    whatsapp: async () => {
      setBusy('wa');
      try { setSent(await sendWhatsApp(glRef.current, state)); } finally { setBusy(false); }
    },
    email: async () => {
      setBusy('mail');
      try {
        const r = await sendEmail(glRef.current, state);
        setSent(r);
        if (r === 'auto') toast('Sifariş şəkillərlə birlikdə göndərildi');
      } finally { setBusy(false); }
    },
    download: async () => { try { downloadBlob(await shot(), `tort-${state.orderId}.png`); } catch (e) { toast(e.message); } },
    downloadPhoto: async () => {
      const f = await dataUrlToFile(state.image.src, `tort-foto-${state.orderId}`);
      downloadBlob(f, `tort-foto-${state.orderId}.${f.type.split('/')[1] || 'jpg'}`);
    },
    // Bütün sifariş şəkillərini bir kliklə yükləyir
    downloadAll: async () => {
      const files = await orderFiles(glRef.current, state);
      files.forEach(({ file }, i) => setTimeout(() => downloadBlob(file, file.name), i * 400));
      toast(`${files.length} şəkil yükləndi — mesaja əlavə edin`);
    },
    share: async () => {
      try {
        const files = (await orderFiles(glRef.current, state)).map(f => f.file);
        await navigator.share({ files, text: orderMessage(state, true) });
      } catch { /* ləğv edildi */ }
    },
    // WhatsApp-da sifariş mətni artıq gedib — burada yalnız şəkilləri paylaşırıq
    shareImages: async () => {
      try {
        const files = (await orderFiles(glRef.current, state)).map(f => f.file);
        await navigator.share({ files, title: `Tort sifarişi #${state.orderId}` });
      } catch { /* ləğv edildi */ }
    },
    copy: async () => {
      try { await navigator.clipboard.writeText(orderMessage(state, false)); toast('Sifariş mətni kopyalandı'); }
      catch { toast('Kopyalamaq alınmadı'); }
    },
    reset: () => {
      replace({ ...defaultState(), customer: { ...state.customer, date: '' } });
      setSent(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  };

  const Step = STEP_COMPONENTS[step];
  const price = money(total(state));
  const sh = byId(DATA.shapes, state.shape), sp = byId(DATA.sponges, state.sponge), cr = byId(DATA.creams, state.cream);
  const fills = state.fillings.map(id => byId(DATA.fillings, id).name);
  const nextLabel = step === DETAILS_STEP ? 'Yoxla' : step === DETAILS_STEP - 1 ? 'Sifariş et' : step === IMAGE_STEP && !state.image ? 'Keç' : 'Növbəti';

  return (
    <>
      <header className="topbar">
        <a className="brand" href="./" aria-label="Tortlab ana səhifə">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="currentColor" /><path d="M8 19h16v5H8zM9 14.5c0-1.4 1.1-2.5 2.5-2.5h9c1.4 0 2.5 1.1 2.5 2.5V19H9z" fill="#fff" /><path d="M16 6.5c1.2 1.3 1.2 2.6 0 3.6-1.2-1-1.2-2.3 0-3.6z" fill="#FFD27A" /></svg>
          </span>
          <span className="brand-name">Tortlab <em>3D</em></span>
        </a>
        <nav className="stepper" aria-label="Addımlar">
          {STEPS.map((x, i) => (
            <button key={i} type="button" onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}
              className={`st ${i === step ? 'is-current' : ''} ${i !== step && i <= state.maxStep ? 'is-done' : ''}`}>
              <span className="st-n">{i < step ? '✓' : i + 1}</span><span className="st-t">{x.short}</span>
            </button>
          ))}
        </nav>
        <div className="top-meta">
          <span className="mobile-step">{step + 1}/{STEPS.length} · {STEPS[step].short}</span>
          <span className="price-pill">{price}</span>
        </div>
        <div className="progress" aria-hidden="true"><span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
      </header>

      <main className="layout">
        <aside className="preview" aria-label="Tortun 3D önizləməsi">
          <div className="preview-card">
            <div className={`stage ${editingPhoto && state.image ? 'is-editing' : ''}`}>
              <Suspense fallback={<div className="stage-loading"><span />3D yüklənir…</div>}>
                <Cake3D state={state} editing={editingPhoto} view={view} viewKey={viewKey} onImageChange={onImageChange} glRef={glRef} />
              </Suspense>
              {editingPhoto && state.image && <div className="stage-hint">✋ Şəkli sürüşdürün · təkərlə böyüdün</div>}
              <div className="view-bar" role="group" aria-label="Görünüş">
                {VIEWS.map(v => (
                  <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => { setView(v.id); setViewKey(k => k + 1); }} title={v.label}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">{v.icon}</svg><span>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="slice">
              <svg viewBox="0 0 300 140" role="img" aria-label="Tortun kəsik görünüşü" dangerouslySetInnerHTML={{ __html: sliceMarkup(state) }} />
              <span className="slice-label">Kəsik görünüşü</span>
            </div>
            <ul className="spec">
              <li>{sh.name} · {fmtKg(state.weight)} · ~{servings(state.weight)} nəfər</li>
              <li>{sp.name} + {cr.name}</li>
              {fills.length > 0 && <li>İçlik: {fills.join(', ')}</li>}
              {state.tiers > 1 && <li>{state.tiers} mərtəbə</li>}
              {state.image && <li>📷 Foto çap</li>}
            </ul>
            <div className="preview-price"><span>Təxmini qiymət</span><strong>{price}</strong></div>
          </div>
        </aside>

        <section className="builder" ref={builderRef}>
          <div className="step-content enter" key={step}>
            <header className="step-head">
              <span className="eyebrow">Addım {step + 1} / {STEPS.length}</span>
              <h1>{STEPS[step].title}</h1>
              <p>{STEPS[step].lead}</p>
            </header>
            <Step
              state={state} update={update} toast={toast} goTo={goTo}
              errors={errors} clearError={k => setErrors(e => ({ ...e, [k]: undefined }))}
              actions={actions} sent={sent}
            />
          </div>
          <div className="nav-bar">
            <button type="button" className="btn btn-ghost" disabled={step === 0} onClick={() => goTo(step - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>Geri
            </button>
            <div className="nav-price"><span>Cəmi</span><strong>{price}</strong></div>
            {step !== REVIEW_STEP && (
              <button type="button" className="btn btn-primary" onClick={() => goTo(step + 1)}>
                <span>{nextLabel}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            )}
          </div>
        </section>
      </main>
      {toastEl}
    </>
  );
}
