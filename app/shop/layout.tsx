"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Package, Home } from "lucide-react";
import { CartProvider, useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/shop/CartDrawer";

// The cart provider is scoped to /shop rather than the root layout: nothing
// outside the shop needs cart state, and keeping it here means the donation
// side of the site carries none of this weight.
function ShopHeader() {
  const { itemCount, openCart, hydrated } = useCart();
  const pathname = usePathname();

  const linkCls = (active: boolean) =>
    `text-sm font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/shop" className="flex items-center gap-2.5">
          <Image
            src="/assets/hkvt-logo-full.png"
            alt="Hare Krishna Movement, Visakhapatnam"
            width={2438}
            height={825}
            className="h-8 w-auto"
          />
          <span className="font-heading text-base font-bold text-primary sm:text-lg">Matchless Gifts</span>
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/" className={`${linkCls(false)} hidden items-center gap-1.5 sm:flex`}>
            <Home className="h-3.5 w-3.5" /> Main site
          </Link>
          <Link href="/shop/orders" className={`${linkCls(pathname.startsWith("/shop/orders"))} flex items-center gap-1.5`}>
            <Package className="h-3.5 w-3.5" /> My Orders
          </Link>
          <button
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {/* Hidden until hydration so the badge never flashes a stale or
                zero count before localStorage has been read. */}
            {hydrated && itemCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                style={{ background: "var(--gradient-gold)" }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <ShopHeader />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
          Hare Krishna Movement, Visakhapatnam · All proceeds support the temple&apos;s sevas
        </footer>
      </div>
    </CartProvider>
  );
}
