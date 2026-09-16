"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2, ShoppingBag, Truck, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { CartQuote, quoteCart, formatINR } from "@/lib/shopApi";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, removeItem, itemCount } = useCart();
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-price on every open and on every quantity change. The cart holds only
  // ids and counts (see CartContext), so this call is what turns it into
  // money — and it's the same server code that will run at checkout, which
  // is why the total shown here can't drift from the total charged.
  useEffect(() => {
    if (!isOpen) return;
    if (lines.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    quoteCart(lines)
      .then((q) => {
        if (!cancelled) setQuote(q);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, lines]);

  const shortfallToFreeShipping =
    quote && quote.freeShippingAbove > 0 && quote.subtotal < quote.freeShippingAbove
      ? quote.freeShippingAbove - quote.subtotal
      : 0;
  const allItemsFree = quote?.items?.length ? quote.items.every((i) => i.freeShipping) : false;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 font-heading text-lg text-primary">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {itemCount > 0 && <span className="text-sm font-normal text-muted-foreground">({itemCount})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              <Link href="/shop" onClick={closeCart}>
                <Button variant="outline" size="sm">Browse the shop</Button>
              </Link>
            </div>
          ) : loading && !quote ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</div>
          ) : (
            <div className="space-y-3">
              {/* Items the server rejected — sold out, withdrawn, or a
                  quantity that's no longer available. Shown plainly rather
                  than silently dropped, so nobody reaches checkout wondering
                  where something went. */}
              {quote?.problems?.map((p) => (
                <div
                  key={`${p.productId}-${p.variantId || "base"}`}
                  className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <div className="flex-1">
                    <p>{p.message}</p>
                    <button
                      onClick={() => removeItem(p.productId, p.variantId || null)}
                      className="mt-1 font-semibold underline"
                    >
                      Remove from cart
                    </button>
                  </div>
                </div>
              ))}

              {quote?.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "base"}`}
                  className="flex gap-3 rounded-xl border border-border p-3"
                >
                  <Link
                    href={`/shop/${item.slug}`}
                    onClick={closeCart}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link href={`/shop/${item.slug}`} onClick={closeCart}>
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.productName}</p>
                    </Link>
                    {item.variantLabel && (
                      <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                    )}
                    {item.freeShipping && (
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                        <Truck className="h-3 w-3" /> Free delivery
                      </p>
                    )}
                    <p className="mt-0.5 text-sm font-semibold text-primary">{formatINR(item.unitPrice)}</p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[28px] text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${item.productName}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-foreground">{formatINR(item.lineTotal)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {quote && quote.items.length > 0 && (
          <div className="border-t border-border bg-card px-5 py-4">
            {shortfallToFreeShipping > 0 && !allItemsFree && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-2 text-xs font-medium text-gold-deep">
                <Truck className="h-3.5 w-3.5 shrink-0" />
                Add {formatINR(shortfallToFreeShipping)} more for free delivery
              </div>
            )}

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatINR(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className={quote.shippingCharge === 0 ? "font-medium text-emerald-600" : "font-medium text-foreground"}>
                  {quote.shippingCharge === 0 ? "Free" : formatINR(quote.shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatINR(quote.total)}</span>
              </div>
            </div>

            <Link href="/shop/checkout" onClick={closeCart} className="mt-4 block">
              <Button className="w-full" size="lg" disabled={!quote.shopEnabled || quote.problems.length > 0}>
                {quote.shopEnabled ? "Proceed to Checkout" : "Shop is closed"}
              </Button>
            </Link>
            {quote.problems.length > 0 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Remove the unavailable items above to continue.
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
