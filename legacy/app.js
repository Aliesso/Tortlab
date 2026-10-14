'use strict';

/* =========================================================
   KONFİQURASİYA — öz məlumatlarınızı buraya yazın
   ========================================================= */
const CONFIG = {
  brand: 'Tortlab',
  whatsapp: '994501234567',        // ölkə kodu ilə, "+" və boşluq olmadan
  email: 'sifaris@tortlab.az',     // sifarişlərin gələcəyi email
  currency: '₼',
  // true olarsa email brauzerdən birbaşa FormSubmit.co vasitəsilə göndərilir
  // (ilk dəfə FormSubmit sizə təsdiq maili göndərəcək). false = istifadəçinin mail proqramı açılır.
  formSubmit: false,
};

/* =========================================================
   MƏLUMATLAR
   ========================================================= */
const DATA = {
  shapes: [
    { id: 'round',  name: 'Dairəvi',    price: 0 },
    { id: 'square', name: 'Kvadrat',    price: 5 },
    { id: 'heart',  name: 'Ürək',       price: 10 },
    { id: 'rect',   name: 'Düzbucaqlı', price: 5 },
  ],
  weights: [1, 1.5, 2, 3, 4, 5],
  tiers: [
    { n: 1, price: 0,  min: 0 },
    { n: 2, price: 25, min: 2 },
    { n: 3, price: 50, min: 3 },
  ],
  sponges: [
    { id: 'vanilla',   name: 'Vanil',      desc: 'Yüngül, klassik',      color: '#F3DDA8', price: 28 },
    { id: 'choco',     name: 'Şokolad',    desc: 'Kakao ilə nəmli',      color: '#5B3A29', price: 30 },
    { id: 'redvelvet', name: 'Red Velvet', desc: 'Məxməri, kakao notlu', color: '#A3263A', price: 34 },
    { id: 'lemon',     name: 'Limon',      desc: 'Təzə sitrus notu',     color: '#F4E07A', price: 30 },
    { id: 'caramel',   name: 'Karamel',    desc: 'Yanmış şəkər dadı',    color: '#C98A4B', price: 32 },
    { id: 'pistachio', name: 'Püstə',      desc: 'Premium, qozlu',       color: '#B5C98A', price: 40 },
  ],
  creams: [
    { id: 'whipped',    name: 'Qaymaq kremi',  desc: 'Yüngül və havalı',   color: '#FFF9F0', price: 0 },
    { id: 'cheese',     name: 'Krem-pendir',   desc: 'Zərif turşməzə',     color: '#FBF1DE', price: 4 },
    { id: 'ganache',    name: 'Şokolad ganaş', desc: 'Sıx və parlaq',      color: '#3E2418', price: 5 },
    { id: 'mascarpone', name: 'Maskarpone',    desc: 'İtalyan kremi',      color: '#FFF3D6', price: 6 },
  ],
  fillings: [
    { id: 'strawberry', name: 'Çiyələk',       color: '#E0435A', price: 5 },
    { id: 'raspberry',  name: 'Moruq',         color: '#C2185B', price: 6 },
    { id: 'cherry',     name: 'Albalı',        color: '#8E1B2E', price: 5 },
    { id: 'banana',     name: 'Banan',         color: '#F2D46B', price: 4 },
    { id: 'saltcaramel',name: 'Duzlu karamel', color: '#B86B2A', price: 6 },
    { id: 'nutella',    name: 'Nutella',       color: '#6B3E26', price: 7 },
    { id: 'walnut',     name: 'Qoz',           color: '#8C6A4A', price: 6 },
    { id: 'mango',      name: 'Manqo',         color: '#F5A623', price: 7 },
  ],
  maxFillings: 2,
  frostColors: [
    { name: 'Süd',           hex: '#FFF8EE' },
    { name: 'Pudra çəhrayı', hex: '#F7C9D0' },
    { name: 'Lavanda',       hex: '#D9CBEA' },
    { name: 'Nanə',          hex: '#CDEBDD' },
    { name: 'Səma',          hex: '#C9DFF2' },
    { name: 'Limonad',       hex: '#FBE7A1' },
    { name: 'Şaftalı',       hex: '#F9C9A8' },
    { name: 'Kakao',         hex: '#6B4331' },
    { name: 'Qrafit',        hex: '#2E2826' },
  ],
  drips: [
    { id: 'none',    name: 'Yoxdur',          color: null,      price: 0 },
    { id: 'choco',   name: 'Tünd şokolad',    color: '#3F2318', price: 8 },
    { id: 'white',   name: 'Ağ şokolad',      color: '#F6EEDF', price: 8 },
    { id: 'caramel', name: 'Karamel',         color: '#C27A35', price: 8 },
    { id: 'pink',    name: 'Çiyələk qlazuru', color: '#E8799A', price: 8 },
  ],
  toppings: [
    { id: 'rosette',    name: 'Krem rozetləri',    price: 6 },
    { id: 'strawberry', name: 'Çiyələk',           price: 10 },
    { id: 'raspberry',  name: 'Moruq',             price: 10 },
    { id: 'blueberry',  name: 'Qaragilə',          price: 10 },
    { id: 'cherry',     name: 'Albalı',            price: 8 },
    { id: 'macaron',    name: 'Makaron',           price: 14 },
    { id: 'flower',     name: 'Yeməli çiçəklər',   price: 12 },
    { id: 'choco',      name: 'Şokolad lövhələri', price: 7 },
    { id: 'stars',      name: 'Qızılı ulduzlar',   price: 5 },
    { id: 'sprinkles',  name: 'Rəngli səpələmə',   price: 4 },
    { id: 'gold',       name: 'Qızıl yarpaq',      price: 15 },
  ],
  candlePrice: 1,
  textPrice: 3,
  textColors: [
    { name: 'Şokolad', hex: '#3E2418' },
    { name: 'Ağ',      hex: '#FFFFFF' },
    { name: 'Moruq',   hex: '#C2185B' },
    { name: 'Qızılı',  hex: '#C9A227' },
    { name: 'Qara',    hex: '#1E1A19' },
  ],
  fonts: [
    { id: 'script', name: 'Kalliqrafik', css: "'Great Vibes', cursive", w: 0.42, weight: 400 },
    { id: 'serif',  name: 'Klassik',     css: "'Fraunces', Georgia, serif", w: 0.56, weight: 600 },
    { id: 'sans',   name: 'Modern',      css: "'Manrope', Arial, sans-serif", w: 0.6, weight: 800 },
  ],
  suggestions: ['Ad günün mübarək!', 'Təbriklər!', 'Səni sevirəm', 'Xoşbəxt ol', 'Uğurlar!'],
  times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
};

const SCATTER = ['sprinkles', 'gold'];
const TIER_SCALES = { 1: [1], 2: [1, 0.66], 3: [1, 0.72, 0.46] };

