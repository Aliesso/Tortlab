/* =========================================================
   KONFİQURASİYA — öz məlumatlarınızı buraya yazın
   ========================================================= */
export const CONFIG = {
  brand: 'Tortlab',
  whatsapp: '994553398565',        // ölkə kodu ilə, "+" və boşluq olmadan
  email: 'aliesso2218@gmail.com',     // sifarişlərin gələcəyi email
  currency: '₼',
  // true: email brauzerdən birbaşa FormSubmit.co ilə göndərilir (ilk dəfə təsdiq maili gəlir)
  // false: istifadəçinin mail proqramı açılır
  formSubmit: false,
};

export const DATA = {
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
    { id: 'whipped',    name: 'Qaymaq kremi',  desc: 'Yüngül və havalı', color: '#FFF9F0', price: 0 },
    { id: 'cheese',     name: 'Krem-pendir',   desc: 'Zərif turşməzə',   color: '#FBF1DE', price: 4 },
    { id: 'ganache',    name: 'Şokolad ganaş', desc: 'Sıx və parlaq',    color: '#3E2418', price: 5 },
    { id: 'mascarpone', name: 'Maskarpone',    desc: 'İtalyan kremi',    color: '#FFF3D6', price: 6 },
  ],
  fillings: [
    { id: 'strawberry',  name: 'Çiyələk',       color: '#E0435A', price: 5 },
    { id: 'raspberry',   name: 'Moruq',         color: '#C2185B', price: 6 },
    { id: 'cherry',      name: 'Albalı',        color: '#8E1B2E', price: 5 },
    { id: 'banana',      name: 'Banan',         color: '#F2D46B', price: 4 },
    { id: 'saltcaramel', name: 'Duzlu karamel', color: '#B86B2A', price: 6 },
    { id: 'nutella',     name: 'Nutella',       color: '#6B3E26', price: 7 },
    { id: 'walnut',      name: 'Qoz',           color: '#8C6A4A', price: 6 },
    { id: 'mango',       name: 'Manqo',         color: '#F5A623', price: 7 },
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
  photoPrice: 12,
  textColors: [
    { name: 'Şokolad', hex: '#3E2418' },
    { name: 'Ağ',      hex: '#FFFFFF' },
    { name: 'Moruq',   hex: '#C2185B' },
    { name: 'Qızılı',  hex: '#C9A227' },
    { name: 'Qara',    hex: '#1E1A19' },
  ],
  fonts: [
    { id: 'script', name: 'Kalliqrafik', family: "'Great Vibes'", css: "'Great Vibes', cursive",       weight: 400 },
    { id: 'serif',  name: 'Klassik',     family: "'Fraunces'",    css: "'Fraunces', Georgia, serif",   weight: 600 },
    { id: 'sans',   name: 'Modern',      family: "'Manrope'",     css: "'Manrope', Arial, sans-serif", weight: 800 },
  ],
  suggestions: ['Ad günün mübarək!', 'Təbriklər!', 'Səni sevirəm', 'Xoşbəxt ol', 'Uğurlar!'],
  times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
};

export const SCATTER = ['sprinkles', 'gold'];

export const PRESETS = [
  { id: 'bday', name: 'Ad günü', s: { shape: 'round', weight: 2, tiers: 1, sponge: 'vanilla', cream: 'whipped', fillings: ['strawberry'], frost: '#F7C9D0', drip: 'none', toppings: ['rosette', 'macaron', 'sprinkles'], candles: 5, text: 'Ad günün mübarək!', textColor: '#C2185B', font: 'script' } },
  { id: 'love', name: 'Romantik', s: { shape: 'heart', weight: 1.5, tiers: 1, sponge: 'redvelvet', cream: 'cheese', fillings: ['raspberry'], frost: '#FFF8EE', drip: 'pink', toppings: ['raspberry', 'flower'], candles: 0, text: 'Səni sevirəm', textColor: '#C2185B', font: 'script' } },
  { id: 'choco', name: 'Şokoladlı', s: { shape: 'round', weight: 2, tiers: 1, sponge: 'choco', cream: 'ganache', fillings: ['nutella', 'cherry'], frost: '#6B4331', drip: 'choco', toppings: ['cherry', 'choco', 'gold'], candles: 0, text: '', textColor: '#FFFFFF', font: 'serif' } },
  { id: 'wedding', name: 'Toy', s: { shape: 'round', weight: 4, tiers: 3, sponge: 'vanilla', cream: 'mascarpone', fillings: ['raspberry'], frost: '#FFF8EE', drip: 'none', toppings: ['flower', 'rosette', 'gold'], candles: 0, text: '', textColor: '#C9A227', font: 'script' } },
];

export const STEPS = [
  { title: 'Forma və ölçü',       short: 'Forma',   lead: 'Hazır ideyadan başlayın və ya formanı, çəkini və mərtəbə sayını özünüz seçin.' },
  { title: 'Dad',                 short: 'Dad',     lead: 'Biskvit, krem və içliyi istədiyiniz kimi birləşdirin.' },
  { title: 'Üzlük',               short: 'Üzlük',   lead: 'Tortun rəngini və axan qlazur (drip) effektini seçin.' },
  { title: 'Dekor',               short: 'Dekor',   lead: 'Üstünə nə qoyaq? Bir neçə dekoru birlikdə seçə bilərsiniz.' },
  { title: 'Foto çap',            short: 'Foto',    lead: 'Cihazınızdan şəkil yükləyin — yeməli kağıza çap olunub tortun üzərinə qoyulacaq.' },
  { title: 'Yazı',                short: 'Yazı',    lead: 'Tortun üzərinə xüsusi yazı əlavə edin — və ya boş saxlayın.' },
  { title: 'Sifariş məlumatları', short: 'Məlumat', lead: 'Sizinlə əlaqə saxlamaq və tortu vaxtında hazırlamaq üçün.' },
  { title: 'Təsdiq və göndər',    short: 'Göndər',  lead: 'Hər şeyi yoxlayın və sifarişi bir kliklə göndərin.' },
];
export const IMAGE_STEP = 4;
export const TEXT_STEP = 5;
export const DETAILS_STEP = 6;
export const REVIEW_STEP = 7;
