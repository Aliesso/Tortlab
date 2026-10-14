import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const TIER_SCALES = { 1: [1], 2: [1, 0.68], 3: [1, 0.72, 0.48] };
const TIER_H = [0.7, 0.6, 0.52];
export const BEVEL = 0.06;
export const BOARD_TOP = 0.04;

export const baseSize = weight => 0.95 + (Math.min(weight, 5) - 1) * 0.11;

/**
 * Tortun 2D konturu (XY müstəvisində). Səhnədə X → X, Y → -Z olur,
 * yəni konturun "aşağısı" (mənfi Y) kameraya tərəf baxır.
 */
export function makeShape(type, s) {
  const sh = new THREE.Shape();
  if (type === 'square' || type === 'rect') {
    const hw = type === 'square' ? s * 0.86 : s * 1.02;
    const hh = type === 'square' ? s * 0.86 : s * 0.7;
    const r = s * 0.16;
    sh.moveTo(-hw + r, -hh);
    sh.lineTo(hw - r, -hh); sh.quadraticCurveTo(hw, -hh, hw, -hh + r);
    sh.lineTo(hw, hh - r); sh.quadraticCurveTo(hw, hh, hw - r, hh);
    sh.lineTo(-hw + r, hh); sh.quadraticCurveTo(-hw, hh, -hw, hh - r);
    sh.lineTo(-hw, -hh + r); sh.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  } else if (type === 'heart') {
    const k = s / 16.5;
    for (let i = 0; i < 160; i++) {
      const t = (i / 160) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      if (i) sh.lineTo(x * k, (y + 2.7) * k); else sh.moveTo(x * k, (y + 2.7) * k);
    }
    sh.closePath();
  } else {
    sh.absarc(0, 0, s, 0, Math.PI * 2, false);
  }
  return sh;
}

/** Konturun ən böyük yarım-ölçüsü (kəsici masa / foto xəritəsi üçün). */
export const shapeExtent = (type, s) => (type === 'rect' ? s * 1.02 : s);

/** Kontur boyunca bərabər addımlı nöqtələr (səhnə koordinatında x, z). */
export function outlinePoints(type, s, spacing, min = 6) {
  const sh = makeShape(type, s);
  const n = Math.max(min, Math.round(sh.getLength() / spacing));
  return sh.getSpacedPoints(n).slice(0, n).map(p => ({ x: p.x, z: -p.y }));
}

export function pointInShape(poly, x, y) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** Yumşaq kənarlı (bevel) həcmli forma, yuxarıya (+Y) uzanan. */
export function extrudeSmooth(shape, depth, bevelThickness, bevelSize, curveSegments = 72) {
  let g = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness, bevelSize, bevelSegments: 8, curveSegments, steps: 1,
  });
  g.rotateX(-Math.PI / 2);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g, 1e-4);
  g.computeVertexNormals();
  return g;
}

export function cakeLayout(st) {
  const base = baseSize(st.weight);
  const scales = TIER_SCALES[st.tiers] || [1];
  let y = BOARD_TOP;
  const tiers = scales.map((sc, i) => {
    const s = base * sc, h = TIER_H[i];
    const t = { s, h, y0: y, top: y + h + 2 * BEVEL };
    y = t.top;
    return t;
  });
  const top = tiers[tiers.length - 1];
  const standR = base * (st.shape === 'square' || st.shape === 'rect' ? 1.36 : 1.22);
  return { base, tiers, top, height: y, standR };
}
