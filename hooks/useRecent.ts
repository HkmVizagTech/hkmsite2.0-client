"use client";

import { useEffect, useState } from "react";

// Recently-viewed is a list of product slugs, newest first, stored per
// browser. Powers the "Recently viewed" rail on the shop page — the
// standard e-commerce way to help a shopper find the thing they saw but
// didn't add, without making them search for it again.
const STORAGE_KEY = "hkm_shop_recent";
const MAX_ITEMS = 12;

function readSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string").slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

/** Record a product visit (dedupes and moves the slug to the front). */
export function recordRecentView(slug: string) {
  if (typeof window === "undefined" || !slug) return;
  const next = [slug, ...readSlugs().filter((s) => s !== slug)].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked — recently-viewed is a nicety, never a requirement.
  }
  window.dispatchEvent(new Event("hkm:recent"));
}

/** Subscribe to the recently-viewed list. Slugs arrive before hydration. */
export function useRecentlyViewed() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(readSlugs());
    sync();
    window.addEventListener("hkm:recent", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hkm:recent", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return slugs;
}
