import type * as THREE_NS from "three";

type T = typeof THREE_NS;

/**
 * Bala Krishna of the Damodar lila, modelled from primitives: the little blue-skinned Lord, bound at the belly by Mother
 * Yashoda's rope to the wooden grinding mortar (ukhala), with the butter pot that got Him into trouble beside Him.
 *
 * Pure geometry + a small animation rig (breathing, blinking, head sway, tugging at the rope). No external assets.
 */
export type FigureControls = {
  group: THREE_NS.Group;
  /** t seconds, tug 0..1 (how hard He pulls), look -1..1 (head turn). */
  update: (t: number, tug: number, look: number) => void;
  dispose: () => void;
};

export function createDamodar(THREE: T): FigureControls {
  const disposables: { dispose: () => void }[] = [];
  const track = <D extends { dispose: () => void }>(o: D): D => {
    disposables.push(o);
    return o;
  };
  const std = (color: number, o: Partial<THREE_NS.MeshStandardMaterialParameters> = {}) =>
    track(new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...o }));
  const mesh = (g: THREE_NS.BufferGeometry, m: THREE_NS.Material, parent: THREE_NS.Object3D, x = 0, y = 0, z = 0) => {
    track(g);
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };
  const tex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!);
    const t = track(new THREE.CanvasTexture(c));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };

  const root = new THREE.Group();

  // ── Materials ─────────────────────────────────────────────────────
  const skin = std(0x2a50c4, { roughness: 0.48, emissive: 0x081a5c, emissiveIntensity: 0.12 });
  const skinLight = std(0x4670e0, { roughness: 0.48, emissive: 0x081a5c, emissiveIntensity: 0.1 });
  const hairMat = std(0x0c1030, { roughness: 0.7 });
  const gold = std(0xe9b32c, { metalness: 1, roughness: 0.26 });
  const dhoti = std(0xffbf00, { roughness: 0.7, side: THREE.DoubleSide, emissive: 0x5a3c00, emissiveIntensity: 0.08 });
  const white = std(0xffffff, { roughness: 0.3 });
  const black = std(0x05060f, { roughness: 0.25 });
  const pearl = std(0xfff6e8, { roughness: 0.25, metalness: 0.2 });
  const ropeMat = std(0xa8702c, { roughness: 0.9 });

  // ── Krishna ───────────────────────────────────────────────────────
  const kr = new THREE.Group();
  root.add(kr);

  // torso + belly (the rope goes round the belly: Damodara = "rope round the belly")
  const torso = mesh(new THREE.SphereGeometry(0.5, 40, 28), skin, kr, 0, 0.98, 0);
  torso.scale.set(1, 1.02, 0.9);
  const belly = mesh(new THREE.SphereGeometry(0.46, 40, 28), skin, kr, 0, 0.68, 0.1);
  belly.scale.set(1.04, 0.9, 0.92);

  // dhoti: a short skirt of yellow cloth + a knot
  const dh = track(
    new THREE.LatheGeometry(
      [[0.5, 0.78], [0.58, 0.62], [0.7, 0.4], [0.74, 0.2], [0.68, 0.1]].map(([x, y]) => new THREE.Vector2(x, y)),
      40
    )
  );
  const skirt = new THREE.Mesh(dh, dhoti);
  skirt.scale.set(1, 1, 0.92);
  kr.add(skirt);
  const knotCloth = mesh(new THREE.SphereGeometry(0.1, 16, 12), dhoti, kr, 0.18, 0.66, 0.5);
  knotCloth.scale.set(1.3, 0.8, 0.8);

  // gold waist band + the rope wound round the belly (twice) with a knot
  const band = mesh(new THREE.TorusGeometry(0.58, 0.035, 12, 64), gold, kr, 0, 0.56, 0.02);
  band.rotation.x = Math.PI / 2;
  band.scale.set(1, 0.93, 1);
  for (const [y, r] of [[0.86, 0.505], [0.78, 0.545]] as const) {
    const loop = mesh(new THREE.TorusGeometry(r, 0.034, 10, 64), ropeMat, kr, 0, y, 0.06);
    loop.rotation.x = Math.PI / 2;
    loop.scale.set(1, 0.9, 1);
  }
  const ropeKnot = mesh(new THREE.SphereGeometry(0.07, 14, 10), ropeMat, kr, -0.5, 0.82, -0.12);

  // legs: sitting, knees out, little feet showing
  const thigh = (side: 1 | -1) => {
    const g = new THREE.Group();
    g.position.set(side * 0.3, 0.22, 0.28);
    g.rotation.set(0, side * 0.5, 0);
    kr.add(g);
    const up = mesh(new THREE.CapsuleGeometry(0.17, 0.42, 8, 16), skin, g, 0, 0, 0.18);
    up.rotation.x = Math.PI / 2;
    const foot = mesh(new THREE.SphereGeometry(0.17, 20, 14), skinLight, g, 0, 0.1, 0.52);
    foot.scale.set(0.9, 0.7, 1.1);
    const anklet = mesh(new THREE.TorusGeometry(0.13, 0.018, 8, 24), gold, g, 0, 0.1, 0.4);
    anklet.rotation.x = Math.PI / 2 - 0.4;
    return g;
  };
  thigh(1);
  thigh(-1);

  // arms: the right hand wipes an eye, the left pulls at the rope
  const makeArm = (side: 1 | -1) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.46, 1.2, 0.04);
    kr.add(shoulder);
    const upper = new THREE.Group();
    shoulder.add(upper);
    mesh(new THREE.CapsuleGeometry(0.125, 0.3, 8, 14), skin, upper, 0, -0.2, 0);
    const fore = new THREE.Group();
    fore.position.set(0, -0.42, 0);
    upper.add(fore);
    mesh(new THREE.CapsuleGeometry(0.11, 0.26, 8, 14), skin, fore, 0, -0.16, 0);
    mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 20), gold, fore, 0, -0.02, 0).rotation.x = Math.PI / 2;
    const hand = mesh(new THREE.SphereGeometry(0.115, 20, 14), skinLight, fore, 0, -0.36, 0);
    for (let i = 0; i < 3; i++) mesh(new THREE.SphereGeometry(0.045, 10, 8), skinLight, hand, (i - 1) * 0.07, -0.08, 0.04);
    return { shoulder, upper, fore };
  };
  const armR = makeArm(1);
  const armL = makeArm(-1);

  // head
  const head = new THREE.Group();
  head.position.set(0, 1.78, 0.05);
  kr.add(head);
  const skull = mesh(new THREE.SphereGeometry(0.46, 44, 32), skin, head);
  skull.scale.set(1, 0.97, 0.98);
  for (const s of [1, -1]) {
    mesh(new THREE.SphereGeometry(0.13, 20, 16), skinLight, head, s * 0.28, -0.12, 0.3); // cheeks
    mesh(new THREE.SphereGeometry(0.075, 14, 12), skin, head, s * 0.46, 0.0, 0.0).scale.set(0.6, 1, 0.8); // ears
    mesh(new THREE.SphereGeometry(0.03, 10, 8), gold, head, s * 0.47, -0.1, 0.0); // earrings
  }
  // hair: cap + curls round the face
  const cap = mesh(new THREE.SphereGeometry(0.475, 40, 24, 0, Math.PI * 2, 0, 1.3), hairMat, head, 0, 0.0, -0.01);
  cap.rotation.x = -0.12;
  for (let i = 0; i < 13; i++) {
    const a = -1.15 + (i / 12) * 2.3;
    const c = mesh(new THREE.SphereGeometry(0.075 + (i % 2) * 0.012, 12, 10), hairMat, head, Math.sin(a) * 0.43, 0.2 + Math.cos(a * 1.4) * 0.05 + (i % 2) * 0.04, 0.2 + Math.cos(a) * 0.2);
    c.scale.set(1, 1.15, 1);
  }
  const knot = mesh(new THREE.SphereGeometry(0.15, 18, 14), hairMat, head, 0, 0.5, -0.05);
  knot.scale.set(1, 0.85, 1);
  const crown = mesh(new THREE.TorusGeometry(0.47, 0.026, 10, 56), gold, head, 0, 0.25, -0.01);
  crown.rotation.set(Math.PI / 2 - 0.12, 0, 0);
  mesh(new THREE.SphereGeometry(0.045, 12, 10), gold, head, 0, 0.3, 0.42);

  // peacock feather: curved stem + eye
  const featherEye = tex(256, 512, (c) => {
    c.clearRect(0, 0, 256, 512);
    const g = c.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#2fa86a");
    g.addColorStop(1, "#1d7a52");
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(128, 250, 118, 240, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#e6b72c";
    c.beginPath();
    c.ellipse(128, 230, 74, 120, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#1b4fb8";
    c.beginPath();
    c.ellipse(128, 226, 52, 86, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#0a8f8a";
    c.beginPath();
    c.ellipse(128, 222, 30, 52, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#082a66";
    c.beginPath();
    c.ellipse(128, 216, 14, 26, 0, 0, Math.PI * 2);
    c.fill();
  });
  const feather = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.34, 0.68)),
    track(new THREE.MeshBasicMaterial({ map: featherEye, transparent: true, side: THREE.DoubleSide, alphaTest: 0.05, toneMapped: false }))
  );
  feather.position.set(0.06, 0.98, -0.12);
  feather.rotation.set(-0.15, 0, -0.28);
  head.add(feather);
  const stemCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.45, -0.04), new THREE.Vector3(0.02, 0.6, -0.1), new THREE.Vector3(0.05, 0.72, -0.12)]);
  mesh(new THREE.TubeGeometry(stemCurve, 8, 0.012, 6), std(0x1d7a52), head);

  // face: eyes (with blink), brows, nose, smile, tilak
  const eyeGroups: THREE_NS.Group[] = [];
  const pupils: THREE_NS.Mesh[] = [];
  for (const s of [1, -1]) {
    const eg = new THREE.Group();
    eg.position.set(s * 0.18, 0.05, 0.4);
    head.add(eg);
    const ball = mesh(new THREE.SphereGeometry(0.135, 24, 18), white, eg);
    ball.scale.set(1, 1.12, 0.45);
    const pupil = mesh(new THREE.SphereGeometry(0.085, 18, 14), black, eg, 0, -0.01, 0.03);
    pupil.scale.set(1, 1.1, 0.5);
    mesh(new THREE.SphereGeometry(0.027, 8, 8), white, eg, 0.03, 0.045, 0.05);
    const lid = mesh(new THREE.TorusGeometry(0.14, 0.014, 6, 20, Math.PI), black, eg, 0, 0.03, 0.02);
    lid.rotation.z = 0;
    eyeGroups.push(eg);
    pupils.push(pupil);
    const brow = mesh(new THREE.TorusGeometry(0.11, 0.016, 6, 16, Math.PI * 0.7), hairMat, head, s * 0.19, 0.22, 0.4);
    brow.rotation.z = s * -0.15 + 0.5 * (s === 1 ? 1 : -1) * 0.0;
  }
  mesh(new THREE.SphereGeometry(0.04, 12, 10), skinLight, head, 0, -0.05, 0.45);
  const smile = mesh(new THREE.TorusGeometry(0.085, 0.014, 8, 20, Math.PI * 0.85), black, head, 0, -0.18, 0.41);
  smile.rotation.set(0, 0, Math.PI + Math.PI * 0.075);
  const tilak = mesh(new THREE.CapsuleGeometry(0.012, 0.07, 4, 8), std(0xfff2b0, { emissive: 0xaa8800, emissiveIntensity: 0.4 }), head, 0, 0.2, 0.455);
  tilak.scale.set(1, 1, 0.6);

  // necklaces: a gold collar and strings of pearls that follow the chest
  const neck = mesh(new THREE.TorusGeometry(0.33, 0.032, 10, 48), gold, kr, 0, 1.33, 0.06);
  neck.rotation.x = Math.PI / 2 - 0.25;
  for (const [drop, n] of [[0.1, 17], [0.22, 15]] as const) {
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const x = (u - 0.5) * 0.78;
      const y = 1.22 - Math.sin(u * Math.PI) * drop;
      const rz = 0.405 * Math.sqrt(Math.max(0.02, 1 - (x / 0.46) ** 2));
      mesh(new THREE.SphereGeometry(0.03, 10, 8), pearl, kr, x, y, rz + 0.025);
    }
  }
  mesh(new THREE.SphereGeometry(0.06, 14, 10), gold, kr, 0, 0.95, 0.43); // pendant

  // ── Mortar (ukhala) with iron bands ───────────────────────────────
  const mortar = new THREE.Group();
  mortar.position.set(-1.55, 0, -0.55);
  root.add(mortar);
  const woodTex = tex(256, 256, (c) => {
    c.fillStyle = "#7a4a22";
    c.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) {
      c.strokeStyle = `rgba(${40 + (i % 5) * 8},${22 + (i % 4) * 6},8,${0.12 + (i % 3) * 0.06})`;
      c.lineWidth = 1 + (i % 3);
      c.beginPath();
      const x = (i * 37) % 256;
      c.moveTo(x, 0);
      c.bezierCurveTo(x + 14, 80, x - 12, 170, x + 6, 256);
      c.stroke();
    }
  });
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.repeat.set(3, 1);
  const wood = std(0xffffff, { map: woodTex, roughness: 0.85 });
  const mortarGeo = track(
    new THREE.LatheGeometry(
      [[0.0, 0.0], [0.52, 0.0], [0.62, 0.04], [0.58, 0.3], [0.46, 0.55], [0.44, 0.7], [0.58, 0.92], [0.66, 1.0], [0.6, 1.04], [0.4, 0.98], [0.34, 0.8], [0.0, 0.76]].map(([x, y]) => new THREE.Vector2(x, y)),
      48
    )
  );
  const mortarMesh = new THREE.Mesh(mortarGeo, wood);
  mortar.add(mortarMesh);
  const iron = std(0x2a2623, { metalness: 0.8, roughness: 0.45 });
  for (const [y, r] of [[0.1, 0.6], [0.88, 0.62]] as const) {
    const ring = mesh(new THREE.TorusGeometry(r, 0.025, 8, 48), iron, mortar, 0, y, 0);
    ring.rotation.x = Math.PI / 2;
  }
  const mortarKnot = mesh(new THREE.SphereGeometry(0.085, 14, 10), ropeMat, mortar, 0.5, 0.52, 0.28);

  // ── Butter pot (the cause of the trouble) ─────────────────────────
  const pot = new THREE.Group();
  pot.position.set(0.95, 0.0, 0.8);
  root.add(pot);
  const terracotta = std(0xb5532d, { roughness: 0.8 });
  mesh(new THREE.SphereGeometry(0.3, 28, 20), terracotta, pot, 0, 0.3, 0).scale.set(1, 0.88, 1);
  mesh(new THREE.TorusGeometry(0.17, 0.04, 10, 28), terracotta, pot, 0, 0.55, 0).rotation.x = Math.PI / 2;
  const butter = mesh(new THREE.SphereGeometry(0.17, 20, 14), std(0xfff0b8, { roughness: 0.4 }), pot, 0, 0.55, 0);
  butter.scale.set(1, 0.6, 1);

  // ── Rope: hip -> mortar ───────────────────────────────────────────
  const ropeHolder = new THREE.Group();
  root.add(ropeHolder);
  let ropeMesh: THREE_NS.Mesh | null = null;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const mid1 = new THREE.Vector3();
  const mid2 = new THREE.Vector3();
  let lastTension = -1;
  const buildRope = (tension: number) => {
    kr.updateWorldMatrix(true, false);
    mortar.updateWorldMatrix(true, false);
    ropeKnot.getWorldPosition(a);
    mortarKnot.getWorldPosition(b);
    root.worldToLocal(a);
    root.worldToLocal(b);
    const sag = (1 - tension) * 0.38;
    mid1.lerpVectors(a, b, 0.33);
    mid2.lerpVectors(a, b, 0.66);
    mid1.y -= sag + 0.05;
    mid2.y -= sag;
    const curve = new THREE.CatmullRomCurve3([a.clone(), mid1.clone(), mid2.clone(), b.clone()]);
    const geo = new THREE.TubeGeometry(curve, 28, 0.034, 7);
    if (ropeMesh) {
      ropeMesh.geometry.dispose();
      ropeMesh.geometry = geo;
    } else {
      ropeMesh = new THREE.Mesh(geo, ropeMat);
      ropeHolder.add(ropeMesh);
    }
  };

  // ── Pose / animation ──────────────────────────────────────────────
  armR.upper.rotation.set(0.25, 0, 0.75);
  armR.fore.rotation.set(-2.05, 0, 0);
  const base = { kx: 0, mz: 0 };

  const update = (t: number, tug: number, look: number) => {
    // breathing
    const br = 1 + Math.sin(t * 1.7) * 0.012;
    torso.scale.set(br, 1.02 * br, 0.9);
    belly.scale.set(1.04 * br, 0.9 * br, 0.92 * br);
    // He leans away from the mortar when pulling, in little bursts
    const burst = Math.max(0, Math.sin(t * 1.35)) ** 2;
    const pull = clamp01(tug) * (0.35 + 0.65 * burst);
    kr.position.x = base.kx + pull * 0.18;
    kr.rotation.z = -pull * 0.1;
    kr.rotation.y = 0.35 + look * 0.5;
    mortar.rotation.z = Math.sin(t * 22) * 0.012 * pull;
    mortar.position.x = -1.55 + pull * 0.1;
    // head
    head.rotation.z = Math.sin(t * 0.9) * 0.06 - pull * 0.08;
    head.rotation.y = Math.sin(t * 0.6) * 0.12 - 0.25 + look * 0.3;
    head.rotation.x = 0.1 + Math.sin(t * 0.8) * 0.03;
    feather.rotation.z = -0.28 + Math.sin(t * 1.3) * 0.05;
    // blink every ~4s
    const phase = (t % 4.2) / 4.2;
    const blink = phase > 0.96 ? 1 - Math.abs((phase - 0.98) / 0.02) : 0;
    eyeGroups.forEach((g) => g.scale.set(1, 1 - 0.9 * clamp01(blink), 1));
    pupils.forEach((p) => p.position.set(-0.012, -0.03, 0.03));
    // arms
    armL.upper.rotation.set(0.1 + pull * 0.2, 0, -0.85 - pull * 0.2);
    armL.fore.rotation.set(-0.5 - pull * 0.4, -0.5, 0);
    armR.upper.rotation.z = 0.75 + Math.sin(t * 2.1) * 0.04;
    // rope follows
    const tension = 0.35 + pull * 0.65;
    if (Math.abs(tension - lastTension) > 0.01) {
      lastTension = tension;
      buildRope(tension);
    }
  };
  buildRope(0.4);
  update(0, 0, 0);

  const dispose = () => {
    ropeMesh?.geometry.dispose();
    disposables.forEach((d) => d.dispose());
  };

  return { group: root, update, dispose };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
