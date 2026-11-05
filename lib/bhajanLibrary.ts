"use client";

// Personal library (liked bhajans, followed composers / saved collections, recently played).
// Stored in localStorage, synced across tabs with the `storage` event, SSR-safe via useSyncExternalStore.
import { useCallback, useSyncExternalStore } from "react";

const KEY = "hkm-bhajan-library-v1";
export const RECENT_LIMIT = 30;

export interface LikedBhajan { slug: string; title: string; artist: string; coverImage: string; at: number }
/** `type` is "author" for composers; categories, moods and festivals can be saved too. */
export interface FollowedItem { type: "author" | "category" | "mood" | "festival"; slug: string; name: string; image: string; at: number }
export interface RecentBhajan { slug: string; title: string; artist: string; coverImage: string; at: number }
export interface LibraryData { liked: LikedBhajan[]; following: FollowedItem[]; recent: RecentBhajan[] }
export type BhajanSnapshot = Pick<LikedBhajan, "slug" | "title" | "artist" | "coverImage">;

const EMPTY: LibraryData = { liked: [], following: [], recent: [] };
let cache: { raw: string | null; data: LibraryData } = { raw: null, data: EMPTY };
let memoryOnly = false;
const listeners = new Set<() => void>();

const arr = <T,>(v: unknown, ok: (x: Record<string, unknown>) => boolean): T[] =>
  Array.isArray(v) ? (v.filter((x) => x && typeof x === "object" && ok(x as Record<string, unknown>)) as T[]) : [];

function parse(raw: string | null): LibraryData {
  if (!raw) return EMPTY;
  try {
    const j = JSON.parse(raw);
    return {
      liked: arr<LikedBhajan>(j.liked, (x) => typeof x.slug === "string"),
      following: arr<FollowedItem>(j.following, (x) => typeof x.slug === "string" && typeof x.type === "string"),
      recent: arr<RecentBhajan>(j.recent, (x) => typeof x.slug === "string"),
    };
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): LibraryData {
  if (typeof window === "undefined" || memoryOnly) return cache.data;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cache.data;
  }
  if (raw !== cache.raw) cache = { raw, data: parse(raw) };
  return cache.data;
}
const getServerSnapshot = () => EMPTY;

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: LibraryData) {
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, raw);
    memoryOnly = false;
  } catch {
    memoryOnly = true;
  }
  cache = { raw, data: next };
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const followId = (type: string, slug: string) => `${type}:${slug}`;

// ---- imperative helpers (safe to call from anywhere on the client) ----
export function toggleLike(b: BhajanSnapshot): boolean {
  if (typeof window === "undefined") return false;
  const d = getSnapshot();
  const had = d.liked.some((x) => x.slug === b.slug);
  commit({
    ...d,
    liked: had ? d.liked.filter((x) => x.slug !== b.slug) : [{ slug: b.slug, title: b.title, artist: b.artist || "", coverImage: b.coverImage || "", at: Date.now() }, ...d.liked],
  });
  return !had;
}

export function toggleFollow(f: Omit<FollowedItem, "at">): boolean {
  if (typeof window === "undefined") return false;
  const d = getSnapshot();
  const id = followId(f.type, f.slug);
  const had = d.following.some((x) => followId(x.type, x.slug) === id);
  commit({
    ...d,
    following: had ? d.following.filter((x) => followId(x.type, x.slug) !== id) : [{ ...f, image: f.image || "", at: Date.now() }, ...d.following],
  });
  return !had;
}

/** Call when a bhajan starts playing. Keeps the last 30, newest first, no duplicates. */
export function recordPlay(slug: string, info: Partial<Pick<RecentBhajan, "title" | "artist" | "coverImage">> = {}): void {
  if (typeof window === "undefined" || !slug) return;
  const d = getSnapshot();
  if (d.recent[0]?.slug === slug) return;
  const prev = d.recent.find((x) => x.slug === slug);
  const entry: RecentBhajan = {
    slug,
    title: info.title || prev?.title || slug.replace(/-/g, " "),
    artist: info.artist ?? prev?.artist ?? "",
    coverImage: info.coverImage ?? prev?.coverImage ?? "",
    at: Date.now(),
  };
  commit({ ...d, recent: [entry, ...d.recent.filter((x) => x.slug !== slug)].slice(0, RECENT_LIMIT) });
}

export function clearRecent(): void {
  if (typeof window === "undefined") return;
  commit({ ...getSnapshot(), recent: [] });
}

export function useBhajanLibrary() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  /** false during SSR and the hydration pass, true afterwards: render empty/neutral UI until then. */
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const isLiked = useCallback((slug: string) => data.liked.some((x) => x.slug === slug), [data.liked]);
  const isFollowing = useCallback((type: FollowedItem["type"], slug: string) => data.following.some((x) => x.type === type && x.slug === slug), [data.following]);
  return { ...data, ready, isLiked, isFollowing, toggleLike, toggleFollow, recordPlay, clearRecent };
}
