import type * as THREE_NS from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type T = typeof THREE_NS;

/**
 * Bala Krishna of the Damodar lila: a jointed, stylised-realistic baby Krishna built from primitives, with smooth
 * lathed torso and limbs, a sculpted face (iris, lids, lashes, lips), curly hair, crown with a peacock feather,
 * jewellery, silk dhoti and shawl; the wooden mortar, the butter pot and the rope.
 *
 * `update(t, dir)` plays the pastime for a scroll position (`dir.chapter`, 0..5):
 *   0 the butter pot   1 the rope two fingers short   2 bound by love
 *   3 He crawls dragging the mortar towards the twin arjuna trees   4 the trees fall
 * and returns what the rest of the scene needs (where the camera should look, how far the trees have fallen, ...).
 * Without a chapter it plays an idle loop (breathing, blinking, tugging at the rope).
 */
export type Direction = { chapter: number | null; look: number; tug: number };
export type Director = { focusX: number; fall: number; burst: number; orbs: number; kx: number; stuck: number; mortarX: number; crawlW: number };
export type FigureControls = {
  group: THREE_NS.Group;
  update: (t: number, dir: Direction) => Director;
  dispose: () => void;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const sm = (x: number, lo: number, hi: number) => {
  const u = clamp01((x - lo) / (hi - lo));
  return u * u * (3 - 2 * u);
};

/** The trees and mortar positions the choreography is built around (shared with the environment). */
export const STAGE = { treeL: 6.35, treeR: 8.05, mortarStop: 5.4, kStart: 0, kEnd: 7.2, drag: 1.65 };

export function createBalKrishna(THREE: T): FigureControls {
  const disposables: { dispose: () => void }[] = [];
  const track = <D extends { dispose: () => void }>(o: D): D => {
    disposables.push(o);
    return o;
  };

  // ── Canvas helpers ────────────────────────────────────────────────
  const canvasOf = (w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!, w, h);
    return c;
  };
  const texOf = (c: HTMLCanvasElement, srgb = true) => {
    const t = track(new THREE.CanvasTexture(c));
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  };
  /** Greyscale height canvas -> tangent-space normal map. */
  const normalMapOf = (height: HTMLCanvasElement, strength = 2.5) => {
    const w = height.width;
    const h = height.height;
    const src = height.getContext("2d")!.getImageData(0, 0, w, h).data;
    const out = canvasOf(w, h, () => undefined);
    const octx = out.getContext("2d")!;
    const img = octx.createImageData(w, h);
    const H = (x: number, y: number) => src[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (H(x + 1, y) - H(x - 1, y)) * strength;
        const dy = (H(x, y + 1) - H(x, y - 1)) * strength;
        const l = Math.hypot(dx, dy, 1);
        const i = (y * w + x) * 4;
        img.data[i] = ((-dx / l) * 0.5 + 0.5) * 255;
        img.data[i + 1] = ((-dy / l) * 0.5 + 0.5) * 255;
        img.data[i + 2] = ((1 / l) * 0.5 + 0.5) * 255;
        img.data[i + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    return texOf(out, false);
  };

  // ── Materials ─────────────────────────────────────────────────────
  const phys = (color: number, o: Partial<THREE_NS.MeshPhysicalMaterialParameters> = {}) =>
    track(new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, metalness: 0, ...o }));
  const poreH = canvasOf(256, 256, (c, w, h) => {
    c.fillStyle = "#808080";
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 5200; i++) {
      const v = 110 + Math.random() * 40;
      c.fillStyle = `rgb(${v},${v},${v})`;
      c.beginPath();
      c.arc(Math.random() * w, Math.random() * h, Math.random() * 1.3 + 0.3, 0, 6.3);
      c.fill();
    }
  });
  const skinN = normalMapOf(poreH, 1.4);
  skinN.repeat.set(5, 5);
  const skin = phys(0x2449b9, { normalMap: skinN, normalScale: new THREE.Vector2(0.35, 0.35), roughness: 0.42, sheen: 1, sheenColor: new THREE.Color(0x86a8ff), sheenRoughness: 0.45, clearcoat: 0.18, clearcoatRoughness: 0.5, emissive: 0x081a5c, emissiveIntensity: 0.14 });
  const skinSoft = phys(0x4a73e2, { normalMap: skinN, normalScale: new THREE.Vector2(0.3, 0.3), roughness: 0.4, sheen: 1, sheenColor: new THREE.Color(0x9bb8ff), sheenRoughness: 0.5, emissive: 0x081a5c, emissiveIntensity: 0.1 });
  const lipMat = phys(0xd4577a, { roughness: 0.32, clearcoat: 0.5 });
  const hairMat = phys(0x0b0d26, { roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.3, sheen: 0.6, sheenColor: new THREE.Color(0x3b4a9c) });
  const gold = phys(0xe8b02a, { metalness: 1, roughness: 0.22 });
  const goldDeep = phys(0xc98a12, { metalness: 1, roughness: 0.3 });
  const whiteMat = phys(0xffffff, { roughness: 0.18, clearcoat: 0.8 });
  const blackMat = phys(0x04050c, { roughness: 0.2 });
  const pearl = phys(0xfff3e2, { roughness: 0.2, metalness: 0.1, clearcoat: 1, sheen: 0.5 });
  const gemRed = phys(0xd7143a, { roughness: 0.12, clearcoat: 1, emissive: 0x6a0016, emissiveIntensity: 0.5 });
  const gemGreen = phys(0x12a36a, { roughness: 0.12, clearcoat: 1, emissive: 0x04532f, emissiveIntensity: 0.5 });
  const gemBlue = phys(0x2a63e8, { roughness: 0.1, clearcoat: 1, emissive: 0x08266e, emissiveIntensity: 0.6 });
  const butterMat = phys(0xfff0b4, { roughness: 0.35, clearcoat: 0.4 });
  const terracotta = phys(0xb4522c, { roughness: 0.78 });

  // silk: pleats (normal map) + a darker woven border near the hem
  const pleatH = canvasOf(256, 128, (c, w, h) => {
    c.fillStyle = "#808080";
    c.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x++) {
      const v = 128 + Math.sin((x / w) * Math.PI * 2 * 14) * 70 + Math.sin((x / w) * Math.PI * 2 * 37) * 18;
      c.fillStyle = `rgb(${v},${v},${v})`;
      c.fillRect(x, 0, 1, h);
    }
  });
  const silkMap = texOf(
    canvasOf(256, 128, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#ffc20a");
      g.addColorStop(0.78, "#f5b200");
      g.addColorStop(0.8, "#b4421a");
      g.addColorStop(0.86, "#b4421a");
      g.addColorStop(0.88, "#e8a317");
      g.addColorStop(1, "#ffc20a");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) {
        c.fillStyle = `rgba(120,70,0,${Math.random() * 0.06})`;
        c.fillRect(Math.random() * w, Math.random() * h, 1, 3);
      }
    })
  );
  const silkN = normalMapOf(pleatH, 3);
  const dhotiMat = phys(0xffffff, { map: silkMap, normalMap: silkN, roughness: 0.55, sheen: 1, sheenColor: new THREE.Color(0xfff0a0), sheenRoughness: 0.4, side: THREE.DoubleSide });
  const shawlMat = phys(0xd92a1c, { roughness: 0.5, sheen: 1, sheenColor: new THREE.Color(0xff8a70), side: THREE.DoubleSide });

  // eyes
  const irisTex = texOf(
    canvasOf(128, 128, (c, w, h) => {
      const g = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
      g.addColorStop(0, "#060508");
      g.addColorStop(0.3, "#150b07");
      g.addColorStop(0.75, "#4a2410");
      g.addColorStop(1, "#1a0c06");
      c.fillStyle = g;
      c.beginPath();
      c.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
      c.fill();
    })
  );
  const irisMat = phys(0xffffff, { map: irisTex, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });

  // wood + rope + feather
  const woodH = canvasOf(256, 256, (c, w, h) => {
    c.fillStyle = "#808080";
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      const v = 90 + Math.random() * 90;
      c.strokeStyle = `rgb(${v},${v},${v})`;
      c.lineWidth = 1 + Math.random() * 3;
      c.beginPath();
      const x = Math.random() * w;
      c.moveTo(x, 0);
      c.bezierCurveTo(x + 16, h * 0.3, x - 14, h * 0.7, x + 8, h);
      c.stroke();
    }
  });
  const woodMap = texOf(
    canvasOf(256, 256, (c, w, h) => {
      c.fillStyle = "#7a4a22";
      c.fillRect(0, 0, w, h);
      c.drawImage(woodH, 0, 0);
      c.globalCompositeOperation = "multiply";
      c.fillStyle = "#c48a52";
      c.fillRect(0, 0, w, h);
    })
  );
  woodMap.repeat.set(3, 1);
  const woodN = normalMapOf(woodH, 2);
  woodN.repeat.set(3, 1);
  const woodMat = phys(0xffffff, { map: woodMap, normalMap: woodN, roughness: 0.82 });
  const ironMat = phys(0x2a2623, { metalness: 0.85, roughness: 0.4 });

  const ropeTexC = canvasOf(64, 64, (c, w, h) => {
    c.fillStyle = "#b07a36";
    c.fillRect(0, 0, w, h);
    c.strokeStyle = "#6f4817";
    c.lineWidth = 7;
    for (let i = -2; i < 5; i++) {
      c.beginPath();
      c.moveTo(i * 22, h);
      c.lineTo(i * 22 + 44, 0);
      c.stroke();
    }
  });
  const ropeTex = texOf(ropeTexC);
  ropeTex.repeat.set(1, 1);
  const ropeMat = phys(0xffffff, { map: ropeTex, roughness: 0.9 });

  const featherTex = texOf(
    canvasOf(256, 512, (c, w, h) => {
      c.clearRect(0, 0, w, h);
      // barbs: fine strokes radiating from the central stem, green fading to gold
      for (let i = 0; i < 460; i++) {
        const y = 40 + (i / 460) * 400;
        const side = i % 2 ? 1 : -1;
        const len = 20 + Math.sin((y / h) * Math.PI) * 100;
        c.strokeStyle = i % 3 === 0 ? "#1e9c6a" : i % 3 === 1 ? "#127a56" : "#43b97d";
        c.lineWidth = 1.4;
        c.beginPath();
        c.moveTo(128, y);
        c.quadraticCurveTo(128 + side * len * 0.55, y - 22, 128 + side * len, y - 46);
        c.stroke();
      }
      const eye = (rx: number, ry: number, col: string, cy: number) => {
        c.fillStyle = col;
        c.beginPath();
        c.ellipse(128, cy, rx, ry, 0, 0, Math.PI * 2);
        c.fill();
      };
      eye(66, 104, "#d9a31b", 190);
      eye(52, 88, "#1a58c8", 188);
      eye(38, 66, "#0b9a92", 186);
      eye(20, 38, "#0a3a86", 182);
      eye(8, 16, "#04122e", 176);
      c.strokeStyle = "#0d5a3d";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(128, 20);
      c.lineTo(128, 512);
      c.stroke();
    })
  );
  featherTex.wrapS = featherTex.wrapT = THREE.ClampToEdgeWrapping;

  // ── Mesh builder: everything static on a joint is merged into one mesh per material ──
  type Piece = { geo: THREE_NS.BufferGeometry; m: THREE_NS.Matrix4 };
  const bins = new Map<THREE_NS.Object3D, Map<THREE_NS.Material, Piece[]>>();
  const tmpO = new THREE.Object3D();
  const add = (
    node: THREE_NS.Object3D,
    mat: THREE_NS.Material,
    geo: THREE_NS.BufferGeometry,
    x = 0, y = 0, z = 0,
    rx = 0, ry = 0, rz = 0,
    sx = 1, sy = 1, sz = 1
  ) => {
    tmpO.position.set(x, y, z);
    tmpO.rotation.set(rx, ry, rz);
    tmpO.scale.set(sx, sy, sz);
    tmpO.updateMatrix();
    let byMat = bins.get(node);
    if (!byMat) bins.set(node, (byMat = new Map()));
    let list = byMat.get(mat);
    if (!list) byMat.set(mat, (list = []));
    list.push({ geo, m: tmpO.matrix.clone() });
  };
  const build = () => {
    bins.forEach((byMat, node) => {
      byMat.forEach((list, mat) => {
        const geos = list.map(({ geo, m }) => {
          const g = geo.clone();
          g.applyMatrix4(m);
          if (g.index) return g.toNonIndexed();
          return g;
        });
        const merged = mergeGeometries(geos, false);
        geos.forEach((g) => g.dispose());
        if (!merged) return;
        track(merged);
        const mesh = new THREE.Mesh(merged, mat);
                node.add(mesh);
      });
      byMat.forEach((list) => list.forEach(({ geo }) => geo.dispose()));
    });
    bins.clear();
  };
  const group = (parent: THREE_NS.Object3D, x = 0, y = 0, z = 0) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  };
  const sphere = (r: number, w = 24, h = 16) => new THREE.SphereGeometry(r, w, h);
  const lathe = (pts: number[][], seg = 40) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

  const root = new THREE.Group();

  // ═════════════════════════════════════════════════════════════════
  //  Krishna: kr > pelvis > torso > (head, shoulders > arms)   pelvis > hips > legs
  // ═════════════════════════════════════════════════════════════════
  const kr = group(root);
  const pelvis = group(kr, 0, 0.42, 0);
  const torso = group(pelvis, 0, 0.05, 0);

  // torso: one smooth lathed body (hips -> belly -> chest -> shoulders -> neck), a touch flatter front to back
  add(torso, skin, lathe([[0, -0.02], [0.4, 0.0], [0.53, 0.12], [0.58, 0.3], [0.55, 0.5], [0.47, 0.7], [0.41, 0.86], [0.29, 0.98], [0.17, 1.07], [0.15, 1.2], [0, 1.2]], 56), 0, 0, 0, 0, 0, 0, 1, 1, 0.86);
  add(torso, skin, sphere(0.075, 12, 10), 0, 0.2, 0.5, 0, 0, 0, 1, 0.7, 0.5); // belly button
  // shoulders blend
  for (const s of [1, -1]) add(torso, skin, sphere(0.15, 20, 14), s * 0.42, 0.9, 0);

  // dhoti (pitambara): pleated skirt from the waist, folded at the front, with a knot
  add(pelvis, dhotiMat, lathe([[0.5, 0.3], [0.6, 0.14], [0.72, -0.05], [0.8, -0.25], [0.79, -0.4], [0.7, -0.43]], 64), 0, 0, 0, 0, 0, 0, 1, 1, 0.92);
  add(pelvis, dhotiMat, new THREE.TorusKnotGeometry(0.1, 0.045, 48, 10, 2, 3), 0.18, 0.2, 0.5, 0.4, 0.5, 0, 1, 1, 0.8);
  // the shawl over the left shoulder and across the chest
  const shawlCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.42, 1.02, 0.08), new THREE.Vector3(-0.2, 0.86, 0.42), new THREE.Vector3(0.1, 0.62, 0.52), new THREE.Vector3(0.42, 0.34, 0.42)]);
  add(torso, shawlMat, new THREE.TubeGeometry(shawlCurve, 24, 0.1, 6), 0, 0, 0, 0, 0, 0, 1, 1, 0.55);

  // kardhani (gold waist belt with bells)
  add(pelvis, goldDeep, new THREE.TorusGeometry(0.58, 0.04, 12, 72), 0, 0.2, 0, Math.PI / 2, 0, 0, 1, 0.92, 1);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    add(pelvis, gold, sphere(0.034, 10, 8), Math.cos(a) * 0.58, 0.15, Math.sin(a) * 0.55 * 0.92);
  }

  // the rope round the belly (twice), knotted: this is the "dama" in Damodara
  for (const [y, r] of [[0.4, 0.545], [0.3, 0.585]] as const) {
    add(torso, ropeMat, new THREE.TorusGeometry(r, 0.036, 10, 72), 0, y, 0.02, Math.PI / 2, 0, 0, 1, 0.9, 1);
  }
  const ropeKnotNode = group(torso, -0.52, 0.34, -0.1);
  add(ropeKnotNode, ropeMat, sphere(0.075, 14, 10), 0, 0, 0, 0, 0, 0, 1.2, 1, 1);

  // chest ornaments: collar, pearl strings with a kaustubha gem
  add(torso, gold, new THREE.TorusGeometry(0.31, 0.034, 10, 56), 0, 1.04, 0.06, Math.PI / 2 - 0.22, 0, 0);
  for (const [drop, n] of [[0.1, 19], [0.23, 17], [0.37, 15]] as const) {
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const x = (u - 0.5) * 0.78;
      const y = 0.95 - Math.sin(u * Math.PI) * drop;
      const rz = 0.5 * Math.sqrt(Math.max(0.03, 1 - (x / 0.5) ** 2)) * 0.86 + 0.02;
      add(torso, pearl, sphere(0.031, 10, 8), x, y, rz);
    }
  }
  add(torso, gold, sphere(0.075, 16, 12), 0, 0.54, 0.455);
  add(torso, gemBlue, sphere(0.05, 14, 10), 0, 0.54, 0.505);

  // ── Head ──
  const neck = group(torso, 0, 1.12, 0);
  const head = group(neck, 0, 0.44, 0.04);
  {
    // skull: an egg that narrows toward a small round chin
    const sk = new THREE.SphereGeometry(0.47, 56, 40);
    const pos = sk.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const k = y < 0 ? 1 - 0.2 * Math.min(1, -y / 0.47) ** 1.5 : 1;
      pos.setX(i, pos.getX(i) * k);
      pos.setZ(i, pos.getZ(i) * (k * 0.98 + (y < -0.1 ? 0.02 : 0)));
      pos.setY(i, y * (y < 0 ? 0.95 : 1));
    }
    sk.computeVertexNormals();
    add(head, skin, sk);
  }
  for (const s of [1, -1]) {
    add(head, skinSoft, sphere(0.1, 24, 18), s * 0.3, -0.1, 0.32); // chubby cheeks
    add(head, skin, sphere(0.085, 16, 12), s * 0.47, 0.0, -0.01, 0, 0, 0, 0.55, 1, 0.8); // ears
    add(head, gold, sphere(0.032, 10, 8), s * 0.49, -0.1, 0.0); // kundala
    add(head, gold, new THREE.TorusGeometry(0.045, 0.012, 8, 20), s * 0.49, -0.17, 0.0, 0, Math.PI / 2, 0);
    add(head, gemRed, sphere(0.02, 8, 8), s * 0.495, -0.22, 0.0);
  }
  // nose, lips, smile creases, butter on the cheek
  add(head, skinSoft, sphere(0.05, 16, 12), 0, -0.06, 0.47, 0, 0, 0, 1, 0.95, 0.9);
  add(head, lipMat, new THREE.TorusGeometry(0.085, 0.017, 8, 24, Math.PI * 0.75), 0, -0.135, 0.445, 0, 0, -Math.PI * 0.875); // smiling upper lip
  add(head, lipMat, sphere(0.035, 12, 8), 0, -0.245, 0.435, 0, 0, 0, 1.6, 0.55, 0.7); // lower lip
  for (const [x, y, z, r] of [[0.21, -0.2, 0.42, 0.03], [0.265, -0.15, 0.4, 0.02], [-0.02, -0.265, 0.44, 0.016]] as const) add(head, butterMat, sphere(r, 10, 8), x, y, z);
  // tilak: a vertical sandal mark with a dot
  add(head, phys(0xfff2b0, { emissive: 0x9a7b00, emissiveIntensity: 0.5, roughness: 0.4 }), new THREE.CapsuleGeometry(0.014, 0.085, 4, 10), 0, 0.2, 0.465, 0, 0, 0, 1, 1, 0.6);
  add(head, gemRed, sphere(0.014, 8, 8), 0, 0.12, 0.47);
  // brows
  for (const s of [1, -1]) add(head, hairMat, new THREE.TorusGeometry(0.17, 0.017, 6, 20, Math.PI * 0.5), s * 0.18, 0.03, 0.42, 0, 0, Math.PI / 4 - s * 0.1);

  // eyes: white, iris, pupil highlight, upper lid (blinks), lashes
  const lids: THREE_NS.Mesh[] = [];
  const irises: THREE_NS.Object3D[] = [];
  for (const s of [1, -1]) {
    const eye = group(head, s * 0.18, 0.06, 0.4);
    const ball = new THREE.Mesh(sphere(0.125, 28, 20), whiteMat);
    ball.scale.set(1, 1.1, 0.5);
    eye.add(ball);
    const iris = group(eye, 0, -0.005, 0.045);
    const irisMesh = new THREE.Mesh(sphere(0.082, 24, 16), irisMat);
    irisMesh.scale.set(1, 1.08, 0.45);
    iris.add(irisMesh);
    const hi = new THREE.Mesh(sphere(0.024, 10, 8), whiteMat);
    hi.position.set(0.03, 0.04, 0.03);
    iris.add(hi);
    const hi2 = new THREE.Mesh(sphere(0.012, 8, 8), whiteMat);
    hi2.position.set(-0.03, -0.03, 0.03);
    iris.add(hi2);
    irises.push(iris);
    // lid: a skin-coloured half shell that swings down over the eye
    const lidPivot = group(eye, 0, 0.1, 0.03);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.132, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), skin);
    lid.scale.set(1, 1.1, 0.55);
    lid.position.set(0, -0.1, 0);
    lid.rotation.x = -1.2;
    lidPivot.add(lid);
    lids.push(lid);
    // lashes
    const lash = new THREE.Mesh(new THREE.TorusGeometry(0.128, 0.011, 6, 24, Math.PI * 0.85), blackMat);
    lash.position.set(0, -0.005, 0.03);
    lash.rotation.z = Math.PI * 0.075;
    lash.scale.set(1, 1.05, 0.5);
    lidPivot.add(lash);
    lash.position.y = -0.1;
    track(lash.geometry);
    track(lid.geometry);
    track(ball.geometry);
    track(irisMesh.geometry);
    track(hi.geometry);
    track(hi2.geometry);
  }

  // hair: glossy cap + many curls (merged), topknot with a gold band and a flower
  add(head, hairMat, new THREE.SphereGeometry(0.485, 44, 24, 0, Math.PI * 2, 0, 1.12), 0, 0.0, -0.015, -0.1, 0, 0);
  const rng = (() => {
    let s = 7;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();
  // tight ringlets: overlapping small glossy curls in rows from the temples round to the back
  for (let i = 0; i < 84; i++) {
    const u = i / 83;
    const a = -2.5 + u * 5.0;
    const row = i % 4;
    const rr = 0.455 + row * 0.012 + (rng() - 0.5) * 0.03;
    const front = Math.abs(a) < 1.0;
    const y = 0.33 + (row === 0 ? 0.06 : row === 1 ? 0.0 : row === 2 ? -0.07 : -0.14) + Math.cos(a * 1.1) * 0.04 + (front ? 0.02 : -0.04);
    const r = 0.045 + rng() * 0.04;
    add(head, hairMat, sphere(r, 10, 8), Math.sin(a) * rr, y + (rng() - 0.5) * 0.04, Math.cos(a) * rr * 0.97 - 0.03 * (Math.abs(a) > 1.6 ? 1 : 0), 0, 0, 0, 1, 1.3, 1);
  }
  for (let i = 0; i < 9; i++) {
    const a = -0.75 + (i / 8) * 1.5;
    add(head, hairMat, sphere(0.07 + (i % 2) * 0.012, 12, 10), Math.sin(a) * 0.34, 0.42 + Math.cos(a * 2) * 0.03, 0.28 + Math.cos(a) * 0.1);
  }
  add(head, hairMat, sphere(0.17, 22, 16), 0, 0.52, -0.06, 0, 0, 0, 1, 0.85, 1);
  add(head, gold, new THREE.TorusGeometry(0.13, 0.022, 10, 36), 0, 0.46, -0.06, Math.PI / 2, 0, 0);
  add(head, gemGreen, sphere(0.05, 12, 10), 0, 0.62, 0.02);
  // crown band with jewels
  add(head, gold, new THREE.TorusGeometry(0.475, 0.028, 12, 64), 0, 0.27, -0.01, Math.PI / 2 - 0.12, 0, 0);
  for (let i = 0; i < 9; i++) {
    const a = -1.05 + (i / 8) * 2.1;
    add(head, i % 3 === 0 ? gemRed : i % 3 === 1 ? gemGreen : gemBlue, sphere(0.032, 10, 8), Math.sin(a) * 0.478, 0.29 + Math.cos(a) * 0.0, Math.cos(a) * 0.46 - 0.02);
  }
  add(head, gold, new THREE.ConeGeometry(0.05, 0.12, 10), 0, 0.36, 0.45, 0, 0, 0);

  // peacock feather (a plane with a painted feather) on a curved stem
  const feather = new THREE.Mesh(
    track(new THREE.PlaneGeometry(0.46, 0.92)),
    track(new THREE.MeshBasicMaterial({ map: featherTex, transparent: true, side: THREE.DoubleSide, alphaTest: 0.04, toneMapped: false }))
  );
  feather.position.set(0.08, 1.07, -0.1);
  feather.rotation.set(-0.12, 0, -0.26);
  head.add(feather);
  add(head, phys(0x1d7a52, { roughness: 0.6 }), new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.55, -0.05), new THREE.Vector3(0.03, 0.72, -0.1), new THREE.Vector3(0.06, 0.9, -0.12)]), 10, 0.013, 6));

  // ── Arms ──
  const makeArm = (side: 1 | -1) => {
    const shoulder = group(torso, side * 0.44, 0.9, 0);
    const upper = group(shoulder);
    add(upper, skin, new THREE.CylinderGeometry(0.125, 0.105, 0.38, 18, 1), 0, -0.19, 0);
    add(upper, skin, sphere(0.105, 18, 14), 0, -0.38, 0);
    add(upper, gold, new THREE.TorusGeometry(0.12, 0.03, 10, 28), 0, -0.1, 0, Math.PI / 2, 0, 0); // armlet
    add(upper, gemRed, sphere(0.03, 8, 8), side * 0.0, -0.1, 0.13);
    const elbow = group(upper, 0, -0.38, 0);
    const fore = group(elbow);
    add(fore, skin, new THREE.CylinderGeometry(0.1, 0.078, 0.3, 18, 1), 0, -0.15, 0);
    for (let k = 0; k < 3; k++) add(fore, gold, new THREE.TorusGeometry(0.082, 0.014, 8, 22), 0, -0.24 + k * 0.025, 0, Math.PI / 2, 0, 0); // bangles
    const wrist = group(fore, 0, -0.3, 0);
    add(wrist, skinSoft, sphere(0.105, 20, 14), 0, -0.06, 0, 0, 0, 0, 1, 1.05, 0.85);
    for (let f = 0; f < 4; f++) add(wrist, skinSoft, new THREE.CapsuleGeometry(0.026, 0.07, 6, 10), (f - 1.5) * 0.048, -0.17, 0.0, 0.1, 0, (f - 1.5) * 0.12);
    add(wrist, skinSoft, new THREE.CapsuleGeometry(0.03, 0.06, 6, 10), side * -0.1, -0.1, 0.03, 0, 0, side * 0.7);
    return { shoulder, upper, elbow, fore, wrist };
  };
  const armR = makeArm(1);
  const armL = makeArm(-1);

  // ── Legs ──
  const makeLeg = (side: 1 | -1) => {
    const hip = group(pelvis, side * 0.27, 0.12, 0.12);
    add(hip, skin, sphere(0.2, 20, 16));
    add(hip, skin, new THREE.CylinderGeometry(0.2, 0.15, 0.5, 20, 1), 0, -0.25, 0);
    const knee = group(hip, 0, -0.5, 0);
    add(knee, skin, sphere(0.15, 18, 14));
    add(knee, skin, new THREE.CylinderGeometry(0.15, 0.1, 0.4, 18, 1), 0, -0.2, 0);
    const ankle = group(knee, 0, -0.4, 0);
    add(ankle, gold, new THREE.TorusGeometry(0.105, 0.016, 8, 24), 0, 0.03, 0, Math.PI / 2, 0, 0);
    for (let b = 0; b < 8; b++) add(ankle, gold, sphere(0.018, 8, 6), Math.cos((b / 8) * 6.28) * 0.105, 0.0, Math.sin((b / 8) * 6.28) * 0.105);
    add(ankle, skinSoft, sphere(0.13, 18, 14), 0, -0.07, 0.05, 0, 0, 0, 1, 0.75, 1.3);
    for (let k = 0; k < 5; k++) add(ankle, skinSoft, sphere(0.032 - k * 0.002, 8, 6), (k - 2) * 0.05 * side, -0.07, 0.19 - Math.abs(k - 2) * 0.012);
    return { hip, knee, ankle };
  };
  const legR = makeLeg(1);
  const legL = makeLeg(-1);

  // ── Mortar (ukhala) ──
  const mortar = group(root, -1.55, 0, -0.5);
  add(mortar, woodMat, lathe([[0, 0], [0.52, 0], [0.62, 0.04], [0.58, 0.3], [0.46, 0.55], [0.44, 0.7], [0.58, 0.92], [0.66, 1.0], [0.6, 1.05], [0.4, 0.99], [0.34, 0.8], [0, 0.76]], 56));
  add(mortar, ironMat, new THREE.TorusGeometry(0.62, 0.026, 8, 56), 0, 0.1, 0, Math.PI / 2, 0, 0);
  add(mortar, ironMat, new THREE.TorusGeometry(0.64, 0.026, 8, 56), 0, 0.9, 0, Math.PI / 2, 0, 0);
  const mortarKnot = group(mortar, 0.45, 0.58, 0.3);
  add(mortarKnot, ropeMat, sphere(0.09, 14, 10));

  // ── Butter pot ──
  const pot = group(root, 1.0, 0, 0.8);
  add(pot, terracotta, sphere(0.31, 32, 22), 0, 0.3, 0, 0, 0, 0, 1, 0.88, 1);
  add(pot, terracotta, new THREE.TorusGeometry(0.18, 0.045, 10, 32), 0, 0.57, 0, Math.PI / 2, 0, 0);
  add(pot, butterMat, sphere(0.18, 22, 14), 0, 0.57, 0, 0, 0, 0, 1, 0.55, 1);
  for (const [x, z] of [[0.3, 0.1], [0.38, -0.05]] as const) add(pot, butterMat, sphere(0.045, 10, 8), x, 0.08, z, 0, 0, 0, 1, 0.5, 1);

  build();

  // ── The rope: an instanced chain of short striped cylinders along a curve (no per-frame allocation) ──
  const SEG = 30;
  const ropeGeo = track(new THREE.CylinderGeometry(0.036, 0.036, 1, 8, 1, true));
  const ropeInst = new THREE.InstancedMesh(ropeGeo, ropeMat, SEG);
  ropeInst.frustumCulled = false;
  ropeInst.castShadow = true;
  root.add(ropeInst);
  const gap = new THREE.Mesh(track(new THREE.TorusGeometry(0.1, 0.014, 8, 28)), track(new THREE.MeshBasicMaterial({ color: 0xffd45e, toneMapped: false })));
  gap.visible = false;
  root.add(gap);

  const pA = new THREE.Vector3();
  const pB = new THREE.Vector3();
  const pE = new THREE.Vector3();
  const m1 = new THREE.Vector3();
  const m2 = new THREE.Vector3();
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
  const up = new THREE.Vector3(0, 1, 0);
  const q = new THREE.Quaternion();
  const mat4 = new THREE.Matrix4();
  const ones = new THREE.Vector3(1, 1, 1);
  const c0 = new THREE.Vector3();
  const c1 = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const updateRope = (tension: number, reach: number) => {
    if (reach < 0.03) {
      ropeInst.visible = false;
      gap.visible = false;
      return;
    }
    ropeInst.visible = true;
    root.updateWorldMatrix(true, true);
    ropeKnotNode.getWorldPosition(pA);
    mortarKnot.getWorldPosition(pB);
    root.worldToLocal(pA);
    root.worldToLocal(pB);
    pE.lerpVectors(pB, pA, reach);
    const sag = (1 - tension) * 0.4;
    m1.lerpVectors(pB, pE, 0.33);
    m2.lerpVectors(pB, pE, 0.66);
    m1.y = Math.max(0.05, m1.y - sag - 0.04);
    m2.y = Math.max(0.05, m2.y - sag);
    const pts = curve.points;
    pts[0].copy(pB);
    pts[1].copy(m1);
    pts[2].copy(m2);
    pts[3].copy(pE);
    for (let i = 0; i < SEG; i++) {
      curve.getPoint(i / SEG, c0);
      curve.getPoint((i + 1) / SEG, c1);
      dir.subVectors(c1, c0);
      const len = dir.length() || 0.001;
      dir.divideScalar(len);
      q.setFromUnitVectors(up, dir);
      mid.addVectors(c0, c1).multiplyScalar(0.5);
      scl.set(1, len * 1.12, 1);
      mat4.compose(mid, q, scl);
      ropeInst.setMatrixAt(i, mat4);
    }
    ropeInst.instanceMatrix.needsUpdate = true;
    gap.visible = reach < 0.985;
    if (gap.visible) {
      gap.position.lerpVectors(pE, pA, 0.5);
      gap.lookAt(pA);
    }
  };

  // ── Animation ─────────────────────────────────────────────────────
  const dirOut: Director = { focusX: 0.4, fall: 0, burst: 0, orbs: 0, kx: 0, stuck: 0, mortarX: -1.55, crawlW: 0 };
  let lastTension = -1;
  let lastReach = -1;

  const update = (t: number, d: Direction): Director => {
    const ch = d.chapter;
    const s = ch ?? 0;
    const story = ch !== null;

    // ── director: what the pastime asks for at this scroll position ──
    const reachOut = story ? 1 - sm(s, 0.7, 1.1) : 0; // right hand reaching for the butter
    const ropeReach = !story ? 1 : s < 1 ? 0 : s < 2 ? lerp(0.02, 0.86, sm(s, 1.0, 1.9)) : lerp(0.86, 1, sm(s, 2.0, 2.5));
    const bound = story ? sm(s, 2.0, 2.5) : 0;
    const crawlW = story ? sm(s, 3.0, 3.45) : 0;
    const crawlMove = story ? sm(s, 3.3, 4.2) : 0;
    const kx = lerp(STAGE.kStart, STAGE.kEnd, crawlMove);
    const mortarX = Math.min(kx - STAGE.drag, STAGE.mortarStop);
    const stuck = story ? sm(kx, STAGE.mortarStop + STAGE.drag - 0.4, STAGE.mortarStop + STAGE.drag) : 0; // rope taut, mortar jammed
    const fall = story ? sm(s, 4.25, 4.8) : 0;
    const burst = story ? sm(s, 4.3, 4.6) * (1 - sm(s, 4.9, 5.0) * 0.4) : 0;
    const orbs = story ? sm(s, 4.5, 5.0) : 0;
    const lookUp = story ? sm(s, 4.5, 4.9) : 0;

    let tug = d.tug;
    let look = d.look;
    if (story) {
      tug = lerp(lerp(0.2, 1, sm(s, 1.0, 1.4)), 0.25, bound);
      look = lerp(lerp(0.9 * reachOut, -0.7, 1 - reachOut), 0, bound);
      tug = lerp(tug, 0.9, stuck);
    }
    const grin = 1 + 0.5 * bound + 0.2 * lookUp;

    // ── whole body ──
    const burst0 = Math.max(0, Math.sin(t * 1.35)) ** 2;
    const pull = clamp01(tug) * (story ? 0.55 + 0.45 * burst0 : 0.35 + 0.65 * burst0);
    const cph = t * 5.2; // crawl phase, advances only while He moves
    const moving = story ? sm(s, 3.3, 3.5) * (1 - stuck * 0.8) * (1 - sm(s, 4.0, 4.3)) + stuck * 0.35 : 0;
    const swing = Math.sin(cph) * moving;
    const swing2 = Math.sin(cph + Math.PI) * moving;

    kr.position.x = kx + pull * 0.12 * (1 - crawlW);
    kr.position.z = lerp(0, 0.25, crawlW) - 0.95 * crawlMove;
    kr.rotation.y = lerp(0.35 + look * 0.45, 1.3, crawlW);
    kr.rotation.z = -pull * 0.08 * (1 - crawlW);

    // pelvis height: sitting on the ground vs. up on hands and knees
    const breathe = 1 + Math.sin(t * 1.7) * 0.012;
    pelvis.position.y = lerp(0.42, 0.62, crawlW) + Math.abs(swing) * 0.03 * crawlW;
    torso.scale.set(breathe, breathe, breathe);
    torso.rotation.x = lerp(0, 1.32, crawlW) + Math.sin(cph * 1) * 0.04 * moving;
    torso.rotation.z = swing * 0.05;

    // head: follows the look, level when crawling, tipping up to the light
    head.rotation.set(
      lerp(0.1 + Math.sin(t * 0.8) * 0.03, -1.15 - lookUp * 0.45, crawlW),
      Math.sin(t * 0.6) * 0.1 - 0.2 + look * 0.4 - crawlW * 0.1,
      Math.sin(t * 0.9) * 0.05 - pull * 0.06
    );
    feather.rotation.z = -0.26 + Math.sin(t * 1.3) * 0.05;

    // eyes: blink + gaze
    const phase = (t % 4.2) / 4.2;
    const blink = phase > 0.955 ? 1 - Math.abs((phase - 0.9775) / 0.0225) : 0;
    lids.forEach((l) => (l.rotation.x = lerp(-1.2, 0.15, clamp01(blink))));
    irises.forEach((i) => i.position.set(-0.012 + look * 0.03, -0.012 + lookUp * 0.03, 0.045));

    // arms
    const crawlArmX = -torso.rotation.x; // keep the arms pointing at the ground while the torso leans
    armL.shoulder.rotation.set(lerp(0.1 + pull * 0.2, crawlArmX + swing * 0.55, crawlW), 0, lerp(-0.85 - pull * 0.2, -0.12, crawlW));
    armL.elbow.rotation.set(lerp(-0.5 - pull * 0.4, -0.15 + Math.max(0, -swing) * 0.4, crawlW), lerp(-0.5, 0, crawlW), 0);
    armR.shoulder.rotation.set(
      lerp(lerp(0.25, 1.0, reachOut), crawlArmX + swing2 * 0.55, crawlW),
      lerp(lerp(0, -0.35, reachOut), 0, crawlW),
      lerp(lerp(0.75 + Math.sin(t * 2.1) * 0.04, 0.55, reachOut), 0.12, crawlW)
    );
    armR.elbow.rotation.set(lerp(lerp(-2.05, -0.35, reachOut), -0.15 + Math.max(0, -swing2) * 0.4, crawlW), 0, 0);
    armR.wrist.rotation.x = lerp(0, 0.3, crawlW);
    armL.wrist.rotation.x = lerp(0, 0.3, crawlW);

    // legs: out in front when sitting; folded under (knees on the ground) when crawling
    const spread = 0.38;
    legR.hip.rotation.set(lerp(-1.4, -0.1 - swing2 * 0.25, crawlW), 0, lerp(spread, 0.05, crawlW));
    legL.hip.rotation.set(lerp(-1.4, -0.1 - swing * 0.25, crawlW), 0, lerp(-spread, -0.05, crawlW));
    legR.knee.rotation.set(lerp(0.45, 1.5 + Math.max(0, swing2) * 0.25, crawlW), 0, 0);
    legL.knee.rotation.set(lerp(0.45, 1.5 + Math.max(0, swing) * 0.25, crawlW), 0, 0);
    legR.ankle.rotation.x = lerp(-0.3, 0.7, crawlW);
    legL.ankle.rotation.x = lerp(-0.3, 0.7, crawlW);

    // rope knot sits on His side when seated, on His back when crawling
    ropeKnotNode.position.set(lerp(-0.52, 0, crawlW), lerp(0.34, 0.3, crawlW), lerp(-0.1, -0.52, crawlW));

    // mortar + pot
    mortar.position.x = lerp(-1.55 + pull * 0.08, mortarX, crawlW);
    mortar.position.z = -0.5 - 0.95 * crawlMove;
    mortar.rotation.z = Math.sin(t * 22) * 0.012 * pull + stuck * Math.sin(t * 17) * 0.02;
    mortar.rotation.y = lerp(0, 0.6, crawlW);
    pot.rotation.z = story ? Math.sin(t * 7) * 0.06 * reachOut : 0;

    // rope
    const tension = clamp01(0.35 + pull * 0.65 + stuck * 0.4);
    if (crawlW > 0.01 || stuck > 0 || Math.abs(tension - lastTension) > 0.01 || Math.abs(ropeReach - lastReach) > 0.004 || lastTension < 0) {
      lastTension = tension;
      lastReach = ropeReach;
      updateRope(tension, ropeReach);
    }
    if (gap.visible) {
      const k = 1 + Math.sin(t * 6) * 0.18;
      gap.scale.set(k, k, k);
    }

    // smile
    // (lips are static geometry; the grin is expressed through the head tilt and the lids)
    void grin;

    dirOut.kx = kx;
    dirOut.focusX = lerp(lerp(0.4, kx + 1.1, sm(s, 3.0, 3.6)), (STAGE.treeL + STAGE.treeR) / 2 + 0.1, sm(s, 3.9, 4.4));
    dirOut.fall = fall;
    dirOut.burst = burst;
    dirOut.orbs = orbs;
    dirOut.stuck = stuck;
    dirOut.mortarX = mortar.position.x;
    dirOut.crawlW = crawlW;
    return dirOut;
  };

  update(0, { chapter: null, look: 0, tug: 0.4 });

  const dispose = () => {
    ropeInst.dispose();
    disposables.forEach((x) => x.dispose());
  };

  return { group: root, update, dispose };
}