const PRESETS = [
  { id: 'bday', name: 'Ad günü', s: { shape: 'round', weight: 2, tiers: 1, sponge: 'vanilla', cream: 'whipped', fillings: ['strawberry'], frost: '#F7C9D0', drip: 'none', toppings: ['rosette', 'macaron', 'sprinkles'], candles: 5, text: 'Ad günün mübarək!', textColor: '#C2185B', font: 'script' } },
  { id: 'love', name: 'Romantik', s: { shape: 'heart', weight: 1.5, tiers: 1, sponge: 'redvelvet', cream: 'cheese', fillings: ['raspberry'], frost: '#FFF8EE', drip: 'pink', toppings: ['raspberry', 'flower'], candles: 0, text: 'Səni sevirəm', textColor: '#C2185B', font: 'script' } },
  { id: 'choco', name: 'Şokoladlı', s: { shape: 'round', weight: 2, tiers: 1, sponge: 'choco', cream: 'ganache', fillings: ['nutella', 'cherry'], frost: '#6B4331', drip: 'choco', toppings: ['cherry', 'choco', 'gold'], candles: 0, text: '', textColor: '#FFFFFF', font: 'serif' } },
  { id: 'wedding', name: 'Toy', s: { shape: 'round', weight: 4, tiers: 3, sponge: 'vanilla', cream: 'mascarpone', fillings: ['raspberry'], frost: '#FFF8EE', drip: 'none', toppings: ['flower', 'rosette', 'gold'], candles: 0, text: '', textColor: '#C9A227', font: 'script' } },
];

const STEPS = [
  { title: 'Forma və ölçü',       short: 'Forma',   lead: 'Hazır ideyadan başlayın və ya formanı, çəkini və mərtəbə sayını özünüz seçin.' },
  { title: 'Dad',                 short: 'Dad',     lead: 'Biskvit, krem və içliyi istədiyiniz kimi birləşdirin.' },
  { title: 'Üzlük',               short: 'Üzlük',   lead: 'Tortun rəngini və axan qlazur (drip) effektini seçin.' },
  { title: 'Dekor',               short: 'Dekor',   lead: 'Üstünə nə qoyaq? Bir neçə dekoru birlikdə seçə bilərsiniz.' },
  { title: 'Yazı',                short: 'Yazı',    lead: 'Tortun üzərinə xüsusi yazı əlavə edin — və ya boş saxlayın.' },
  { title: 'Sifariş məlumatları', short: 'Məlumat', lead: 'Sizinlə əlaqə saxlamaq və tortu vaxtında hazırlamaq üçün.' },
  { title: 'Təsdiq və göndər',    short: 'Göndər',  lead: 'Hər şeyi yoxlayın və sifarişi bir kliklə göndərin.' },
];
const DETAILS_STEP = 5;
const REVIEW_STEP = 6;

/* =========================================================
   KÖMƏKÇİLƏR
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const byId = (list, id) => list.find(x => x.id === id);
const money = n => `${Math.round(n)} ${CONFIG.currency}`;
const fmtKg = w => `${String(w).replace('.', ',')} kq`;
const servings = w => Math.round(w * 6);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const f1 = n => n.toFixed(1);

function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
function lum(h) {
  const [r, g, b] = hexToRgb(h);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function getPath(obj, path) { return path.split('.').reduce((o, k) => o?.[k], obj); }
function setPath(obj, path, v) {
  const keys = path.split('.'); const last = keys.pop();
  keys.reduce((o, k) => o[k], obj)[last] = v;
}

/* =========================================================
   VƏZİYYƏT
   ========================================================= */
const STORE_KEY = 'tortlab-v1';
const defaultState = () => ({
  step: 0, maxStep: 0, orderId: null,
  shape: 'round', weight: 2, tiers: 1,
  sponge: 'vanilla', cream: 'whipped', fillings: ['strawberry'],
  frost: '#F7C9D0', drip: 'none',
  toppings: ['rosette', 'strawberry'], candles: 0, notes: '',
  text: '', textColor: '#3E2418', font: 'script',
  customer: { name: '', phone: '', email: '', date: '', time: '14:00', method: 'pickup', address: '' },
});

let state = load();
let popType = null;

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved) { const d = defaultState(); return { ...d, ...saved, customer: { ...d.customer, ...saved.customer } }; }
  } catch (e) { /* yox */ }
  return defaultState();
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* yox */ }
}

/* =========================================================
   TORT RENDERİ (SVG)
   ========================================================= */
const NS = 'http://www.w3.org/2000/svg';
const measureSvg = document.createElementNS(NS, 'svg');
measureSvg.setAttribute('width', '0');
measureSvg.setAttribute('height', '0');
measureSvg.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
const measurePath = document.createElementNS(NS, 'path');
measureSvg.appendChild(measurePath);
document.body.appendChild(measureSvg);

function roundRect(cx, cy, hw, hh, r) {
  const x = cx - hw, y = cy - hh, w = 2 * hw, h = 2 * hh;
  return `M${f1(x + r)},${f1(y)}H${f1(x + w - r)}A${f1(r)},${f1(r)} 0 0 1 ${f1(x + w)},${f1(y + r)}V${f1(y + h - r)}A${f1(r)},${f1(r)} 0 0 1 ${f1(x + w - r)},${f1(y + h)}H${f1(x + r)}A${f1(r)},${f1(r)} 0 0 1 ${f1(x)},${f1(y + h - r)}V${f1(y + r)}A${f1(r)},${f1(r)} 0 0 1 ${f1(x + r)},${f1(y)}Z`;
}
function heartD(cx, cy, s) {
  const k = s / 16.5; let d = '';
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    d += (i ? 'L' : 'M') + f1(cx + x * k) + ',' + f1(cy - (y + 2.7) * k);
  }
  return d + 'Z';
}
function shapeD(shape, cx, cy, s) {
  switch (shape) {
    case 'square': return roundRect(cx, cy, s * 0.86, s * 0.86, s * 0.14);
    case 'rect':   return roundRect(cx, cy, s * 1.02, s * 0.7, s * 0.12);
    case 'heart':  return heartD(cx, cy, s);
    default:       return `M${f1(cx - s)},${cy}a${f1(s)},${f1(s)} 0 1,0 ${f1(2 * s)},0a${f1(s)},${f1(s)} 0 1,0 ${f1(-2 * s)},0Z`;
  }
}
function pointsBySpacing(d, spacing, min = 6) {
  measurePath.setAttribute('d', d);
  const L = measurePath.getTotalLength();
  const n = Math.max(min, Math.round(L / spacing));
  const pts = [];
  for (let i = 0; i < n; i++) {
    const p = measurePath.getPointAtLength(((i + 0.5) / n) * L);
    pts.push({ x: p.x, y: p.y });
  }
  return pts;
}
function insideShape(d, x, y) {
  measurePath.setAttribute('d', d);
  try { return measurePath.isPointInFill(new DOMPoint(x, y)); }
  catch (e) { return Math.hypot(x - 200, y - 200) < 100; }
}

