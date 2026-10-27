import type * as THREE_NS from "three";
import { canvasTex, clamp, lerp } from "./diwaliFx";

type T = typeof THREE_NS;

const bowlProfile = (THREE: T) =>
  [[0, -0.02], [0.3, 0], [0.6, 0.07], [0.86, 0.22], [1.0, 0.45], [1.05, 0.6], [0.99, 0.63], [0.9, 0.54], [0.72, 0.36], [0.42, 0.26], [0, 0.24]].map(([x, y]) => new THREE.Vector2(x, y));

export type Mats = { gold: THREE_NS.Material; oil: THREE_NS.MeshStandardMaterial; flameTex: THREE_NS.Texture; dotTex: THREE_NS.Texture };

/** A brass diya with a flickering flame. `set(t, k)`: k 0..1 is how lit it is. */
export function createDiya(THREE: T, m: Mats) {
  const group = new THREE.Group();
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(bowlProfile(THREE), 64), m.gold);
  group.add(bowl);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.035, 12, 80), m.gold);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.6;
  group.add(rim);
  const oil = new THREE.Mesh(new THREE.CircleGeometry(0.7, 40), m.oil);
  oil.rotation.x = -Math.PI / 2;
  oil.position.y = 0.3;
  group.add(oil);
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: m.flameTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false, fog: false }));
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: m.dotTex, color: 0xff9a2e, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, toneMapped: false, fog: false }));
  core.position.set(0, 0.98, 0.05);
  glow.position.set(0, 0.92, -0.05);
  group.add(glow, core);
  const set = (t: number, k: number, phase = 0) => {
    const f = 1 + 0.07 * Math.sin(t * 9.1 + phase) + 0.045 * Math.sin(t * 17.3 + phase * 1.7) + 0.03 * Math.sin(t * 31 + phase * 2.3);
    core.scale.set(0.78 * f * k, 1.55 * (1 + (f - 1) * 1.4) * k, 1);
    core.position.x = 0.025 * Math.sin(t * 5.2 + phase);
    glow.scale.setScalar(3.1 * (0.96 + (f - 1) * 0.8) * k);
    (glow.material as THREE_NS.SpriteMaterial).opacity = 0.55 * k;
  };
  const dispose = () => {
    bowl.geometry.dispose();
    rim.geometry.dispose();
    oil.geometry.dispose();
    (core.material as THREE_NS.Material).dispose();
    (glow.material as THREE_NS.Material).dispose();
  };
  return { group, set, dispose };
}

