"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

// The cart deliberately stores the BARE MINIMUM: what was chosen and how
// many. No prices, no names, no images.
//
// Anything else would go stale — a cart can sit in a browser for weeks while
// the temple re-prices an item or renames it — and a cached price is the
// kind of stale that turns into an argument at checkout. Display details and
// every rupee come from /shop/cart/quote, re-fetched each time the cart is
// shown, so what the devotee sees is always today's catalog.
export interface CartLine {
  productId: string;
  variantId: string | null;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  addItem: (line: CartLine) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "hkm_shop_cart";

const sameLine = (a: CartLine, productId: string, variantId: string | null) =>
  a.productId === productId && (a.variantId || null) === (variantId || null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // Server-render and first client render must match, so the cart starts
  // empty and fills in after mount. `hydrated` lets the badge stay blank
  // until then rather than flashing "0" over the real count.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(
            parsed
              .filter((l) => l && typeof l.productId === "string")
              .map((l) => ({
                productId: l.productId,
                variantId: l.variantId || null,
                quantity: Math.min(99, Math.max(1, Number(l.quantity) || 1)),
              }))
          );
        }
      }
    } catch {
      // Private browsing, blocked storage, or corrupt JSON — an empty cart
      // is a fine outcome; never let this break the page.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  const addItem = useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, line.productId, line.variantId));
      if (existing) {
        return prev.map((l) =>
          sameLine(l, line.productId, line.variantId)
            ? { ...l, quantity: Math.min(99, l.quantity + line.quantity) }
            : l
        );
      }
      return [...prev, { ...line, variantId: line.variantId || null, quantity: Math.min(99, line.quantity) }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, variantId: string | null, quantity: number) => {
    setLines((prev) =>
      quantity < 1
        ? prev.filter((l) => !sameLine(l, productId, variantId))
        : prev.map((l) => (sameLine(l, productId, variantId) ? { ...l, quantity: Math.min(99, quantity) } : l))
    );
  }, []);

  const removeItem = useCallback((productId: string, variantId: string | null) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, productId, variantId)));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      hydrated,
    }),
    [lines, isOpen, hydrated, addItem, setQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
