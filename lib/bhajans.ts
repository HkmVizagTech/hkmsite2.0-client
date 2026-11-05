// Typed helpers for the public Bhajans API (see the shared bhajans contract).
// Server helpers cache for 5 minutes and never throw: an unreachable API gives
// empty data so pages still render.

export type LangCode = "en" | "te" | "hi";

export interface BhajanTrack {
  _id?: string;
  singer?: string;
  url: string;
  duration?: number;
  order?: number;
  bytes?: number;
  /** Start time (seconds) of each verse, index-aligned to `verses` (may be shorter or empty). */
  verseTimes?: number[];
}

export interface BhajanSummary {
  _id: string;
  slug: string;
  title: string;
  artist: string;
  authorSlug?: string;
  categories: string[];
  moods: string[];
  festivals: string[];
  languages: string[];
  coverImage: string;
  isFeatured: boolean;
  hasAudio: boolean;
  trackCount: number;
  duration: number;
  playCount: number;
}

export interface BhajanVerse {
  number?: number;
  text?: Partial<Record<LangCode, string[]>>;
  translation?: Partial<Record<LangCode, string>>;
  wordByWord?: Partial<Record<LangCode, { word: string; meaning: string }[]>>;
}

export interface Bhajan extends BhajanSummary {
  subtitle?: string;
  tracks: BhajanTrack[];
  verses: BhajanVerse[];
  lyricsText?: string;
  source?: { name?: string; url?: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface FacetCount {
  slug: string;
  label: string;
  count: number;
}

export interface BhajanMeta {
  categories: FacetCount[];
  moods: FacetCount[];
  festivals: FacetCount[];
  artists: { slug: string; name: string; count: number }[];
  totals: { bhajans: number; withAudio: number };
}

export interface BhajanList {
  items: BhajanSummary[];
  total: number;
  page: number;
  pages: number;
}

export interface BhajanQuery {
  q?: string;
  category?: string;
  mood?: string;
  festival?: string;
  artist?: string;
  featured?: boolean;
  hasAudio?: boolean;
  sort?: "featured" | "new" | "title" | "plays";
  page?: number;
  limit?: number;
}

export const EMPTY_META: BhajanMeta = {
  categories: [],
  moods: [],
  festivals: [],
  artists: [],
  totals: { bhajans: 0, withAudio: 0 },
};
export const EMPTY_LIST: BhajanList = { items: [], total: 0, page: 1, pages: 0 };

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

/** Hero banner (inked portrait collage of the Acharyas), hosted on R2. Change here to swap everywhere. */
// The inked portrait collage of the Acharyas used on the source site's bhajans index (desktop + mobile versions).
export const BHAJANS_HERO_BANNER =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/bhajans/branding/index-banner-desktop.webp";
export const BHAJANS_HERO_BANNER_MOBILE =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/bhajans/branding/index-banner-mobile.webp";
// The purple portrait of Srila Prabhupada the source site uses behind each song's header.
export const BHAJANS_SONG_BANNER =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/bhajans/branding/hero-portrait-bg.png";

export const LANG_LABEL: Record<string, string> = {
  en: "English",
  te: "తెలుగు",
  hi: "हिन्दी",
};
export const LANG_ORDER = ["en", "te", "hi"];

export function buildQuery(q: BhajanQuery): string {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  if (q.category) p.set("category", q.category);
  if (q.mood) p.set("mood", q.mood);
  if (q.festival) p.set("festival", q.festival);
  if (q.artist) p.set("artist", q.artist);
  if (q.featured) p.set("featured", "true");
  if (q.hasAudio) p.set("hasAudio", "true");
  if (q.sort) p.set("sort", q.sort);
  if (q.page && q.page > 1) p.set("page", String(q.page));
  if (q.limit) p.set("limit", String(q.limit));
  const s = p.toString();
  return s ? `?${s}` : "";
}

// ---- server (cached) ----
export async function fetchBhajanList(q: BhajanQuery = {}): Promise<BhajanList> {
  try {
    const res = await fetch(`${API_URL}/bhajans${buildQuery(q)}`, { next: { revalidate: 300 } });
    if (!res.ok) return EMPTY_LIST;
    const j = await res.json();
    return { items: j.items || [], total: j.total || 0, page: j.page || 1, pages: j.pages || 0 };
  } catch {
    return EMPTY_LIST;
  }
}

export async function fetchBhajanMeta(): Promise<BhajanMeta> {
  try {
    const res = await fetch(`${API_URL}/bhajans/meta`, { next: { revalidate: 300 } });
    if (!res.ok) return EMPTY_META;
    const j = await res.json();
    return {
      categories: j.categories || [],
      moods: j.moods || [],
      festivals: j.festivals || [],
      artists: j.artists || [],
      totals: j.totals || EMPTY_META.totals,
    };
  } catch {
    return EMPTY_META;
  }
}

export async function fetchBhajanBySlug(slug: string): Promise<Bhajan | null> {
  try {
    const res = await fetch(`${API_URL}/bhajans/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const j = await res.json();
    return { ...j, tracks: j.tracks || [], verses: j.verses || [], languages: j.languages || [] } as Bhajan;
  } catch {
    return null;
  }
}

// ---- client ----
export async function clientFetchBhajanList(q: BhajanQuery, signal?: AbortSignal): Promise<BhajanList> {
  try {
    const res = await fetch(`${API_URL}/bhajans${buildQuery(q)}`, { signal });
    if (!res.ok) return EMPTY_LIST;
    const j = await res.json();
    return { items: j.items || [], total: j.total || 0, page: j.page || 1, pages: j.pages || 0 };
  } catch {
    return EMPTY_LIST;
  }
}

export async function clientFetchBhajan(slug: string): Promise<Bhajan | null> {
  try {
    const res = await fetch(`${API_URL}/bhajans/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return (await res.json()) as Bhajan;
  } catch {
    return null;
  }
}

export function postPlay(slug: string): void {
  try {
    void fetch(`${API_URL}/bhajans/${encodeURIComponent(slug)}/play`, { method: "POST", keepalive: true }).catch(() => {});
  } catch {
    /* ignore */
  }
}

// ---- helpers ----
export function fmtDuration(sec?: number): string {
  if (!sec || !isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function labelOf(list: FacetCount[], slug: string): string {
  return list.find((x) => x.slug === slug)?.label || slug.replace(/-/g, " ");
}

/** Languages present in the verses (ordered), falling back to the document's `languages`. */
export function presentLanguages(b: Bhajan): string[] {
  const set = new Set<string>();
  for (const v of b.verses || []) {
    for (const k of Object.keys(v.text || {})) if ((v.text as Record<string, string[]>)[k]?.length) set.add(k);
  }
  const out = LANG_ORDER.filter((l) => set.has(l));
  return out.length ? out : (b.languages || []).filter((l) => LANG_ORDER.includes(l));
}

export function lyricsAsText(b: Bhajan, lang: string): string {
  return (b.verses || [])
    .map((v) => (v.text?.[lang as LangCode] || []).join("\n"))
    .filter(Boolean)
    .join("\n\n");
}

/** Queue item used by the player. */
export interface QueueItem {
  slug: string;
  title: string;
  artist: string;
  coverImage: string;
  singer: string;
  url: string;
  duration: number;
  key: string;
  verseTimes?: number[];
  verseCount?: number;
}

export function tracksToQueue(b: Pick<Bhajan, "slug" | "title" | "artist" | "coverImage" | "tracks"> & { verses?: unknown[] }): QueueItem[] {
  return (b.tracks || [])
    .filter((t) => t.url)
    .sort((a, c) => (a.order ?? 0) - (c.order ?? 0))
    .map((t, i) => ({
      slug: b.slug,
      title: b.title,
      artist: b.artist,
      coverImage: b.coverImage || "",
      singer: t.singer || "",
      url: t.url,
      duration: t.duration || 0,
      key: `${b.slug}:${t._id || i}`,
      verseTimes: Array.isArray(t.verseTimes) && t.verseTimes.length ? t.verseTimes : undefined,
      verseCount: b.verses?.length,
    }));
}
