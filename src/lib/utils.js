import { CONFIG, DATA } from './data.js';

export const byId = (list, id) => list.find(x => x.id === id);
export const money = n => `${Math.round(n)} ${CONFIG.currency}`;
export const fmtKg = w => `${String(w).replace('.', ',')} kq`;
export const servings = w => Math.round(w * 6);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const f1 = n => n.toFixed(1);

export function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
export function lum(h) {
  const [r, g, b] = hexToRgb(h);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
export function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function splitText(t) {
  t = (t || '').trim();
  if (!t) return [];
  if (t.length <= 14 || !t.includes(' ')) return [t];
  const mid = t.length / 2; let best = -1;
  for (let i = 0; i < t.length; i++) if (t[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return [t.slice(0, best), t.slice(best + 1)];
}

export const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
export const WEEKDAYS = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];

/** Yerli vaxtla YYYY-MM-DD (toISOString UTC-yə çevirdiyi üçün gecə saatlarında bir gün sürüşür). */
export function toIso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function fromIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(d, n) {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  r.setDate(r.getDate() + n);
  return r;
}

export function minOrderDate() {
  return toIso(addDays(new Date(), 1));
}

export function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function frostName(hex) {
  const f = DATA.frostColors.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  return f ? f.name : `Xüsusi (${hex.toUpperCase()})`;
}

export function priceLines(st) {
  const L = [];
  const sp = byId(DATA.sponges, st.sponge), cr = byId(DATA.creams, st.cream);
  L.push([`${sp.name} biskvit · ${fmtKg(st.weight)}`, sp.price * st.weight]);
  if (cr.price) L.push([`${cr.name} · ${fmtKg(st.weight)}`, cr.price * st.weight]);
  const sh = byId(DATA.shapes, st.shape);
  if (sh.price) L.push([`${sh.name} forma`, sh.price]);
  const tr = DATA.tiers.find(t => t.n === st.tiers);
  if (tr?.price) L.push([`${st.tiers} mərtəbə`, tr.price]);
  st.fillings.forEach(id => { const f = byId(DATA.fillings, id); L.push([`İçlik: ${f.name}`, f.price]); });
  const dr = byId(DATA.drips, st.drip);
  if (dr?.price) L.push([`Drip: ${dr.name}`, dr.price]);
  st.toppings.forEach(id => { const t = byId(DATA.toppings, id); L.push([t.name, t.price]); });
  if (st.candles) L.push([`Şam × ${st.candles}`, st.candles * DATA.candlePrice]);
  if (st.image) L.push(['Yeməli foto çap', DATA.photoPrice]);
  if (st.text.trim()) L.push(['Xüsusi yazı', DATA.textPrice]);
  return L;
}
export const total = st => priceLines(st).reduce((s, [, p]) => s + p, 0);

export function describe(st) {
  const sh = byId(DATA.shapes, st.shape), sp = byId(DATA.sponges, st.sponge), cr = byId(DATA.creams, st.cream);
  const dr = byId(DATA.drips, st.drip), font = byId(DATA.fonts, st.font);
  const fills = st.fillings.map(id => byId(DATA.fillings, id).name).join(', ') || 'Yoxdur';
  const tops = st.toppings.map(id => byId(DATA.toppings, id).name).join(', ') || 'Yoxdur';
  const tc = DATA.textColors.find(c => c.hex === st.textColor)?.name || st.textColor;
  return [
    { step: 0, label: 'Forma', value: `${sh.name} · ${fmtKg(st.weight)} · ${st.tiers} mərtəbə (~${servings(st.weight)} nəfər)` },
    { step: 1, label: 'Biskvit', value: sp.name },
    { step: 1, label: 'Krem', value: cr.name },
    { step: 1, label: 'İçlik', value: fills },
    { step: 2, label: 'Üzlük rəngi', value: frostName(st.frost) },
    { step: 2, label: 'Drip', value: dr.name },
    { step: 3, label: 'Dekor', value: tops },
    { step: 3, label: 'Şam', value: st.candles ? `${st.candles} ədəd` : 'Yoxdur' },
    { step: 4, label: 'Foto çap', value: st.image ? 'Bəli — şəkil sifarişə əlavə olunub' : 'Yoxdur' },
    { step: 5, label: 'Yazı', value: st.text.trim() ? `“${st.text.trim()}” — ${font.name}, ${tc}` : 'Yoxdur' },
    ...(st.notes.trim() ? [{ step: 3, label: 'Əlavə istək', value: st.notes.trim() }] : []),
  ];
}

/** links: [{ label, url }] — yüklənmiş şəkillərin linkləri (varsa mesajın sonuna əlavə olunur). */
export function orderMessage(st, rich = true, links = []) {
  const b = s => (rich ? `*${s}*` : s);
  const c = st.customer;
  return [
    `🎂 ${b('Yeni tort sifarişi')} — #${st.orderId}`,
    '━━━━━━━━━━━━━━',
    ...describe(st).map(r => `${b(r.label + ':')} ${r.value}`),
    '━━━━━━━━━━━━━━',
    `👤 ${b('Müştəri:')} ${c.name}`,
    `📞 ${b('Telefon:')} ${c.phone}`,
    ...(c.email ? [`✉️ ${b('Email:')} ${c.email}`] : []),
    `📅 ${b('Tarix:')} ${fmtDate(c.date)}, ${c.time}`,
    c.method === 'delivery' ? `🚚 ${b('Çatdırılma:')} ${c.address}` : `🏪 ${b('Təhvil:')} Mağazadan götürəcəyəm`,
    '━━━━━━━━━━━━━━',
    `💰 ${b('Təxmini qiymət:')} ${money(total(st))}`,
    ...(links.length ? ['━━━━━━━━━━━━━━', ...links.map(l => `🖼 ${b(l.label + ':')} ${l.url}`)] : []),
  ].join('\n');
}

export function validateDetails(c) {
  const e = {};
  if (c.name.trim().length < 2) e.name = 'Adınızı yazın';
  if (c.phone.replace(/\D/g, '').length < 9) e.phone = 'Düzgün telefon nömrəsi yazın';
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) e.email = 'Email düzgün deyil';
  if (!c.date) e.date = 'Tarix seçin';
  else if (c.date < minOrderDate()) e.date = 'Ən tezi sabah üçün sifariş mümkündür';
  if (c.method === 'delivery' && c.address.trim().length < 5) e.address = 'Ünvanı yazın';
  return e;
}

/** Tortun kəsik görünüşü (2D SVG). */
export function sliceMarkup(st) {
  const rnd = rng(5);
  const sp = byId(DATA.sponges, st.sponge), cr = byId(DATA.creams, st.cream);
  const fills = st.fillings.map(id => byId(DATA.fillings, id)?.color).filter(Boolean);
  const drip = byId(DATA.drips, st.drip);
  let o = `<rect x="12" y="128" width="276" height="7" rx="3.5" fill="#E3D8CC"/>`;
  o += `<rect x="20" y="14" width="260" height="116" rx="12" fill="${st.frost}"/><rect x="20" y="14" width="260" height="116" rx="12" fill="none" stroke="${mix(st.frost, '#000', .15)}" stroke-opacity=".5"/>`;
  if (drip?.color) {
    o += `<path d="M20,30V26a12,12 0 0 1 12,-12H268a12,12 0 0 1 12,12V30Z" fill="${drip.color}"/>`;
    [[20, 22], [272, 30]].forEach(([x, h]) => { o += `<rect x="${x}" y="24" width="8" height="${h}" rx="4" fill="${drip.color}"/>`; });
  }
  let y = 26;
  const crumbDark = mix(sp.color, '#000', .14), crumbLight = mix(sp.color, '#fff', .2);
  ['s', 'c', 's', 'c', 's'].forEach(t => {
    if (t === 's') {
      o += `<rect x="28" y="${y}" width="244" height="26" rx="2" fill="${sp.color}"/>`;
      for (let i = 0; i < 34; i++) o += `<circle cx="${f1(31 + rnd() * 238)}" cy="${f1(y + 2 + rnd() * 22)}" r="${f1(.6 + rnd() * 1.1)}" fill="${i % 2 ? crumbDark : crumbLight}"/>`;
      y += 26;
    } else {
      o += `<rect x="28" y="${y}" width="244" height="9" fill="${cr.color}"/>`;
      if (fills.length) for (let x = 36, i = 0; x < 268; x += 15, i++) o += `<ellipse cx="${f1(x + (rnd() - .5) * 4)}" cy="${y + 4.5}" rx="4.2" ry="3.2" fill="${fills[i % fills.length]}"/>`;
      y += 9;
    }
  });
  return o;
}

/** Yüklənən şəkli kiçildib dataURL-ə çevirir (localStorage və performans üçün). */
export async function readImageFile(file, max = 1400) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Yalnız şəkil faylı yükləyin');
  if (file.size > 15 * 1024 * 1024) throw new Error('Şəkil 15 MB-dan böyük olmamalıdır');
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const cv = document.createElement('canvas');
    cv.width = Math.round(img.naturalWidth * k);
    cv.height = Math.round(img.naturalHeight * k);
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    const keepAlpha = file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/gif';
    return keepAlpha ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.88);
  } finally {
    URL.revokeObjectURL(url);
  }
}
