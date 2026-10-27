import type * as THREE_NS from "three";

type T = typeof THREE_NS;

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const smooth = (x: number, lo: number, hi: number) => {
  const u = clamp((x - lo) / (hi - lo), 0, 1);
  return u * u * (3 - 2 * u);
};

export function canvasTex(THREE: T, w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Soft round glow used for flames, sparks and stars. */
export function dotTexture(THREE: T) {
  return canvasTex(THREE, 64, 64, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// Fireworks: a small pool of rockets that climb, burst into a shell of sparks, and fall away.
// All particles live in ONE Points object; positions and colours are rewritten each frame on the CPU
// (a few hundred points, so it costs next to nothing).
// ─────────────────────────────────────────────────────────────────────────────────────────────
const PALETTE = [0xffd36b, 0xff7a3d, 0xff4f8b, 0xfff2c8, 0x8fd0ff, 0xb98cff];

export function createFireworks(THREE: T, dotTex: THREE_NS.Texture, bursts = 7, per = 64) {
  const N = bursts * per;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.3,
    map: dotTex,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    toneMapped: false,
    fog: false,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;

  // unit shell directions (golden-spiral sphere) shared by every burst
  const dirs: [number, number, number][] = Array.from({ length: per }, (_, i) => {
    const y = 1 - (i / (per - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.399963;
    return [Math.cos(a) * r, y, Math.sin(a) * r * 0.6];
  });

  type Burst = { t0: number; x: number; y: number; z: number; speed: number; color: THREE_NS.Color; alt: THREE_NS.Color; active: boolean; fuse: number };
  const pool: Burst[] = Array.from({ length: bursts }, () => ({ t0: -99, x: 0, y: 0, z: 0, speed: 2.6, color: new THREE.Color(), alt: new THREE.Color(), active: false, fuse: 0.9 }));
  const tmp = new THREE.Color();
  let next = 0;
  let acc = 0;
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  /** Launch a rocket now (optionally at a fixed place). */
  const launch = (t: number, at?: { x: number; y: number; z?: number }) => {
    const b = pool[next];
    next = (next + 1) % bursts;
    b.active = true;
    b.t0 = t;
    b.x = at ? at.x : (rnd() - 0.5) * 9;
    b.y = at ? at.y : 2.6 + rnd() * 3;
    b.z = at?.z ?? -2.5 - rnd() * 3;
    b.speed = 2.6 + rnd() * 1.8;
    b.fuse = 0.7 + rnd() * 0.4;
    b.color.setHex(PALETTE[Math.floor(rnd() * PALETTE.length)]);
    b.alt.setHex(PALETTE[Math.floor(rnd() * PALETTE.length)]);
  };

  /** `rate` = bursts per second (0 = none). */
  const update = (t: number, dt: number, rate: number) => {
    acc += dt * rate;
    while (acc >= 1) {
      acc -= 1;
      launch(t);
    }
    for (let b = 0; b < bursts; b++) {
      const bu = pool[b];
      const age = t - bu.t0;
      const o = b * per;
      if (!bu.active || age > bu.fuse + 2.4) {
        bu.active = false;
        for (let i = 0; i < per; i++) {
          pos[(o + i) * 3 + 1] = -50;
          col[(o + i) * 3] = col[(o + i) * 3 + 1] = col[(o + i) * 3 + 2] = 0;
        }
        continue;
      }
      if (age < bu.fuse) {
        // the rocket: one bright dot climbing from the ground, the rest hidden inside it
        const k = age / bu.fuse;
        const y = lerp(-1.5, bu.y, 1 - (1 - k) * (1 - k));
        for (let i = 0; i < per; i++) {
          pos[(o + i) * 3] = bu.x + Math.sin(age * 20 + i) * 0.01;
          pos[(o + i) * 3 + 1] = y;
          pos[(o + i) * 3 + 2] = bu.z;
          const lit = i === 0 ? 1 : 0;
          col[(o + i) * 3] = lit;
          col[(o + i) * 3 + 1] = lit * 0.85;
          col[(o + i) * 3 + 2] = lit * 0.55;
        }
      } else {
        const e = age - bu.fuse; // seconds since the burst
        const fade = Math.max(0, 1 - e / 2.2);
        const r = bu.speed * (1 - Math.exp(-e * 2.4));
        for (let i = 0; i < per; i++) {
          const d = dirs[i];
          pos[(o + i) * 3] = bu.x + d[0] * r;
          pos[(o + i) * 3 + 1] = bu.y + d[1] * r - 0.55 * e * e;
          pos[(o + i) * 3 + 2] = bu.z + d[2] * r;
          tmp.copy(i % 3 === 0 ? bu.alt : bu.color);
          const f = fade * fade * (0.75 + 0.25 * Math.sin(e * 30 + i));
          col[(o + i) * 3] = tmp.r * f;
          col[(o + i) * 3 + 1] = tmp.g * f;
          col[(o + i) * 3 + 2] = tmp.b * f;
        }
      }
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  };

  const dispose = () => {
    geo.dispose();
    mat.dispose();
  };
  return { points, update, launch, dispose };
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// Sky lanterns: warm glowing paper lanterns drifting upward and swaying.
// ─────────────────────────────────────────────────────────────────────────────────────────────
export function createLanterns(THREE: T, count = 14) {
  const tex = canvasTex(THREE, 64, 96, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#ffb347");
    g.addColorStop(0.5, "#ff8a2a");
    g.addColorStop(1, "#ffd36b");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(10, 8);
    c.quadraticCurveTo(w / 2, -4, w - 10, 8);
    c.lineTo(w - 4, h - 14);
    c.quadraticCurveTo(w / 2, h + 2, 4, h - 14);
    c.closePath();
    c.fill();
    c.fillStyle = "rgba(255,255,230,0.9)";
    c.beginPath();
    c.ellipse(w / 2, h - 24, 10, 16, 0, 0, 6.3);
    c.fill();
  });
  const geo = new THREE.PlaneGeometry(0.34, 0.5);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false, opacity: 0.95, fog: false });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.frustumCulled = false;
  const d = new THREE.Object3D();
  const seeds = Array.from({ length: count }, (_, i) => ({
    x: ((i * 0.6180339) % 1) * 12 - 6,
    z: -3.5 - ((i * 0.37) % 1) * 5,
    v: 0.16 + ((i * 0.713) % 1) * 0.16,
    o: ((i * 0.911) % 1) * 9,
    s: 0.7 + ((i * 0.53) % 1) * 0.9,
    p: i * 1.7,
  }));
  const update = (t: number) => {
    seeds.forEach((s, i) => {
      const y = -2 + ((s.o + t * s.v) % 9.5);
      d.position.set(s.x + Math.sin(t * 0.5 + s.p) * 0.4, y, s.z);
      d.rotation.z = Math.sin(t * 0.7 + s.p) * 0.12;
      d.scale.setScalar(s.s);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  const dispose = () => {
    geo.dispose();
    mat.dispose();
    tex.dispose();
    mesh.dispose();
  };
  return { mesh, update, dispose };
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// Rangoli: a painted mandala disc on the ground that blooms outwards (a radial reveal in the shader).
// ─────────────────────────────────────────────────────────────────────────────────────────────
export function createRangoli(THREE: T, radius = 3.6) {
  const tex = canvasTex(THREE, 1024, 1024, (c, w, h) => {
    c.translate(w / 2, h / 2);
    c.lineCap = "round";
    const ring = (r: number, col: string, lw: number) => {
      c.strokeStyle = col;
      c.lineWidth = lw;
      c.beginPath();
      c.arc(0, 0, r, 0, Math.PI * 2);
      c.stroke();
    };
    const petals = (n: number, r0: number, r1: number, wd: number, fill: string, stroke: string) => {
      for (let i = 0; i < n; i++) {
        c.save();
        c.rotate((i / n) * Math.PI * 2);
        c.beginPath();
        c.moveTo(0, -r0);
        c.quadraticCurveTo(wd, -(r0 + r1) / 2, 0, -r1);
        c.quadraticCurveTo(-wd, -(r0 + r1) / 2, 0, -r0);
        c.fillStyle = fill;
        c.fill();
        c.strokeStyle = stroke;
        c.lineWidth = 3;
        c.stroke();
        c.restore();
      }
    };
    const dots = (n: number, r: number, size: number, col: string) => {
      c.fillStyle = col;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        c.beginPath();
        c.arc(Math.cos(a) * r, Math.sin(a) * r, size, 0, Math.PI * 2);
        c.fill();
      }
    };
    // soft base
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 500);
    g.addColorStop(0, "rgba(120,30,80,0.55)");
    g.addColorStop(1, "rgba(60,10,60,0.35)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, 498, 0, Math.PI * 2);
    c.fill();
    ring(496, "#ffd36b", 6);
    dots(72, 470, 6, "#fff2c8");
    petals(24, 330, 462, 50, "#ff8a2a", "#ffd36b");
    petals(24, 330, 440, 26, "#ff4f8b", "#fff2c8");
    ring(325, "#ffd36b", 5);
    dots(48, 300, 7, "#ffd36b");
    petals(16, 170, 318, 58, "#7a2fd0", "#ffd36b");
    petals(16, 170, 290, 28, "#ff4f8b", "#fff2c8");
    ring(166, "#ffd36b", 5);
    dots(24, 142, 8, "#fff2c8");
    petals(12, 40, 160, 40, "#ffb347", "#fff2c8");
    petals(12, 40, 120, 18, "#d7143a", "#ffd36b");
    c.fillStyle = "#ffd36b";
    c.beginPath();
    c.arc(0, 0, 40, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#d7143a";
    c.beginPath();
    c.arc(0, 0, 18, 0, Math.PI * 2);
    c.fill();
  });
  const uniforms = { uTex: { value: tex }, uReveal: { value: 0 }, uGlow: { value: 1 } };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: `
      uniform sampler2D uTex; uniform float uReveal; uniform float uGlow; varying vec2 vUv;
      void main(){
        vec2 p = vUv - 0.5;
        float r = length(p) * 2.0;
        vec4 c = texture2D(uTex, vUv);
        float edge = smoothstep(uReveal, uReveal - 0.12, r);
        float ring = smoothstep(0.1, 0.0, abs(r - uReveal + 0.04)) * 0.9;
        c.rgb = c.rgb * uGlow + vec3(1.0, 0.82, 0.4) * ring;
        gl_FragColor = vec4(c.rgb, c.a * edge + ring * 0.4 * step(r, uReveal + 0.02));
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 96), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.012;
  const dispose = () => {
    mesh.geometry.dispose();
    mat.dispose();
    tex.dispose();
  };
  return { mesh, uniforms, dispose };
}
