"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { KK } from "./KkHero";

/**
 * The Kurukshetra hero as a real 3D scene built from the painted layers: the sky far away, the armies on the horizon,
 * drifting haze, the chariot close to the camera and embers floating between them. The camera sways with the mouse
 * (or slowly on its own on phones) and dollies forward as you scroll, so the layers move with true depth.
 */
export default function Hero3D({ go, onReady }: { go: boolean; onReady: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const goRef = useRef(go);
  goRef.current = go;

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    const el: HTMLDivElement = host;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x06080f, 1);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x2a2140, 30, 60);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    const loader = new THREE.TextureLoader();
    const tex = (url: string) =>
      new Promise<THREE.Texture>((res, rej) => loader.load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; res(t); }, undefined, rej));

    // soft round sprite (embers, haze, sun glow)
    const softTex = (inner: string, outer: string) => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d")!;
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, inner);
      gr.addColorStop(1, outer);
      g.fillStyle = gr;
      g.fillRect(0, 0, 128, 128);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };

    const D = { sky: 44, armies: 24, haze: 17, chariot: 9 };
    const visH = (d: number) => 2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const plane = (t: THREE.Texture, opts: { transparent?: boolean; fog?: boolean } = {}) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: t, transparent: !!opts.transparent, depthWrite: !opts.transparent, fog: opts.fog ?? false }));
      scene.add(m);
      return m;
    };

    let sky: THREE.Mesh, armies: THREE.Mesh, chariot: THREE.Mesh, sun: THREE.Sprite;
    const hazes: { s: THREE.Sprite; speed: number }[] = [];
    let embers: THREE.Points;
    let emberVel: Float32Array;
    let skyAR = 16 / 9, armyAR = 3, chariotAR = 1.88;
    let chariotTargetX = 0, chariotBaseY = 0, chariotW = 1, startX = -20;
    let entranceT = -1;
    let disposed = false, raf = 0, visible = true;

    const layout = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const portrait = w / h < 1;
      if (sky) {
        const vh = visH(D.sky) * 1.12, vw = vh * camera.aspect;
        const sw = Math.max(vw, vh * skyAR), sh = sw / skyAR;
        sky.scale.set(sw, sh, 1);
        // keep the sunrise (right third of the painting) on screen on phones
        sky.position.set(portrait ? -sw * 0.18 : 0, -vh * 0.05, -D.sky);
        sun.position.set(portrait ? vw * 0.05 : vw * 0.2, -vh * 0.18, -D.sky + 1);
        sun.scale.setScalar(vh * 0.55);
      }
      if (armies) {
        const vh = visH(D.armies), vw = vh * camera.aspect;
        const aw = portrait ? vw * 2.3 : vw * 1.15, ah = aw / armyAR;
        armies.scale.set(aw, ah, 1);
        armies.position.set(0, -vh / 2 + ah / 2 - vh * 0.02, -D.armies);
      }
      if (chariot) {
        const vh = visH(D.chariot), vw = vh * camera.aspect;
        chariotW = portrait ? vw * 0.96 : Math.min(vw * 0.46, vh * 1.25);
        const ch = chariotW / chariotAR;
        chariot.scale.set(chariotW, ch, 1);
        chariotTargetX = portrait ? 0 : -vw / 2 + vw * 0.46 + chariotW / 2;
        chariotBaseY = -vh / 2 + ch / 2 + vh * (portrait ? 0.07 : 0.045);
        startX = -vw / 2 - chariotW;
        if (entranceT < 0) chariot.position.set(startX, chariotBaseY, -D.chariot);
      }
      hazes.forEach(({ s }, i) => {
        const vh = visH(D.haze), vw = vh * camera.aspect;
        s.scale.set(vw * 0.9, vh * 0.35, 1);
        if (s.position.x === 0) s.position.set(-vw / 2 + (i / hazes.length) * vw * 1.4, -vh * 0.32 + (i % 2) * vh * 0.05, -D.haze - i * 0.5);
      });
    };

    (async () => {
      try {
        const [tSky, tArmy, tChariot] = await Promise.all([tex(KK.sky), tex(KK.armies), tex(KK.chariot)]);
        if (disposed) return;
        skyAR = (tSky.image as HTMLImageElement).width / (tSky.image as HTMLImageElement).height;
        armyAR = (tArmy.image as HTMLImageElement).width / (tArmy.image as HTMLImageElement).height;
        chariotAR = (tChariot.image as HTMLImageElement).width / (tChariot.image as HTMLImageElement).height;
        sky = plane(tSky);
        sky.renderOrder = 0;
        sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex("rgba(255,214,130,0.75)", "rgba(255,170,60,0)"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
        sun.renderOrder = 1;
        scene.add(sun);
        armies = plane(tArmy, { transparent: true });
        armies.renderOrder = 2;
        const hazeTex = softTex("rgba(255,210,150,0.35)", "rgba(255,210,150,0)");
        for (let i = 0; i < 5; i++) {
          const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, transparent: true, depthWrite: false, opacity: 0.4 }));
          s.renderOrder = 3;
          scene.add(s);
          hazes.push({ s, speed: 0.15 + Math.random() * 0.25 });
        }
        chariot = plane(tChariot, { transparent: true });
        chariot.renderOrder = 5;

        // embers between the layers
        const N = mobile ? 160 : 320;
        const pos = new Float32Array(N * 3);
        emberVel = new Float32Array(N);
        for (let i = 0; i < N; i++) {
          const z = -(3 + Math.random() * 20);
          const vh = visH(-z), vw = vh * 1.8;
          pos[i * 3] = (Math.random() - 0.5) * vw;
          pos[i * 3 + 1] = (Math.random() - 0.5) * vh;
          pos[i * 3 + 2] = z;
          emberVel[i] = 0.004 + Math.random() * 0.012;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        embers = new THREE.Points(geo, new THREE.PointsMaterial({ size: mobile ? 0.16 : 0.12, map: softTex("rgba(255,220,140,1)", "rgba(255,140,40,0)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
        embers.renderOrder = 6;
        scene.add(embers);

        layout();
        renderer.render(scene, camera);
        onReady();
        loop();
      } catch {
        /* textures failed: the 2D hero underneath stays visible */
      }
    })();

    const pointer = { x: 0, y: 0 }, cam = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); });
    io.observe(el);

    const clock = new THREE.Clock();
    function loop() {
      cancelAnimationFrame(raf);
      if (disposed || !visible || !sky) return;
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      // camera: mouse sway on desktop, slow drift on phones, dolly forward as the hero scrolls away
      const drift = mobile ? Math.sin(t * 0.25) * 0.35 : 0;
      cam.x += (pointer.x * 0.8 + drift - cam.x) * 0.04;
      cam.y += (-pointer.y * 0.35 - cam.y) * 0.04;
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      camera.position.set(cam.x, cam.y, -p * 4);
      camera.lookAt(cam.x * 0.4, cam.y * 0.4, -30);

      // chariot charges in after the opening sequence, then gallops in place
      if (chariot) {
        if (goRef.current && entranceT < 0) entranceT = t;
        let x = startX;
        if (entranceT >= 0) {
          const k = Math.min(1, (t - entranceT) / 2.6);
          const e = 1 - Math.pow(1 - k, 4);
          x = startX + (chariotTargetX - startX) * e;
        }
        chariot.position.x = x;
        chariot.position.y = chariotBaseY + Math.abs(Math.sin(t * 7)) * chariotW * 0.006;
      }
      if (sun) (sun.material as THREE.SpriteMaterial).opacity = 0.75 + Math.sin(t * 0.8) * 0.2;
      hazes.forEach(({ s, speed }) => {
        const vw = visH(D.haze) * camera.aspect;
        s.position.x -= speed * dt * 2;
        if (s.position.x < -vw) s.position.x = vw;
      });
      if (embers) {
        const a = embers.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < a.count; i++) {
          let y = a.getY(i) + emberVel[i];
          const z = a.getZ(i);
          const half = visH(-z) / 2;
          if (y > half) y = -half;
          a.setY(i, y);
          a.setX(i, a.getX(i) + Math.sin(t + i) * 0.003);
        }
        a.needsUpdate = true;
      }
      renderer.render(scene, camera);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material & { map?: THREE.Texture };
        if (mat) { mat.map?.dispose(); mat.dispose(); }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return <div ref={box} aria-hidden className="absolute inset-0" />;
}
