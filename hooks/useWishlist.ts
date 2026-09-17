"use client";

import { useCallback, useEffect, useState } from "react";

// The wishlist is a lightweight "save for later" list: product ids only,
// persisted per browser. Unlike the cart it carries no quantities and never
// hits the server until the shop page fetches the saved products by id.
const STORAGE_KEY = "hkm_shop_wishlist";

function readStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string").slice(0, 100);
  } catch {
    return [];
  }
}

/**
 * Shared wishlist state. Every mounted component stays in sync through the
 * `hkm:wishlist` window event, so hearting an item on a product card also
 * flips the heart on the product page and updates the header count.
 */
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(readStoredIds());
    setHydrated(true);
    const sync = () => setIds(readStoredIds());
    window.addEventListener("hkm:wishlist", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hkm:wishlist", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const persist = useCallback((next: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing / blocked storage — the heart still toggles for
      // this session, it just won't survive a reload. Never break the page.
    }
    setIds(next);
    window.dispatchEvent(new Event("hkm:wishlist"));
  }, []);

  const toggle = useCallback(
    (productId: string) => {
      const current = readStoredIds();
      persist(current.includes(productId) ? current.filter((id) => id !== productId) : [productId, ...current].slice(0, 100));
    },
    [persist]
  );

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  return { ids, hydrated, toggle, has };
}
