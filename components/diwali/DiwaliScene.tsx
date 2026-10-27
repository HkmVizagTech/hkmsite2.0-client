"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { createBalKrishna } from "@/components/kartik/balKrishna";
import { canvasTex, clamp, createFireworks, createLanterns, createRangoli, dotTexture, lerp, smooth } from "./diwaliFx";
import { createDiya, createDiyaField, createGovardhan, createKalasha, createLotus, createThali, type Mats } from "./diwaliProps";

/**
 * Three.js scene for the Diwali page. ONE WebGL context is shared by three sections: the hero (a lotus diya, a rangoli that
 * blooms, fireworks, sky lanterns, and little Krishna who crawls in, waves and crawls away), the five-days stage (five scenes
 * driven by scroll: Dhanteras, Naraka Chaturdashi, Diwali, Govardhan Puja, Bhai Dooj) and the finale.
 *
 * The scene is identical on every device. Only the render resolution adapts (a governor steps it down when frames run long),
 * the loop runs at 30fps while the page scrolls and stops when the canvas is off screen or the tab is hidden, and
 * prefers-reduced-motion renders a single still frame. If WebGL is missing a CSS glow is shown.
 */
export type DiwaliState = { intro: number; /** 0..1 through the five-days stage */ progress?: number };
type Variant = "hero" | "stage" | "finale";

type Props = { variant: Variant; state?: DiwaliState; className?: string };

export default function DiwaliScene({ variant, state, className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let detach: (() => void) | undefined;
    acquire()
      .then((ctl) => {
        if (disposed) {
          ctl.release();
          return;
        }
        ctl.attach(variant, host, state ?? { intro: 1, progress: 0 });
        detach = () => {
          ctl.detach(variant);
          ctl.release();
        };
      })
      .catch((err) => {
        console.warn("[diwali-scene] 3D unavailable, using the CSS glow instead:", err);
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
          <div className="h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,196,80,0.6),rgba(255,120,40,0.2)_45%,transparent_70%)] blur-2xl md:h-80 md:w-80" />
        </div>
      )}
    </div>
  );
}

type Controller = { attach: (v: Variant, host: HTMLElement, st: DiwaliState) => void; detach: (v: Variant) => void; release: () => void };
let promise: Promise<Controller> | null = null;
let refs = 0;
let disposeAll: (() => void) | null = null;

function acquire(): Promise<Controller> {
  refs++;
  if (!promise) {
    promise = (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const built = build(THREE, RoomEnvironment);
      await built.ready;
      disposeAll = built.dispose;
      return {
        attach: built.attach,
        detach: built.detach,
        release: () => {
          refs--;
          if (refs <= 0) {
            disposeAll?.();
            promise = null;
            disposeAll = null;
            refs = 0;
          }
        },
      };
    })().catch((e) => {
      promise = null;
      refs = 0;
      throw e;
    });
  }
  return promise;
}

type THREE_ = typeof import("three");

