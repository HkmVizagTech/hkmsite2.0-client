// Typed helpers for the Bhajans taxonomy API (authors, categories, moods, festivals).
// Server helpers cache for 5 minutes and never throw.
import { API_URL, type BhajanSummary } from "@/lib/bhajans";

export type TaxonomyType = "author" | "category" | "mood" | "festival";
export type L10n = { en?: string; te?: string; hi?: string };

export interface TaxonomyItem {
  type: TaxonomyType;
  slug: string;
  name: L10n;
  description: L10n;
  image: string;
  order: number;
  songCount: number;
  audioCount: number;
  topSongs?: BhajanSummary[];
}

export const TAXONOMY_META: Record<TaxonomyType, { segment: string; singular: string; plural: string; query: "artist" | "category" | "mood" | "festival" }> = {
  author: { segment: "authors", singular: "Composer", plural: "Composers", query: "artist" },
  category: { segment: "categories", singular: "Category", plural: "Categories", query: "category" },
  mood: { segment: "moods", singular: "Mood", plural: "Moods", query: "mood" },
  festival: { segment: "festivals", singular: "Festival", plural: "Festivals", query: "festival" },
};

export function taxonomyHref(type: TaxonomyType, slug?: string): string {
  const seg = TAXONOMY_META[type].segment;
  return slug ? `/bhajans/${seg}/${slug}` : `/bhajans/${seg}`;
}

/** Locale value when present, otherwise English, otherwise any other language. */
export function pickL10n(v: L10n | undefined, lang?: string): string {
  if (!v) return "";
  const l = (lang === "te" || lang === "hi" ? lang : "en") as keyof L10n;
  return (v[l] || v.en || v.te || v.hi || "").trim();
}

function normalize(j: Partial<TaxonomyItem>): TaxonomyItem {
  return {
    type: j.type as TaxonomyType,
    slug: j.slug || "",
    name: j.name || {},
    description: j.description || {},
    image: j.image || "",
    order: j.order ?? 0,
    songCount: j.songCount || 0,
    audioCount: j.audioCount || 0,
    topSongs: j.topSongs,
  };
}

export async function fetchTaxonomyList(type: TaxonomyType, opts: { q?: string; limit?: number } = {}): Promise<TaxonomyItem[]> {
  try {
    const p = new URLSearchParams();
    if (opts.q) p.set("q", opts.q);
    if (opts.limit) p.set("limit", String(opts.limit));
    const s = p.toString();
    const res = await fetch(`${API_URL}/bhajans/taxonomy/${type}${s ? `?${s}` : ""}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const j = await res.json();
    return (j.items || []).map(normalize);
  } catch {
    return [];
  }
}

export async function fetchTaxonomyItem(type: TaxonomyType, slug: string): Promise<TaxonomyItem | null> {
  try {
    const res = await fetch(`${API_URL}/bhajans/taxonomy/${type}/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return normalize(await res.json());
  } catch {
    return null;
  }
}

export const initialsOf = (name: string): string => {
  const w = name.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (!w.length) return "ॐ";
  return (w[0][0] + (w[1]?.[0] || "")).toUpperCase();
};

export function strHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
