import { CONFIG, DATA } from './data.js';
import { byId, fmtKg, money, orderMessage, total } from './utils.js';

/* =========================================================
   SİFARİŞ ŞƏKİLLƏRİ
   ========================================================= */

/** 3D səhnənin şəklini məlumat kartı ilə birlikdə şəklə çevirir. */
export async function renderPng(gl, state, type = 'image/png') {
  const shot = new Image();
  shot.src = gl.domElement.toDataURL('image/png');
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
  return new Promise(res => cv.toBlob(res, type, 0.9));
}

export async function dataUrlToFile(dataUrl, name) {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], name, { type: blob.type });
}

/** Sifarişə qoşulan fayllar: 3D dizayn + (varsa) müştərinin fotosu. */
export async function orderFiles(gl, state) {
  const files = [];
  if (gl) {
    try {
      const blob = await renderPng(gl, state, 'image/jpeg');
      files.push({ label: '3D dizayn', file: new File([blob], `tort-${state.orderId}-3d.jpg`, { type: 'image/jpeg' }) });
    } catch { /* 3D hazır deyilsə, keçirik */ }
  }
  if (state.image) {
    const ext = state.image.src.startsWith('data:image/png') ? 'png' : 'jpg';
    files.push({ label: 'Tortun üzərinə çap olunacaq foto', file: await dataUrlToFile(state.image.src, `tort-${state.orderId}-foto.${ext}`) });
  }
  return files;
}

/** Şəkilləri ImgBB-yə yükləyib linklərini qaytarır (CONFIG.imgbbKey lazımdır). */
async function uploadImages(files) {
  return Promise.all(files.map(async ({ label, file }) => {
    const fd = new FormData();
    fd.append('image', file);
    fd.append('name', file.name.replace(/\.\w+$/, ''));
    const r = await fetch(`https://api.imgbb.com/1/upload?key=${CONFIG.imgbbKey}`, { method: 'POST', body: fd });
    const data = await r.json();
    if (!r.ok || !data?.data?.url) throw new Error(data?.error?.message || 'Şəkil yüklənmədi');
    return { label, url: data.data.url };
  }));
}

/* =========================================================
   WHATSAPP
   ========================================================= */
const waUrl = (state, links) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(orderMessage(state, true, links))}`;

/**
 * 'wa'        — WhatsApp açıldı, şəkillər mesajda link kimi var (və ya şəkil yoxdur).
 * 'wa-attach' — WhatsApp açıldı, şəkilləri müştəri özü əlavə etməlidir.
 */
export async function sendWhatsApp(gl, state) {
  if (!CONFIG.imgbbKey) {
    window.open(waUrl(state), '_blank', 'noopener');
    return 'wa-attach';
  }
  // Popup bloklanmasın deyə pəncərəni kliklə dərhal açır, linki yükləmədən sonra veririk
  const win = window.open('about:blank', '_blank');
  try {
    const links = await uploadImages(await orderFiles(gl, state));
    const url = waUrl(state, links);
    if (win) win.location.href = url; else location.href = url;
    return 'wa';
  } catch (e) {
    console.warn('ImgBB:', e);
    const url = waUrl(state);
    if (win) win.location.href = url; else location.href = url;
    return 'wa-attach';
  }
}

/* =========================================================
   EMAIL
   ========================================================= */
const emailSubject = state => `Tort sifarişi #${state.orderId} — ${state.customer.name}`;

/** Avtomatik göndərmə alınmayanda istifadəçinin özü açacağı linklər. */
export function emailLinks(state) {
  const to = encodeURIComponent(CONFIG.email);
  const su = encodeURIComponent(emailSubject(state));
  const body = encodeURIComponent(orderMessage(state, false));
  const cc = state.customer.email ? encodeURIComponent(state.customer.email) : '';
  return {
    // Gmail-in veb yazma pəncərəsi — kompüterdə mail proqramı tələb etmir
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}${cc ? `&cc=${cc}` : ''}`,
    mailto: `mailto:${CONFIG.email}?subject=${su}${cc ? `&cc=${cc}` : ''}&body=${body}`,
  };
}

/**
 * 'auto'     — sifariş şəkillərlə birlikdə FormSubmit ilə birbaşa emailə göndərildi.
 * 'fallback' — avtomatik göndərmə alınmadı; interfeys Gmail / mail proqramı linklərini göstərir.
 */
export async function sendEmail(gl, state) {
  if (!CONFIG.formSubmit) return 'fallback';
  try {
    const fd = new FormData();
    fd.append('_subject', emailSubject(state));
    fd.append('_template', 'box');
    fd.append('_captcha', 'false');
    if (state.customer.email) fd.append('_cc', state.customer.email);
    fd.append('Sifariş №', state.orderId);
    fd.append('Ad', state.customer.name);
    fd.append('Telefon', state.customer.phone);
    fd.append('Sifariş', orderMessage(state, false));
    (await orderFiles(gl, state)).forEach(({ file }, i) => fd.append(i === 0 ? '3D_dizayn' : 'Foto', file, file.name));

    const r = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: fd,
    });
    const data = await r.json().catch(() => ({}));
    // FormSubmit aktivləşdirilməyibsə 200 qaytarır, amma success: "false" olur
    if (r.ok && String(data.success) === 'true') return 'auto';
    console.warn('FormSubmit:', data.message || r.status);
  } catch (e) {
    console.warn('FormSubmit əlçatmazdır:', e);
  }
  return 'fallback';
}

/* =========================================================
   KÖMƏKÇİLƏR
   ========================================================= */
export function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
