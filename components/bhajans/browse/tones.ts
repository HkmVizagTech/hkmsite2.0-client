/** Curated Spotify-style tile palette: rich blues, indigos, teals, violets, ambers. White text passes AA on all. */
export const TILE_COLORS = [
  "#1e3a8a", "#6d28d9", "#0f766e", "#b45309", "#1d4ed8", "#9d174d", "#0e7490", "#4338ca",
  "#7e22ce", "#0369a1", "#a16207", "#115e59", "#3730a3", "#be185d", "#1e40af", "#86198f",
];

export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function initials(name: string): string {
  const w = name.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (!w.length) return "ॐ";
  return (w[0][0] + (w[1]?.[0] || "")).toUpperCase();
}

export const GOLD = "#F6C752";
export const BODY_BG = "#ffffff";
export const MUTED = "text-vk-700";
export const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vk-500";
export const RESULTS_ID = "bhajan-results";

/** Blue-family tile tones (white text passes AA on every one). */
export const BLUE_TONES = ["#0b1745", "#15308a", "#1e3a8a", "#2b52c9", "#3b63d8", "#0f4c75", "#3730a3", "#334e8a"];
