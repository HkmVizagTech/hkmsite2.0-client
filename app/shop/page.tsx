"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
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
  displayPrice,
} from "@/lib/shopApi";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Saved-for-later + recently-viewed — both are personal, browser-local
  // rails that global storefronts use to shorten the path back to an item.
  const { ids: savedIds, hydrated: wishlistReady } = useWishlist();
  const [saved, setSaved] = useState<Product[]>([]);
  const recentSlugs = useRecentlyViewed();
  const [recent, setRecent] = useState<Product[]>([]);

  // Debounced so a search box doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

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

  // A few featured items double as the hero collage, so the right side of the
  // hero is real merchandise instead of empty decorative space.
  const heroProducts = featured.slice(0, 4);

  const heroPill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
      active
        ? "border-gold bg-gold/20 text-gold"
        : "border-white/20 text-white/75 hover:border-gold/60 hover:text-white"
    }`;

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
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(hsl(42 92% 56%) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "var(--gradient-gold)", opacity: 0.25 }}
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--gradient-gold)", opacity: 0.12 }}
        />

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
              <Sparkles className="h-3 w-3" /> Matchless Gifts
            </span>
            <h1 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Books, puja items &amp; <span className="text-gradient-gold">sacred gifts</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Every purchase supports the temple&apos;s daily sevas and prasadam distribution.
            </p>

            <div className="relative mt-7 max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search books, incense, malas…"
                className="w-full rounded-full border border-white/20 bg-background/95 py-3.5 pl-11 pr-4 text-sm text-foreground shadow-xl outline-none transition-colors focus:border-gold"
              />
            </div>

            {categories.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Browse
                </span>
                <button type="button" onClick={() => setCategory("all")} className={heroPill(category === "all")}>
                  All
                </button>
                {categories.slice(0, 5).map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => setCategory(c.slug)}
                    className={heroPill(category === c.slug)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {heroProducts.length > 0 && (
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {heroProducts.map((p) => (
                  <Link
                    key={p._id}
                    href={`/shop/${p.slug}`}
                    className="group overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square overflow-hidden bg-white/5">
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-1 text-xs font-semibold text-white">{p.name}</p>
                      <p className="mt-0.5 text-[11px] font-bold text-gold">{displayPrice(p)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-gold/30 bg-background/95 px-4 py-2.5 shadow-elevated backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Every order
                </p>
                <p className="text-sm font-bold text-primary">Supports temple sevas</p>
              </div>
            </div>
          )}
        </div>
      </section>

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
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
          {/* Category selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold text-foreground transition-colors hover:border-gold sm:text-sm"
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
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-semibold text-foreground transition-colors hover:border-gold sm:text-sm"
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
            className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors sm:text-sm ${
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
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-deep">
                “{search}”
                <button onClick={() => setSearchInput("")} aria-label="Clear search">
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
                setSearchInput("");
                setInStockOnly(false);
              }}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ═══ FEATURED RAIL ═══ */}
      {featured.length > 0 && (
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
                  setSearchInput("");
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