const DEFS = `<defs>
<radialGradient id="ck-plate" cx=".5" cy=".45" r=".62"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".82" stop-color="#F5EFE9"/><stop offset="1" stop-color="#E4DACF"/></radialGradient>
<radialGradient id="ck-sheen" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".13"/></radialGradient>
<radialGradient id="ck-flame"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".35" stop-color="#FFC94A" stop-opacity=".95"/><stop offset="1" stop-color="#FF8A1F" stop-opacity="0"/></radialGradient>
<linearGradient id="ck-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7E08A"/><stop offset=".5" stop-color="#C99A22"/><stop offset="1" stop-color="#F3D67A"/></linearGradient>
<filter id="ck-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
</defs>`;

const MACARON = ['#F4A7B9', '#BFE3C9', '#D6C4EE', '#FBE29A', '#A9D3F0'];
const FLOWERS = ['#FFFFFF', '#F7B2C4', '#C9B6F2', '#FFD27A'];
const SPRINKLES = ['#F25F8C', '#FFD23F', '#3BCEAC', '#5E60CE', '#FF8C42', '#FFFFFF'];
const CANDLES = ['#F25F8C', '#5E60CE', '#3BCEAC', '#FFB627', '#FFFFFF'];

/** Bir dekor elementinin SVG-si (0,0 mərkəzli, ~22px). */
function toppingSym(id, i, ctx) {
  switch (id) {
    case 'rosette': {
      let g = `<circle r="11" fill="${ctx.rose}"/><circle r="11" fill="none" stroke="${ctx.roseShade}" stroke-opacity=".35"/>`;
      for (let k = 0; k < 8; k++) g += `<path d="M0,-2.5Q4.5,-6.5 0,-10" fill="none" stroke="${ctx.roseShade}" stroke-width="1.3" stroke-linecap="round" transform="rotate(${k * 45})"/>`;
      return g + `<circle r="2.4" fill="${ctx.roseShade}" opacity=".5"/>`;
    }
    case 'strawberry': {
      const seeds = [[-4, -3], [0, -4.5], [4, -3], [-5, 2], [-1, 0.5], [3.5, 1.5], [-2, 5.5], [2, 5.5]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx=".8" ry="1.1" fill="#F9DC7A"/>`).join('');
      return `<path d="M0,12C-10,6-11,-5-5.5,-8.5C-2.5,-10.2 2.5,-10.2 5.5,-8.5C11,-5 10,6 0,12Z" fill="#E23A4E"/><path d="M0,12C-10,6-11,-5-5.5,-8.5C-3.5,-9.6-1.5,-10 0,-10C-6,-4-5,6 0,12Z" fill="#fff" opacity=".14"/>${seeds}<path d="M-7,-8.5L-2,-6.5L0,-11L2,-6.5L7,-8.5L4,-11.5L0,-9L-4,-11.5Z" fill="#3C8D3F"/>`;
    }
    case 'raspberry': {
      const pts = [[0, 0], [5, 0], [-5, 0], [2.5, 4.3], [-2.5, 4.3], [2.5, -4.3], [-2.5, -4.3]];
      return pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.7" fill="#D23462"/><circle cx="${x - 1}" cy="${y - 1}" r="1.2" fill="#fff" opacity=".35"/>`).join('');
    }
    case 'blueberry': {
      const one = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3A4A8A"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .35}" fill="#fff" opacity=".25"/><path d="M${x - 1.4},${y}h2.8M${x},${y - 1.4}v2.8" stroke="#1E2650" stroke-width="1"/>`;
      return one(-4, 2.5, 6) + one(5, -3.5, 5.2);
    }
    case 'cherry':
      return `<path d="M1,-6Q5,-14 12,-13" fill="none" stroke="#5B3A1E" stroke-width="1.6" stroke-linecap="round"/><circle r="8" fill="#B0122C"/><ellipse cx="-3" cy="-3" rx="2.6" ry="1.6" fill="#fff" opacity=".45" transform="rotate(-35 -3 -3)"/>`;
    case 'macaron': {
      const c = MACARON[i % MACARON.length];
      return `<circle r="11" fill="${c}"/><circle r="11" fill="none" stroke="${mix(c, '#000', .15)}"/><circle r="8.2" fill="none" stroke="#fff" stroke-opacity=".4"/><ellipse cx="-3.5" cy="-4" rx="4" ry="2.2" fill="#fff" opacity=".45" transform="rotate(-30 -3.5 -4)"/>`;
    }
    case 'flower': {
      const c = FLOWERS[i % FLOWERS.length];
      let g = '';
      for (let k = 0; k < 5; k++) g += `<ellipse cy="-6" rx="4.6" ry="6.4" fill="${c}" stroke="${mix(c, '#000', .14)}" stroke-width=".6" transform="rotate(${k * 72})"/>`;
      return g + `<circle r="3.2" fill="#F2B705"/><circle cx="-.8" cy="-.8" r="1" fill="#fff" opacity=".6"/>`;
    }
    case 'choco':
      return `<path d="M-10,-4L6,-10L11,3L-3,9Z" fill="#4A2A1C"/><path d="M-10,-4L6,-10L5,-6.5L-7.5,-1.8Z" fill="#7A4A33"/><path d="M-3,9L11,3L10,5.5L-2,10.5Z" fill="#2E1911"/>`;
    case 'stars':
      return `<path d="M0,-10L2.9,-3.1L10,-3.1L4.3,1.4L6.4,8.6L0,4.4L-6.4,8.6L-4.3,1.4L-10,-3.1L-2.9,-3.1Z" fill="url(#ck-gold)" stroke="#B88A18" stroke-width=".6"/>`;
    case 'gold':
      return `<path d="M-8,-3L-2,-9L6,-6L9,2L3,8L-6,6Z" fill="url(#ck-gold)"/><path d="M-2,-9L6,-6L1,-2Z" fill="#fff" opacity=".35"/>`;
    case 'sprinkles': {
      const r = rng(3); let g = '';
      for (let k = 0; k < 14; k++) g += `<rect x="-3" y="-1" width="6" height="2" rx="1" fill="${SPRINKLES[k % SPRINKLES.length]}" stroke="#0001" stroke-width=".4" transform="translate(${f1((r() - .5) * 20)},${f1((r() - .5) * 20)}) rotate(${Math.round(r() * 180)})"/>`;
      return g;
    }
  }
  return '';
}

function splitText(t) {
  t = (t || '').trim();
  if (!t) return [];
  if (t.length <= 14 || !t.includes(' ')) return [t];
  const mid = t.length / 2; let best = -1;
  for (let i = 0; i < t.length; i++) if (t[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return [t.slice(0, best), t.slice(best + 1)];
}

function cakeMarkup(st, { pop = null } = {}) {
  const rnd = rng(11);
  const cx = 200, cy = 200;
  const frost = st.frost;
  const light = lum(frost) > 0.55;
  const shade = mix(frost, '#000', 0.2);
  const bead = light ? mix(frost, '#fff', 0.45) : mix(frost, '#fff', 0.16);
  const ctx = { rose: light ? mix(frost, '#fff', 0.3) : mix(frost, '#fff', 0.12), roseShade: mix(frost, '#000', 0.2) };
  const base = 116 + (clamp(st.weight, 1, 5) - 1) * 8.5;
  const scales = TIER_SCALES[st.tiers] || [1];
  const drip = byId(DATA.drips, st.drip) || DATA.drips[0];
  const ring = st.toppings.filter(t => !SCATTER.includes(t));
  const sTop = base * scales[scales.length - 1];

  const item = (type, i, x, y, rot, k) => {
    const cls = pop === type ? ` class="pop" style="animation-delay:${(i % 14) * 25}ms"` : '';
    return `<g transform="translate(${f1(x)},${f1(y)}) rotate(${Math.round(rot)}) scale(${k.toFixed(2)})"><g${cls}>${toppingSym(type, i, ctx)}</g></g>`;
  };

  let o = DEFS;
  o += `<circle cx="200" cy="200" r="194" fill="url(#ck-plate)"/><circle cx="200" cy="200" r="194" fill="none" stroke="#D9CDC1" stroke-width="1.5"/><circle cx="200" cy="200" r="178" fill="none" stroke="#fff" stroke-opacity=".8"/>`;

  let n = 0;
  scales.forEach((sc, ti) => {
    const s = base * sc;
    const d = shapeD(st.shape, cx, cy, s);
    const isTop = ti === scales.length - 1;
    o += `<path d="${d}" fill="#3B2418" opacity=".24" filter="url(#ck-blur)" transform="translate(3,${ti === 0 ? 9 : 6})"/>`;
    o += `<path d="${d}" fill="${frost}"/><path d="${d}" fill="url(#ck-sheen)"/><path d="${d}" fill="none" stroke="${shade}" stroke-opacity=".35" stroke-width="1.5"/>`;

    if (isTop && drip.color) {
      pointsBySpacing(d, 14).forEach(p => {
        const dx = p.x - cx, dy = p.y - cy, m = Math.hypot(dx, dy) || 1;
        const out = 1 + rnd() * 3.5, r = 3 + rnd() * 4.5;
        o += `<circle cx="${f1(p.x + dx / m * out)}" cy="${f1(p.y + dy / m * out)}" r="${f1(r)}" fill="${drip.color}"/>`;
      });
      o += `<path d="${d}" fill="${drip.color}"/><path d="${d}" fill="url(#ck-sheen)"/>`;
    } else {
      pointsBySpacing(shapeD(st.shape, cx, cy, s - 5.5), 10.5).forEach(p => {
        o += `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="4.2" fill="${bead}" stroke="${shade}" stroke-opacity=".35" stroke-width=".8"/>`;
      });
    }

    // aşağı mərtəbələrin görünən zolağı
    if (!isTop && ring.length) {
      const next = base * scales[ti + 1];
      const band = s - next;
      const k = clamp((band - 10) / 26, 0.5, 1);
      const mid = next + (band - 9) / 2;
      pointsBySpacing(shapeD(st.shape, cx, cy, mid), 30 * k).forEach(p => {
        const type = ring[n % ring.length];
        const rot = Math.atan2(p.y - cy, p.x - cx) * 180 / Math.PI + 90 + (rnd() - .5) * 30;
        o += item(type, n++, p.x, p.y, rot, k);
      });
    }
  });

  // yuxarı mərtəbə
  const lines = splitText(st.text);
  const topD = shapeD(st.shape, cx, cy, sTop * 0.9);
  const textZone = (x, y) => lines.length && Math.abs(x - cx) < sTop * 0.62 && Math.abs(y - cy) < sTop * (lines.length > 1 ? 0.34 : 0.22);
  const sizeK = clamp(sTop / 140, 0.62, 1.05);

  if (st.toppings.includes('sprinkles')) {
    const count = Math.round(70 * (sTop / 140) ** 2);
    let placed = 0, tries = 0, sp = '';
    while (placed < count && tries++ < count * 8) {
      const x = cx + (rnd() - .5) * sTop * 2, y = cy + (rnd() - .5) * sTop * 2;
      if (!insideShape(topD, x, y) || textZone(x, y)) continue;
      sp += `<rect x="-3" y="-1" width="6" height="2" rx="1" fill="${SPRINKLES[placed % SPRINKLES.length]}" stroke="#0001" stroke-width=".4" transform="translate(${f1(x)},${f1(y)}) rotate(${Math.round(rnd() * 180)}) scale(${sizeK.toFixed(2)})"/>`;
      placed++;
    }
    o += `<g${pop === 'sprinkles' ? ' class="pop-fade"' : ''}>${sp}</g>`;
  }
  if (st.toppings.includes('gold')) {
    let placed = 0, tries = 0;
    while (placed < 7 && tries++ < 80) {
      const x = cx + (rnd() - .5) * sTop * 1.7, y = cy + (rnd() - .5) * sTop * 1.7;
      if (!insideShape(topD, x, y) || textZone(x, y)) continue;
      o += item('gold', placed++, x, y, rnd() * 360, sizeK * (0.6 + rnd() * 0.5));
    }
  }

  if (ring.length) {
    const ringD = shapeD(st.shape, cx, cy, sTop * 0.76);
    pointsBySpacing(ringD, 30 * sizeK, 5).forEach(p => {
      const type = ring[n % ring.length];
      const rot = Math.atan2(p.y - cy, p.x - cx) * 180 / Math.PI + 90 + (rnd() - .5) * 30;
      o += item(type, n++, p.x, p.y, rot, sizeK);
    });
  }

  if (st.candles > 0) {
    const c = st.candles, rc = sTop * 0.44;
    const span = Math.min(150, 24 * (c - 1));
    for (let i = 0; i < c; i++) {
      const a = (-90 - span / 2 + (c > 1 ? (span * i) / (c - 1) : 0)) * Math.PI / 180;
      const x = cx + rc * Math.cos(a), y = cy + (st.shape === 'heart' ? 6 : 0) + rc * Math.sin(a) * 0.85;
      const col = CANDLES[i % CANDLES.length];
      o += `<g transform="translate(${f1(x)},${f1(y)}) scale(${sizeK.toFixed(2)})"><g${pop === 'candle' ? ' class="pop"' : ''}><circle r="17" fill="url(#ck-flame)" opacity=".85"/><circle r="5.2" fill="${col}" stroke="#fff" stroke-width="1.7" stroke-dasharray="3 2.2"/><circle r="2.2" fill="#FFF7D6"/></g></g>`;
    }
  }

  if (lines.length) {
    const font = byId(DATA.fonts, st.font) || DATA.fonts[0];
    const maxW = sTop * (st.shape === 'heart' ? 1.05 : 1.3);
    const longest = Math.max(...lines.map(l => l.length));
    const fs = clamp(Math.min(sTop * 0.3, maxW / (longest * font.w)), 9, 60);
    const lh = fs * 1.08;
    const y0 = cy + (st.candles ? sTop * 0.12 : 0) + (st.shape === 'heart' ? sTop * 0.06 : 0) - ((lines.length - 1) * lh) / 2;
    const halo = lum(st.textColor) > 0.6 ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.35)';
    lines.forEach((l, i) => {
      o += `<text x="${cx}" y="${f1(y0 + i * lh)}" text-anchor="middle" dominant-baseline="central" font-family="${font.css}" font-weight="${font.weight}" font-size="${f1(fs)}" fill="${st.textColor}" stroke="${halo}" stroke-width="${f1(fs * 0.04)}" paint-order="stroke">${esc(l)}</text>`;
    });
  }
  return o;
}

function sliceMarkup(st) {
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
      if (fills.length) for (let x = 36, i = 0; x < 268; x += 15, i++) o += `<ellipse cx="${x + (rnd() - .5) * 4}" cy="${y + 4.5}" rx="4.2" ry="3.2" fill="${fills[i % fills.length]}"/>`;
      y += 9;
    }
  });
  return o;
}

function shapeIcon(id) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${shapeD(id, 50, 52, 36)}"/></svg>`;
}
function toppingIcon(id) {
  const ctx = { rose: mix(state.frost, '#fff', .3), roseShade: mix(state.frost, '#000', .2) };
  return `<svg viewBox="-17 -17 34 34" aria-hidden="true">${DEFS}${toppingSym(id, 0, ctx)}</svg>`;
}

/* =========================================================
   QİYMƏT VƏ TƏSVİR
   ========================================================= */
function priceLines(st) {
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
  if (st.text.trim()) L.push(['Xüsusi yazı', DATA.textPrice]);
  return L;
}
const total = st => priceLines(st).reduce((s, [, p]) => s + p, 0);

function frostName(hex) {
  const f = DATA.frostColors.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  return f ? f.name : `Xüsusi (${hex.toUpperCase()})`;
}

function describe(st) {
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
    { step: 4, label: 'Yazı', value: st.text.trim() ? `“${st.text.trim()}” — ${font.name}, ${tc}` : 'Yoxdur' },
    ...(st.notes.trim() ? [{ step: 3, label: 'Əlavə istək', value: st.notes.trim() }] : []),
  ];
}

function fmtDate(iso) {
  if (!iso) return '';
  const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

function orderMessage(st, rich = true) {
  const b = s => (rich ? `*${s}*` : s);
  const c = st.customer;
  const lines = [
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
  ];
  return lines.join('\n');
}

/* =========================================================
   ADDIMLARIN UI-ı
   ========================================================= */
const tick = '<span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
const opt = (key, value, inner, cls = '') => `<button type="button" class="opt ${cls}" data-set="${key}" data-value="${esc(value)}" aria-pressed="false">${inner}${tick}</button>`;
const tog = (key, value, inner, cls = '') => `<button type="button" class="opt ${cls}" data-toggle="${key}" data-value="${esc(value)}" aria-pressed="false">${inner}${tick}</button>`;
const group = (title, hint, body) => `<section class="group"><div class="group-head"><h3>${title}</h3>${hint ? `<span class="hint">${hint}</span>` : ''}</div>${body}</section>`;
const plus = p => (p ? `<span class="price-tag">+${Math.round(p)} ${CONFIG.currency}</span>` : `<span class="price-tag muted">daxildir</span>`);

const RENDER = [
  // 0 — Forma
  () => group('Tez başla', 'Hazır ideyanı seçin, sonra dəyişin',
      `<div class="presets">${PRESETS.map(p => `<button type="button" class="preset" data-preset="${p.id}"><span class="preset-thumb"><svg viewBox="0 0 400 400" aria-hidden="true">${cakeMarkup({ ...defaultState(), ...p.s })}</svg></span><span class="preset-name">${p.name}</span></button>`).join('')}</div>`)
    + group('Forma', '',
      `<div class="grid grid-4">${DATA.shapes.map(s => opt('shape', s.id, `<span class="shape-ico">${shapeIcon(s.id)}</span><span class="opt-title">${s.name}</span>${plus(s.price)}`, 'opt-center')).join('')}</div>`)
    + group('Çəki', 'Təxminən 1 kq ≈ 6 nəfər',
      `<div class="chips">${DATA.weights.map(w => opt('weight', w, `<span class="chip-main">${fmtKg(w)}</span><span class="chip-sub">~${servings(w)} nəfər</span>`, 'chip')).join('')}</div>`)
    + group('Mərtəbə', '<span id="tierHint"></span>',
      `<div class="grid grid-3">${DATA.tiers.map(t => opt('tiers', t.n, `<span class="tier-ico" aria-hidden="true">${'<i></i>'.repeat(t.n)}</span><span class="opt-title">${t.n} mərtəbə</span>${t.min ? `<span class="opt-desc">min. ${fmtKg(t.min)}</span>` : '<span class="opt-desc">Klassik</span>'}${plus(t.price)}`, 'opt-center')).join('')}</div>`),

  // 1 — Dad
  () => group('Biskvit', 'Qiymət 1 kq üçün',
      `<div class="grid grid-3">${DATA.sponges.map(s => opt('sponge', s.id, `<span class="swatch crumb" style="--c:${s.color}"></span><span class="opt-title">${s.name}</span><span class="opt-desc">${s.desc}</span><span class="price-tag">${s.price} ${CONFIG.currency}/kq</span>`)).join('')}</div>`)
    + group('Krem', '',
      `<div class="grid grid-2">${DATA.creams.map(c => opt('cream', c.id, `<span class="swatch cream" style="--c:${c.color}"></span><span class="opt-title">${c.name}</span><span class="opt-desc">${c.desc}</span>${c.price ? `<span class="price-tag">+${c.price} ${CONFIG.currency}/kq</span>` : plus(0)}`, 'opt-row')).join('')}</div>`)
    + group('İçlik', `<span id="fillCount"></span>`,
      `<div class="chips">${DATA.fillings.map(f => tog('fillings', f.id, `<span class="dot" style="--c:${f.color}"></span><span class="chip-main">${f.name}</span><span class="chip-sub">+${f.price} ${CONFIG.currency}</span>`, 'chip chip-row')).join('')}</div>`),

  // 2 — Üzlük
  () => group('Üzlük rəngi', `<span id="frostName"></span>`,
      `<div class="swatches">${DATA.frostColors.map(c => `<button type="button" class="sw" data-set="frost" data-value="${c.hex}" aria-pressed="false" title="${c.name}" style="--c:${c.hex}"><span class="sr">${c.name}</span></button>`).join('')}
        <label class="sw sw-custom" title="Öz rənginiz"><input type="color" id="customFrost" value="${esc(state.frost)}"><span class="sr">Öz rənginiz</span></label></div>`)
    + group('Drip — axan qlazur', '',
      `<div class="grid grid-3">${DATA.drips.map(d => opt('drip', d.id, `<span class="drip-ico" style="--c:${d.color || 'transparent'}">${d.color ? '' : '—'}</span><span class="opt-title">${d.name}</span>${plus(d.price)}`, 'opt-center')).join('')}</div>`),

  // 3 — Dekor
  () => group('Üstünə dekor', 'İstədiyiniz qədər seçin',
      `<div class="grid grid-4">${DATA.toppings.map(t => tog('toppings', t.id, `<span class="top-ico">${toppingIcon(t.id)}</span><span class="opt-title">${t.name}</span>${plus(t.price)}`, 'opt-center')).join('')}</div>`)
    + group('Şamlar', `${DATA.candlePrice} ${CONFIG.currency} / ədəd`,
      `<div class="stepper-input"><button type="button" class="round-btn" data-candle="-1" aria-label="Azalt">−</button><output id="candleOut">0</output><button type="button" class="round-btn" data-candle="1" aria-label="Artır">+</button><span class="hint">0–20 ədəd</span></div>`)
    + group('Əlavə istəklər', 'İstəyə bağlı',
      `<textarea class="input" data-field="notes" rows="3" maxlength="400" placeholder="Məs: üstündə uşaq üçün oyuncaq fiqur, şəkərsiz krem, xüsusi rəng tonu…">${esc(state.notes)}</textarea>`),

  // 4 — Yazı
  () => group('Yazı mətni', `<span id="textCount"></span>`,
      `<input class="input input-lg" data-field="text" maxlength="32" placeholder="Məs: Ad günün mübarək, Leyla!" value="${esc(state.text)}" autocomplete="off">
       <div class="suggest">${DATA.suggestions.map(s => `<button type="button" class="pill" data-suggest="${esc(s)}">${s}</button>`).join('')}<button type="button" class="pill pill-ghost" data-suggest="">Təmizlə</button></div>`)
    + group('Şrift', '',
      `<div class="grid grid-3">${DATA.fonts.map(f => opt('font', f.id, `<span class="font-sample" style="font-family:${f.css};font-weight:${f.weight}">Aa</span><span class="opt-title">${f.name}</span>`, 'opt-center')).join('')}</div>`)
    + group('Yazının rəngi', '',
      `<div class="swatches">${DATA.textColors.map(c => `<button type="button" class="sw" data-set="textColor" data-value="${c.hex}" aria-pressed="false" title="${c.name}" style="--c:${c.hex}"><span class="sr">${c.name}</span></button>`).join('')}</div>`),

  // 5 — Məlumat
  () => {
    const c = state.customer;
    const t = new Date(); t.setDate(t.getDate() + 1);
    const minDate = t.toISOString().slice(0, 10);
    return `<form class="form" id="detailsForm" novalidate>
      <div class="field"><label for="f-name">Ad, soyad *</label><input class="input" id="f-name" data-field="customer.name" value="${esc(c.name)}" autocomplete="name" placeholder="Adınız"><small class="err"></small></div>
      <div class="field"><label for="f-phone">Telefon *</label><input class="input" id="f-phone" data-field="customer.phone" value="${esc(c.phone)}" type="tel" autocomplete="tel" placeholder="+994 50 123 45 67"><small class="err"></small></div>
      <div class="field span-2"><label for="f-email">Email <span class="muted">(istəyə bağlı — surət sizə də gəlsin)</span></label><input class="input" id="f-email" data-field="customer.email" value="${esc(c.email)}" type="email" autocomplete="email" placeholder="ad@mail.com"><small class="err"></small></div>
      <div class="field"><label for="f-date">Tarix *</label><input class="input" id="f-date" data-field="customer.date" value="${esc(c.date)}" type="date" min="${minDate}"><small class="err"></small></div>
      <div class="field"><label for="f-time">Saat</label><select class="input" id="f-time" data-field="customer.time">${DATA.times.map(x => `<option ${x === c.time ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="field span-2"><span class="label">Təhvil üsulu</span>
        <div class="grid grid-2">
          ${opt('customer.method', 'pickup', `<span class="opt-title">🏪 Mağazadan götürəcəyəm</span><span class="opt-desc">Pulsuz</span>`, 'opt-row')}
          ${opt('customer.method', 'delivery', `<span class="opt-title">🚚 Çatdırılma</span><span class="opt-desc">Qiyməti operator dəqiqləşdirəcək</span>`, 'opt-row')}
        </div></div>
      <div class="field span-2" id="addrField"><label for="f-address">Ünvan *</label><input class="input" id="f-address" data-field="customer.address" value="${esc(c.address)}" autocomplete="street-address" placeholder="Şəhər, küçə, ev, mənzil"><small class="err"></small></div>
      <p class="fine span-2">Tortlar ən azı 1 gün əvvəldən sifariş olunur.</p>
    </form>`;
  },

  // 6 — Təsdiq
  () => {
    if (!state.orderId) { state.orderId = 'TL-' + Date.now().toString().slice(-6); save(); }
    const c = state.customer;
    const rows = describe(state).map(r => `<div class="rv-row"><span>${r.label}</span><b>${esc(r.value)}</b><button type="button" class="link" data-goto="${r.step}">Dəyiş</button></div>`).join('');
    const bill = priceLines(state).map(([n, p]) => `<div class="bill-row"><span>${esc(n)}</span><span>${money(p)}</span></div>`).join('');
    return `<div class="review">
      <div class="card">
        <div class="card-head"><h3>Tortunuz</h3><span class="order-id">#${state.orderId}</span></div>
        ${rows}
      </div>
      <div class="card">
        <div class="card-head"><h3>Əlaqə və təhvil</h3><button type="button" class="link" data-goto="${DETAILS_STEP}">Dəyiş</button></div>
        <div class="rv-row"><span>Müştəri</span><b>${esc(c.name)}</b></div>
        <div class="rv-row"><span>Telefon</span><b>${esc(c.phone)}</b></div>
        ${c.email ? `<div class="rv-row"><span>Email</span><b>${esc(c.email)}</b></div>` : ''}
        <div class="rv-row"><span>Tarix</span><b>${fmtDate(c.date)}, ${c.time}</b></div>
        <div class="rv-row"><span>Təhvil</span><b>${c.method === 'delivery' ? 'Çatdırılma — ' + esc(c.address) : 'Mağazadan götürmə'}</b></div>
      </div>
      <div class="card bill">
        ${bill}
        <div class="bill-total"><span>Təxmini cəmi</span><strong>${money(total(state))}</strong></div>
      </div>
      <div class="send">
        <button type="button" class="btn btn-wa" id="sendWa">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.8-2.8l.9-1-1-2z" class="fill"/></svg>
          WhatsApp ilə göndər
        </button>
        <button type="button" class="btn btn-dark" id="sendMail">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg>
          Email ilə göndər
        </button>
        <div class="send-extra">
          <button type="button" class="link" id="dlPng">⬇ Dizayn şəklini yüklə</button>
          <button type="button" class="link" id="sharePng" hidden>↗ Şəkli paylaş</button>
          <button type="button" class="link" id="copyText">⧉ Mətni kopyala</button>
        </div>
        <p class="fine">Qiymət təxminidir — dəqiq məbləği və hazır olma vaxtını qənnadçımız sizinlə əlaqə saxlayaraq təsdiqləyəcək. WhatsApp-a dizayn şəklini də əlavə etməyiniz tövsiyə olunur.</p>
      </div>
      <div class="sent card" id="sentPanel" hidden>
        <div class="sent-ico">✓</div>
        <h3>Sifarişiniz hazırdır!</h3>
        <p id="sentText"></p>
        <button type="button" class="btn btn-ghost" id="newCake">Yeni tort yarat</button>
      </div>
    </div>`;
  },
];

/* =========================================================
   RENDER VƏ SİNXRONİZASİYA
   ========================================================= */
const content = $('#stepContent');

function renderStep() {
  const s = STEPS[state.step];
  content.innerHTML = `<header class="step-head"><span class="eyebrow">Addım ${state.step + 1} / ${STEPS.length}</span><h1>${s.title}</h1><p>${s.lead}</p></header>${RENDER[state.step]()}`;
  content.classList.remove('enter'); void content.offsetWidth; content.classList.add('enter');

  $('#stepper').innerHTML = STEPS.map((x, i) => `<button type="button" class="st ${i === state.step ? 'is-current' : ''} ${i < state.step || (i <= state.maxStep && i !== state.step) ? 'is-done' : ''}" data-goto="${i}" ${i === state.step ? 'aria-current="step"' : ''}><span class="st-n">${i < state.step ? '✓' : i + 1}</span><span class="st-t">${x.short}</span></button>`).join('');
  $('#mobileStep').textContent = `${state.step + 1}/${STEPS.length} · ${s.short}`;
  $('#progressBar').style.width = `${((state.step + 1) / STEPS.length) * 100}%`;

  $('#backBtn').disabled = state.step === 0;
  $('#nextBtn').hidden = state.step === REVIEW_STEP;
  $('#nextLabel').textContent = state.step === DETAILS_STEP ? 'Yoxla' : state.step === DETAILS_STEP - 1 ? 'Sifariş et' : 'Növbəti';

  if (state.step === REVIEW_STEP && navigator.canShare) {
    try { $('#sharePng').hidden = !navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] }); } catch (e) { /* yox */ }
  }
  syncUI();
}

function syncUI() {
  $$('[data-set]', content).forEach(b => b.setAttribute('aria-pressed', String(getPath(state, b.dataset.set)).toLowerCase() === String(b.dataset.value).toLowerCase()));
  $$('[data-toggle]', content).forEach(b => b.setAttribute('aria-pressed', state[b.dataset.toggle].includes(b.dataset.value)));
  $$('[data-set="tiers"]', content).forEach(b => {
    const t = DATA.tiers.find(x => x.n === Number(b.dataset.value));
    b.disabled = state.weight < t.min;
  });
  const set = (sel, txt) => { const el = $(sel, content); if (el) el.textContent = txt; };
  set('#tierHint', state.tiers > 1 ? '' : 'Çox mərtəbə üçün çəkini artırın');
  set('#fillCount', `${state.fillings.length} / ${DATA.maxFillings} seçilib`);
  set('#frostName', frostName(state.frost));
  set('#candleOut', state.candles);
  set('#textCount', `${state.text.length} / 32`);
  const custom = $('.sw-custom', content);
  if (custom) {
    const isCustom = !DATA.frostColors.some(c => c.hex.toLowerCase() === state.frost.toLowerCase());
    custom.classList.toggle('is-on', isCustom);
    if (isCustom) custom.style.setProperty('--c', state.frost);
  }
  const addr = $('#addrField', content);
  if (addr) addr.hidden = state.customer.method !== 'delivery';
}

function renderPreview() {
  $('#cakeSvg').innerHTML = cakeMarkup(state, { pop: popType });
  $('#sliceSvg').innerHTML = sliceMarkup(state);
  popType = null;
  const sh = byId(DATA.shapes, state.shape), sp = byId(DATA.sponges, state.sponge), cr = byId(DATA.creams, state.cream);
  const fills = state.fillings.map(id => byId(DATA.fillings, id).name);
  $('#specList').innerHTML = [
    `${sh.name} · ${fmtKg(state.weight)} · ~${servings(state.weight)} nəfər`,
    `${sp.name} + ${cr.name}`,
    fills.length ? `İçlik: ${fills.join(', ')}` : null,
    state.tiers > 1 ? `${state.tiers} mərtəbə` : null,
  ].filter(Boolean).map(x => `<li>${esc(x)}</li>`).join('');
  const p = money(total(state));
  $('#price').textContent = p; $('#barPrice').textContent = p; $('#topPrice').textContent = p;
}

function update({ ui = true } = {}) {
  save();
  renderPreview();
  if (ui) syncUI();
}

/* =========================================================
   NAVİQASİYA VƏ VALİDASİYA
   ========================================================= */
function validateDetails() {
  const c = state.customer, e = {};
  if (c.name.trim().length < 2) e['customer.name'] = 'Adınızı yazın';
  if (c.phone.replace(/\D/g, '').length < 9) e['customer.phone'] = 'Düzgün telefon nömrəsi yazın';
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) e['customer.email'] = 'Email düzgün deyil';
  const t = new Date(); t.setDate(t.getDate() + 1);
  if (!c.date) e['customer.date'] = 'Tarix seçin';
  else if (c.date < t.toISOString().slice(0, 10)) e['customer.date'] = 'Ən tezi sabah üçün sifariş mümkündür';
  if (c.method === 'delivery' && c.address.trim().length < 5) e['customer.address'] = 'Ünvanı yazın';
  return e;
}
function showErrors(errors) {
  $$('.field', content).forEach(f => {
    const input = $('[data-field]', f); const err = $('.err', f);
    if (!input || !err) return;
    const msg = errors[input.dataset.field] || '';
    err.textContent = msg; input.classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', !!msg);
  });
  const first = $('.invalid', content);
  if (first) first.focus();
}

function goTo(n) {
  n = clamp(n, 0, STEPS.length - 1);
  if (n > DETAILS_STEP) {
    const errors = validateDetails();
    if (Object.keys(errors).length) {
      if (state.step !== DETAILS_STEP) { state.step = DETAILS_STEP; renderStep(); }
      showErrors(errors);
      toast('Zəhmət olmasa məlumatları tamamlayın');
      return;
    }
  }
  state.step = n;
  state.maxStep = Math.max(state.maxStep, n);
  save();
  renderStep();
  const top = $('.builder').getBoundingClientRect().top + window.scrollY - (window.innerWidth < 960 ? 0 : 90);
  if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

/* =========================================================
   GÖNDƏRMƏ
   ========================================================= */
function markSent(how) {
  $('#sentText').textContent = how === 'wa'
    ? 'WhatsApp açıldı — mesajı göndərməyi unutmayın. Qənnadçımız tezliklə sizinlə əlaqə saxlayacaq.'
    : how === 'auto'
      ? 'Sifarişiniz emailə göndərildi. Qənnadçımız tezliklə sizinlə əlaqə saxlayacaq.'
      : 'Mail proqramınız açıldı — "Göndər" düyməsini sıxmağı unutmayın.';
  $('#sentPanel').hidden = false;
  $('#sentPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function sendWhatsApp() {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(orderMessage(state, true))}`;
  window.open(url, '_blank', 'noopener');
  markSent('wa');
}

async function sendEmail() {
  const subject = `Tort sifarişi #${state.orderId} — ${state.customer.name}`;
  const body = orderMessage(state, false);
  if (CONFIG.formSubmit) {
    const btn = $('#sendMail'); btn.disabled = true; btn.classList.add('loading');
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: subject, _template: 'box', _cc: state.customer.email || undefined, Sifariş: body, Ad: state.customer.name, Telefon: state.customer.phone }),
      });
      if (r.ok) { markSent('auto'); return; }
    } catch (e) { /* mailto-ya keç */ }
    finally { btn.disabled = false; btn.classList.remove('loading'); }
  }
  const cc = state.customer.email ? `&cc=${encodeURIComponent(state.customer.email)}` : '';
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}${cc}&body=${encodeURIComponent(body)}`;
  markSent('mail');
}

async function cakePngBlob() {
  const svg = `<svg xmlns="${NS}" width="1000" height="1000" viewBox="0 0 400 400">${cakeMarkup(state)}</svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await img.decode();
  const W = 1080, H = 1260, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  g.fillStyle = '#FAF5EF'; g.fillRect(0, 0, W, H);
  g.drawImage(img, 40, 40, 1000, 1000);
  g.fillStyle = '#2B1E18'; g.textAlign = 'center';
  g.font = '600 44px Fraunces, Georgia, serif';
  g.fillText(`${CONFIG.brand} · #${state.orderId || 'dizayn'}`, W / 2, 1110);
  g.font = '500 30px Manrope, Arial, sans-serif'; g.fillStyle = '#7A6A60';
  const sh = byId(DATA.shapes, state.shape), sp = byId(DATA.sponges, state.sponge);
  g.fillText(`${sh.name} · ${fmtKg(state.weight)} · ${state.tiers} mərtəbə · ${sp.name}`, W / 2, 1165);
  g.fillText(`Təxmini qiymət: ${money(total(state))}`, W / 2, 1210);
  return new Promise(res => cv.toBlob(res, 'image/png'));
}

