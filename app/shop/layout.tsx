"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, Package, Home } from "lucide-react";
import { motion } from "framer-motion";
import { quoteCart, formatINR } from "@/lib/shopApi";
import { STORAGE_KEY as CART_STORAGE_KEY } from "@/contexts/CartContext";
import { CartProvider, useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/shop/CartDrawer";
import MiniCartBar from "@/components/shop/MiniCartBar";
import { Toaster } from "@/components/ui/sonner";

// The header only needs current ids/quantities for pricing — read them
// straight from the same localStorage key the provider persists to, rather
// than re-plumbing context through another component.
function cartSnapshot(): { lines: { productId: string; variantId: string | null; quantity: number }[] } {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return { lines: [] };
    return {
      lines: parsed
        .filter((l) => l && typeof l.productId === "string")
        .map((l) => ({
          productId: l.productId,
          variantId: l.variantId || null,
          quantity: Math.min(99, Math.max(1, Number(l.quantity) || 1)),
        })),
    };
  } catch {
    return { lines: [] };
  }
}

// The cart provider is scoped to /shop rather than the root layout: nothing
// outside the shop needs cart state, and keeping it here means the donation
// side of the site carries none of this weight.
function ShopHeader() {
  const { itemCount, openCart, hydrated } = useCart();
  const [cartTotal, setCartTotal] = useState<number | null>(null);
  const pathname = usePathname();

  // A cart button that also shows the running total is the global-standard
  // pattern (Amazon, Flipkart): the devotee knows where they stand before
  // opening anything. Same quote endpoint as the drawer, so the number
  // can't drift from what checkout will charge.
  useEffect(() => {
    const { lines } = cartSnapshot();
    if (!hydrated || lines.length === 0) {
      setCartTotal(null);
      return;
    }
    let cancelled = false;
    quoteCart(lines)
      .then((q) => !cancelled && setCartTotal(q.subtotal))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [hydrated, itemCount]);

  const linkCls = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-gold after:transition-all after:duration-300 hover:after:w-full ${
      active ? "text-primary after:w-full" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        {/* Brand wordmark only — no logo image. */}
        <Link href="/shop" className="group flex flex-col leading-none">
          <span className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Matchless <span className="text-gradient-gold">Gifts</span>
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            HKM Visakhapatnam
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7">
          <Link href="/" className={`${linkCls(false)} hidden sm:inline-flex`}>
            <Home className="h-3.5 w-3.5" /> Main site
          </Link>
          <Link href="/shop/orders" className={linkCls(pathname.startsWith("/shop/orders"))}>
            <Package className="h-3.5 w-3.5" /> My Orders
          </Link>
          <button
            onClick={openCart}
            className="group relative flex h-10 items-center gap-2 rounded-full border border-border bg-background/60 pl-2.5 pr-2.5 transition-colors hover:border-gold/50 hover:bg-gold/5 sm:pr-3.5"
            aria-label="Open cart"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <ShoppingBag className="h-[18px] w-[18px] text-foreground" />
              {/* Hidden until hydration so the badge never flashes a stale or
                  zero count before localStorage has been read. */}
              {hydrated && itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 20 }}
                  className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-[hsl(220,60%,12%)] shadow-sm"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  {itemCount}
                </motion.span>
              )}
            </span>
            <span className="hidden text-xs font-semibold text-foreground sm:inline">
              Cart{cartTotal !== null ? ` · ${formatINR(cartTotal)}` : ""}
            </span>
          </button>
        </nav>
      </div>
      {/* Gold hairline that grounds the header. */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </header>
  );
}

function ShopFooter() {
  const shopLinks = [
    { href: "/shop", label: "All items" },
    { href: "/shop/orders", label: "My orders" },
    { href: "/", label: "Main site" },
  ];
  const supportLinks = [
    { href: "/contact", label: "Contact us" },
    { href: "/donate", label: "Donate" },
    { href: "/refund-policy", label: "Refund policy" },
    { href: "/privacy-policy", label: "Privacy policy" },
  ];

  return (
    <footer className="mt-16 border-t border-border bg-gradient-to-b from-card to-background">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Matchless <span className="text-gradient-gold">Gifts</span>
            </span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Sacred books, puja essentials and devotional gifts — every purchase supports the
              temple&apos;s daily sevas, annadanam and Go-seva.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-deep">
                Blessed items
              </span>
              <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-deep">
                Pan-India shipping
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Shop</h3>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Support</h3>
            <ul className="mt-4 space-y-2.5">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Hare Krishna Movement, Visakhapatnam. All rights reserved.</p>
          <p>All proceeds support the temple&apos;s sevas.</p>
        </div>
      </div>
    </footer>
  );
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <ShopHeader />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        {/* Persistent mini-cart bar — the always-visible "proceed to
            checkout" affordance for when the add-to-cart toast has faded. */}
        <MiniCartBar />
        {/* Sonner toaster, scoped to the shop. Add-to-cart confirmations are
            custom-rendered (components/shop/CartToast) and rely on being inside
            CartProvider. Offset keeps toasts stacked above the mini-cart bar
            instead of colliding with it. */}
        <Toaster position="bottom-center" offset={84} />
        <ShopFooter />
      </div>
    </CartProvider>
  );
}
