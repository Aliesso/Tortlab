import { useCallback, useEffect, useState } from 'react';

const STORE_KEY = 'tortlab-3d-v1';

export const defaultImage = src => ({ src, x: 0, y: 0, scale: 1, rot: 0, crop: 'rect' });

export const defaultState = () => ({
  step: 0, maxStep: 0, orderId: null,
  shape: 'round', weight: 2, tiers: 1,
  sponge: 'vanilla', cream: 'whipped', fillings: ['strawberry'],
  frost: '#F7C9D0', drip: 'none',
  toppings: ['rosette', 'strawberry'], candles: 0, notes: '',
  image: null,
  text: '', textColor: '#3E2418', font: 'script', textSize: 1, textY: 0,
  customer: { name: '', phone: '', email: '', date: '', time: '14:00', method: 'pickup', address: '' },
});

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved) {
      const d = defaultState();
      return { ...d, ...saved, customer: { ...d.customer, ...saved.customer } };
    }
  } catch { /* boş */ }
  return defaultState();
}

function persist(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Şəkil yaddaş limitini keçərsə, şəkilsiz saxlayırıq
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...state, image: null })); } catch { /* boş */ }
  }
}

export function useCakeState() {
  const [state, setState] = useState(load);

  // Şəkil sürüşdürülərkən hər hərəkətdə yazmamaq üçün gecikdirilmiş saxlama
  useEffect(() => {
    const t = setTimeout(() => persist(state), 300);
    return () => clearTimeout(t);
  }, [state]);

  const update = useCallback(patch => {
    setState(s => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  return [state, update, setState];
}
