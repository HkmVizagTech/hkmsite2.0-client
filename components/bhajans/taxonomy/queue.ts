"use client";
import { clientFetchBhajan, clientFetchBhajanList, tracksToQueue, type BhajanQuery, type QueueItem } from "@/lib/bhajans";

/** Builds a player queue (first recording of each bhajan) from slugs, or from a list query (audio bhajans only). */
export async function loadQueue(src: { slugs: string[] } | { query: BhajanQuery }, max = 40): Promise<QueueItem[]> {
  let slugs: string[];
  if ("slugs" in src) slugs = src.slugs;
  else {
    const l = await clientFetchBhajanList({ ...src.query, hasAudio: true, limit: 60 });
    slugs = l.items.map((i) => i.slug);
  }
  const details = await Promise.all(slugs.slice(0, max).map((s) => clientFetchBhajan(s)));
  const out: QueueItem[] = [];
  for (const d of details) {
    if (!d) continue;
    const q = tracksToQueue(d)[0];
    if (q) out.push(q);
  }
  return out;
}

export function shuffled<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
