import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { DATA, SCATTER } from '../lib/data.js';
import { byId, clamp, lum, mix, rng, splitText } from '../lib/utils.js';
import { BEVEL, extrudeSmooth, makeShape, outlinePoints, pointInShape, shapeExtent } from './shapes.js';
import TopLayer from './TopLayer.jsx';
import { Candles, GoldLeaf, Pop, Sprinkles, Topping } from './Toppings.jsx';

function Stand({ R }) {
  return (
    <group>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R, 0.05, 96]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[0, -0.025, 0]} receiveShadow>
        <cylinderGeometry args={[R * 0.97, R * 0.9, 0.035, 96]} />
        <meshPhysicalMaterial color="#F1ECE6" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.32, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.17, 0.56, 48]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.2} clearcoat={1} />
      </mesh>
      <mesh position={[0, -0.605, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R * 0.45, R * 0.5, 0.03, 64]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  );
}

function Beads({ points, y, color, r = 0.036 }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    points.forEach((p, i) => {
      m.position.set(p.x, y, p.z);
      m.updateMatrix();
      ref.current.setMatrixAt(i, m.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [points, y]);
  return (
    <instancedMesh key={points.length} ref={ref} args={[null, null, points.length]} castShadow receiveShadow>
      <sphereGeometry args={[r, 16, 12]} />
      <meshStandardMaterial color={color} roughness={0.45} />
    </instancedMesh>
  );
}

function Tier({ shape, t, frost, bead }) {
  const geometry = useMemo(() => extrudeSmooth(makeShape(shape, t.s), t.h, BEVEL, BEVEL), [shape, t.s, t.h]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const beads = useMemo(() => outlinePoints(shape, t.s + BEVEL * 0.8, 0.07), [shape, t.s]);
  return (
    <group>
      <mesh geometry={geometry} position={[0, t.y0 + BEVEL, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={frost} roughness={0.62} sheen={0.7} sheenRoughness={0.45} sheenColor="#ffffff" />
      </mesh>
      <Beads points={beads} y={t.y0 + 0.034} color={bead} />
    </group>
  );
}

function Drip({ shape, t, color }) {
  const cap = useMemo(() => extrudeSmooth(makeShape(shape, t.s), 0.004, 0.022, BEVEL + 0.014), [shape, t.s]);
  useEffect(() => () => cap.dispose(), [cap]);
  const drips = useMemo(() => {
    const r = rng(21);
    return outlinePoints(shape, t.s + BEVEL + 0.008, 0.075).map(p => ({ ...p, len: 0.04 + r() * r() * 0.32 }));
  }, [shape, t.s]);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({ color, roughness: 0.18, clearcoat: 0.8, clearcoatRoughness: 0.15 }), [color]);
  useEffect(() => () => material.dispose(), [material]);
  return (
    <group>
      <mesh geometry={cap} material={material} position={[0, t.top + 0.012 - 0.026, 0]} castShadow />
      {drips.map((d, i) => (
        <mesh key={i} material={material} position={[d.x, t.top - 0.035 - d.len / 2, d.z]} castShadow>
          <capsuleGeometry args={[0.024, d.len, 4, 10]} />
        </mesh>
      ))}
    </group>
  );
}

export default function CakeModel({ state, layout, editing, onImageChange }) {
  const { shape, frost, toppings } = state;
  const drip = byId(DATA.drips, state.drip);
  const bead = lum(frost) > 0.55 ? mix(frost, '#fff', 0.45) : mix(frost, '#fff', 0.14);
  const top = layout.top;
  const topY = top.top + (drip?.color ? 0.012 : 0);
  const kTop = clamp(top.s / 1.15, 0.55, 1.1);
  // Foto və yazının tutduğu sahə — səpələmə bura düşməsin (koordinatlar səhnədə x, z)
  const E = shapeExtent(shape, top.s) * 1.05;
  const img = state.image;
  const textLines = splitText(state.text).length;
  const artKey = [img ? `${img.x.toFixed(2)},${img.y.toFixed(2)},${img.scale.toFixed(2)}` : '', textLines, state.textY, state.textSize].join('|');
  const blocked = (x, z) =>
    (img && Math.hypot(x - img.x * E, z - img.y * E) < 0.62 * img.scale * E * 0.85) ||
    (textLines && Math.abs(z - state.textY * E) < 0.13 * E * state.textSize * textLines && Math.abs(x) < E * 0.85);

  // Halqa üzrə dekorlar (yuxarı mərtəbə + aşağı mərtəbələrin görünən zolağı)
  const ring = toppings.filter(t => !SCATTER.includes(t));
  const placements = useMemo(() => {
    if (!ring.length) return [];
    const out = [], r = rng(11);
    let n = 0;
    layout.tiers.forEach((t, i) => {
      const isTop = i === layout.tiers.length - 1;
      let s, k, y;
      if (isTop) { s = t.s * 0.8; k = kTop; y = topY; }
      else {
        const inner = layout.tiers[i + 1].s + BEVEL;
        const band = t.s - inner;
        if (band < 0.16) return;
        s = inner + band * 0.5; k = clamp(band / 0.36, 0.5, 0.9); y = t.top;
      }
      outlinePoints(shape, s, 0.19 * k, 5).forEach(p => {
        out.push({ type: ring[n % ring.length], i: n, x: p.x, y, z: p.z, k, rot: -Math.atan2(p.z, p.x) + (r() - 0.5) * 0.6 });
        n++;
      });
    });
    return out;
  }, [ring.join(), shape, layout, kTop, topY]);

  // Üst səthdə təsadüfi nöqtələr (səpələmə və qızıl yarpaq üçün)
  const scatter = (count, seed, inset) => {
    const poly = makeShape(shape, top.s * inset).getPoints(64);
    const r = rng(seed), pts = [];
    let tries = 0;
    while (pts.length < count && tries++ < count * 10) {
      const x = (r() - 0.5) * top.s * 2.2, y = (r() - 0.5) * top.s * 2.2;
      if (!pointInShape(poly, x, y)) continue;
      if (blocked(x, -y)) continue;
      pts.push({ x, z: -y });
    }
    return pts;
  };
  const sprinkles = useMemo(
    () => (toppings.includes('sprinkles') ? scatter(Math.round(260 * (top.s / 1.15) ** 2), 4, 0.9) : []),
    [toppings.includes('sprinkles'), shape, top.s, artKey],
  );
  const gold = useMemo(
    () => (toppings.includes('gold') ? scatter(9, 8, 0.85) : []),
    [toppings.includes('gold'), shape, top.s, artKey],
  );

  return (
    <group>
      <Stand R={layout.standR} />
      {layout.tiers.map((t, i) => <Tier key={i} shape={shape} t={t} frost={frost} bead={bead} />)}
      {drip?.color && <Drip shape={shape} t={top} color={drip.color} />}
      <TopLayer state={state} layout={layout} editing={editing} onImageChange={onImageChange} />

      {placements.map(p => (
        <Pop key={`${p.type}-${p.i}`} k={p.k} delay={(p.i % 16) * 0.025} position={[p.x, p.y, p.z]} rotation={[0, p.rot, 0]}>
          <Topping type={p.type} i={p.i} frost={frost} />
        </Pop>
      ))}
      {sprinkles.length > 0 && <Sprinkles points={sprinkles} y={topY} />}
      {gold.length > 0 && <GoldLeaf points={gold} y={topY} />}
      {state.candles > 0 && <Candles count={state.candles} radius={top.s * 0.52} y={topY} k={clamp(kTop, 0.7, 1)} />}
    </group>
  );
}
