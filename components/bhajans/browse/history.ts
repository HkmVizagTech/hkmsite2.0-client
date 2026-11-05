"use client";

// One play history for the whole module: it lives in lib/bhajanLibrary ("recent"). These are thin wrappers.
import { clearRecent, recordPlay, useBhajanLibrary, type RecentBhajan } from "@/lib/bhajanLibrary";

export type HistoryItem = RecentBhajan;

/** Record that a bhajan started playing (newest first, no duplicates). */
export function pushHistory(item: { slug: string; title: string; artist?: string; coverImage?: string }): void {
  recordPlay(item.slug, { title: item.title, artist: item.artist, coverImage: item.coverImage });
}

export function clearHistory(): void {
  clearRecent();
}

/** SSR-safe: empty during SSR and hydration, then the stored list. */
export function useHistory(): HistoryItem[] {
  const { ready, recent } = useBhajanLibrary();
  return ready ? recent : [];
}
