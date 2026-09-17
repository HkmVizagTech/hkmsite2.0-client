"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PackageOpen,
  Megaphone,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ArrowUpDown,
  ChevronDown,
  Check,
  Loader2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductCard from "@/components/shop/ProductCard";
import { useShopSearch } from "@/contexts/ShopSearchContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useRecentlyViewed } from "@/hooks/useRecent";
import {
  Product,
  ShopCategory,
  ShopSettings,
  fetchCategories,
  fetchProducts,
  fetchProduct,
  fetchShopSettings,
} from "@/lib/shopApi";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

// Designed shop banner, served from the media bucket (same host as product
// photos, so a plain <img> — see next.config remotePatterns note in ProductCard).
const SHOP_BANNER_DESKTOP =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789648085166-1789648084187-shop-desk.webp";
const SHOP_BANNER_MOBILE =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789648084586-1789648083922-shop-mob.webp";

export default function ShopCatalogPage() {
  const { query: search, setQuery: setSearch } = useShopSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Arriving from the navbar search on another page lands here with a
  // ?search= term in the URL — seed the shared query once so the grid shows
  // those results even on a fresh load.
  useEffect(() => {
    try {
      const term = new URLSearchParams(window.location.search).get("search");
      if (term) setSearch(term);
    } catch {}
  }, []);

  // Saved-for-later + recently-viewed — both are personal, browser-local
  // rails that global storefronts use to shorten the path back to an item.
  const { ids: savedIds, hydrated: wishlistReady } = useWishlist();
  const [saved, setSaved] = useState<Product[]>([]);
  const recentSlugs = useRecentlyViewed();
  const [recent, setRecent] = useState<Product[]>([]);

  // Scroll behaviour tied to search state:
  //   - no search: auto-scroll past the hero artwork on arrival so the
  //     devotee lands on the filters and products.
  //   - search active: the banner is replaced by a results band, so jump to
  //     the very top — results are immediately visible, no scrolling needed.
  //   - search cleared: the banner comes back, so return to just below it.
  const searchActive = search.trim().length > 0;
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchActive) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (window.scrollY > 0) return;
      const el = document.getElementById("shop-hero");
      if (!el) return;
      const bottom = el.getBoundingClientRect().bottom + window.scrollY;
      if (bottom > 96) window.scrollTo({ top: Math.max(bottom - 72, 0), behavior: "smooth" });
    }, 80);
    return () => clearTimeout(t);
  }, [searchActive]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchShopSettings().then(setSettings).catch(() => setSettings(null));
    // The "Featured" rail always shows the store's curated picks, independent
    // of the active category/search/sort filtering the main grid.
    fetchProducts({ sort: "featured", limit: 40 })
      .then((data) => setFeatured(data.products.filter((p) => p.featured).slice(0, 10)))
      .catch(() => setFeatured([]));
  }, []);

  const load = useCallback(
    async (targetPage = 1, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const { products: rows, pagination } = await fetchProducts({
          category,
          search,
          sort,
          page: targetPage,
          limit: 24,
          inStockOnly,
        });
        setProducts((prev) => (append ? [...prev, ...rows] : rows));
        setPages(pagination.pages);
        setTotal(pagination.total);
        setPage(targetPage);
      } catch (e: any) {
        setError(e.message || "Could not load the shop.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, search, sort, inStockOnly]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  // Saved for later: the wishlist stores ids only — resolve them into real
  // products here so the rail always reflects the live catalog (price,
  // stock, name) rather than a stale snapshot.
  useEffect(() => {
    if (!wishlistReady || savedIds.length === 0) {
      setSaved([]);
      return;
    }
    fetchProducts({ ids: savedIds.slice(0, 20).join(","), limit: 20 })
      .then((d) => setSaved(d.products))
      .catch(() => setSaved([]));
  }, [wishlistReady, savedIds]);

  // Recently viewed: slugs resolve individually (≤ 8 parallel calls).
  useEffect(() => {
    const list = recentSlugs.slice(0, 8);
    if (list.length === 0) {
      setRecent([]);
      return;
    }
    let cancelled = false;
    Promise.all(list.map((s) => fetchProduct(s).then((d) => d.product).catch(() => null)))
      .then((ps) => {
        if (!cancelled) setRecent(ps.filter((p): p is Product => !!p));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [recentSlugs]);

  const activeCategoryName = useMemo(
    () => categories.find((c) => c.slug === category)?.name,
    [categories, category]
  );

  const scrollFeatured = (dir: 1 | -1) => {
    featuredRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const categoryName = useCallback(
    (slug?: string) => (slug ? categories.find((c) => c.slug === slug)?.name : undefined),
    [categories]
  );

  const loadMore = () => {
    if (!loadingMore && page < pages) load(page + 1, true);
  };

  return (
    <div>
      {/* ═══ HERO BANNER — replaced by a slim results band while searching so
          the matches are visible the moment the devotee types. ═══ */}
      {searchActive ? (
        <section className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border pb-4">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <h1 className="truncate font-heading text-xl font-bold text-foreground sm:text-2xl">
                Results for <span className="text-primary">“{search}”</span>
              </h1>
              <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
                {loading ? "Searching…" : `${total} item${total === 1 ? "" : "s"}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-foreground transition-colors hover:border-gold hover:text-primary"
            >
              <X className="h-3.5 w-3.5" /> Clear search
            </button>
          </div>
        </section>
      ) : (
        <section id="shop-hero" className="relative">
          {/* The banner itself comes in two crops — a wide desktop frame and a
              taller mobile one that still breathes on a small screen. Like the
              festival pages, its bottom edge curves. */}
          <div className="overflow-hidden rounded-b-[2rem] md:rounded-b-[2.5rem]">
            <picture>
              <source media="(max-width: 640px)" srcSet={SHOP_BANNER_MOBILE} />
              <img
                src={SHOP_BANNER_DESKTOP}
                alt="The Hare Krishna temple shop — books, puja items & sacred gifts"
                className="block h-auto w-full"
              />
            </picture>
          </div>
        </section>
      )}

      {/* ═══ ANNOUNCEMENT + CLOSED BANNERS ═══ */}
      {settings?.announcement && (
        <div className="flex items-center justify-center gap-2 bg-gold/10 px-4 py-2.5 text-center text-xs font-medium text-gold-deep sm:text-sm">
          <Megaphone className="h-3.5 w-3.5 shrink-0" />
          {settings.announcement}
        </div>
      )}

      {settings && !settings.shopEnabled && (
        <div className="bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">
          The shop is temporarily closed for orders. You can still browse — please check back soon.
        </div>
      )}

      {/* ═══ STICKY FILTERS ═══ */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md sm:top-[72px]">
        {/* On mobile the filters live in one swipeable row (the pattern the
            big storefronts use) rather than wrapping onto two lines. */}
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Category selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold text-foreground transition-colors hover:border-gold sm:text-sm"
                aria-label="Filter by category"
              >
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                {activeCategoryName ?? "All categories"}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-96 w-64 overflow-y-auto p-1.5">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => setCategory("all")}>
                <span className="flex w-full items-center justify-between gap-3">
                  All categories
                  {category === "all" && <Check className="h-4 w-4 text-primary" />}
                </span>
              </DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c._id} onSelect={() => setCategory(c.slug)}>
                  <span className="flex w-full items-center justify-between gap-3">
                    {c.name}
                    <span className="flex items-center gap-2">
                      {c.productCount > 0 && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {c.productCount}
                        </span>
                      )}
                      {category === c.slug && <Check className="h-4 w-4 text-primary" />}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold text-foreground transition-colors hover:border-gold sm:text-sm"
                aria-label="Sort products"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                {SORTS.find((s) => s.value === sort)?.label ?? "Sort"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-1.5">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sort by
              </DropdownMenuLabel>
              {SORTS.map((s) => (
                <DropdownMenuItem key={s.value} onSelect={() => setSort(s.value)}>
                  <span className="flex w-full items-center justify-between gap-3">
                    {s.label}
                    {sort === s.value && <Check className="h-4 w-4 text-primary" />}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* In-stock-only toggle — global-standard availability filter. */}
          <button
            type="button"
            onClick={() => setInStockOnly((v) => !v)}
            aria-pressed={inStockOnly}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors sm:text-sm ${
              inStockOnly
                ? "border-gold bg-gold/10 text-gold-deep"
                : "border-border bg-background text-foreground hover:border-gold"
            }`}
          >
            <Check className={`h-3.5 w-3.5 ${inStockOnly ? "text-gold-deep" : "text-muted-foreground"}`} />
            In stock only
          </button>
        </div>

        {/* Active filter chips */}
        {(category !== "all" || search || inStockOnly) && (
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 px-4 pb-3 sm:px-6 lg:px-8">
            {category !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-deep">
                {activeCategoryName ?? "Category"}
                <button onClick={() => setCategory("all")} aria-label="Remove category filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-deep">
                In stock only
                <button onClick={() => setInStockOnly(false)} aria-label="Remove in-stock filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setCategory("all");
                setSearch("");
                setInStockOnly(false);
              }}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ═══ FEATURED RAIL — hidden while searching so results lead. */}
      {!searchActive && featured.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Curated for you</p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">Featured</h2>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollFeatured(-1)}
                aria-label="Scroll featured left"
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-gold hover:text-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollFeatured(1)}
                aria-label="Scroll featured right"
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-gold hover:text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            ref={featuredRef}
            className="featured-rail -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Hide webkit scrollbar for the rail */}
            <style>{`.featured-rail::-webkit-scrollbar { display: none; }`}</style>
            {featured.map((p, i) => (
              <div key={p._id} className="w-[220px] shrink-0 snap-start sm:w-[240px]">
                <ProductCard product={p} index={i} categoryName={categoryName(p.category)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ MAIN GRID ═══ */}
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border">
                <div className="aspect-square animate-pulse bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <button onClick={() => load(1)} className="mt-3 text-sm font-semibold text-primary underline">
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <PackageOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium text-foreground">
              {search ? `Nothing matches “${search}”` : "Nothing here yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try a different word, or browse all items."
                : activeCategoryName
                  ? `${activeCategoryName} items are coming soon.`
                  : "New items are added regularly — please check back."}
            </p>
            {(search || category !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-gold"
              >
                Show everything
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {products.length} of {total} item{total === 1 ? "" : "s"}
                {activeCategoryName ? ` in ${activeCategoryName}` : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} categoryName={categoryName(p.category)} />
              ))}
            </div>
            {page < pages && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-primary disabled:opacity-60"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                    </>
                  ) : (
                    <>
                      Load more ({total - products.length} remaining)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ═══ SAVED FOR LATER ═══ */}
      {saved.length > 0 && (
        <section className="border-t border-border bg-card/50">
          <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Your wishlist</p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">Saved for later</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {saved.slice(0, 5).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} categoryName={categoryName(p.category)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ RECENTLY VIEWED ═══ */}
      {recent.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Pick up where you left off</p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">Recently viewed</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {recent.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} categoryName={categoryName(p.category)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ TRUST STRIP ═══ */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-bold text-foreground">Secure payments</p>
              <p className="text-xs text-muted-foreground">PCI-DSS Razorpay checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-bold text-foreground">
                {settings
                  ? `Free shipping above ₹${settings.freeShippingAbove.toLocaleString("en-IN")}`
                  : "Pan-India shipping"}
              </p>
              <p className="text-xs text-muted-foreground">{settings?.deliveryEstimate || "Carefully packed & shipped"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HeartHandshake className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-bold text-foreground">Every purchase gives</p>
              <p className="text-xs text-muted-foreground">Funds daily temple sevas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-bold text-foreground">Blessed & sanctified</p>
              <p className="text-xs text-muted-foreground">Items offered to the Lordships</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}