"use client";

import { useEffect } from "react";
import { scrollToTopNow } from "@/lib/scrollTop";

/** Opens the page at the top whenever `k` changes (e.g. moving from one centre's page to another's). */
export default function ScrollToTop({ k }: { k: string }) {
  useEffect(() => { scrollToTopNow(); }, [k]);
  return null;
}
