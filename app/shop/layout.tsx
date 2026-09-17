"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, Package, Home, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { quoteCart, formatINR } from "@/lib/shopApi";
import { STORAGE_KEY as CART_STORAGE_KEY } from "@/contexts/CartContext";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { ShopSearchProvider, useShopSearch } from "@/contexts/ShopSearchContext";
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
  const { query, setQuery } = useShopSearch();
  const router = useRouter();
  const [cartTotal, setCartTotal] = useState<number | null>(null);
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  // On phones/tablets a search input can't live in the header, so it opens
  // as an expanding row instead. A short-lived hint bubble tells first-time
  // visitors the icon is for searching — appears once, pops out after 4s.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const appear = setTimeout(() => setHintVisible(true), 700);
    const hide = setTimeout(() => setHintVisible(false), 4700);
    return () => {
      clearTimeout(appear);
      clearTimeout(hide);
    };
  }, []);

  // Navigating away should always collapse the expanded mobile search row.
  useEffect(() => {
    setMobileSearchOpen(false);
  }, [pathname]);

  const goSearch = () => {
    const term = query.trim();
    if (!term) return;
    // On the shop page the grid is already filtering live via the shared
    // query; from anywhere else, carry the term over as a search.
    if (pathname !== "/shop") {
      router.push(`/shop?search=${encodeURIComponent(term)}`);
    }
    setMobileSearchOpen(false);
  };

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
      active ? "text-gold after:w-full" : "text-white/70 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-navy text-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-2 px-4 sm:h-[72px] sm:px-6 lg:gap-6 lg:px-8">
        {/* Brand wordmark only — no logo image. */}
        <Link href="/shop" className="group flex shrink-0 flex-col leading-none">
          <span className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            Matchless <span className="text-gradient-gold">Gifts</span>
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/60">
            HKM Visakhapatnam
          </span>
        </Link>

        {/* Center search — a real input on lg+, an expanding-panel icon below. */}
        <div className="mx-auto flex min-w-0 flex-1 items-center justify-center px-2">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              goSearch();
            }}
            className="hidden w-full max-w-md lg:block"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="h-10 w-full rounded-full border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/50 focus:border-gold"
              />
            </div>
          </form>

          {/* Mobile/tablet: search icon; keeps the header uncluttered. */}
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(true);
              setHintVisible(false);
            }}
            aria-label="Search products"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:border-gold/60 hover:bg-white/15 lg:hidden"
          >
            <Search className="h-4 w-4" />
            <AnimatePresence>
              {hintVisible && !mobileSearchOpen && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full z-50 mt-2 w-max max-w-[220px] rounded-xl bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-elevated"
                >
                  Click here to search products
                  <span className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-white" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <nav className="flex shrink-0 items-center gap-4 sm:gap-7">
          <Link href="/" className={`${linkCls(false)} hidden sm:inline-flex`}>
            <Home className="h-3.5 w-3.5" /> Main site
          </Link>
          <Link href="/shop/orders" className={linkCls(pathname.startsWith("/shop/orders"))}>
            <Package className="h-3.5 w-3.5" /> My Orders
          </Link>
          <button
            onClick={openCart}
            className="group relative flex h-10 items-center gap-2 rounded-full border border-white/25 bg-white/10 pl-2.5 pr-2.5 transition-colors hover:border-gold/60 hover:bg-white/15 sm:pr-3.5"
            aria-label="Open cart"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <ShoppingBag className="h-[18px] w-[18px] text-white" />
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
            <span className="hidden text-xs font-semibold text-white sm:inline">
              Cart{cartTotal !== null ? ` · ${formatINR(cartTotal)}` : ""}
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile/tablet: expanded search row. */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="mx-auto max-w-[1440px] px-4 py-2.5 sm:px-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      goSearch();
                    }
                  }}
                  placeholder="Search products…"
                  className="h-11 w-full rounded-full border border-white/20 bg-white/10 pl-10 pr-12 text-sm text-white outline-none transition-colors placeholder:text-white/50 focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  aria-label="Close search"
                  className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <ShopSearchProvider>
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
      </ShopSearchProvider>
    </CartProvider>
  );
}
