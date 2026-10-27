"use client";

import { useEffect, useRef, useState } from "react";
import { createBalKrishna } from "./balKrishna";
import { createEnvironment } from "./damodarEnvironment";

/**
 * Three.js scene for the Kartik Maas page: a brass diya with a flickering flame resting on a blooming lotus,
 * a slowly turning mandala and halo behind it, rising embers, drifting lotus petals and a field of stars.
 *
 * Built with plain three (loaded on demand, so it never touches the first paint), tuned for phones:
 *   - pixel ratio is capped, antialiasing is off on touch screens, particle counts are lower on small screens
 *   - the render loop only runs while the canvas is on screen and the tab is visible
 *   - the scene is identical on every device; only the render resolution adapts to keep the frame rate smooth
 *   - prefers-reduced-motion renders one still frame
 *   - if WebGL is unavailable a CSS glow is shown instead
 *
 * `state.intro` (0 -> 1) is driven by GSAP on the page: it ignites the flame and opens the lotus.
 */
export type SceneState = { intro: number; /** 0..1 through the scroll story (story variant only) */ progress?: number };

type Props = {
  variant?: "hero" | "story" | "finale";
  state?: SceneState;
  className?: string;
};

type THREE_ = typeof import("three");

export default function KartikScene({ variant = "hero", state, className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let detach: (() => void) | undefined;
    acquireController()
      .then((ctl) => {
        if (disposed) {
          ctl.release();
          return;
        }
        ctl.attach(variant, host, state ?? { intro: 1 });
        detach = () => {
          ctl.detach(variant);
          ctl.release();
        };
      })
      .catch((err) => {
        console.warn("[kartik-scene] 3D unavailable, using the CSS glow instead:", err);
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      detach?.();
    };
  }, [variant, state]);

  return (
    <div ref={hostRef} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,196,80,0.55),rgba(255,140,40,0.18)_45%,transparent_70%)] blur-2xl md:h-80 md:w-80" />
        </div>
      )}
    </div>
  );
}

/**
 * ONE WebGL context serves both the hero and the finale: the canvas is moved into whichever section is on screen. The
 * finale therefore costs nothing extra (no second context, shader compile or texture upload while the visitor scrolls).
 */
type Controller = {
  attach: (variant: Variant, host: HTMLElement, state: SceneState) => void;
  detach: (variant: Variant) => void;
  release: () => void;
};
type Variant = "hero" | "story" | "finale";

let controllerPromise: Promise<Controller> | null = null;
let controllerRefs = 0;
let controllerDispose: (() => void) | null = null;

function acquireController(): Promise<Controller> {
  controllerRefs++;
  if (!controllerPromise) {
    controllerPromise = (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const built = build(THREE, RoomEnvironment);
      await built.ready;
      controllerDispose = built.dispose;
      return {
        attach: built.attach,
        detach: built.detach,
        release: () => {
          controllerRefs--;
          if (controllerRefs <= 0) {
            controllerDispose?.();
            controllerPromise = null;
            controllerDispose = null;
            controllerRefs = 0;
          }
        },
      };
    })().catch((err) => {
      controllerPromise = null;
      controllerRefs = 0;
      throw err;
    });
  }
  return controllerPromise;
}

