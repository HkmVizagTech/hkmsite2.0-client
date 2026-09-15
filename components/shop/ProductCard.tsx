"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Product, discountPercent, displayPrice, formatINR } from "@/lib/shopApi";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const off = product.hasVariants
    ? null
    : discountPercent(product.price, product.mrp);

  // A variant product can't be added straight from the card — the devotee
  // has to choose 100g or 250g first — so its button sends them to the
  // product page instead of silently picking one for them.
  const needsChoice = product.hasVariants;

  const quickAdd = () => {
    addItem({ productId: product._id, variantId: null, quantity: 1 });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-warm)]"
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

        {off !== null && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-sm"
            style={{ background: "var(--gradient-gold)" }}
          >
            {off}% OFF
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
        <Link href={`/shop/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[15px]">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.shortDescription}</p>
          )}
        </Link>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-bold text-primary">{displayPrice(product)}</p>
            {off !== null && product.mrp && (
              <p className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</p>
            )}
          </div>

          {product.inStock ? (
            needsChoice ? (
              <Link
                href={`/shop/${product.slug}`}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-gold hover:bg-gold/10"
              >
                Options
              </Link>
            ) : (
              <button
                onClick={quickAdd}
                aria-label={`Add ${product.name} to cart`}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
              >
                {justAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                {justAdded ? "Added" : "Add"}
              </button>
            )
          ) : (
            <span className="text-xs font-medium text-muted-foreground">Sold out</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
