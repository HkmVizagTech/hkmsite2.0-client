// Makhan Chor "steal" performance cut from a Gemini (Veo) green-screen video: kneeling by the pot holding the rope,
// glancing around, winking, scooping butter and showing it. 72 frames at 12 fps in a 10-column grid (169x272).
// ROPE_TOP[i]: where the rope leaves the top of frame i (fraction of frame width). KID_SPAN: share of the frame
// height his body takes (the rest is rope above him), so he matches the size of the other pictures.
export const BUTTER_STEAL = { file: "butter-steal", frames: 72, cols: 10, rows: 8, w: 169, h: 272, fps: 12, kidSpan: 0.875 };
export const BUTTER_ROPE_TOP = [
  0.8993, 0.8993, 0.8993, 0.8993, 0.8993, 0.8993, 0.9016, 0.8993, 0.8949, 0.8926, 0.8881, 0.8881, 0.8881, 0.8881, 0.8881,
  0.8881, 0.8881, 0.8881, 0.8904, 0.8904, 0.8926, 0.8926, 0.8926, 0.8949, 0.8949, 0.8971, 0.8971, 0.8949, 0.8926,
  0.8904, 0.8904, 0.8904, 0.8926, 0.8926, 0.8904, 0.8904, 0.8904, 0.8904, 0.8926, 0.8949, 0.8993, 0.9038, 0.906,
  0.9083, 0.906, 0.9038, 0.9038, 0.9038, 0.9038, 0.9083, 0.9105, 0.9083, 0.9038, 0.8993, 0.8949, 0.8904, 0.8881,
  0.8881, 0.8904, 0.8949, 0.8993, 0.9016, 0.9016, 0.8993, 0.8949, 0.8949, 0.8949, 0.8949, 0.8993, 0.9016, 0.8993,
  0.8949,
];