// ───────────────────────────────────────────────────────────────────────────────────────────
// Scene
// ───────────────────────────────────────────────────────────────────────────────────────────

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function canvasTexture(THREE: THREE_, size: number, height: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = height;
  const ctx = c.getContext("2d")!;
  draw(ctx, size, height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function build(
  THREE: THREE_,
  RoomEnvironment: new () => import("three").Scene
): { ready: Promise<void>; attach: Controller["attach"]; detach: Controller["detach"]; dispose: () => void } {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // The section the canvas currently lives in. Everything below that used to be fixed per instance follows it.
  let isHero = true;
  let isStory = false;
  let host: HTMLElement | null = null;
  let state: SceneState = { intro: 1 };

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const canvas = renderer.domElement;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .7s ease;";

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.5;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 0.5, 9);

  const disposables: { dispose: () => void }[] = [pmrem, envTex];
  const track = <T extends { dispose: () => void }>(o: T): T => {
    disposables.push(o);
    return o;
  };

  // ── Lights ────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x6f86ff, 0.35));
  const rim = new THREE.DirectionalLight(0x7f9bef, 1.1);
  rim.position.set(-4, 3, 2);
  scene.add(rim);
  const key = new THREE.DirectionalLight(0xfff0d8, 1.6);
  key.position.set(-2.5, 6, 5);
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -9;
  key.shadow.camera.right = 9;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -4;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 24;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.03;
  const fog = new THREE.Fog(0x0a1442, 1000, 2000); // pushed far away except on the story stage
  scene.fog = fog;
  const hemi = new THREE.HemisphereLight(0x9db4ff, 0x4a2f1c, 0.55);
  scene.add(hemi);
  const rimBlue = new THREE.DirectionalLight(0x6f95ff, 1.1);
  rimBlue.position.set(5, 3, -4);
  scene.add(rimBlue);
  const flameLight = new THREE.PointLight(0xffa447, 0, 16, 1.6);
  scene.add(flameLight);

  const rig = new THREE.Group();
  scene.add(rig);
  rig.add(key, key.target);

  // ── Textures ──────────────────────────────────────────────────────
  const dotTex = track(
    canvasTexture(THREE, 64, 64, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    })
  );
  const flameTex = track(
    canvasTexture(THREE, 128, 256, (ctx, w, h) => {
      ctx.save();
      ctx.translate(w / 2, h * 0.68);
      ctx.scale(0.62, 1.55);
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, w * 0.5);
      g.addColorStop(0, "rgba(255,255,238,1)");
      g.addColorStop(0.22, "rgba(255,224,130,0.98)");
      g.addColorStop(0.55, "rgba(255,150,45,0.6)");
      g.addColorStop(1, "rgba(255,90,10,0)");
      ctx.fillStyle = g;
      ctx.fillRect(-w, -h, w * 2, h * 2);
      ctx.restore();
    })
  );
  const mandalaTex = track(
    canvasTexture(THREE, 1024, 1024, (ctx, w, h) => {
      ctx.translate(w / 2, h / 2);
      ctx.strokeStyle = "rgba(255,206,110,0.9)";
      ctx.fillStyle = "rgba(255,206,110,0.9)";
      ctx.lineCap = "round";
      const ring = (r: number, lw: number) => {
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      };
      ring(500, 3);
      ring(486, 1.5);
      ring(330, 2);
      ring(180, 2);
      const petals = (n: number, r0: number, r1: number, width: number, lw: number) => {
        ctx.lineWidth = lw;
        for (let i = 0; i < n; i++) {
          ctx.save();
          ctx.rotate((i / n) * Math.PI * 2);
          ctx.beginPath();
          ctx.moveTo(0, -r0);
          ctx.quadraticCurveTo(width, -(r0 + r1) / 2, 0, -r1);
          ctx.quadraticCurveTo(-width, -(r0 + r1) / 2, 0, -r0);
          ctx.stroke();
          ctx.restore();
        }
      };
      petals(24, 335, 482, 46, 2);
      petals(16, 185, 326, 54, 2);
      petals(12, 40, 176, 44, 2);
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 458, Math.sin(a) * 458, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    })
  );

  // ── Diya ──────────────────────────────────────────────────────────
  const goldMat = track(new THREE.MeshStandardMaterial({ color: 0xdca21e, metalness: 1, roughness: 0.28, side: THREE.DoubleSide }));
  const profile = [
    [0, -0.02], [0.3, 0], [0.6, 0.07], [0.86, 0.22], [1.0, 0.45], [1.05, 0.6], [0.99, 0.63],
    [0.9, 0.54], [0.72, 0.36], [0.42, 0.26], [0, 0.24],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const bowlGeo = track(new THREE.LatheGeometry(profile, 72));
  const bowl = new THREE.Mesh(bowlGeo, goldMat);
  const diya = new THREE.Group();
  diya.add(bowl);

  const rimGeo = track(new THREE.TorusGeometry(1.02, 0.035, 12, 96));
  const rimMesh = new THREE.Mesh(rimGeo, goldMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 0.6;
  diya.add(rimMesh);

  const oilMat = track(new THREE.MeshStandardMaterial({ color: 0x2c1404, emissive: 0xff7a18, emissiveIntensity: 0, roughness: 0.12, metalness: 0 }));
  const oilGeo = track(new THREE.CircleGeometry(0.7, 48));
  const oil = new THREE.Mesh(oilGeo, oilMat);
  oil.rotation.x = -Math.PI / 2;
  oil.position.y = 0.3;
  diya.add(oil);

  const wickMat = track(new THREE.MeshStandardMaterial({ color: 0x3a2412, roughness: 0.8 }));
  const wickGeo = track(new THREE.CylinderGeometry(0.03, 0.045, 0.3, 10));
  const wick = new THREE.Mesh(wickGeo, wickMat);
  wick.position.y = 0.42;
  diya.add(wick);

  const flameCore = new THREE.Sprite(
    track(new THREE.SpriteMaterial({ map: flameTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }))
  );
  const flameGlow = new THREE.Sprite(
    track(new THREE.SpriteMaterial({ map: dotTex, color: 0xff9a2e, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.0, toneMapped: false }))
  );
  const flameBase = new THREE.Vector3(0, 0.98, 0.05);
  flameCore.position.copy(flameBase);
  flameGlow.position.set(0, 0.92, -0.05);
  diya.add(flameGlow, flameCore);
  diya.position.y = 0.55;
  rig.add(diya);

  // ── Lotus ─────────────────────────────────────────────────────────
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.bezierCurveTo(0.58, 0.25, 0.5, 1.0, 0, 1.55);
  petalShape.bezierCurveTo(-0.5, 1.0, -0.58, 0.25, 0, 0);
  const petalGeo = track(new THREE.ShapeGeometry(petalShape, 14));
  {
    const pos = petalGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const base = new THREE.Color(0xfff4ee);
    const tip = new THREE.Color(0xf38db3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setZ(i, -0.3 * y * y);
      c.copy(base).lerp(tip, clamp(y / 1.55, 0, 1) ** 1.4);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    petalGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    petalGeo.computeVertexNormals();
  }
  const petalMat = track(
    new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.55, metalness: 0, emissive: 0x7a2a4a, emissiveIntensity: 0.18 })
  );
  const lotus = new THREE.Group();
  const rings = [
    { n: 10, elev: 0.14, scale: 1.05, off: 0 },
    { n: 10, elev: 0.5, scale: 0.92, off: 0.5 },
    { n: 8, elev: 0.9, scale: 0.74, off: 0 },
    { n: 6, elev: 1.2, scale: 0.52, off: 0.5 },
  ];
  const slots: { angle: number; elev: number; scale: number }[] = [];
  for (const ring of rings) for (let i = 0; i < ring.n; i++) slots.push({ angle: ((i + ring.off) / ring.n) * Math.PI * 2, elev: ring.elev, scale: ring.scale });
  // One draw call for the whole lotus. Petal matrices are rewritten only while the flower is opening.
  const lotusMesh = new THREE.InstancedMesh(petalGeo, petalMat, slots.length);
  lotusMesh.frustumCulled = false;
  const pivotD = new THREE.Object3D();
  const petalD = new THREE.Object3D();
  const lotusM = new THREE.Matrix4();
  let lastBloom = -1;
  const writeLotus = (bloom: number) => {
    slots.forEach((slot, i) => {
      pivotD.rotation.set(0, slot.angle, 0);
      pivotD.updateMatrix();
      petalD.rotation.set(Math.PI / 2 - lerp(1.5, slot.elev, bloom), 0, 0);
      petalD.position.set(0, 0, 0.12);
      petalD.scale.setScalar(slot.scale);
      petalD.updateMatrix();
      lotusM.multiplyMatrices(pivotD.matrix, petalD.matrix);
      lotusMesh.setMatrixAt(i, lotusM);
    });
    lotusMesh.instanceMatrix.needsUpdate = true;
  };
  writeLotus(0);
  lotus.add(lotusMesh);
  lotus.position.y = -0.18;
  rig.add(lotus);

  // ── Bala Krishna tied to the mortar (hero). The diya + lotus above are the finale's centrepiece. ──
  const figure = createBalKrishna(THREE);
  rig.add(figure.group);
  const env = createEnvironment(THREE, dotTex);
  rig.add(env.group);
  disposables.push({ dispose: figure.dispose }, { dispose: env.dispose });
  const shadowTex = track(
    canvasTexture(THREE, 128, 128, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      g.addColorStop(0, "rgba(0,0,0,0.6)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    })
  );
  const blobGeo = track(new THREE.PlaneGeometry(1, 1));
  const blobMat = track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.8 }));
  const blobs = [
    { w: 2.8, d: 1.9 }, // Krishna
    { w: 1.9, d: 1.5 }, // mortar
    { w: 1.0, d: 0.9 }, // butter pot
  ].map(({ w, d }) => {
    const m = new THREE.Mesh(blobGeo, blobMat);
    m.rotation.x = -Math.PI / 2;
    m.scale.set(w, d, 1);
    m.position.y = 0.012;
    rig.add(m);
    return m;
  });
  const shadow = blobs[0];

  // ── Mandala + halo ────────────────────────────────────────────────
  const mandalaMat = (opacity: number) =>
    track(new THREE.MeshBasicMaterial({ map: mandalaTex, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  const planeGeo = track(new THREE.PlaneGeometry(1, 1));
  const mandalaA = new THREE.Mesh(planeGeo, mandalaMat(0.34));
  mandalaA.scale.setScalar(7.4);
  mandalaA.position.set(0, 1.3, -1.6);
  const mandalaB = new THREE.Mesh(planeGeo, mandalaMat(0.16));
  mandalaB.scale.setScalar(5.1);
  mandalaB.position.set(0, 1.3, -1.4);
  rig.add(mandalaA, mandalaB);

  const haloGeo = track(new THREE.TorusGeometry(2.45, 0.014, 8, 160));
  const haloMat = track(new THREE.MeshBasicMaterial({ color: 0xffc95e, transparent: true, opacity: 0.55, toneMapped: false }));
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.set(0, 1.3, -0.9);
  rig.add(halo);

  // ── Embers, petals, stars ─────────────────────────────────────────
  const small = () => window.innerWidth < 640;
  const EMBERS = 90;
  const emberPos = new Float32Array(EMBERS * 3);
  const emberCol = new Float32Array(EMBERS * 3);
  const emberSpeed = new Float32Array(EMBERS);
  const emberPhase = new Float32Array(EMBERS);
  const cA = new THREE.Color(0xffd36b);
  const cB = new THREE.Color(0xff8a2a);
  const tmpC = new THREE.Color();
  const resetEmber = (i: number, spawn = false) => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 3.6;
    emberPos[i * 3] = Math.cos(a) * r;
    emberPos[i * 3 + 1] = spawn ? -1 + Math.random() * 7 : -1.2 + Math.random() * 0.8;
    emberPos[i * 3 + 2] = -1.2 + Math.random() * 3;
    emberSpeed[i] = 0.18 + Math.random() * 0.45;
    emberPhase[i] = Math.random() * Math.PI * 2;
    tmpC.copy(cA).lerp(cB, Math.random());
    emberCol.set([tmpC.r, tmpC.g, tmpC.b], i * 3);
  };
  for (let i = 0; i < EMBERS; i++) resetEmber(i, true);
  const emberGeo = track(new THREE.BufferGeometry());
  emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
  emberGeo.setAttribute("color", new THREE.BufferAttribute(emberCol, 3));
  const emberMat = track(
    new THREE.PointsMaterial({ size: 0.085, map: dotTex, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, toneMapped: false })
  );
  const embers = new THREE.Points(emberGeo, emberMat);
  rig.add(embers);

  const PETALS = 10;
  const drift = new THREE.InstancedMesh(petalGeo, petalMat, PETALS);
  const dd = Array.from({ length: PETALS }, () => ({ x: 0, y: 0, z: 0, s: 0, vy: 0, sx: 0, rx: 0, ry: 0, rz: 0, vr: 0 }));
  const resetPetal = (p: (typeof dd)[number], spawn: boolean) => {
    p.x = (Math.random() - 0.5) * 9;
    p.y = spawn ? -2 + Math.random() * 8 : 5.5 + Math.random() * 1.5;
    p.z = -1.5 + Math.random() * 3.5;
    p.s = 0.09 + Math.random() * 0.1;
    p.vy = 0.22 + Math.random() * 0.3;
    p.sx = 0.3 + Math.random() * 0.5;
    p.rx = Math.random() * 6;
    p.ry = Math.random() * 6;
    p.rz = Math.random() * 6;
    p.vr = 0.4 + Math.random() * 0.9;
  };
  dd.forEach((p) => resetPetal(p, true));
  const dummy = new THREE.Object3D();
  const writePetals = (t: number) => {
    dd.forEach((p, i) => {
      dummy.position.set(p.x + Math.sin(t * p.sx + i) * 0.5, p.y, p.z);
      dummy.rotation.set(p.rx + t * p.vr * 0.5, p.ry + t * p.vr, p.rz);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      drift.setMatrixAt(i, dummy.matrix);
    });
    drift.instanceMatrix.needsUpdate = true;
  };
  drift.frustumCulled = false;
  rig.add(drift);

  const STARS = 180;
  const starPos = new Float32Array(STARS * 3);
  for (let i = 0; i < STARS; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 34;
    starPos[i * 3 + 1] = (Math.random() - 0.3) * 20;
    starPos[i * 3 + 2] = -14 - Math.random() * 6;
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = track(new THREE.PointsMaterial({ size: 0.09, map: dotTex, color: 0xdfe7ff, transparent: true, opacity: 0.7, depthWrite: false, toneMapped: false }));
  const stars = new THREE.Points(starGeo, starMat);
  stars.visible = true;
  scene.add(stars);

  // Which centrepiece is shown follows the section the canvas is in.
  const applyVariant = () => {
    key.visible = isStory;
    hemi.visible = isStory;
    rimBlue.visible = isStory;
    figure.group.visible = isStory;
    env.group.visible = isStory;
    blobs.forEach((b) => (b.visible = isStory));
    fog.near = isStory ? 14 : 1000;
    fog.far = isStory ? 46 : 2000;
    lotus.visible = !isStory;
    diya.visible = !isStory;
    diya.position.set(0, 0.55, 0);
    diya.scale.setScalar(1);
    const my = isStory ? 2.2 : 1.3;
    mandalaA.position.set(0, my, -1.9);
    mandalaB.position.set(0, my, -1.7);
    halo.position.set(0, my, -1.1);
  };
  applyVariant();

  // ── Layout ────────────────────────────────────────────────────────
  let hostTop = 0;
  let hostH = 1;
  let aspect = 1;
  let maxDpr = 1;
  const baseRig = new THREE.Vector3();
  let baseScale = 1;
  let storyFinalZoom = 0.62;

  const layout = () => {
    if (!host) return;
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    aspect = w / h;
    maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(maxDpr * resScale);
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    const r = host.getBoundingClientRect();
    hostTop = r.top + window.scrollY;
    hostH = r.height || 1;
    const visW = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360) * aspect;
    if (isStory) {
      // The sticky story stage: Krishna, the mortar and the butter pot centred, as large as the stage allows.
      baseScale = clamp((visW * 0.9) / 5.4, 0.45, 1.25);
      // at the end the whole of the two tall trees (about 9.6 units) must fit the stage height
      const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
      storyFinalZoom = clamp((visH * 0.8) / (9.6 * baseScale), 0.22, 0.62);
      baseRig.set(0, -1.35 * baseScale, 0);
    } else if (isHero) {
      if (aspect > 1.15) {
        baseScale = 1;
        baseRig.set(visW * 0.22, -1.15, 0);
      } else {
        // Portrait phone: the diya sits in the upper part, the copy is below it.
        baseScale = clamp(visW * 0.215, 0.5, 0.78);
        baseRig.set(0, 3.0 - 1.45 * baseScale - 0.95, 0);
      }
    } else {
      baseScale = aspect > 1.15 ? 1.25 : clamp(visW * 0.34, 0.6, 0.95);
      baseRig.set(0, aspect > 1.15 ? -1.55 : -1.1, 0);
    }
    camera.updateProjectionMatrix();
  };

  // ── Resolution governor ──────────────────────────────────────────
  // Every device gets the same scene, lighting and effects. Only the render resolution adapts: it steps down when frames
  // take too long and creeps back up when there is headroom, so a low-end phone stays smooth at a slightly softer image.
  let resScale = 1;
  const setRes = (k: number) => {
    resScale = clamp(k, 0.55, 1);
    renderer.setPixelRatio(maxDpr * resScale);
    if (host) renderer.setSize(host.clientWidth, host.clientHeight, false);
  };
  let sampleFrames = 0;
  let sampleSum = 0;
  let goodWindows = 0;

  // ── Input ─────────────────────────────────────────────────────────
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!coarse && !reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  // ── Frame ─────────────────────────────────────────────────────────
  const tmpV = new THREE.Vector3();
  const flameWorld = new THREE.Vector3();
  const update = (t: number, dt: number) => {
    const intro = clamp(state.intro, 0, 1);
    const ignite = easeOutCubic(clamp((intro - 0.35) / 0.65, 0, 1));
    const bloom = easeOutCubic(clamp(intro / 0.85, 0, 1));

    // flame
    const f1 = 1 + 0.07 * Math.sin(t * 9.1) + 0.045 * Math.sin(t * 17.3 + 1.1) + 0.03 * Math.sin(t * 31 + 2);
    const sway = 0.025 * Math.sin(t * 5.2) + 0.012 * Math.sin(t * 11.7);
    flameCore.scale.set(0.78 * f1 * ignite, 1.55 * (1 + (f1 - 1) * 1.4) * ignite, 1);
    flameCore.position.set(flameBase.x + sway, flameBase.y + 0.1 * ignite, flameBase.z);
    flameGlow.scale.setScalar(3.1 * (0.96 + (f1 - 1) * 0.8) * ignite);
    (flameGlow.material as import("three").SpriteMaterial).opacity = 0.55 * ignite;
    flameCore.getWorldPosition(flameWorld);
    flameLight.position.set(flameWorld.x, flameWorld.y, flameWorld.z + 1.2);
    flameLight.intensity = (isHero ? 30 : isStory ? 0 : 24) * ignite * (0.92 + (f1 - 1) * 1.6);
    oilMat.emissiveIntensity = 0.7 * ignite;

    // lotus bloom (matrices are only rewritten while it is still opening)
    if (Math.abs(bloom - lastBloom) > 0.003) {
      writeLotus(bloom);
      lastBloom = bloom;
    }

    // slow spins
    mandalaA.rotation.z += dt * 0.05;
    mandalaB.rotation.z -= dt * 0.08;
    halo.rotation.z += dt * 0.1;
    halo.scale.setScalar(0.9 + 0.1 * bloom);
    (mandalaA.material as import("three").MeshBasicMaterial).opacity = (isStory ? 0.14 : 0.34) * bloom;
    (mandalaB.material as import("three").MeshBasicMaterial).opacity = (isStory ? 0.06 : 0.16) * bloom;
    haloMat.opacity = (isStory ? 0.22 : 0.55) * bloom;

    // embers
    const n = EMBERS;
    for (let i = 0; i < n; i++) {
      emberPos[i * 3 + 1] += emberSpeed[i] * dt;
      emberPos[i * 3] += Math.sin(t * 0.7 + emberPhase[i]) * 0.003;
      if (emberPos[i * 3 + 1] > 6) resetEmber(i);
    }
    emberGeo.attributes.position.needsUpdate = true;
    emberMat.opacity = 0.95 * ignite;

    // drifting petals
    const pn = PETALS;
    for (let i = 0; i < pn; i++) {
      dd[i].y -= dd[i].vy * dt;
      if (dd[i].y < -3.5) resetPetal(dd[i], false);
    }
    writePetals(t);

    // Krishna: pulls harder at the rope the further the visitor scrolls, and turns toward the pointer
    let focusX = 0;
    let zoom = 1;
    let tilt = 0;
    if (isStory) {
      const chapter = clamp(state.progress ?? 0, 0, 1) * 4.999;
      const dv = figure.update(t, { chapter, look: coarse ? Math.sin(t * 0.4) * 0.3 : pointer.x * 0.5, tug: 0.5 });
      env.update(t, dv);
      focusX = dv.focusX;
      const ss = (x: number, a: number, b: number) => {
        const u = clamp((x - a) / (b - a), 0, 1);
        return u * u * (3 - 2 * u);
      };
      // follow Him while He crawls, then pull back to take in the whole of the two trees
      zoom = lerp(1 - 0.08 * ss(chapter, 3.0, 3.5), storyFinalZoom, ss(chapter, 3.9, 4.4));
      tilt = ss(chapter, 3.9, 4.4);
      key.position.set(focusX - 3, 6, 5);
      key.target.position.set(focusX, 0, 0);
      blobs[0].position.x = dv.kx - 0.2;
      blobs[1].position.x = dv.mortarX;
      blobs[1].position.z = -0.5;
      blobs[2].position.set(1.0, 0.012, 0.8);
      blobMat.opacity = 0.8;
    }

    // rig: scroll lift + pointer parallax (touch screens get a slow sway instead)
    const p = isStory ? 0 : clamp((window.scrollY - hostTop) / hostH, 0, 1);
    pointer.x = lerp(pointer.x, pointer.tx, 0.05);
    pointer.y = lerp(pointer.y, pointer.ty, 0.05);
    const sway2 = coarse ? Math.sin(t * 0.35) * 0.18 : pointer.x * 0.4;
    rig.rotation.y = isStory ? sway2 * 0.2 : sway2;
    rig.rotation.x = coarse || isStory ? 0 : pointer.y * 0.1;
    tmpV.copy(baseRig);
    tmpV.y += p * 1.1 + (isStory ? 0 : Math.sin(t * 0.6) * 0.05);
    tmpV.x -= focusX * baseScale * zoom;
    tmpV.y = lerp(tmpV.y, -1.55, tilt);
    rig.position.copy(tmpV);
    rig.scale.setScalar(baseScale * zoom * (1 - p * 0.18));
    stars.rotation.z = t * 0.004;
  };

  let raf = 0;
  let last = performance.now();
  let running = false;
  const clock0 = performance.now();
  // While the visitor is scrolling the browser has page work to do (the blurred header, compositing), so the
  // scene drops to 30fps then and stops entirely once the hero has mostly scrolled away.
  let lastScroll = 0;
  const onScroll = () => {
    lastScroll = performance.now();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (isHero && (window.scrollY - hostTop) / hostH > 1.05) {
      last = now;
      return;
    }
    const scrolling = now - lastScroll < 160;
    if (scrolling && now - last < 30) return; // 30fps while the page is scrolling (same on every device)
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update((now - clock0) / 1000, dt);
    renderer.render(scene, camera);
    if (canvas.style.opacity !== "1") {
      canvas.style.opacity = "1"; // fade in once the first frame is really on the canvas
      host?.dispatchEvent(new CustomEvent("scene-ready", { bubbles: true }));
    }
    if (!scrolling && now - clock0 > 1200) {
      sampleSum += dt;
      sampleFrames++;
      if (sampleFrames === 40) {
        const avg = sampleSum / 40;
        if (avg > 0.024 && resScale > 0.56) {
          setRes(resScale * 0.82);
          goodWindows = 0;
        } else if (avg < 0.0185 && resScale < 1) {
          if (++goodWindows >= 3) {
            setRes(resScale * 1.12);
            goodWindows = 0;
          }
        } else goodWindows = 0;
        sampleFrames = 0;
        sampleSum = 0;
      }
    }
  };
  const start = () => {
    if (running || reduceMotion) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // ── Hosts: the hero and the finale each register; the canvas lives in the one that is on screen ──
  type Entry = { host: HTMLElement; state: SceneState; onScreen: boolean; io: IntersectionObserver; ro: ResizeObserver };
  const entries = new Map<Variant, Entry>();
  let active: Variant | null = null;

  const activate = (variant: Variant | null) => {
    if (variant === active) return;
    active = variant;
    if (!variant) {
      stop();
      return;
    }
    const e = entries.get(variant)!;
    isHero = variant === "hero";
    isStory = variant === "story";
    host = e.host;
    state = e.state;
    if (canvas.parentElement !== host) host.appendChild(canvas);
    stars.visible = variant !== "finale";
    flameLight.intensity = 0;
    applyVariant();
    layout();
    canvas.style.transition = "none";
    canvas.style.opacity = "0";
    void canvas.offsetWidth;
    canvas.style.transition = "opacity .7s ease";
    if (reduceMotion) {
      state.intro = 1;
      update(2, 0);
      renderer.render(scene, camera);
      canvas.style.opacity = "1";
      host?.dispatchEvent(new CustomEvent("scene-ready", { bubbles: true }));
    }
    sync();
  };
  const pick = () => {
    const order: Variant[] = ["story", "hero", "finale"];
    activate(order.find((v) => entries.get(v)?.onScreen) ?? null);
  };
  const sync = () => (active && !document.hidden ? start() : stop());

  const onVis = () => sync();
  document.addEventListener("visibilitychange", onVis);
  const onLoad = () => layout();
  window.addEventListener("load", onLoad);

  const attach: Controller["attach"] = (variant, h, st) => {
    entries.get(variant)?.io.disconnect();
    entries.get(variant)?.ro.disconnect();
    const entry: Entry = {
      host: h,
      state: st,
      onScreen: false,
      io: new IntersectionObserver(
        (list) => {
          entry.onScreen = list[list.length - 1]?.isIntersecting ?? false;
          pick();
        },
        { rootMargin: "120px" }
      ),
      ro: new ResizeObserver(() => {
        if (host === h) {
          layout();
          if (reduceMotion) renderer.render(scene, camera);
        }
      }),
    };
    entries.set(variant, entry);
    entry.io.observe(h);
    entry.ro.observe(h);
  };
  const detach: Controller["detach"] = (variant) => {
    const e = entries.get(variant);
    if (!e) return;
    e.io.disconnect();
    e.ro.disconnect();
    entries.delete(variant);
    if (active === variant) {
      active = null;
      host = null;
      canvas.remove();
    }
    pick();
  };

  const dispose = () => {
    stop();
    entries.forEach((e) => {
      e.io.disconnect();
      e.ro.disconnect();
    });
    entries.clear();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("load", onLoad);
    window.removeEventListener("scroll", onScroll);
    drift.dispose();
    lotusMesh.dispose();
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  // Compile every shader off the main thread (where supported) before the first frame, so nothing hitches later.
  // Everything is made visible for the compile so the story stage's materials (and the shadow pass) are ready too.
  const ready = (async () => {
    try {
      key.visible = hemi.visible = rimBlue.visible = figure.group.visible = env.group.visible = lotus.visible = diya.visible = true;
      await renderer.compileAsync(scene, camera);
    } catch {
      /* compiled lazily on the first frame instead */
    } finally {
      applyVariant();
    }
  })();

  return { ready, attach, detach, dispose };
}
