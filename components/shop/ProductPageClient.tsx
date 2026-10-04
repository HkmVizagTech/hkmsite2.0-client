"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import {
  ShoppingBag,
  Minus,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Check,
  Heart,
  PackageOpen,
  ClipboardList,
  Sparkles,
  BookOpen,
} from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { showAddedToCart } from "@/components/shop/CartToast";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { recordRecentView } from "@/hooks/useRecent";
import {
  Product,
  ProductVariant,
  ShopSettings,
  fetchProduct,
  fetchProducts,
  fetchShopSettings,
  discountPercent,
  formatINR,
} from "@/lib/shopApi";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;
  const { addItem, setQuantity: setCartQuantity, openCart, lines } = useCart();
  const { has: isWishlisted, toggle: toggleWishlist, hydrated: wishlistReady } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [moreProducts, setMoreProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [imageDirection, setImageDirection] = useState(1);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const relatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    recordRecentView(slug);
    let cancelled = false;
    setLoading(true);
    fetchProduct(slug)
      .then(({ product: p, related: r }) => {
        if (cancelled) return;
        setProduct(p);
        setRelated(r);
        setActiveImage(0);
        // Pre-select the first variant that's actually buyable, so the page
        // opens on something the devotee can add rather than a sold-out size.
        setVariant(p.hasVariants ? p.variants.find((v) => v.inStock) || p.variants[0] || null : null);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    fetchShopSettings().then(setSettings).catch(() => {});
    // A secondary rail of other catalog picks below "You may also like" — the
    // same pattern storefronts use to keep a devotee browsing. Anything
    // already shown (this product, its same-category neighbours) is filtered
    // out in the render.
    fetchProducts({ sort: "featured", limit: 12 })
      .then((data) => {
        if (!cancelled) setMoreProducts(data.products);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Auto-slide the gallery one frame every 3s, always — waiting on a hover
  // made desktop feel like auto-swipe was broken, since resting the mouse on
  // the photo froze it. activeImage is in the deps so whatever changed the
  // frame (auto, arrows, thumbnails or a swipe) restarts the timer, keeping
  // each photo showing for a full 3 seconds.
  useEffect(() => {
    if (!product || product.images.length <= 1) return;
    const id = setInterval(() => {
      setImageDirection(1);
      setActiveImage((i) => (i + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [product, activeImage]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-vk-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <span className="vk-icon-chip !h-14 !w-14 !rounded-2xl">
          <PackageOpen className="h-7 w-7" />
        </span>
        <p className="font-medium text-ink">{error || "This item isn't available."}</p>
        <Link href="/shop" className="vk-btn-outline">
          Back to the shop
        </Link>
      </div>
    );
  }

  const currentPrice = product.hasVariants ? variant?.price ?? 0 : product.price ?? 0;
  const currentMrp = product.hasVariants ? variant?.mrp : product.mrp;
  const currentStock = product.hasVariants ? variant?.stock ?? 0 : product.stock;
  const off = discountPercent(currentPrice, currentMrp);
  const canBuy = currentStock > 0 && (!product.hasVariants || !!variant);
  const wishlisted = wishlistReady && isWishlisted(product._id);

  const imageCount = product.images.length;

  // Slide the gallery to a specific frame; the new photo enters from the
  // side it would naturally come from (next → enters from the right).
  const goImage = (next: number) => {
    setImageDirection(next === (activeImage + 1) % imageCount ? 1 : -1);
    setActiveImage(next);
  };

  // Horizontal swipe on the main photo — finger on touch screens, or a
  // click-and-drag with the mouse on desktop. The image follows the pointer
  // with an elastic snap-back until the gesture crosses a small threshold,
  // then it advances like a swipe.
  const gallerySwipe = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (Math.abs(offset.x) < 35 && Math.abs(velocity.x) < 300) return;
    const forward = offset.x < 0 || velocity.x < 0;
    setImageDirection(forward ? 1 : -1);
    setActiveImage((i) => (forward ? (i + 1) % imageCount : (i - 1 + imageCount) % imageCount));
  };

  const galleryVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  // Horizontal scroll for the "You may also like" rail (desktop arrows).
  const scrollRelated = (dir: 1 | -1) => {
    relatedRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  // "You might also love" — featured picks from the store, minus anything that
  // already appeared above (this product or its same-category companions).
  const seenIds = new Set([product._id, ...related.map((r) => r._id)]);
  const explore = moreProducts.filter((p) => !seenIds.has(p._id)).slice(0, 8);

  // How many of the currently-selected option are already in the cart.
  const inCartForSelection =
    lines.find(
      (l) => l.productId === product._id && (l.variantId || null) === (variant?._id || null)
    )?.quantity ?? 0;

  // The stepper is bound straight to the cart (same as the product cards):
  // + adds a unit to the cart, - takes one out, and the number always shows
  // the live in-cart total — never a local "how many to add" picker that
  // silently drifts out of sync with the bag.
  const maxQty = Math.min(99, currentStock || 99);

  const handleAdd = () => {
    if (!canBuy) return;
    addItem({ productId: product._id, variantId: variant?._id || null, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    // Elegant confirmation popup instead of force-opening the cart drawer.
    showAddedToCart(
      {
        name: product.name,
        image: product.images?.[activeImage] || product.images?.[0],
        price: currentPrice,
        variantLabel: variant?.label,
        quantity: 1,
      },
      openCart
    );
  };

  return (
    <div className="vk-container py-6 sm:py-10">
      <Link
        href="/shop"
        className="mb-5 inline-flex items-center gap-1 rounded-full bg-vk-50 px-3 py-1.5 text-xs font-semibold text-vk-700 transition-colors hover:bg-vk-100 sm:text-[13px]"
      >
        <ChevronLeft className="h-4 w-4" /> Back to shop
      </Link>

      {/* Desktop: gallery + item details on the left, the purchase card on the
          right sticks while the left column scrolls. Mobile keeps the natural
          order gallery → purchase card → details. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
        {/* Gallery */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <div className="relative overflow-hidden rounded-3xl border border-vk-100 bg-vk-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
              drag={imageCount > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              dragMomentum={false}
              onDragEnd={gallerySwipe}
            >
              {product.images?.[activeImage] ? (
                <AnimatePresence initial={false} custom={imageDirection}>
                  <motion.img
                    key={activeImage}
                    src={product.images[activeImage]}
                    alt={product.name}
                    custom={imageDirection}
                    variants={galleryVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
              ) : (
                <div className="flex h-full items-center justify-center text-vk-300">
                  <ShoppingBag className="h-10 w-10" />
                </div>
              )}
            </motion.div>

            {/* Prev/next arrows + frame dots. The gallery auto-slides every 3s, swipes
                (finger or mouse drag) and the arrows cover explicit stepping. */}
            {imageCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goImage((activeImage - 1 + imageCount) % imageCount)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-vk-100 bg-white/90 text-vk-800 shadow-card backdrop-blur transition-colors hover:border-vk-500 hover:text-vk-500 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goImage((activeImage + 1) % imageCount)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-vk-100 bg-white/90 text-vk-800 shadow-card backdrop-blur transition-colors hover:border-vk-500 hover:text-vk-500 active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-vk-900/35 px-2.5 py-1.5 backdrop-blur-sm">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full bg-white/90 shadow transition-all duration-300 ${
                        i === activeImage ? "w-4" : "w-1.5 opacity-60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {imageCount > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => goImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-vk-50 transition-colors sm:h-[72px] sm:w-[72px] ${
                    i === activeImage ? "border-vk-500" : "border-vk-100 hover:border-vk-300"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase card — sticky on desktop. */}
        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-[96px]">
            <div className="vk-card relative !rounded-3xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 pr-12">
                {product.category && (
                  <span className="vk-pill-soft">
                    <Sparkles className="h-3 w-3" />
                    {product.category.replace(/-/g, " ")}
                  </span>
                )}
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    In stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-600">
                    Out of stock
                  </span>
                )}
              </div>

              {/* Save-for-later heart, aligned with the title block. */}
              <button
                type="button"
                onClick={() => toggleWishlist(product._id)}
                aria-label={wishlisted ? "Remove from wishlist" : "Save for later"}
                aria-pressed={wishlisted}
                className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-colors sm:right-5 sm:top-5 sm:h-11 sm:w-11 ${
                  wishlisted
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-vk-100 bg-white text-muted-foreground hover:text-rose-500"
                }`}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>

              <h1 className="mt-4 break-words font-heading text-2xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-2.5 break-words text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
              )}

              <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1.5 border-t border-vk-100 pt-5">
                <span className="font-heading text-3xl font-extrabold tracking-tight text-vk-700 sm:text-4xl">
                  {formatINR(currentPrice)}
                </span>
                {off !== null && currentMrp && (
                  <>
                    <span className="text-base font-medium text-muted-foreground line-through sm:text-lg">
                      {formatINR(currentMrp)}
                    </span>
                    <span className="mb-1 rounded-full bg-[hsl(var(--gold))] px-2.5 py-1 text-xs font-bold text-ink">
                      {off}% OFF
                    </span>
                  </>
                )}
              </div>

              {product.hasVariants && (
                <div className="mt-5">
                  <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">Choose an option</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v._id}
                        onClick={() => v.inStock && setVariant(v)}
                        disabled={!v.inStock}
                        className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all ${
                          variant?._id === v._id
                            ? "border-vk-500 bg-vk-50 text-vk-800 ring-2 ring-vk-500/20"
                            : v.inStock
                              ? "border-vk-200 bg-white text-ink hover:border-vk-400"
                              : "cursor-not-allowed border-vk-100 bg-white text-muted-foreground/40 line-through"
                        }`}
                      >
                        {v.label}
                        <span className="ml-1.5 text-xs font-medium opacity-70">{formatINR(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex h-11 items-center rounded-xl border border-vk-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setCartQuantity(product._id, variant?._id || null, inCartForSelection - 1)}
                    disabled={!canBuy || inCartForSelection < 1}
                    className="flex h-full w-11 items-center justify-center text-vk-700 transition-colors hover:text-vk-500 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span
                    aria-live="polite"
                    className="flex min-w-[36px] items-center justify-center gap-1 text-center text-sm font-semibold text-ink"
                  >
                    {inCartForSelection > 0 && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                    <span className="tabular-nums">{inCartForSelection}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCartQuantity(product._id, variant?._id || null, Math.min(maxQty, inCartForSelection + 1))}
                    disabled={!canBuy || inCartForSelection >= maxQty}
                    className="flex h-full w-11 items-center justify-center text-vk-700 transition-colors hover:text-vk-500 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {currentStock > 0 && currentStock <= 5 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Only {currentStock} left
                  </span>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!canBuy || settings?.shopEnabled === false}
                  className="vk-btn-gold h-12 flex-1 text-[15px] font-bold"
                >
                  {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                  {!canBuy ? "Out of stock" : settings?.shopEnabled === false ? "Shop closed" : added ? "Added" : inCartForSelection > 0 ? "Add more" : "Add to Cart"}
                </button>
              </div>

              {inCartForSelection > 0 && (
                <p className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                  {inCartForSelection} in your cart
                  <button
                    type="button"
                    onClick={openCart}
                    className="font-semibold text-vk-500 underline-offset-2 hover:underline"
                  >
                    View cart
                  </button>
                </p>
              )}

              {/* Delivery & trust */}
              <div className="mt-5 space-y-2 border-t border-vk-100 pt-5">
                {product.freeShipping && (
                  <div className="flex items-center gap-3 rounded-xl bg-vk-50 px-3 py-2.5">
                    <span className="vk-icon-chip !h-9 !w-9 !bg-white">
                      <Truck className="h-4 w-4" />
                    </span>
                    <p className="min-w-0 text-[13px] font-semibold text-ink">Free delivery on this item</p>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-xl bg-vk-50 px-3 py-2.5">
                  <span className="vk-icon-chip !h-9 !w-9 !bg-white">
                    <Truck className="h-4 w-4" />
                  </span>
                  <p className="min-w-0 text-[13px] font-semibold text-ink">
                    {settings?.deliveryEstimate || "Usually dispatched in 3–5 working days"}
                  </p>
                </div>
                {settings && settings.freeShippingAbove > 0 && (
                  <div className="flex items-center gap-3 rounded-xl bg-vk-50 px-3 py-2.5">
                    <span className="vk-icon-chip !h-9 !w-9 !bg-white">
                      <PackageOpen className="h-4 w-4" />
                    </span>
                    <p className="min-w-0 text-[13px] font-semibold text-ink">
                      Free delivery on orders above {formatINR(settings.freeShippingAbove)}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-xl bg-vk-50 px-3 py-2.5">
                  <span className="vk-icon-chip !h-9 !w-9 !bg-white">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <p className="min-w-0 text-[13px] font-semibold text-ink">
                    Secure payment · Supports the temple&apos;s sevas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item details */}
        {(product.description || product.productInfo) && (
          <div className="min-w-0 space-y-4 lg:col-start-1 lg:row-start-2">
            {product.description && (
              <div className="vk-card p-5 sm:p-6">
                <h2 className="flex items-center gap-2.5 font-heading text-base font-bold text-ink">
                  <span className="vk-icon-chip !h-9 !w-9">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  About this item
                </h2>
                <div className="mt-3 break-words whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </div>
              </div>
            )}

            {/* Product information — admin-authored rich text (label:value rows
                like "Book Name: …" with the side headings bolded). Rendered as
                authored HTML so the formatting an admin chose is exactly what a
                devotee sees. */}
            {product.productInfo && (
              <div className="vk-card p-5 sm:p-6">
                <h2 className="flex items-center gap-2.5 font-heading text-base font-bold text-ink">
                  <span className="vk-icon-chip !h-9 !w-9">
                    <ClipboardList className="h-4 w-4" />
                  </span>
                  Product information
                </h2>
                <div
                  className="product-info-content mt-3 break-words rounded-2xl bg-vk-50 p-4 text-sm leading-relaxed text-ink/90"
                  dangerouslySetInnerHTML={{ __html: product.productInfo }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ YOU MAY ALSO LIKE — same-category picks in a swipeable rail, with
          arrows on desktop, mirroring the shop's featured rail. ═══ */}
      {related.length > 0 && (
        <section className="mt-14 sm:mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="vk-pill-soft">Similar to this item</span>
              <h2 className="vk-h3 mt-2.5">You may also like</h2>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollRelated(-1)}
                aria-label="Scroll related products left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition-colors hover:border-vk-700 hover:bg-vk-50 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRelated(1)}
                aria-label="Scroll related products right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition-colors hover:border-vk-700 hover:bg-vk-50 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            ref={relatedRef}
            className="related-rail -mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.related-rail::-webkit-scrollbar { display: none; }`}</style>
            {related.map((p, i) => (
              <div key={p._id} className="w-[220px] shrink-0 snap-start sm:w-[240px]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ YOU MIGHT ALSO LOVE — a second rail of other catalog picks, the
          "keep them browsing" layer modern stores place under the related
          rail. ═══ */}
      {explore.length > 0 && (
        <section className="mt-12 border-t border-vk-100 pt-8 sm:mt-14 sm:pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="vk-pill-soft">More from the store</span>
              <h2 className="vk-h3 mt-2.5">You might also love</h2>
            </div>
            <Link
              href="/shop"
              className="vk-btn-outline hidden sm:inline-flex"
            >
              View all products <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {explore.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Rich HTML styles for the Product information block — CKEditor output
          is plain semantic tags, so format them to match the product page. */}
      <style>{`
        .product-info-content { overflow-x: auto; }
        .product-info-content p { margin: 0.4rem 0; line-height: 1.7; }
        .product-info-content p:first-child { margin-top: 0; }
        .product-info-content p:last-child { margin-bottom: 0; }
        .product-info-content strong { font-weight: 700; color: hsl(var(--foreground)); }
        .product-info-content b { font-weight: 700; color: hsl(var(--foreground)); }
        .product-info-content h1,
        .product-info-content h2,
        .product-info-content h3,
        .product-info-content h4 { margin: 0.75rem 0 0.3rem; font-weight: 700; color: hsl(var(--foreground)); }
        .product-info-content h2 { font-size: 1.05rem; }
        .product-info-content h3,
        .product-info-content h4 { font-size: 0.95rem; }
        .product-info-content ul,
        .product-info-content ol { padding-left: 1.25rem; margin: 0.4rem 0; }
        .product-info-content li { margin: 0.15rem 0; }
        .product-info-content a { color: hsl(var(--primary)); text-decoration: underline; }
        .product-info-content table { width: 100%; border-collapse: collapse; margin: 0.5rem 0; font-size: 0.85rem; }
        .product-info-content th,
        .product-info-content td { border: 1px solid hsl(var(--border)); padding: 0.4rem 0.6rem; text-align: left; }
        .product-info-content th { background: hsl(var(--muted)); font-weight: 600; }
      `}</style>
    </div>
  );
}
