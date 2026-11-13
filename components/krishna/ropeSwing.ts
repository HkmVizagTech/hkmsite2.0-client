// "Krishna on the rope" performance cut from a Gemini (Veo) green-screen video: swing, giggle, wink, wave.
// 79 frames at 12 fps in a 10-column grid (201x272 each). ROPE_TOP[i] is where the rope leaves the top edge of
// frame i, as a fraction of the frame width; the on-screen physics rope is joined to that point every frame.
export const ROPE_SWING = { file: "rope-swing", frames: 79, cols: 10, rows: 8, w: 201, h: 272, fps: 12 };

export const ROPE_TOP = [
  0.3959, 0.3846, 0.379, 0.379, 0.3846, 0.3959, 0.4109, 0.4315, 0.4522, 0.4728, 0.4934, 0.5122, 0.5291, 0.5441, 0.5647,
  0.5872, 0.6173, 0.6473, 0.6867, 0.7298, 0.7824, 0.8274, 0.8218, 0.8105, 0.8011, 0.7917, 0.7842, 0.7805, 0.7786,
  0.7842, 0.7974, 0.8143, 0.833, 0.848, 0.8574, 0.8668, 0.8724, 0.878, 0.8799, 0.8762, 0.8705, 0.863, 0.8537, 0.8424,
  0.8293, 0.8199, 0.8086, 0.7992, 0.7917, 0.7861, 0.7842, 0.788, 0.7936, 0.8011, 0.8143, 0.8255, 0.8368, 0.848,
  0.8574, 0.8668, 0.8724, 0.878, 0.8799, 0.8799, 0.8762, 0.8724, 0.8649, 0.8574, 0.8274, 0.7711, 0.7054, 0.6398,
  0.5722, 0.5197, 0.4822, 0.4672, 0.4634, 0.4653, 0.469,
];
