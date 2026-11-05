"use client";

import { clientFetchBhajan, tracksToQueue, type QueueItem } from "@/lib/bhajans";

const cache = new Map<string, Promise<QueueItem[]>>();

/** Queue items (all recordings) for a bhajan, fetched once and cached for the session. */
export function fetchQueue(slug: string): Promise<QueueItem[]> {
  let p = cache.get(slug);
  if (!p) {
    p = clientFetchBhajan(slug).then((d) => (d ? tracksToQueue(d) : []));
    cache.set(slug, p);
    p.then((q) => {
      if (!q.length) cache.delete(slug); // allow a retry after a failed or empty fetch
    });
  }
  return p;
}