/** A blooming lotus (one draw call). `bloom` 0 closed .. 1 open. */
export function createLotus(THREE: T) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.58, 0.25, 0.5, 1.0, 0, 1.55);
  shape.bezierCurveTo(-0.5, 1.0, -0.58, 0.25, 0, 0);
  const geo = new THREE.ShapeGeometry(shape, 14);
  const pos = geo.attributes.position;
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
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.55, emissive: 0x7a2a4a, emissiveIntensity: 0.22 });
  const rings = [
    { n: 10, elev: 0.14, scale: 1.05, off: 0 },
    { n: 10, elev: 0.5, scale: 0.92, off: 0.5 },
    { n: 8, elev: 0.9, scale: 0.74, off: 0 },
    { n: 6, elev: 1.2, scale: 0.52, off: 0.5 },
  ];
  const slots: { angle: number; elev: number; scale: number }[] = [];
  for (const r of rings) for (let i = 0; i < r.n; i++) slots.push({ angle: ((i + r.off) / r.n) * Math.PI * 2, elev: r.elev, scale: r.scale });
  const mesh = new THREE.InstancedMesh(geo, mat, slots.length);
  mesh.frustumCulled = false;
  const pd = new THREE.Object3D();
  const qd = new THREE.Object3D();
  const m4 = new THREE.Matrix4();
  let last = -1;
  const set = (bloom: number) => {
    if (Math.abs(bloom - last) < 0.003) return;
    last = bloom;
    slots.forEach((s, i) => {
      pd.rotation.set(0, s.angle, 0);
      pd.updateMatrix();
      qd.rotation.set(Math.PI / 2 - lerp(1.5, s.elev, bloom), 0, 0);
      qd.position.set(0, 0, 0.12);
      qd.scale.setScalar(s.scale);
      qd.updateMatrix();
      m4.multiplyMatrices(pd.matrix, qd.matrix);
      mesh.setMatrixAt(i, m4);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  set(0);
  const dispose = () => {
    geo.dispose();
    mat.dispose();
    mesh.dispose();
  };
  return { mesh, set, dispose };
}

/** Rings of small diyas on the ground. `lit` (0..1) lights them one after another around each ring. */
export function createDiyaField(THREE: T, m: Mats, rings: { r: number; n: number; start: number }[]) {
  const positions: [number, number][] = [];
  const order: number[] = [];
  rings.forEach((ring) => {
    for (let i = 0; i < ring.n; i++) {
      const a = ring.start + (i / ring.n) * Math.PI * 2;
      positions.push([Math.cos(a) * ring.r, Math.sin(a) * ring.r * 0.62]);
      order.push(order.length);
    }
  });
  const N = positions.length;
  const bowlGeo = new THREE.LatheGeometry(bowlProfile(THREE), 20);
  const bowls = new THREE.InstancedMesh(bowlGeo, m.gold, N);
  const d = new THREE.Object3D();
  positions.forEach(([x, z], i) => {
    d.position.set(x, 0, z);
    d.scale.setScalar(0.17);
    d.updateMatrix();
    bowls.setMatrixAt(i, d.matrix);
  });
  const fp = new Float32Array(N * 3);
  const fc = new Float32Array(N * 3);
  const gp = new Float32Array(N * 3);
  const gc = new Float32Array(N * 3);
  positions.forEach(([x, z], i) => {
    fp.set([x, 0.2, z], i * 3);
    gp.set([x, 0.22, z], i * 3);
  });
  const flameGeo = new THREE.BufferGeometry();
  flameGeo.setAttribute("position", new THREE.BufferAttribute(fp, 3));
  flameGeo.setAttribute("color", new THREE.BufferAttribute(fc, 3));
  const glowGeo = new THREE.BufferGeometry();
  glowGeo.setAttribute("position", new THREE.BufferAttribute(gp, 3));
  glowGeo.setAttribute("color", new THREE.BufferAttribute(gc, 3));
  const common = { map: m.dotTex, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false } as const;
  const flames = new THREE.Points(flameGeo, new THREE.PointsMaterial({ ...common, size: 0.3, sizeAttenuation: true }));
  const glows = new THREE.Points(glowGeo, new THREE.PointsMaterial({ ...common, size: 1.3, sizeAttenuation: true, opacity: 0.55 }));
  flames.frustumCulled = glows.frustumCulled = false;
  const group = new THREE.Group();
  group.add(bowls, glows, flames);
  const fl = new THREE.Color(0xffd27a);
  const gl = new THREE.Color(0xff8a2a);
  const set = (t: number, lit: number) => {
    for (let i = 0; i < N; i++) {
      const on = clamp(lit * N - i, 0, 1);
      const f = on * (0.85 + 0.15 * Math.sin(t * 9 + i * 1.3) + 0.08 * Math.sin(t * 17 + i));
      fc[i * 3] = fl.r * f;
      fc[i * 3 + 1] = fl.g * f;
      fc[i * 3 + 2] = fl.b * f;
      gc[i * 3] = gl.r * f * 0.5;
      gc[i * 3 + 1] = gl.g * f * 0.5;
      gc[i * 3 + 2] = gl.b * f * 0.5;
    }
    flameGeo.attributes.color.needsUpdate = true;
    glowGeo.attributes.color.needsUpdate = true;
  };
  set(0, 0);
  const dispose = () => {
    bowlGeo.dispose();
    flameGeo.dispose();
    glowGeo.dispose();
    bowls.dispose();
    (flames.material as THREE_NS.Material).dispose();
    (glows.material as THREE_NS.Material).dispose();
  };
  return { group, set, dispose, count: N };
}

/** Dhanteras: a golden kalasha with coins rising from it. */
export function createKalasha(THREE: T, gold: THREE_NS.Material) {
  const group = new THREE.Group();
  const prof = [[0, 0], [0.34, 0], [0.4, 0.06], [0.62, 0.34], [0.66, 0.62], [0.52, 0.92], [0.3, 1.04], [0.34, 1.16], [0.5, 1.22], [0.5, 1.28], [0.28, 1.26], [0.0, 1.26]].map(([x, y]) => new THREE.Vector2(x, y));
  const pot = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), gold);
  group.add(pot);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2c8a4c, roughness: 0.6, side: THREE.DoubleSide });
  const leafGeo = new THREE.SphereGeometry(0.16, 10, 8);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const l = new THREE.Mesh(leafGeo, leafMat);
    l.scale.set(0.6, 1.5, 0.25);
    l.position.set(Math.cos(a) * 0.3, 1.46, Math.sin(a) * 0.3);
    l.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
    group.add(l);
  }
  const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 14), new THREE.MeshStandardMaterial({ color: 0x8a5a2c, roughness: 0.8 }));
  coconut.position.y = 1.62;
  group.add(coconut);
  const COINS = 26;
  const coinGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.035, 20);
  const coins = new THREE.InstancedMesh(coinGeo, gold, COINS);
  coins.frustumCulled = false;
  group.add(coins);
  const d = new THREE.Object3D();
  const seeds = Array.from({ length: COINS }, (_, i) => ({ a: i * 2.4, r: 0.4 + ((i * 0.37) % 1) * 1.4, v: 0.5 + ((i * 0.71) % 1) * 0.7, o: ((i * 0.57) % 1) * 3, s: 0.8 + ((i * 0.43) % 1) * 0.6 }));
  const set = (t: number, k: number) => {
    seeds.forEach((s, i) => {
      const ph = ((s.o + t * s.v * 0.4) % 3) / 3;
      const rise = Math.sin(ph * Math.PI);
      d.position.set(Math.cos(s.a + t * 0.6) * s.r * ph, 1.3 + ph * 2.6, Math.sin(s.a + t * 0.6) * s.r * ph * 0.7);
      d.rotation.set(t * 3 + i, t * 2 + i, 0);
      d.scale.setScalar(s.s * rise * k);
      d.updateMatrix();
      coins.setMatrixAt(i, d.matrix);
    });
    coins.instanceMatrix.needsUpdate = true;
  };
  const dispose = () => {
    pot.geometry.dispose();
    leafGeo.dispose();
    leafMat.dispose();
    coconut.geometry.dispose();
    (coconut.material as THREE_NS.Material).dispose();
    coinGeo.dispose();
    coins.dispose();
  };
  return { group, set, dispose };
}

