"use client";

import { useCallback, useState } from "react";
import { usePlayer, usePlayerActions } from "../playerContext";
import { fetchQueue } from "./queueFetch";
import { showToast } from "../toast";

/** Play / pause state and handler for a bhajan identified by slug (queue is fetched on demand). */
export function usePlaySlug(slug: string) {
  const { current, playing } = usePlayer();
  const { play, toggle } = usePlayerActions();
  const [busy, setBusy] = useState(false);
  const isCurrent = current?.slug === slug;
  const showPause = isCurrent && playing;
  const onPlay = useCallback(async () => {
    if (isCurrent) return toggle();
    setBusy(true);
    const q = await fetchQueue(slug);
    setBusy(false);
    if (q.length) play(q, 0);
    else showToast("This bhajan has no audio yet.", "error");
  }, [isCurrent, toggle, slug, play]);
  return { isCurrent, showPause, busy, onPlay };
}
