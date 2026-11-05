"use client";

import { useCallback, useState } from "react";
import { usePlayerActions } from "../playerContext";
import { fetchQueue } from "./queueFetch";
import { showToast } from "../toast";
import type { QueueItem } from "@/lib/bhajans";

const MAX = 40;

/** Play (or shuffle) a list of bhajans: the first recording of each one that has audio. */
export function usePlayAll() {
  const { play, setShuffle } = usePlayerActions();
  const [busy, setBusy] = useState<"" | "play" | "shuffle">("");
  const run = useCallback(
    async (getSlugs: () => string[] | Promise<string[]>, shuffle: boolean) => {
      setBusy(shuffle ? "shuffle" : "play");
      try {
        const slugs = (await getSlugs()).slice(0, MAX);
        const lists = await Promise.all(slugs.map((s) => fetchQueue(s)));
        const q = lists.map((l) => l[0]).filter(Boolean) as QueueItem[];
        if (!q.length) {
          showToast("No audio recordings here yet.", "error");
          return;
        }
        setShuffle(shuffle);
        play(q, shuffle ? Math.floor(Math.random() * q.length) : 0);
        showToast(shuffle ? `Shuffling ${q.length} bhajan${q.length === 1 ? "" : "s"}` : `Playing ${q.length} bhajan${q.length === 1 ? "" : "s"}`);
      } finally {
        setBusy("");
      }
    },
    [play, setShuffle],
  );
  return { busy, run };
}