/** Govardhan: the green hill, and the mound of food (Annakut) at its base. */
export function createGovardhan(THREE: T) {
  const group = new THREE.Group();
  const hillTex = canvasTex(THREE, 256, 256, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#9bd27a");
    g.addColorStop(0.55, "#3f9a4a");
    g.addColorStop(1, "#2a6b3a");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 700; i++) {
      c.fillStyle = `rgba(${20 + Math.random() * 50},${70 + Math.random() * 90},${30 + Math.random() * 40},${Math.random() * 0.35})`;
      c.fillRect(Math.random() * w, Math.random() * h, 2, 3);
    }
  });
  const prof = [[0, 1.55], [0.18, 1.5], [0.5, 1.25], [0.9, 0.85], [1.3, 0.4], [1.55, 0.02], [1.25, -0.12], [0.8, -0.06], [0, -0.1]].map(([x, y]) => new THREE.Vector2(x, y));
  const hillGeo = new THREE.LatheGeometry(prof, 36);
  const p = hillGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = Math.atan2(p.getZ(i), p.getX(i));
    const k = 1 + 0.06 * Math.sin(a * 3 + p.getY(i) * 4) + 0.04 * Math.sin(a * 7);
    p.setX(i, p.getX(i) * k);
    p.setZ(i, p.getZ(i) * k);
  }
  hillGeo.computeVertexNormals();
  const hill = new THREE.Mesh(hillGeo, new THREE.MeshStandardMaterial({ map: hillTex, roughness: 0.9 }));
  const hillGroup = new THREE.Group(); // the hill and its trees, lifted as one
  hillGroup.add(hill);
  group.add(hillGroup);
  // trees dotted on the hill
  const treeGeo = new THREE.SphereGeometry(0.14, 8, 6);
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x1f6b34, roughness: 0.8 });
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, 26);
  const d = new THREE.Object3D();
  for (let i = 0; i < 26; i++) {
    const a = i * 2.39996;
    const h = 0.15 + ((i * 0.37) % 1) * 1.0;
    const r = Math.max(0.1, 1.5 - h * 0.95) * 0.82;
    d.position.set(Math.cos(a) * r, h, Math.sin(a) * r);
    d.scale.setScalar(0.7 + ((i * 0.53) % 1) * 0.8);
    d.updateMatrix();
    trees.setMatrixAt(i, d.matrix);
  }
  hillGroup.add(trees);
  // Annakut: a heap of colourful dishes
  const FOOD = 64;
  const foodGeo = new THREE.SphereGeometry(0.13, 12, 10);
  const foodMat = new THREE.MeshStandardMaterial({ roughness: 0.5 });
  const food = new THREE.InstancedMesh(foodGeo, foodMat, FOOD);
  const palette = [0xffd36b, 0xff8a2a, 0xfff2c8, 0xd7143a, 0x8bc34a, 0xffb347, 0xffffff];
  const col = new THREE.Color();
  for (let i = 0; i < FOOD; i++) {
    const layer = Math.floor(Math.sqrt(i));
    const a = i * 2.39996;
    const rr = (7 - layer) * 0.13 * (0.5 + ((i * 0.31) % 1) * 0.6);
    d.position.set(Math.cos(a) * rr, layer * 0.1 + 0.1, Math.sin(a) * rr);
    d.scale.set(1, 0.7, 1);
    d.updateMatrix();
    food.setMatrixAt(i, d.matrix);
    food.setColorAt(i, col.setHex(palette[i % palette.length]));
  }
  food.instanceColor!.needsUpdate = true;
  const foodGroup = new THREE.Group();
  foodGroup.add(food);
  group.add(foodGroup);
  // rain falling around the hill
  const RAIN = 90;
  const rainPos = new Float32Array(RAIN * 3);
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.Points(rainGeo, new THREE.PointsMaterial({ size: 0.06, color: 0x9fc6ff, transparent: true, opacity: 0.7, depthWrite: false, toneMapped: false, fog: false }));
  rain.frustumCulled = false;
  group.add(rain);
  const rs = Array.from({ length: RAIN }, (_, i) => ({ x: (((i * 0.6180339) % 1) - 0.5) * 7, z: (((i * 0.4142) % 1) - 0.5) * 3, v: 3 + ((i * 0.77) % 1) * 2, o: ((i * 0.91) % 1) * 5 }));
  const set = (t: number, rainK: number) => {
    for (let i = 0; i < RAIN; i++) {
      const s = rs[i];
      const y = 5.5 - ((s.o + t * s.v) % 5.5);
      // drops slide off the hill's umbrella instead of reaching the ground beneath it
      const under = Math.abs(s.x) < 1.7 && y < 3.4;
      rainPos[i * 3] = under ? s.x * (1 + (3.4 - y) * 0.5) : s.x;
      rainPos[i * 3 + 1] = y;
      rainPos[i * 3 + 2] = s.z;
    }
    rainGeo.attributes.position.needsUpdate = true;
    (rain.material as THREE_NS.PointsMaterial).opacity = 0.7 * rainK;
  };
  const dispose = () => {
    hillGeo.dispose();
    hillTex.dispose();
    (hill.material as THREE_NS.Material).dispose();
    treeGeo.dispose();
    treeMat.dispose();
    trees.dispose();
    foodGeo.dispose();
    foodMat.dispose();
    food.dispose();
    rainGeo.dispose();
    (rain.material as THREE_NS.Material).dispose();
  };
  return { group, hillGroup, foodGroup, set, dispose };
}

