import { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mix, rng } from '../lib/utils.js';

/* ---------- Bir dəfə yaradılan paylaşılan həndəsələr ---------- */
let G = null;
function geos() {
  if (G) return G;

  // Krem rozeti: burulmuş ulduz profil
  const rosette = new THREE.LatheGeometry(
    Array.from({ length: 14 }, (_, i) => {
      const t = i / 13;
      const r = 0.075 * Math.pow(1 - t, 0.75) + 0.004;
      return new THREE.Vector2(r * (1 + 0.15 * Math.sin(t * Math.PI)), t * 0.13);
    }), 64);
  const p = rosette.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(z, x), r = Math.hypot(x, z);
    const k = 1 + 0.16 * Math.cos(7 * a + y * 55);
    p.setX(i, Math.cos(a) * r * k); p.setZ(i, Math.sin(a) * r * k);
  }
  rosette.computeVertexNormals();

  // Çiyələk: yuxarı uclu
  const strawberry = new THREE.LatheGeometry(
    [[0, 0], [0.05, 0.004], [0.072, 0.03], [0.07, 0.07], [0.055, 0.11], [0.03, 0.145], [0.008, 0.162], [0, 0.165]]
      .map(([x, y]) => new THREE.Vector2(x, y)), 40);
  const calyx = new THREE.ExtrudeGeometry(starShape(6, 0.085, 0.035), { depth: 0.006, bevelEnabled: false });
  calyx.rotateX(-Math.PI / 2);

  // Moruq: kiçik kürəciklər
  const drupes = [];
  const n = 46;
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 1.6;               // aşağı hissəni boş saxlayırıq
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * 2.399963;
    const s = new THREE.SphereGeometry(0.022, 10, 8);
    s.translate(Math.cos(th) * r * 0.055, (y + 1) * 0.055, Math.sin(th) * r * 0.055);
    drupes.push(s);
  }
  const raspberry = mergeGeometries(drupes);

  const sphere = new THREE.SphereGeometry(1, 32, 24);
  const shell = new THREE.SphereGeometry(0.068, 32, 16); shell.scale(1, 0.42, 1);
  const filling = new THREE.CylinderGeometry(0.06, 0.06, 0.022, 32);
  const petal = new THREE.SphereGeometry(0.04, 16, 12); petal.scale(0.55, 0.16, 1); petal.translate(0, 0, 0.042);
  const stemCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(0.01, 0.12, 0), new THREE.Vector3(0.06, 0.15, 0));
  const stem = new THREE.TubeGeometry(stemCurve, 12, 0.006, 6, false);
  const shard = new THREE.BoxGeometry(0.15, 0.11, 0.012);
  const star = new THREE.ExtrudeGeometry(starShape(5, 0.07, 0.03), { depth: 0.014, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.005, bevelSegments: 2 });
  star.center();
  const leaf = new THREE.ShapeGeometry(irregular());
  leaf.rotateX(-Math.PI / 2);

  G = { rosette, strawberry, calyx, raspberry, sphere, shell, filling, petal, stem, shard, star, leaf };
  return G;
}

function starShape(points, R, r) {
  const s = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 ? r : R;
    if (i) s.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); else s.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  s.closePath();
  return s;
}
function irregular() {
  const s = new THREE.Shape();
  const pts = [[-0.05, -0.02], [-0.015, -0.055], [0.04, -0.035], [0.055, 0.015], [0.02, 0.05], [-0.04, 0.035]];
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}

/* ---------- Materiallar ---------- */
const MAT = {};
function mat(key, make) { return MAT[key] || (MAT[key] = make()); }
const glossy = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.3, ...extra });
const matte = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra });
const goldMat = () => mat('gold', () => new THREE.MeshStandardMaterial({ color: '#E2B53E', metalness: 1, roughness: 0.22, side: THREE.DoubleSide }));

