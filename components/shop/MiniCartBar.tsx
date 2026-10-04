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
          <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift backdrop-blur-xl">
            <span className="relative shrink-0">
              <ShoppingBag className="h-5 w-5 text-vk-700" />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-vk-700 px-1 text-[9px] font-bold text-white">
                {itemCount}
              </span>
            </span>

            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs font-bold text-ink">
                {itemCount} item{itemCount === 1 ? "" : "s"} in cart
              </p>
              <p className="text-[11px] text-muted-foreground">
                {subtotal === null ? (
                  <Loader2 className="inline h-3 w-3 animate-spin align-[-2px]" />
                ) : (
                  <>
                    Total <span className="font-semibold text-vk-700">{formatINR(subtotal)}</span>
                  </>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={openCart}
              className="vk-btn-outline hidden h-10 shrink-0 px-3.5 text-xs sm:inline-flex"
            >
              View cart
            </button>

            <Link
              href="/shop/checkout"
              className="vk-btn-gold h-11 shrink-0 px-4 text-xs font-bold"
            >
              Proceed to Checkout <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
