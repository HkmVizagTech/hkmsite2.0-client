"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatINR, quoteCart } from "@/lib/shopApi";

/**
 * Sticky mini-cart bar.
 *
 * After the "added to cart" toast fades, the only persistent sign of the cart
 * used to be the small header badge — easy to miss. This bar keeps the next
 * step (checkout) one tap away the whole time the devotee browses, the way
 * Flipkart/Amazon keep a persistent cart affordance on screen.
 *
 * Shows only when the cart has items, and hides itself where checkout already
 * owns the screen (/shop/checkout) or where there is nothing to check out
 * from (/shop/orders).
 */
export default function MiniCartBar() {
  const { itemCount, hydrated, isOpen, lines, openCart } = useCart();
  const pathname = usePathname();
  const [subtotal, setSubtotal] = useState<number | null>(null);

  // Re-price (debounced) whenever the cart changes so the bar shows today's
  // total from the same /shop/cart/quote endpoint the drawer and checkout
  // use — never a locally guessed number.
  useEffect(() => {
    if (!hydrated || lines.length === 0) {
      setSubtotal(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      quoteCart(lines)
        .then((q) => {
          if (!cancelled) setSubtotal(q.subtotal);
        })
        .catch(() => {
          // Total is decorative here; checkout re-quotes authoritatively.
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [lines, hydrated]);

  const hidden =
    !hydrated ||
    itemCount === 0 ||
    isOpen ||
    pathname === "/shop/checkout" ||
    pathname.startsWith("/shop/orders");

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-5"
        >
          <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-gold/40 bg-background/95 p-2.5 pl-4 shadow-elevated backdrop-blur-xl">
            <span className="relative shrink-0">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span
                className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-[hsl(220,60%,12%)]"
                style={{ background: "var(--gradient-gold)" }}
              >
                {itemCount}
              </span>
            </span>

            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs font-bold text-foreground">
                {itemCount} item{itemCount === 1 ? "" : "s"} in cart
              </p>
              <p className="text-[11px] text-muted-foreground">
                {subtotal === null ? (
                  <Loader2 className="inline h-3 w-3 animate-spin align-[-2px]" />
                ) : (
                  <>
                    Total <span className="font-semibold text-primary">{formatINR(subtotal)}</span>
                  </>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={openCart}
              className="hidden shrink-0 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-gold hover:text-primary sm:block"
            >
              View cart
            </button>

            <Link
              href="/shop/checkout"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-gold)" }}
            >
              Proceed to Checkout <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
