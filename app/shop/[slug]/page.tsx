"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Minus,
  Plus,
  Loader2,
  ChevronLeft,
  ShieldCheck,
  Truck,
  Check,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shop/ProductCard";
import { showAddedToCart } from "@/components/shop/CartToast";
import { useCart } from "@/contexts/CartContext";
import {
  Product,
  ProductVariant,
  ShopSettings,
  fetchProduct,
  fetchShopSettings,
  discountPercent,
  formatINR,
} from "@/lib/shopApi";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    fetchProduct(slug)
      .then(({ product: p, related: r }) => {
        if (cancelled) return;
        setProduct(p);
        setRelated(r);
        setActiveImage(0);
        setQuantity(1);
        // Pre-select the first variant that's actually buyable, so the page
        // opens on something the devotee can add rather than a sold-out size.
        setVariant(p.hasVariants ? p.variants.find((v) => v.inStock) || p.variants[0] || null : null);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    fetchShopSettings().then(setSettings).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <PackageOpen className="h-10 w-10 text-muted-foreground/50" />
        <p className="font-medium text-foreground">{error || "This item isn't available."}</p>
        <Link href="/shop">
          <Button variant="outline" size="sm">Back to the shop</Button>
        </Link>
      </div>
    );
  }

  const currentPrice = product.hasVariants ? variant?.price ?? 0 : product.price ?? 0;
  const currentMrp = product.hasVariants ? variant?.mrp : product.mrp;
  const currentStock = product.hasVariants ? variant?.stock ?? 0 : product.stock;
  const off = discountPercent(currentPrice, currentMrp);
  const canBuy = currentStock > 0 && (!product.hasVariants || !!variant);

  const handleAdd = () => {
    if (!canBuy) return;
    addItem({ productId: product._id, variantId: variant?._id || null, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    // Elegant confirmation popup instead of force-opening the cart drawer.
    showAddedToCart(
      {
        name: product.name,
        image: product.images?.[activeImage] || product.images?.[0],
        price: currentPrice,
        variantLabel: variant?.label,
        quantity,
      },
      openCart
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/shop"
        className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
          >
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ShoppingBag className="h-10 w-10" />
              </div>
            )}
          </motion.div>

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === activeImage ? "border-gold" : "border-border hover:border-muted-foreground"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.category.replace(/-/g, " ")}
            </span>
          )}
          <h1 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
          {product.shortDescription && (
            <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>
          )}

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold text-primary">{formatINR(currentPrice)}</span>
            {off !== null && currentMrp && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatINR(currentMrp)}</span>
                <span
                  className="mb-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  {off}% OFF
                </span>
              </>
            )}
          </div>

          {product.hasVariants && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-foreground">Choose an option</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => v.inStock && setVariant(v)}
                    disabled={!v.inStock}
                    className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-all ${
                      variant?._id === v._id
                        ? "border-gold bg-gold/10 text-foreground"
                        : v.inStock
                          ? "border-border text-muted-foreground hover:border-muted-foreground"
                          : "cursor-not-allowed border-border text-muted-foreground/40 line-through"
                    }`}
                  >
                    {v.label}
                    <span className="ml-1.5 text-xs opacity-70">{formatINR(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[36px] text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(Math.max(1, currentStock), q + 1))}
                className="px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* A low-stock line is only worth showing when it's genuinely
                scarce — "12 left" on a shelf of 200 is just noise. */}
            {currentStock > 0 && currentStock <= 5 && (
              <span className="text-xs font-medium text-amber-600">Only {currentStock} left</span>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <Button size="lg" className="flex-1 gap-2" disabled={!canBuy || settings?.shopEnabled === false} onClick={handleAdd}>
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {!canBuy ? "Out of stock" : settings?.shopEnabled === false ? "Shop closed" : added ? "Added to cart" : "Add to Cart"}
            </Button>
          </div>

          <div className="mt-6 space-y-2.5 rounded-xl border border-border bg-card p-4 text-sm">
            {product.freeShipping && (
              <p className="flex items-center gap-2 text-emerald-600">
                <Truck className="h-4 w-4 shrink-0" />
                Free delivery on this item
              </p>
            )}
            <p className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4 shrink-0 text-gold" />
              {settings?.deliveryEstimate || "Usually dispatched in 3–5 working days"}
            </p>
            {settings && settings.freeShippingAbove > 0 && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <PackageOpen className="h-4 w-4 shrink-0 text-gold" />
                Free delivery on orders above {formatINR(settings.freeShippingAbove)}
              </p>
            )}
            <p className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gold" />
              Secure payment · Supports the temple&apos;s sevas
            </p>
          </div>

          {product.description && (
            <div className="mt-6">
              <h2 className="mb-2 font-heading text-base font-bold text-foreground">About this item</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 font-heading text-lg font-bold text-foreground">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
