"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Truck, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { showAddedToCart } from "@/components/shop/CartToast";
import { Product, discountPercent, displayPrice, formatINR } from "@/lib/shopApi";

interface Props {
  product: Product;
  index?: number;
  categoryName?: string;
}

const MAX_QTY = 99;

export default function ProductCard({ product, index = 0, categoryName }: Props) {
  const { addItem, setQuantity, openCart, lines } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const off = product.hasVariants ? null : discountPercent(product.price, product.mrp);
  const saveAmount =
    !product.hasVariants && off !== null && product.mrp
      ? (product.mrp || 0) - (product.price || 0)
      : null;

  // A variant product can't be added straight from the card — the devotee
  // has to choose 100g or 250g first — so its button sends them to the
  // product page instead of silently picking one for them.
  const needsChoice = product.hasVariants;

  // Lowest stock across variants decides the "Low stock" hint — a simple
  // product just uses its own stock figure.
  const minStock = product.hasVariants
    ? Math.min(...product.variants.map((v) => v.stock))
    : product.stock;
  const lowStock = product.inStock && minStock <= 5;

  // How many of this simple product are already in the cart — drives the
  // inline stepper so the card reflects cart state (and survives a reload).
  const inCartQty =
    lines.find((l) => l.productId === product._id && !l.variantId)?.quantity ?? 0;
  // Total across every line of this product (any variant) — used for the
  // "In cart" cue, so a variant product still shows it was added.
  const inCartAny = lines
    .filter((l) => l.productId === product._id)
    .reduce((sum, l) => sum + l.quantity, 0);
  const maxQty = Math.min(MAX_QTY, product.stock || MAX_QTY);

  const quickAdd = () => {
    addItem({ productId: product._id, variantId: null, quantity: 1 });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    // Confirm with an elegant popup instead of force-opening the cart drawer.
    showAddedToCart(
      {
        name: product.name,
        image: product.images?.[0],
        price: product.price,
        quantity: 1,
      },
      openCart
    );
  };

  const increase = () => setQuantity(product._id, null, Math.min(maxQty, inCartQty + 1));
  const decrease = () => setQuantity(product._id, null, inCartQty - 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-warm)] ${
        inCartAny > 0 ? "border-gold/40 ring-1 ring-gold/20" : "border-border"
      }`}
    >
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        {product.images?.[0] ? (
          // Plain <img> rather than next/image: product photos are uploaded
          // to R2 and the public bucket host is env-configured, so it isn't
          // guaranteed to match next.config's remotePatterns allow-list.
          // A broken optimiser would mean no product photos at all.
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ShoppingBag className="h-8 w-8" />
          </div>
        )}

        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
            Best seller
          </span>
        )}

        {off !== null && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-sm"
            style={{ background: "var(--gradient-gold)" }}
          >
            {off}% OFF
          </span>
        )}

        {/* In-cart marker on the image — a discreet, modern cue that this
            item is already in the bag even before you reach the button. */}
        {inCartAny > 0 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm backdrop-blur-sm">
            <Check className="h-3 w-3" /> In cart{inCartAny > 1 ? ` · ${inCartAny}` : ""}
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-semibold text-background">
              Out of stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {categoryName && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {categoryName}
          </p>
        )}

        <Link href={`/shop/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[15px]">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.shortDescription}</p>
          )}
        </Link>

        <div className="mt-2 flex items-center gap-3">
          <p className="text-base font-bold text-primary">{displayPrice(product)}</p>
          {off !== null && product.mrp && (
            <p className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</p>
          )}
          {saveAmount !== null && saveAmount > 0 && (
            <p className="text-[10px] font-bold uppercase text-emerald-600">Save {formatINR(saveAmount)}</p>
          )}
          {product.freeShipping && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
              <Truck className="h-3 w-3" /> Free delivery
            </span>
          )}
        </div>

        {product.inStock && (
          <p className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${lowStock ? "text-amber-600" : "text-emerald-600"}`}>
            <span
              className={`h-1.5 w-1.5 rounded-full ${lowStock ? "bg-amber-500" : "bg-emerald-500"}`}
            />
            {lowStock ? `Only ${minStock} left` : "In stock"}
          </p>
        )}

        <div className="mt-3">
          {product.inStock ? (
            needsChoice ? (
              <Link
                href={`/shop/${product.slug}`}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Choose variant
              </Link>
            ) : inCartQty > 0 ? (
              // Once added, the button becomes an inline quantity stepper —
              // the pattern shoppers expect from modern stores.
              <div className="flex w-full items-center justify-between rounded-xl border border-gold/50 bg-gold/5 p-1">
                <button
                  type="button"
                  onClick={decrease}
                  aria-label={`Decrease quantity of ${product.name}`}
                  className="flex h-8 w-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-gold/15 active:scale-95"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span
                  aria-live="polite"
                  className="flex items-center gap-1.5 text-xs font-bold text-primary"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="tabular-nums">{inCartQty}</span>
                </span>
                <button
                  type="button"
                  onClick={increase}
                  disabled={inCartQty >= maxQty}
                  aria-label={`Increase quantity of ${product.name}`}
                  className="flex h-8 w-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-gold/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={quickAdd}
                aria-label={`Add ${product.name} to cart`}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                {justAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                  </>
                )}
              </button>
            )
          ) : (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-muted px-3 py-2.5 text-xs font-semibold text-muted-foreground"
            >
              Sold out
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