const MACARON = ['#F4A7B9', '#BFE3C9', '#D6C4EE', '#FBE29A', '#A9D3F0'];
const FLOWERS = ['#FFFFFF', '#F7B2C4', '#C9B6F2', '#FFD27A'];
export const SPRINKLE_COLORS = ['#F25F8C', '#FFD23F', '#3BCEAC', '#5E60CE', '#FF8C42', '#FFFFFF'];
const CANDLES = ['#F25F8C', '#5E60CE', '#3BCEAC', '#FFB627', '#FFFFFF'];

/* ---------- Tək dekor elementi ---------- */
export function Topping({ type, i = 0, frost }) {
  const g = geos();
  switch (type) {
    case 'rosette': {
      const c = mix(frost, '#fff', 0.25);
      return <mesh geometry={g.rosette} material={mat('ros' + c, () => matte(c, { roughness: 0.6 }))} castShadow />;
    }
    case 'strawberry':
      return (
        <group>
          <mesh geometry={g.strawberry} material={mat('straw', () => glossy('#D7263D'))} castShadow />
          <mesh geometry={g.calyx} position={[0, 0.006, 0]} material={mat('leaf', () => matte('#3C8D3F', { side: THREE.DoubleSide }))} />
        </group>
      );
    case 'raspberry':
      return <mesh geometry={g.raspberry} material={mat('rasp', () => glossy('#C72C5A', { roughness: 0.4 }))} castShadow />;
    case 'blueberry':
      return (
        <group>
          {[[-0.03, 0.038, 0.01, 0.04], [0.035, 0.034, -0.015, 0.035], [0.002, 0.03, 0.04, 0.032]].map(([x, y, z, r], k) => (
            <mesh key={k} geometry={g.sphere} position={[x, y, z]} scale={r} material={mat('blue', () => matte('#36437E', { roughness: 0.45 }))} castShadow />
          ))}
        </group>
      );
    case 'cherry':
      return (
        <group>
          <mesh geometry={g.sphere} position={[0, 0.052, 0]} scale={0.055} material={mat('cherry', () => glossy('#A3112B', { roughness: 0.12, clearcoat: 1 }))} castShadow />
          <mesh geometry={g.stem} material={mat('stem', () => matte('#5B3A1E'))} />
        </group>
      );
    case 'macaron': {
      const c = MACARON[i % MACARON.length];
      return (
        <group rotation={[0, 0, 1.15]} position={[0, 0.06, 0]}>
          <mesh geometry={g.shell} position={[0, 0.022, 0]} material={mat('mac' + c, () => matte(c, { roughness: 0.55 }))} castShadow />
          <mesh geometry={g.filling} material={mat('macf', () => matte('#FFF6EA'))} />
          <mesh geometry={g.shell} position={[0, -0.022, 0]} material={mat('mac' + c, () => matte(c))} castShadow />
        </group>
      );
    }
    case 'flower': {
      const c = FLOWERS[i % FLOWERS.length];
      return (
        <group position={[0, 0.02, 0]} rotation={[-0.25, 0, 0]}>
          {[0, 1, 2, 3, 4].map(k => (
            <mesh key={k} geometry={g.petal} rotation={[0, (k * Math.PI * 2) / 5, 0.0]} material={mat('pet' + c, () => matte(c, { roughness: 0.5 }))} castShadow />
          ))}
          <mesh geometry={g.sphere} scale={[0.018, 0.012, 0.018]} position={[0, 0.008, 0]} material={mat('pistil', () => matte('#F2B705'))} />
        </group>
      );
    }
    case 'choco':
      return <mesh geometry={g.shard} position={[0, 0.05, 0]} rotation={[0.35, 0.3, 0.15]} material={mat('choc', () => glossy('#3E2216', { roughness: 0.35 }))} castShadow />;
    case 'stars':
      return <mesh geometry={g.star} position={[0, 0.07, 0]} rotation={[0.25, 0, 0]} material={goldMat()} castShadow />;
    default:
      return null;
  }
}

