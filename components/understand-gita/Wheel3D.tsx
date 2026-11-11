"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const N = 18;
const GOLD = "#F6C752";
const BLUE = "#2448B4";
const NAVY = "#0A1233";

/** Small round label texture ("1" to "18"), used as a camera-facing sprite on each spoke tip. */
function numberTexture(n: number, active: boolean) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = active ? NAVY : "#ffffff";
  g.font = "700 64px Poppins, system-ui, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(String(n), 64, 70);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Wheel({ active, onHover, onSelect }: { active: number; onHover: (i: number | null) => void; onSelect: (i: number) => void }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const hovered = useRef<number | null>(null);
  const textures = useMemo(() => Array.from({ length: N }, (_, i) => ({ idle: numberTexture(i + 1, false), on: numberTexture(i + 1, true) })), []);
  const nodes = useRef<(THREE.Mesh | null)[]>([]);
  const sprites = useRef<(THREE.Sprite | null)[]>([]);

  const spokeGeo = useMemo(() => new THREE.CylinderGeometry(0.045, 0.06, 1.55, 12), []);
  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.2, 28, 28), []);
  const sparks = useMemo(() => {
    const pos = new Float32Array(160 * 3);
    for (let i = 0; i < 160; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.9 + Math.random() * 2.2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.75;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);
  const sparkRef = useRef<THREE.Points>(null);

  useEffect(() => () => {
    textures.forEach((t) => { t.idle.dispose(); t.on.dispose(); });
    spokeGeo.dispose();
    nodeGeo.dispose();
  }, [textures, spokeGeo, nodeGeo]);

  useFrame((state, dt) => {
    const r = root.current, s = spin.current;
    if (!r || !s) return;
    // Tilt toward the pointer (works with a mouse; on touch it simply stays level).
    const tx = state.pointer.y * -0.35, ty = state.pointer.x * 0.5;
    r.rotation.x = THREE.MathUtils.damp(r.rotation.x, tx, 3, dt);
    r.rotation.y = THREE.MathUtils.damp(r.rotation.y, ty, 3, dt);
    // Turn slowly; stop while a spoke is under the pointer so it is easy to read and click.
    if (hovered.current === null) s.rotation.z -= dt * 0.12;
    nodes.current.forEach((m, i) => {
      if (!m) return;
      const on = i === active || hovered.current === i;
      const target = on ? 1.45 : 1;
      m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, target, 8, dt));
      (m.material as THREE.MeshStandardMaterial).color.set(on ? GOLD : BLUE);
      (m.material as THREE.MeshStandardMaterial).emissive.set(on ? "#b8860b" : "#000000");
      const sp = sprites.current[i];
      if (sp) (sp.material as THREE.SpriteMaterial).map = on ? textures[i].on : textures[i].idle;
    });
    if (sparkRef.current) sparkRef.current.rotation.z += dt * 0.03;
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        {/* rim */}
        <mesh>
          <torusGeometry args={[2, 0.16, 28, 160]} />
          <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.32} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.42, 0.045, 16, 160]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.62, 0.04, 16, 120]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
        </mesh>
        {/* hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.34, 40]} />
          <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.3} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color={BLUE} metalness={0.3} roughness={0.35} />
        </mesh>
        {/* 18 spokes, one per chapter */}
        {Array.from({ length: N }, (_, i) => {
          const a = (i / N) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, 0, a]}>
              <mesh geometry={spokeGeo} position={[0, 1.2, 0]}>
                <meshStandardMaterial color="#ffffff" metalness={0.15} roughness={0.45} />
              </mesh>
              <mesh
                ref={(m) => { nodes.current[i] = m; }}
                geometry={nodeGeo}
                position={[0, 2.0, 0]}
                onPointerOver={(e) => { e.stopPropagation(); hovered.current = i; onHover(i); document.body.style.cursor = "pointer"; }}
                onPointerOut={() => { hovered.current = null; onHover(null); document.body.style.cursor = ""; }}
                onClick={(e) => { e.stopPropagation(); onSelect(i); }}
              >
                <meshStandardMaterial color={BLUE} metalness={0.3} roughness={0.4} />
              </mesh>
            </group>
          );
        })}
      </group>
      {/* numbers sit above the rotating group so they always face the camera and stay upright */}
      <NumberLayer spin={spin} sprites={sprites} textures={textures} />
      <points ref={sparkRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparks, 3]} />
        </bufferGeometry>
        <pointsMaterial color={GOLD} size={0.045} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
      </points>
    </group>
  );
}

function NumberLayer({ spin, sprites, textures }: { spin: React.RefObject<THREE.Group | null>; sprites: React.MutableRefObject<(THREE.Sprite | null)[]>; textures: { idle: THREE.Texture; on: THREE.Texture }[] }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const s = spin.current, g = group.current;
    if (!s || !g) return;
    g.children.forEach((child, i) => {
      const a = (i / N) * Math.PI * 2 + s.rotation.z;
      child.position.set(-Math.sin(a) * 2.0, Math.cos(a) * 2.0, 0.28);
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: N }, (_, i) => (
        <sprite key={i} ref={(sp) => { sprites.current[i] = sp; }} scale={[0.34, 0.34, 1]}>
          <spriteMaterial map={textures[i].idle} transparent depthTest={false} />
        </sprite>
      ))}
    </group>
  );
}

export default function Wheel3D({ active, onHover, onSelect, running }: { active: number; onHover: (i: number | null) => void; onSelect: (i: number) => void; running: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={running ? "always" : "never"}
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#7fa0ff" />
      <pointLight position={[0, 0, 4]} intensity={10} color={GOLD} />
      <Wheel active={active} onHover={onHover} onSelect={onSelect} />
    </Canvas>
  );
}
