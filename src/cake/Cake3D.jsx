import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import CakeModel from './CakeModel.jsx';
import { cakeLayout } from './shapes.js';

/** Kameranı seçilmiş görünüşə yumşaq şəkildə aparır. İstifadəçi fırladanda dayanır. */
function CameraRig({ view, viewKey, layout }) {
  const { camera, controls } = useThree();
  const goal = useRef(null);
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), t: new THREE.Vector3() }), []);

  useEffect(() => {
    const h = layout.height;
    const dist = 2.7 + layout.base * 1.5 + (layout.tiers.length - 1) * 0.45;
    goal.current = view === 'top'
      ? { p: [0, layout.top.top + 1.4 + layout.top.s * 3.9, 0.45], t: [0, layout.top.top, 0] }
      : { p: [0, h * 0.5 + dist * 0.55, dist], t: [0, h * 0.42, 0] };
  }, [view, viewKey, layout]);

  useEffect(() => {
    if (!controls) return;
    const stop = () => { goal.current = null; };
    controls.addEventListener('start', stop);
    return () => controls.removeEventListener('start', stop);
  }, [controls]);

  useFrame((_, dt) => {
    if (!goal.current || !controls) return;
    const a = 1 - Math.pow(0.002, dt);
    tmp.p.set(...goal.current.p); tmp.t.set(...goal.current.t);
    camera.position.lerp(tmp.p, a);
    controls.target.lerp(tmp.t, a);
    controls.update();
    if (camera.position.distanceTo(tmp.p) < 0.005) goal.current = null;
  });
  return null;
}

export default function Cake3D({ state, editing, view, viewKey, onImageChange, glRef }) {
  const layout = useMemo(() => cakeLayout(state), [state.shape, state.weight, state.tiers]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2.6, 4.4], fov: 32 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        if (glRef) glRef.current = gl;
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow position={[2.5, 6, 3]} intensity={1.7}
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} shadow-normalBias={0.02}
        shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3}
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.4} color="#FFE6EC" />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[8, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-5, 2, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#FFF1E6" />
        <Lightformer form="rect" intensity={1} position={[5, 1.5, -1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#FDE2EA" />
        <Lightformer form="ring" intensity={1.2} position={[0, 2, 6]} scale={3} />
      </Environment>

      <CakeModel state={state} layout={layout} editing={editing} onImageChange={onImageChange} />
      <ContactShadows position={[0, -0.62, 0]} opacity={0.38} scale={7} blur={2.4} far={1.5} color="#3B2418" />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={!(editing && state.image)}
        minDistance={1.6}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2 - 0.08}
        autoRotate={view === 'spin'}
        autoRotateSpeed={1.6}
        enableDamping
      />
      <CameraRig view={view === 'spin' ? 'front' : view} viewKey={viewKey} layout={layout} />
    </Canvas>
  );
}
