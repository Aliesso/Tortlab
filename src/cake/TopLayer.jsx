import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DATA } from '../lib/data.js';
import { byId, clamp, lum, splitText } from '../lib/utils.js';
import { makeShape, shapeExtent } from './shapes.js';

const SIZE = 1024;
const FONT_SAMPLE = 'AaəƏşçğıöü';

function roundRectPath(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Foto və yazını tortun üst səthinə uyğun kətana çəkir. */
function drawTop(g, { img, image, text, font, textColor, textSize, textY, editing }) {
  const W = SIZE;
  g.clearRect(0, 0, W, W);

  if (img && image) {
    const ar = img.naturalHeight / img.naturalWidth;
    const w = W * 0.62 * image.scale;
    const h = image.crop === 'circle' ? w : w * ar;
    g.save();
    g.translate(W / 2 + image.x * W / 2, W / 2 + image.y * W / 2);
    g.rotate((image.rot * Math.PI) / 180);
    if (image.crop === 'circle') {
      g.beginPath(); g.arc(0, 0, w / 2, 0, Math.PI * 2);
    } else {
      roundRectPath(g, -w / 2, -h / 2, w, h, Math.min(w, h) * 0.04);
    }
    g.save();
    g.clip();
    if (image.crop === 'circle') {
      // dairəvi kəsimdə şəkli "cover" kimi yerləşdiririk
      const k = Math.max(w / img.naturalWidth, w / img.naturalHeight);
      const dw = img.naturalWidth * k, dh = img.naturalHeight * k;
      g.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    } else {
      g.drawImage(img, -w / 2, -h / 2, w, h);
    }
    g.restore();
    if (editing) {
      g.setLineDash([22, 14]);
      g.lineWidth = 7;
      g.strokeStyle = 'rgba(200, 70, 107, .95)';
      g.stroke();
    }
    g.restore();
  }

  const lines = splitText(text);
  if (lines.length) {
    const f = byId(DATA.fonts, font) || DATA.fonts[0];
    const longest = Math.max(...lines.map(l => l.length));
    const widthFactor = f.id === 'script' ? 0.42 : f.id === 'serif' ? 0.56 : 0.6;
    const px = clamp(Math.min(W * 0.13, (W * 0.78) / (longest * widthFactor)), 28, 200) * textSize;
    const lh = px * 1.08;
    g.font = `${f.weight} ${px}px ${f.css}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = textColor;
    g.shadowColor = lum(textColor) > 0.6 ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.4)';
    g.shadowBlur = px * 0.06;
    const y0 = W / 2 + textY * W / 2 - ((lines.length - 1) * lh) / 2;
    lines.forEach((l, i) => g.fillText(l, W / 2, y0 + i * lh));
    g.shadowBlur = 0;
  }
}

export default function TopLayer({ state, layout, editing, onImageChange }) {
  const { camera, gl, controls } = useThree();
  const top = layout.top;
  const E = shapeExtent(state.shape, top.s) * 1.05;
  const y = top.top + (state.drip !== 'none' ? 0.016 : 0.003);

  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = SIZE;
    return c;
  }, []);
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [canvas]);

  // Üst səthin forması; UV-lər kətanın [-E, E] sahəsinə uyğunlaşdırılır
  const geometry = useMemo(() => {
    const g = new THREE.ShapeGeometry(makeShape(state.shape, top.s * 0.96), 96);
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / (2 * E) + 0.5, pos.getY(i) / (2 * E) + 0.5);
    g.rotateX(-Math.PI / 2);
    return g;
  }, [state.shape, top.s, E]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Yüklənmiş şəkli HTMLImageElement kimi saxlayırıq
  const [img, setImg] = useState(null);
  const src = state.image?.src;
  useEffect(() => {
    if (!src) { setImg(null); return; }
    const el = new Image();
    el.onload = () => setImg(el);
    el.src = src;
  }, [src]);

  // Veb-şriftlər yüklənəndən sonra yenidən çəkmək üçün
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    if (!document.fonts) return;
    Promise.all(DATA.fonts.map(f => document.fonts.load(`${f.weight} 64px ${f.family}`, FONT_SAMPLE)))
      .then(() => setFontsReady(n => n + 1)).catch(() => {});
  }, []);

  useEffect(() => {
    drawTop(canvas.getContext('2d'), {
      img, image: state.image, text: state.text, font: state.font,
      textColor: state.textColor, textSize: state.textSize, textY: state.textY, editing,
    });
    texture.needsUpdate = true;
  }, [canvas, texture, img, state.image, state.text, state.font, state.textColor, state.textSize, state.textY, editing, fontsReady]);

  /* ---------- Sürüşdürmə, təkərlə böyütmə ---------- */
  const drag = useRef(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -y), [y]);
  const canEdit = editing && !!state.image;

  const toCanvas = (clientX, clientY) => {
    const r = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, camera);
    const hit = new THREE.Vector3();
    return ray.ray.intersectPlane(plane, hit) ? { x: hit.x / E, y: hit.z / E } : null;
  };

  const onPointerDown = e => {
    if (!canEdit) return;
    e.stopPropagation();
    const p = toCanvas(e.clientX, e.clientY);
    if (!p) return;
    drag.current = { start: p, ox: state.image.x, oy: state.image.y };
    if (controls) controls.enabled = false;
    document.body.style.cursor = 'grabbing';

    const move = ev => {
      const q = toCanvas(ev.clientX, ev.clientY);
      if (!q || !drag.current) return;
      const d = drag.current;
      onImageChange({ x: clamp(d.ox + q.x - d.start.x, -1.1, 1.1), y: clamp(d.oy + q.y - d.start.y, -1.1, 1.1) });
    };
    const up = () => {
      drag.current = null;
      if (controls) controls.enabled = true;
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const onWheel = e => {
    if (!canEdit) return;
    e.stopPropagation();
    onImageChange({ scale: clamp(state.image.scale * (e.deltaY > 0 ? 0.94 : 1.06), 0.2, 2.2) });
  };

  return (
    <mesh
      geometry={geometry}
      position={[0, y, 0]}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      onPointerOver={() => { if (canEdit) document.body.style.cursor = 'grab'; }}
      onPointerOut={() => { if (!drag.current) document.body.style.cursor = ''; }}
      receiveShadow
    >
      <meshStandardMaterial map={texture} transparent roughness={0.55} toneMapped={false} depthWrite={false} polygonOffset polygonOffsetFactor={-4} />
    </mesh>
  );
}