/** Bhai Dooj: a puja thali with a lit diya, kumkum and sweets. */
export function createThali(THREE: T, m: Mats) {
  const group = new THREE.Group();
  const plate = new THREE.Mesh(new THREE.LatheGeometry([[0, 0.02], [1.2, 0.02], [1.4, 0.12], [1.46, 0.16], [1.4, 0.17], [1.2, 0.08], [0, 0.08]].map(([x, y]) => new THREE.Vector2(x, y)), 56), m.gold);
  group.add(plate);
  const diya = createDiya(THREE, m);
  diya.group.position.set(0, 0.1, 0);
  diya.group.scale.setScalar(0.42);
  group.add(diya.group);
  const kum = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.14, 24), new THREE.MeshStandardMaterial({ color: 0xd7143a, roughness: 0.7 }));
  kum.position.set(-0.78, 0.18, 0.3);
  const rice = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.12, 24), new THREE.MeshStandardMaterial({ color: 0xfff6e0, roughness: 0.8 }));
  rice.position.set(0.8, 0.17, 0.32);
  group.add(kum, rice);
  const sweetGeo = new THREE.SphereGeometry(0.15, 14, 10);
  const sweetMat = new THREE.MeshStandardMaterial({ color: 0xf0a42a, roughness: 0.4 });
  for (let i = 0; i < 5; i++) {
    const a = 2.4 + i * 0.55;
    const s = new THREE.Mesh(sweetGeo, sweetMat);
    s.position.set(Math.cos(a) * 0.85, 0.22, Math.sin(a) * 0.5);
    s.scale.set(1, 0.7, 1);
    group.add(s);
  }
  const marigold = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.06, 8, 40), new THREE.MeshStandardMaterial({ color: 0xff9a1f, roughness: 0.7 }));
  marigold.rotation.x = Math.PI / 2;
  marigold.position.y = 0.2;
  group.add(marigold);
  const dispose = () => {
    plate.geometry.dispose();
    diya.dispose();
    sweetGeo.dispose();
    sweetMat.dispose();
    marigold.geometry.dispose();
    (marigold.material as THREE_NS.Material).dispose();
    kum.geometry.dispose();
    rice.geometry.dispose();
  };
  return { group, diya, dispose };
}