function build(THREE: THREE_, RoomEnvironment: new () => import("three").Scene) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  let variant: Variant = "hero";
  let host: HTMLElement | null = null;
  let state: DiwaliState = { intro: 1, progress: 0 };

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  const canvas = renderer.domElement;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .7s ease;";

  const scene = new THREE.Scene();
  // a soft studio environment so the brass catches light
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.28;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  const CAM_TARGET = new THREE.Vector3(0, 0.9, 0);
  camera.position.set(0, 2.5, 9.2);
  camera.lookAt(CAM_TARGET);

  const disposables: { dispose: () => void }[] = [pmrem, envTex];
  const track = <D extends { dispose: () => void }>(o: D): D => {
    disposables.push(o);
    return o;
  };

  // lights
  scene.add(new THREE.AmbientLight(0x7a6bff, 0.35));
  scene.add(new THREE.HemisphereLight(0x8fa2ff, 0x3a1f12, 0.3));
  const key = new THREE.DirectionalLight(0xfff0d8, 1.0);
  key.position.set(-3, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff9a5a, 0.9);
  rim.position.set(4, 3, -4);
  scene.add(rim);
  const flameLight = new THREE.PointLight(0xffa447, 0, 18, 1.5);
  scene.add(flameLight);

  const rig = new THREE.Group();
  scene.add(rig);

  // shared materials / textures
  const dotTex = track(dotTexture(THREE));
  const flameTex = track(
    canvasTex(THREE, 128, 256, (ctx, w, h) => {
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
  const gold = track(new THREE.MeshStandardMaterial({ color: 0xdca21e, metalness: 1, roughness: 0.28, side: THREE.DoubleSide }));
  const oil = track(new THREE.MeshStandardMaterial({ color: 0x2c1404, emissive: 0xff7a18, emissiveIntensity: 0.8, roughness: 0.12 }));
  const mats: Mats = { gold, oil, flameTex, dotTex };

  // ── stars (fixed in the sky, outside the rig) ──
  const STARS = 200;
  const sp = new Float32Array(STARS * 3);
  for (let i = 0; i < STARS; i++) {
    sp[i * 3] = (Math.random() - 0.5) * 36;
    sp[i * 3 + 1] = (Math.random() - 0.15) * 22;
    sp[i * 3 + 2] = -16 - Math.random() * 6;
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const starMat = track(new THREE.PointsMaterial({ size: 0.1, map: dotTex, color: 0xdfe7ff, transparent: true, opacity: 0.75, depthWrite: false, toneMapped: false, fog: false }));
  scene.add(new THREE.Points(starGeo, starMat));

  // ── ground: rangoli + rings of diyas ──
  const rangoli = track(createRangoli(THREE, 3.7));
  rig.add(rangoli.mesh);
  const field = track(
    createDiyaField(THREE, mats, [
      { r: 3.95, n: 24, start: 0 },
      { r: 2.2, n: 14, start: 0.2 },
    ])
  );
  rig.add(field.group);

  // ── centrepiece: lotus + big diya ──
  const lotus = track(createLotus(THREE));
  lotus.mesh.position.y = -0.18;
  const centre = new THREE.Group();
  const bigDiya = track(createDiya(THREE, mats));
  bigDiya.group.position.y = 0.55;
  centre.add(lotus.mesh, bigDiya.group);
  rig.add(centre);

  // ── chapter props ──
  const kalasha = track(createKalasha(THREE, gold));
  rig.add(kalasha.group);
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: 0xffb347, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, toneMapped: false, fog: false }));
  sun.position.set(0, 1.6, -4.5);
  rig.add(sun);
  const sunCore = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: 0xfff2c8, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, toneMapped: false, fog: false }));
  sunCore.position.copy(sun.position);
  rig.add(sunCore);
  const govardhan = track(createGovardhan(THREE));
  rig.add(govardhan.group);
  const thali = track(createThali(THREE, mats));
  rig.add(thali.group);
  track({ dispose: () => (sun.material as THREE_NS.Material).dispose() });
  track({ dispose: () => (sunCore.material as THREE_NS.Material).dispose() });

  // ── sky ──
  const fireworks = track(createFireworks(THREE, dotTex, 7, 64));
  rig.add(fireworks.points);
  const lanterns = track(createLanterns(THREE, 14));
  rig.add(lanterns.mesh);

  // ── Krishna ──
  const krishna = createBalKrishna(THREE);
  krishna.setProps(false);
  rig.add(krishna.group);
  track({ dispose: krishna.dispose });

  // ── layout ──
  let aspect = 1;
  let maxDpr = 1;
  let resScale = 1;
  let hostTop = 0;
  let hostH = 1;
  let visW = 10;
  const baseRig = new THREE.Vector3();
  let baseScale = 1;

  const layout = () => {
    if (!host) return;
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    aspect = w / h;
    maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(maxDpr * resScale);
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    const r = host.getBoundingClientRect();
    hostTop = r.top + window.scrollY;
    hostH = r.height || 1;
    visW = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360) * aspect;
    const wide = aspect > 1.15;
    if (variant === "hero") {
      baseScale = wide ? 1.0 : clamp((visW * 0.17) / 1.0, 0.45, 0.68);
      baseRig.set(wide ? visW * 0.2 : 0, wide ? -0.35 : 1.5, 0);
    } else if (variant === "stage") {
      baseScale = clamp((visW * 1.2) / 8.2, 0.5, 1.25);
      baseRig.set(0, -0.8 * baseScale, 0);
    } else {
      baseScale = wide ? 1.0 : clamp(visW * 0.2, 0.5, 0.8);
      baseRig.set(wide ? visW * 0.18 : 0, wide ? -1.5 : -0.2, 0);
    }
  };

  // ── resolution governor ──
  const setRes = (k: number) => {
    resScale = clamp(k, 0.55, 1);
    renderer.setPixelRatio(maxDpr * resScale);
    if (host) renderer.setSize(host.clientWidth, host.clientHeight, false);
  };
  let sampleFrames = 0;
  let sampleSum = 0;
  let goodWindows = 0;

  // ── input ──
  const pointer = { x: 0, tx: 0 };
  const onPointer = (e: PointerEvent) => (pointer.tx = (e.clientX / window.innerWidth) * 2 - 1);
  if (!coarse && !reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  // ── Krishna keyframes for the five stage scenes ──
  const K = [
    { x: -2.7, z: 0.9, rotY: 0.55, crawl: 0, wave: 1, lift: 0 }, // Dhanteras: waves hello
    { x: -1.4, z: 0.9, rotY: 1.2, crawl: 1, wave: 0, lift: 0 }, // Naraka Chaturdashi: crawls towards the light
    { x: -2.6, z: 1.0, rotY: 0.5, crawl: 0, wave: 0.5, lift: 0 }, // Diwali: sits and watches the lamps
    { x: -2.2, z: 1.0, rotY: 0.5, crawl: 0, wave: 0, lift: 1 }, // Govardhan: lifts the hill
    { x: -2.7, z: 0.9, rotY: 0.55, crawl: 0, wave: 1, lift: 0 }, // Bhai Dooj: waves
  ];

  const tmpV = new THREE.Vector3();
  let leftEdge = -6;
  const heroKrishna = (t: number) => {
    const period = 19;
    const p = t % period;
    const sitX = leftEdge + 2.1;
    const outX = leftEdge - 1.6;
    let x = outX,
      crawl = 1,
      moving = 0,
      wave = 0,
      rotY = 1.3;
    if (p < 3.6) {
      const k = p / 3.6;
      x = lerp(outX, sitX, 1 - (1 - k) * (1 - k));
      moving = 1 - smooth(p, 3.0, 3.6) * 0.6;
      crawl = 1;
      rotY = 1.3;
    } else if (p < 4.4) {
      x = sitX;
      const k = smooth(p, 3.6, 4.4);
      crawl = 1 - k;
      rotY = lerp(1.3, 0.55, k);
    } else if (p < 10.2) {
      x = sitX;
      crawl = 0;
      rotY = 0.55;
      wave = smooth(p, 4.4, 5.0) * (1 - smooth(p, 9.4, 10.0));
    } else if (p < 11) {
      x = sitX;
      const k = smooth(p, 10.2, 11);
      crawl = k;
      rotY = lerp(0.55, -1.3, k);
    } else if (p < 14.4) {
      const k = (p - 11) / 3.4;
      x = lerp(sitX, outX, k * k);
      crawl = 1;
      moving = 1;
      rotY = -1.3;
    }
    return { x, z: 2.3, rotY, crawl, moving, wave, lift: 0, look: 0, scale: 0.72 };
  };

  const stageKrishna = (c: number) => {
    const cc = clamp(c, 0, 4.999);
    const i = Math.floor(cc);
    const f = cc - i;
    const b = i < 4 ? smooth(f, 0.72, 1.0) : 0;
    const a = K[i];
    const n = K[Math.min(4, i + 1)];
    const dash = Math.sin(Math.PI * b); // crawling between two scenes
    const sitX = leftEdge + 2.1;
    const x = lerp(a.x, n.x, b);
    return {
      x: Math.max(x, leftEdge + 2.3),
      z: lerp(a.z, n.z, b),
      rotY: lerp(a.rotY, n.rotY, b) + (b > 0 && b < 1 ? 0.5 * dash : 0),
      crawl: Math.max(lerp(a.crawl, n.crawl, b), dash),
      moving: dash,
      wave: lerp(a.wave, n.wave, b) * (1 - dash),
      lift: lerp(a.lift, n.lift, b),
      look: 0,
      scale: 0.95,
      sitX,
    };
  };

  const update = (t: number, dt: number) => {
    const hero = variant === "hero";
    const stage = variant === "stage";
    const intro = clamp(state.intro, 0, 1);
    const bloomI = smooth(intro, 0, 0.85);
    const lightI = smooth(intro, 0.35, 1);
    const prog = clamp(state.progress ?? 0, 0, 1);
    const c = prog * 5; // 0..5 over the five scenes
    const w = (i: number) => (stage ? 1 - smooth(Math.abs(c - (i + 0.5)), 0.38, 0.62) : 0);

    leftEdge = (-visW / 2 - baseRig.x) / baseScale;

    // ── what is visible and how lit ──
    const w0 = w(0),
      w1 = w(1),
      w2 = w(2),
      w3 = w(3),
      w4 = w(4);
    const centreW = hero ? bloomI : stage ? w2 : 0.85 * bloomI;
    centre.visible = centreW > 0.01;
    centre.scale.setScalar(Math.max(0.001, centreW));
    lotus.set(clamp(centreW * 1.1, 0, 1));
    bigDiya.set(t, clamp(centreW * lightI * 1.05, 0, 1));
    centre.position.y = (1 - centreW) * -0.8;

    const rangoliReveal = hero ? bloomI * 1.02 : stage ? clamp(0.4 + w2 * 0.65 + w0 * 0.1 + w4 * 0.25, 0, 1.02) : 1.02;
    rangoli.uniforms.uReveal.value = rangoliReveal;
    rangoli.uniforms.uGlow.value = 0.85 + (stage ? w2 * 0.3 : 0.25);
    rangoli.mesh.rotation.z = t * 0.03;

    const fieldLit = hero ? lightI : stage ? clamp(0.25 + w1 * 0.4 + w2 * 0.75 + w4 * 0.5, 0, 1) : 1;
    field.set(t, fieldLit);

    kalasha.group.visible = w0 > 0.01;
    kalasha.group.scale.setScalar(Math.max(0.001, w0));
    kalasha.group.position.set(0.9, (1 - w0) * -0.9, 0.2);
    kalasha.set(t, w0);

    const sunOp = w1 * 0.9;
    (sun.material as THREE_NS.SpriteMaterial).opacity = sunOp * 0.6;
    (sunCore.material as THREE_NS.SpriteMaterial).opacity = sunOp;
    const sunRise = smooth(c, 1.0, 1.7);
    sun.position.y = lerp(-1.2, 2.2, sunRise);
    sunCore.position.y = sun.position.y;
    sun.scale.setScalar(9 + sunRise * 3);
    sunCore.scale.setScalar(3.2 + sunRise * 0.8);

    govardhan.group.visible = w3 > 0.01;
    govardhan.set(t, w3);

    thali.group.visible = w4 > 0.01;
    thali.group.scale.setScalar(Math.max(0.001, w4 * 0.95));
    thali.group.position.set(0.9, (1 - w4) * -0.6 + 0.02, 0.5);
    thali.diya.set(t, w4, 1.3);

    // fireworks: gentle in the hero, frantic in the Diwali scene, a few at the finale
    const rate = hero ? 0.5 * bloomI : stage ? 0.18 + w2 * 1.6 : 0.5;
    fireworks.update(t, dt, rate);
    lanterns.update(t);

    // ── Krishna ──
    krishna.group.visible = true;
    if (hero) {
      krishna.updateFree(t, heroKrishna(t));
    } else if (stage) {
      const k = stageKrishna(c);
      krishna.updateFree(t, k);
      // hold the Govardhan hill above His raised left hand; the Annakut heap sits on the ground beside Him
      const up = smooth(w3, 0.1, 0.9);
      govardhan.group.position.set(0, 0, 0);
      govardhan.hillGroup.position.set(k.x + 0.15, lerp(5.2, 3.45, up), 0.2);
      govardhan.hillGroup.scale.setScalar(0.72);
      govardhan.foodGroup.position.set(k.x + 3.1, 0, 0.9);
      govardhan.foodGroup.scale.setScalar(1.25);
    } else {
      const k = { x: leftEdge + 2.1, z: 1.0, rotY: 0.55, crawl: 0, moving: 0, wave: 1, lift: 0, look: 0, scale: 0.62 };
      krishna.updateFree(t, k);
    }

    // flame light follows the centrepiece
    flameLight.position.set(rig.position.x, rig.position.y + 2.0 * baseScale, 2.2);
    flameLight.intensity = (hero || variant === "finale" ? 26 : 10 + w2 * 20 + w4 * 8) * clamp(lightI, 0, 1) * (0.92 + 0.08 * Math.sin(t * 12));

    // ── rig placement ──
    pointer.x = lerp(pointer.x, pointer.tx, 0.05);
    const sway = coarse ? Math.sin(t * 0.35) * 0.1 : pointer.x * 0.25;
    rig.rotation.y = sway * (stage ? 0.4 : 1);
    const p = hero ? clamp((window.scrollY - hostTop) / hostH, 0, 1) : 0;
    tmpV.copy(baseRig);
    tmpV.y += p * 1.0;
    rig.position.copy(tmpV);
    rig.scale.setScalar(baseScale * (1 - p * 0.15));
  };

  // ── frame loop ──
  let raf = 0;
  let last = performance.now();
  let running = false;
  const clock0 = performance.now();
  let lastScroll = 0;
  const onScroll = () => (lastScroll = performance.now());
  window.addEventListener("scroll", onScroll, { passive: true });
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (variant === "hero" && (window.scrollY - hostTop) / hostH > 1.05) {
      last = now;
      return;
    }
    const scrolling = now - lastScroll < 160;
    if (scrolling && now - last < 30) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update((now - clock0) / 1000, dt);
    renderer.render(scene, camera);
    if (canvas.style.opacity !== "1") canvas.style.opacity = "1";
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

  // ── hosts ──
  type Entry = { host: HTMLElement; state: DiwaliState; onScreen: boolean; io: IntersectionObserver; ro: ResizeObserver };
  const entries = new Map<Variant, Entry>();
  let active: Variant | null = null;
  const sync = () => (active && !document.hidden ? start() : stop());
  const activate = (v: Variant | null) => {
    if (v === active) return;
    active = v;
    if (!v) {
      stop();
      return;
    }
    const e = entries.get(v)!;
    variant = v;
    host = e.host;
    state = e.state;
    if (canvas.parentElement !== host) host.appendChild(canvas);
    layout();
    canvas.style.transition = "none";
    canvas.style.opacity = "0";
    void canvas.offsetWidth;
    canvas.style.transition = "opacity .7s ease";
    if (reduceMotion) {
      state.intro = 1;
      update(3, 0.016);
      renderer.render(scene, camera);
      canvas.style.opacity = "1";
    }
    sync();
  };
  const pick = () => {
    const order: Variant[] = ["stage", "hero", "finale"];
    activate(order.find((v) => entries.get(v)?.onScreen) ?? null);
  };
  const onVis = () => sync();
  document.addEventListener("visibilitychange", onVis);
  const onLoad = () => layout();
  window.addEventListener("load", onLoad);

  const attach = (v: Variant, h: HTMLElement, st: DiwaliState) => {
    entries.get(v)?.io.disconnect();
    entries.get(v)?.ro.disconnect();
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
    entries.set(v, entry);
    entry.io.observe(h);
    entry.ro.observe(h);
  };
  const detach = (v: Variant) => {
    const e = entries.get(v);
    if (!e) return;
    e.io.disconnect();
    e.ro.disconnect();
    entries.delete(v);
    if (active === v) {
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
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  // compile everything once, off the main thread where supported, so nothing hitches later
  const ready = (async () => {
    try {
      layoutDefaults();
      await renderer.compileAsync(scene, camera);
    } catch {
      /* compiled lazily on the first frame instead */
    }
  })();
  function layoutDefaults() {
    centre.visible = kalasha.group.visible = govardhan.group.visible = thali.group.visible = true;
  }

  return { ready, attach, detach, dispose };
}