/* =========================================================
   HADİSƏLƏR
   ========================================================= */
document.addEventListener('click', async e => {
  const el = e.target.closest('button, [data-goto]');
  if (!el) return;

  if (el.dataset.goto !== undefined) { goTo(Number(el.dataset.goto)); return; }

  if (el.dataset.set) {
    const key = el.dataset.set;
    let v = el.dataset.value;
    if (key === 'weight' || key === 'tiers') v = Number(v);
    setPath(state, key, v);
    if (key === 'weight') {
      const max = [...DATA.tiers].reverse().find(t => v >= t.min).n;
      if (state.tiers > max) { state.tiers = max; toast(`${fmtKg(v)} üçün maksimum ${max} mərtəbə mümkündür`); }
    }
    update();
    return;
  }

  if (el.dataset.toggle) {
    const key = el.dataset.toggle, v = el.dataset.value, arr = state[key];
    const i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1);
    else {
      arr.push(v);
      if (key === 'fillings' && arr.length > DATA.maxFillings) {
        const removed = arr.shift();
        toast(`Maksimum ${DATA.maxFillings} içlik — “${byId(DATA.fillings, removed).name}” çıxarıldı`);
      }
      if (key === 'toppings') popType = v;
    }
    update();
    return;
  }

  if (el.dataset.preset) {
    const p = byId(PRESETS, el.dataset.preset);
    Object.assign(state, JSON.parse(JSON.stringify(p.s)));
    popType = p.s.toppings.find(t => !SCATTER.includes(t)) || null;
    update();
    toast(`“${p.name}” ideyası tətbiq olundu — istədiyinizi dəyişin`);
    return;
  }

  if (el.dataset.candle) {
    const before = state.candles;
    state.candles = clamp(state.candles + Number(el.dataset.candle), 0, 20);
    if (state.candles > before) popType = 'candle';
    update();
    return;
  }

  if (el.dataset.suggest !== undefined) {
    state.text = el.dataset.suggest;
    const input = $('[data-field="text"]', content);
    if (input) input.value = state.text;
    update();
    return;
  }

  switch (el.id) {
    case 'backBtn': goTo(state.step - 1); break;
    case 'nextBtn': goTo(state.step + 1); break;
    case 'sendWa': sendWhatsApp(); break;
    case 'sendMail': sendEmail(); break;
    case 'copyText':
      try { await navigator.clipboard.writeText(orderMessage(state, false)); toast('Sifariş mətni kopyalandı'); }
      catch (err) { toast('Kopyalamaq alınmadı'); }
      break;
    case 'dlPng': {
      const blob = await cakePngBlob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `tort-${state.orderId || 'dizayn'}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      break;
    }
    case 'sharePng': {
      const blob = await cakePngBlob();
      const file = new File([blob], `tort-${state.orderId}.png`, { type: 'image/png' });
      try { await navigator.share({ files: [file], text: orderMessage(state, true) }); } catch (err) { /* ləğv edildi */ }
      break;
    }
    case 'newCake': {
      const customer = state.customer;
      state = { ...defaultState(), customer: { ...customer, date: '' } };
      save(); renderPreview(); renderStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    }
  }
});

document.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'customFrost') { state.frost = el.value; update(); return; }
  if (!el.dataset.field) return;
  setPath(state, el.dataset.field, el.value);
  if (el.classList.contains('invalid')) {
    el.classList.remove('invalid');
    const err = el.closest('.field')?.querySelector('.err'); if (err) err.textContent = '';
  }
  // yalnız önizləməyə təsir edən sahələr tortu yenidən çəkir
  if (el.dataset.field === 'text') update();
  else { save(); if (el.dataset.field === 'notes') syncUI(); }
});

document.addEventListener('change', e => {
  if (e.target.dataset?.field) { setPath(state, e.target.dataset.field, e.target.value); save(); }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('#detailsForm input')) { e.preventDefault(); goTo(state.step + 1); }
});

/* Başlanğıc */
if (state.step === REVIEW_STEP && Object.keys(validateDetails()).length) state.step = DETAILS_STEP;
renderPreview();
renderStep();
document.fonts?.ready.then(renderPreview);
