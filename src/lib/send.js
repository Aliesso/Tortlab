import { CONFIG, DATA } from './data.js';
import { byId, fmtKg, money, orderMessage, total } from './utils.js';

export function sendWhatsApp(state) {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(orderMessage(state, true))}`;
  window.open(url, '_blank', 'noopener');
  return 'wa';
}

/** 'auto' — FormSubmit ilə göndərildi; 'mail' — mail proqramı açıldı. */
export async function sendEmail(state) {
  const subject = `Tort sifarişi #${state.orderId} — ${state.customer.name}`;
  const body = orderMessage(state, false);
  if (CONFIG.formSubmit) {
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _template: 'box',
          ...(state.customer.email ? { _cc: state.customer.email } : {}),
          Sifariş: body,
          Ad: state.customer.name,
          Telefon: state.customer.phone,
        }),
      });
      if (r.ok) return 'auto';
    } catch { /* mailto-ya keçirik */ }
  }
  const cc = state.customer.email ? `&cc=${encodeURIComponent(state.customer.email)}` : '';
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}${cc}&body=${encodeURIComponent(body)}`;
  return 'mail';
}

/** 3D səhnənin şəklini məlumat kartı ilə birlikdə PNG-yə çevirir. */
export async function renderPng(gl, state) {
  const src = gl.domElement;
  const shot = new Image();
  shot.src = src.toDataURL('image/png');
  await shot.decode();

  const W = 1080, H = 1260;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#FDF1F3'); bg.addColorStop(1, '#FAF5EF');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  const side = Math.min(shot.width, shot.height);
  g.drawImage(shot, (shot.width - side) / 2, (shot.height - side) / 2, side, side, 40, 20, 1000, 1000);

  g.fillStyle = '#2B1E18'; g.textAlign = 'center';
  g.font = '600 46px Fraunces, Georgia, serif';
  g.fillText(`${CONFIG.brand} · #${state.orderId || 'dizayn'}`, W / 2, 1100);
  g.font = '600 30px Manrope, Arial, sans-serif'; g.fillStyle = '#7A6A60';
  const sh = byId(DATA.shapes, state.shape), sp = byId(DATA.sponges, state.sponge);
  g.fillText(`${sh.name} · ${fmtKg(state.weight)} · ${state.tiers} mərtəbə · ${sp.name}`, W / 2, 1155);
  g.fillText(`Təxmini qiymət: ${money(total(state))}`, W / 2, 1200);
  return new Promise(res => cv.toBlob(res, 'image/png'));
}

export function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export async function dataUrlToFile(dataUrl, name) {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], name, { type: blob.type });
}