/* ---------- Görünəndə "sıçrayaraq" çıxan qrup ---------- */
const easeOutBack = t => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
export function Pop({ k = 1, delay = 0, children, ...props }) {
  const ref = useRef();
  const t = useRef(-delay);
  useFrame((_, dt) => {
    if (!ref.current) return;
    if (t.current < 1) t.current = Math.min(1, t.current + dt * 2.6);
    ref.current.scale.setScalar(k * Math.max(0.0001, easeOutBack(Math.max(0, t.current))));
  });
  return <group ref={ref} scale={0.0001} {...props}>{children}</group>;
}

/* ---------- Səpələmə (instanced) ---------- */
export function Sprinkles({ points, y }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const m = new THREE.Object3D(), c = new THREE.Color(), r = rng(9);
    points.forEach((p, i) => {
      m.position.set(p.x, y + 0.008, p.z);
      m.rotation.set(Math.PI / 2, 0, r() * Math.PI * 2);
      m.updateMatrix();
      ref.current.setMatrixAt(i, m.matrix);
      ref.current.setColorAt(i, c.set(SPRINKLE_COLORS[i % SPRINKLE_COLORS.length]));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [points, y]);
  return (
    <instancedMesh key={points.length} ref={ref} args={[null, null, points.length]} castShadow>
      <capsuleGeometry args={[0.008, 0.028, 3, 6]} />
      <meshStandardMaterial roughness={0.35} />
    </instancedMesh>
  );
}

export function GoldLeaf({ points, y }) {
  const g = geos();
  return points.map((p, i) => (
    <Pop key={i} k={0.6 + (i % 3) * 0.25} delay={i * 0.05} position={[p.x, y + 0.004, p.z]} rotation={[0, i * 1.7, 0]}>
      <mesh geometry={g.leaf} material={goldMat()} />
    </Pop>
  ));
}

/* ---------- Şamlar ---------- */
const FLAME = 0.024;
export function Candles({ count, radius, y, k }) {
  const flames = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flames.current.forEach((f, i) => {
      if (!f) return;
      const s = 1 + Math.sin(t * 13 + i * 1.7) * 0.08 + Math.sin(t * 7.3 + i) * 0.06;
      f.scale.set((FLAME * 0.6) / s, FLAME * 1.5 * s, (FLAME * 0.6) / s);
      f.rotation.z = Math.sin(t * 5 + i) * 0.08;
    });
  });
  const span = Math.min(2.6, 0.42 * (count - 1));
  const items = Array.from({ length: count }, (_, i) => {
    const a = -Math.PI / 2 - span / 2 + (count > 1 ? (span * i) / (count - 1) : 0);
    return [Math.cos(a) * radius, Math.sin(a) * radius];
  });
  const g = geos();
  return (
    <group>
      {items.map(([x, z], i) => (
        <Pop key={i} k={k} delay={i * 0.06} position={[x, y, z]}>
          <mesh position={[0, 0.15, 0]} castShadow material={mat('cdl' + i % 5, () => glossy(CANDLES[i % CANDLES.length], { roughness: 0.4 }))}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 20]} />
          </mesh>
          {[0.07, 0.15, 0.23].map(h => (
            <mesh key={h} position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat('cdlw', () => matte('#ffffff'))}>
              <torusGeometry args={[0.0205, 0.004, 6, 20]} />
            </mesh>
          ))}
          <mesh position={[0, 0.31, 0]} material={mat('wick', () => matte('#222'))}><cylinderGeometry args={[0.002, 0.002, 0.025, 6]} /></mesh>
          <mesh ref={el => (flames.current[i] = el)} position={[0, 0.345, 0]} geometry={g.sphere} scale={[FLAME * 0.6, FLAME * 1.5, FLAME * 0.6]}>
            <meshBasicMaterial color="#FFB547" toneMapped={false} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0.338, 0]} geometry={g.sphere} scale={0.009}>
            <meshBasicMaterial color="#FFF8DC" toneMapped={false} />
          </mesh>
        </Pop>
      ))}
      <pointLight position={[0, y + 0.5, -radius * 0.6]} color="#FFB547" intensity={0.25 + count * 0.05} distance={2.5} />
    </group>
  );
}
