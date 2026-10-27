import type * as THREE_NS from "three";
import { STAGE, type Director } from "./balKrishna";

type T = typeof THREE_NS;

/**
 * Gokula at dusk, for the Damodar lila stage: the courtyard ground, rows of lit lamps, hills and village silhouettes for
 * depth, and the twin arjuna trees that fall when Krishna drags the mortar between them, with the burst of light and
 * the two liberated souls that rise from them.
 */
export type Environment = {
  group: THREE_NS.Group;
  update: (t: number, d: Director) => void;
  dispose: () => void;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function createEnvironment(THREE: T, dotTex: THREE_NS.Texture): Environment {
  const disposables: { dispose: () => void }[] = [];
  const track = <D extends { dispose: () => void }>(o: D): D => {
    disposables.push(o);
    return o;
  };
  const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!, w, h);
    const t = track(new THREE.CanvasTexture(c));
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    return t;
  };
  const group = new THREE.Group();

  // ── Ground: packed earth that fades into the night at the edges ──
  const groundTex = canvasTex(512, 256, (c, w, h) => {
    c.fillStyle = "#3a2616";
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      c.fillStyle = `rgba(${90 + Math.random() * 60},${60 + Math.random() * 40},${30 + Math.random() * 20},${Math.random() * 0.14})`;
      c.beginPath();
      c.arc(Math.random() * w, Math.random() * h, Math.random() * 3 + 0.5, 0, 6.3);
      c.fill();
    }
    // fade the edges so the ground melts into the backdrop
    c.globalCompositeOperation = "destination-in";
    const gx = c.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, "rgba(0,0,0,0)");
    gx.addColorStop(0.12, "rgba(0,0,0,1)");
    gx.addColorStop(0.88, "rgba(0,0,0,1)");
    gx.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = gx;
    c.fillRect(0, 0, w, h);
    const gy = c.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, "rgba(0,0,0,0)");
    gy.addColorStop(0.35, "rgba(0,0,0,1)");
    gy.addColorStop(1, "rgba(0,0,0,1)");
    c.globalCompositeOperation = "destination-in";
    c.fillStyle = gy;
    c.fillRect(0, 0, w, h);
  });
  groundTex.wrapS = groundTex.wrapT = THREE.ClampToEdgeWrapping;
  const ground = new THREE.Mesh(
    track(new THREE.PlaneGeometry(26, 9)),
    track(new THREE.MeshStandardMaterial({ map: groundTex, transparent: true, roughness: 1, metalness: 0, depthWrite: false }))
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(4.2, 0, -0.6);
  ground.receiveShadow = true;
  group.add(ground);

  // ── Backdrop: layered hill / village silhouettes (planes) for depth and parallax ──
  const silhouette = (colorTop: string, colorBottom: string, seed: number, hills: number, withHuts: boolean) =>
    canvasTex(1024, 256, (c, w, h) => {
      let s = seed;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, colorTop);
      g.addColorStop(1, colorBottom);
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(0, h);
      let y = h * 0.55;
      for (let x = 0; x <= w; x += 16) {
        y = h * 0.5 + Math.sin(x / (w / hills) + seed) * h * 0.1 + Math.sin(x / 37) * h * 0.02;
        c.lineTo(x, y);
      }
      c.lineTo(w, h);
      c.closePath();
      c.fill();
      if (withHuts) {
        for (let i = 0; i < 6; i++) {
          const x = 80 + rnd() * (w - 160);
          const baseY = h * 0.52 + Math.sin(x / (w / hills) + seed) * h * 0.1 + 4;
          c.fillStyle = colorBottom;
          c.fillRect(x - 22, baseY - 20, 44, 20);
          c.beginPath();
          c.moveTo(x - 30, baseY - 20);
          c.lineTo(x, baseY - 46);
          c.lineTo(x + 30, baseY - 20);
          c.closePath();
          c.fill();
        }
        for (let i = 0; i < 9; i++) {
          const x = rnd() * w;
          const baseY = h * 0.52 + Math.sin(x / (w / hills) + seed) * h * 0.1 + 6;
          c.fillStyle = colorBottom;
          c.beginPath();
          c.arc(x, baseY - 30, 20 + rnd() * 12, 0, 6.3);
          c.fill();
          c.fillRect(x - 3, baseY - 30, 6, 30);
        }
      }
    });
  const bgFar = new THREE.Mesh(
    track(new THREE.PlaneGeometry(60, 15)),
    track(new THREE.MeshBasicMaterial({ map: silhouette("#16266e", "#0a1442", 3, 3, false), transparent: true, depthWrite: false, fog: false }))
  );
  bgFar.position.set(4, 5.5, -16);
  group.add(bgFar);
  const bgNear = new THREE.Mesh(
    track(new THREE.PlaneGeometry(44, 11)),
    track(new THREE.MeshBasicMaterial({ map: silhouette("#0c1a50", "#081038", 11, 5, true), transparent: true, depthWrite: false, fog: false }))
  );
  bgNear.position.set(4, 3.1, -9);
  group.add(bgNear);

  // ── Twin arjuna trees ──
  const barkH = (() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#3b2a20";
    g.fillRect(0, 0, 128, 256);
    for (let i = 0; i < 70; i++) {
      g.strokeStyle = `rgba(${20 + Math.random() * 40},${14 + Math.random() * 20},${10},${0.25 + Math.random() * 0.4})`;
      g.lineWidth = 1 + Math.random() * 3;
      g.beginPath();
      const x = Math.random() * 128;
      g.moveTo(x, 0);
      g.bezierCurveTo(x + 8, 80, x - 8, 170, x + 4, 256);
      g.stroke();
    }
    const t = track(new THREE.CanvasTexture(c));
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 3);
    return t;
  })();
  const barkMat = track(new THREE.MeshStandardMaterial({ map: barkH, roughness: 0.95, color: 0xcfb8a8 }));
  const leafMat = track(new THREE.MeshStandardMaterial({ color: 0x2c7a4c, roughness: 0.8 }));
  const blossomMat = track(new THREE.MeshStandardMaterial({ color: 0xf3f0e4, roughness: 0.6, emissive: 0x777766, emissiveIntensity: 0.2 }));
  const trunkGeo = track(new THREE.CylinderGeometry(0.24, 0.34, 7.2, 20, 1));
  const flareGeo = track(new THREE.CylinderGeometry(0.34, 0.55, 0.5, 20, 1));
  const branchGeo = track(new THREE.CylinderGeometry(0.06, 0.12, 1.5, 8, 1));
  const leafGeo = track(new THREE.SphereGeometry(0.62, 14, 10));
  const blossomGeo = track(new THREE.SphereGeometry(0.06, 8, 6));
  const makeTree = (x: number, seed: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0, -1.55);
    const trunk = new THREE.Mesh(trunkGeo, barkMat);
    trunk.position.y = 3.6;
    trunk.castShadow = true;
    pivot.add(trunk);
    const flare = new THREE.Mesh(flareGeo, barkMat);
    flare.position.y = 0.25;
    pivot.add(flare);
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(branchGeo, barkMat);
      const a = (i / 4) * Math.PI * 2 + rnd();
      b.position.set(Math.cos(a) * 0.4, 6 + rnd() * 0.8, Math.sin(a) * 0.4);
      b.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9);
      pivot.add(b);
    }
    const foliage = new THREE.InstancedMesh(leafGeo, leafMat, 22);
    const blossoms = new THREE.InstancedMesh(blossomGeo, blossomMat, 46);
    const dm = new THREE.Object3D();
    for (let i = 0; i < 22; i++) {
      const a = rnd() * 6.28;
      const r = Math.sqrt(rnd()) * 1.5;
      dm.position.set(Math.cos(a) * r, 6.2 + rnd() * 2.1, Math.sin(a) * r * 0.8);
      dm.scale.setScalar(0.7 + rnd() * 0.8);
      dm.updateMatrix();
      foliage.setMatrixAt(i, dm.matrix);
    }
    for (let i = 0; i < 46; i++) {
      const a = rnd() * 6.28;
      const r = 0.4 + rnd() * 1.7;
      dm.position.set(Math.cos(a) * r, 6.0 + rnd() * 2.4, Math.sin(a) * r * 0.85 + 0.3);
      dm.scale.setScalar(0.8 + rnd());
      dm.updateMatrix();
      blossoms.setMatrixAt(i, dm.matrix);
    }
    foliage.castShadow = true;
    pivot.add(foliage, blossoms);
    group.add(pivot);
    return { pivot, foliage, blossoms };
  };
  const treeA = makeTree(STAGE.treeL, 5);
  const treeB = makeTree(STAGE.treeR, 9);

  // ── Lamps along the courtyard: warm glows that flicker ──
  const glowMat = (opacity: number) =>
    track(new THREE.SpriteMaterial({ map: dotTex, color: 0xffa646, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity, toneMapped: false, fog: false }));
  const bowlGeo = track(new THREE.LatheGeometry([[0, 0], [0.12, 0], [0.2, 0.05], [0.22, 0.1], [0.17, 0.09], [0, 0.06]].map(([x, y]) => new THREE.Vector2(x, y)), 16));
  const bowlMat = track(new THREE.MeshStandardMaterial({ color: 0xc98a12, metalness: 1, roughness: 0.3 }));
  const lamps: { glow: THREE_NS.Sprite; flame: THREE_NS.Sprite; ph: number }[] = [];
  const lampSpots: [number, number][] = [[-2.6, 1.6], [-1.2, 2.3], [0.2, 2.6], [1.8, 2.1], [3.2, 1.4], [4.6, 2.2], [5.9, 1.2], [7.2, 2.4], [8.6, 1.5], [9.8, 2.0], [-3.2, -1.5], [3.0, -2.0], [9.2, -1.6]];
  const flameMat = track(new THREE.SpriteMaterial({ map: dotTex, color: 0xffd27a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false, fog: false }));
  const bowls = new THREE.InstancedMesh(bowlGeo, bowlMat, lampSpots.length);
  const dm2 = new THREE.Object3D();
  lampSpots.forEach(([x, z], i) => {
    dm2.position.set(x, 0, z);
    dm2.scale.setScalar(0.8);
    dm2.updateMatrix();
    bowls.setMatrixAt(i, dm2.matrix);
    const glow = new THREE.Sprite(glowMat(0.35));
    glow.position.set(x, 0.25, z);
    glow.scale.setScalar(1.8);
    const flame = new THREE.Sprite(flameMat);
    flame.position.set(x, 0.16, z);
    flame.scale.set(0.14, 0.26, 1);
    group.add(glow, flame);
    lamps.push({ glow, flame, ph: i * 1.7 });
  });
  group.add(bowls);

  // ── The burst of light and the two souls ──
  // light shaft: two crossed planes with a soft, glowing fall-off (reads as volume from any side)
  const colMat = track(
    new THREE.MeshBasicMaterial({
      map: canvasTex(128, 256, (c, w, h) => {
        const img = c.createImageData(w, h);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const u = Math.abs(x / (w - 1) - 0.5) * 2;
            const v = y / (h - 1); // 0 top, 1 bottom
            const a = Math.pow(1 - u, 1.6) * Math.pow(v, 0.8) * 0.8;
            const i = (y * w + x) * 4;
            img.data[i] = 255;
            img.data[i + 1] = 214 - (1 - v) * 40;
            img.data[i + 2] = 120 - (1 - v) * 40;
            img.data[i + 3] = a * 255;
          }
        }
        c.putImageData(img, 0, 0);
      }),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
      opacity: 0,
      fog: false,
    })
  );
  const column = new THREE.Group();
  const shaftGeo = track(new THREE.PlaneGeometry(5.4, 10));
  const shaftA = new THREE.Mesh(shaftGeo, colMat);
  column.add(shaftA);
  column.position.set((STAGE.treeL + STAGE.treeR) / 2, 4.9, -1.1);
  group.add(column);
  const ringMat = track(new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }));
  const ring = new THREE.Mesh(track(new THREE.TorusGeometry(1, 0.03, 8, 64)), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set((STAGE.treeL + STAGE.treeR) / 2, 0.08, -0.9);
  group.add(ring);

  const orbs = [0, 1].map((i) => {
    const halo = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: dotTex, color: 0xffd36b, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, toneMapped: false, fog: false })));
    const core = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: dotTex, color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, toneMapped: false, fog: false })));
    group.add(halo, core);
    return { halo, core, x: i === 0 ? STAGE.treeL : STAGE.treeR };
  });
  const SPARKS = 60;
  const sparkPos = new Float32Array(SPARKS * 3);
  const sparkSeed = Array.from({ length: SPARKS }, () => ({ a: Math.random() * 6.28, r: Math.random() * 1.2, v: 0.5 + Math.random() * 1.2, o: Math.random() * 8 }));
  const sparkGeo = track(new THREE.BufferGeometry());
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = track(new THREE.PointsMaterial({ size: 0.12, map: dotTex, color: 0xffe08a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }));
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false;
  group.add(sparks);

  const update = (t: number, d: Director) => {
    // lamps flicker
    for (const l of lamps) {
      const f = 1 + Math.sin(t * 7.3 + l.ph) * 0.12 + Math.sin(t * 13.1 + l.ph * 2) * 0.07;
      l.flame.scale.set(0.14 * f, 0.26 * (0.9 + (f - 1) * 1.5), 1);
      l.glow.material.opacity = 0.32 * (0.9 + (f - 1) * 1.2);
    }
    // the trees fall backwards, away from the camera, one just after the other
    const fa = clamp01(d.fall);
    const fb = clamp01((d.fall - 0.12) / 0.88);
    const ease = (x: number) => x * x * (1.2 + x * 0.8);
    // they crash down away from each other, sideways to the camera so the fall can be seen
    // the lying trunks rest ON the ground (their axis is lifted by the trunk radius), never sunk into it
    treeA.pivot.position.y = Math.min(1, ease(fa)) * 0.15;
    treeB.pivot.position.y = Math.min(1, ease(fb)) * 0.15;
    treeA.pivot.rotation.z = ease(fa) * 1.2;
    treeB.pivot.rotation.z = -ease(fb) * 1.2;
    treeA.pivot.rotation.x = -ease(fa) * 0.18;
    treeB.pivot.rotation.x = -ease(fb) * 0.12;
    const fade = 1 - clamp01((d.fall - 0.7) / 0.3) * 0.0;
    void fade;
    // light
    colMat.opacity = d.burst * (0.85 + Math.sin(t * 3) * 0.08);
    column.scale.set(1 + d.burst * 0.3, 1, 1 + d.burst * 0.3);
    ringMat.opacity = d.burst * 0.55 * (1 - clamp01((d.orbs - 0.4) / 0.6));
    ring.scale.setScalar(0.5 + d.burst * 2.4);
    sparkMat.opacity = d.burst * 0.9;
    for (let i = 0; i < SPARKS; i++) {
      const sd = sparkSeed[i];
      const h = (sd.o + t * sd.v) % 8;
      sparkPos[i * 3] = (STAGE.treeL + STAGE.treeR) / 2 + Math.cos(sd.a + t * 0.4) * sd.r;
      sparkPos[i * 3 + 1] = h;
      sparkPos[i * 3 + 2] = -1.0 + Math.sin(sd.a + t * 0.4) * sd.r * 0.6;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    // the two souls rise, bow and drift up
    orbs.forEach((o, i) => {
      const rise = d.orbs;
      const y = 1.0 + rise * 5.2 + Math.sin(t * 1.4 + i) * 0.1;
      const x = o.x + (i === 0 ? -1 : 1) * rise * 0.6 + Math.sin(t * 0.9 + i * 2) * 0.15;
      o.halo.position.set(x, y, -0.5);
      o.core.position.set(x, y, -0.45);
      o.halo.scale.setScalar(1.3 + Math.sin(t * 2 + i) * 0.12);
      o.core.scale.setScalar(0.55);
      (o.halo.material as THREE_NS.SpriteMaterial).opacity = clamp01(d.orbs * 1.5) * 0.45;
      (o.core.material as THREE_NS.SpriteMaterial).opacity = clamp01(d.orbs * 1.5);
    });
  };

  const dispose = () => {
    disposables.forEach((x) => x.dispose());
  };
  return { group, update, dispose };
}
