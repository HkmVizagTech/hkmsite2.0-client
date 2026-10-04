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

  // Shared pill styles for the filter row (GVD rounded-full chips).
  const chipCls =
    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors sm:text-sm";
  const chipIdle = "border-vk-200 bg-white text-ink hover:border-vk-500 hover:text-vk-700";
  const arrowCls =
    "flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition-colors hover:border-vk-700 hover:bg-vk-50";

  return (
    <div className="bg-white">
      {/* ═══ HERO BANNER — replaced by a slim results band while searching so
          the matches are visible the moment the devotee types. ═══ */}
      {searchActive ? (
        <section className="bg-gradient-to-b from-vk-50 to-white">
          <div className="vk-container pt-5">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-vk-100 pb-4">
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <h1 className="truncate font-heading text-xl font-extrabold tracking-[-0.02em] text-ink sm:text-2xl">
                  Results for <span className="text-vk-700">“{search}”</span>
                </h1>
                <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
                  {loading ? "Searching…" : `${total} item${total === 1 ? "" : "s"}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`${chipCls} ${chipIdle} !h-9 !px-3.5 !text-xs`}
              >
                <X className="h-3.5 w-3.5" /> Clear search
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section id="shop-hero" className="bg-gradient-to-b from-vk-50 to-white pt-4 md:pt-6">
          {/* The banner itself comes in two crops — a wide desktop frame and a
              taller mobile one that still breathes on a small screen — shown
              as an inset rounded card, GVD-style. */}
          <div className="vk-container">
            <div className="overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]">
              <picture>
                <source media="(max-width: 640px)" srcSet={SHOP_BANNER_MOBILE} />
                <img
                  src={SHOP_BANNER_DESKTOP}
                  alt="The Hare Krishna temple shop — books, puja items & sacred gifts"
                  className="block h-auto w-full"
                />
              </picture>
            </div>
          </div>

          {/* A real H1 + short intro. The shop is the temple store, so both
              matter for search: one clear heading, then who we are and what
              every purchase funds. */}
          <div className="vk-container pt-7 md:pt-9">
            <h1 className="vk-h2">
              ISKCON Vizag Shop — <span className="text-vk-700">Matchless Gifts</span>
            </h1>
            <p className="vk-lead mt-3 max-w-3xl">
              Welcome to the online store of the ISKCON Visakhapatnam temple — the
              Hare Krishna Movement, Gambheeram. Here you&apos;ll find
              Bhagavad Gita As It Is and Srila Prabhupada&apos;s books, puja
              essentials, japa malas, murtis and devotional gifts. Every purchase
              supports the temple&apos;s daily sevas, annadanam and Go-seva.
            </p>
          </div>
        </section>
      )}

      {/* ═══ ANNOUNCEMENT + CLOSED BANNERS ═══ */}
      {settings?.announcement && (
        <div className="vk-container mt-4">
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-vk-50 px-4 py-2.5 text-center text-xs font-semibold text-vk-700 sm:text-sm">
            <Megaphone className="h-3.5 w-3.5 shrink-0" />
            {settings.announcement}
          </div>
        </div>
      )}

      {settings && !settings.shopEnabled && (
        <div className="vk-container mt-4">
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">
            The shop is temporarily closed for orders. You can still browse — please check back soon.
          </div>
        </div>
      )}

      {/* ═══ STICKY FILTERS ═══ */}
      <div className="sticky top-16 z-30 mt-4 border-b border-vk-100 bg-white/95 backdrop-blur-md sm:top-[72px]">
        {/* On mobile the filters live in one swipeable row (the pattern the
            big storefronts use) rather than wrapping onto two lines. */}
        <div className="vk-container flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {/* Category selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`${chipCls} ${category !== "all" ? "border-vk-700 bg-vk-700 text-white" : chipIdle}`}
                aria-label="Filter by category"
              >
                <LayoutGrid className={`h-4 w-4 ${category !== "all" ? "text-white/80" : "text-vk-500"}`} />
                {activeCategoryName ?? "All categories"}
                <ChevronDown className={`h-3.5 w-3.5 ${category !== "all" ? "text-white/80" : "text-muted-foreground"}`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-96 w-64 overflow-y-auto rounded-2xl p-1.5">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => setCategory("all")} className="rounded-lg">
                <span className="flex w-full items-center justify-between gap-3">
                  All categories
                  {category === "all" && <Check className="h-4 w-4 text-vk-700" />}
                </span>
              </DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c._id} onSelect={() => setCategory(c.slug)} className="rounded-lg">
                  <span className="flex w-full items-center justify-between gap-3">
                    {c.name}
                    <span className="flex items-center gap-2">
                      {c.productCount > 0 && (
                        <span className="rounded-full bg-vk-100 px-1.5 py-0.5 text-[10px] font-semibold text-vk-700">
                          {c.productCount}
                        </span>
                      )}
                      {category === c.slug && <Check className="h-4 w-4 text-vk-700" />}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`${chipCls} ${chipIdle}`} aria-label="Sort products">
                <ArrowUpDown className="h-3.5 w-3.5 text-vk-500" />
                {SORTS.find((s) => s.value === sort)?.label ?? "Sort"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-2xl p-1.5">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sort by
              </DropdownMenuLabel>
              {SORTS.map((s) => (
                <DropdownMenuItem key={s.value} onSelect={() => setSort(s.value)} className="rounded-lg">
                  <span className="flex w-full items-center justify-between gap-3">
                    {s.label}
                    {sort === s.value && <Check className="h-4 w-4 text-vk-700" />}
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
            className={`${chipCls} ${inStockOnly ? "border-vk-700 bg-vk-700 text-white" : chipIdle}`}
          >
            <Check className={`h-3.5 w-3.5 ${inStockOnly ? "text-white" : "text-muted-foreground"}`} />
            In stock only
          </button>
        </div>

        {/* Active filter chips */}
        {(category !== "all" || search || inStockOnly) && (
          <div className="vk-container flex flex-wrap items-center gap-2 pb-3">
            {category !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-vk-100 px-3 py-1 text-xs font-semibold text-vk-700">
                {activeCategoryName ?? "Category"}
                <button onClick={() => setCategory("all")} aria-label="Remove category filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-vk-100 px-3 py-1 text-xs font-semibold text-vk-700">
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
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-vk-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ═══ FEATURED RAIL — hidden while searching so results lead. */}
      {!searchActive && featured.length > 0 && (
        <section className="vk-band">
          <div className="vk-container py-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="vk-pill">Curated for you</span>
                <h2 className="vk-h2 mt-3">Featured</h2>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => scrollFeatured(-1)}
                  aria-label="Scroll featured left"
                  className={arrowCls}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFeatured(1)}
                  aria-label="Scroll featured right"
                  className={arrowCls}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div
              ref={featuredRef}
              className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 pt-1 scrollbar-hide sm:mx-0 sm:px-0"
            >
              {featured.map((p, i) => (
                <div key={p._id} className="w-[220px] shrink-0 snap-start sm:w-[240px]">
                  <ProductCard product={p} index={i} categoryName={categoryName(p.category)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ MAIN GRID ═══ */}
      <section className="vk-container py-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-[#E8ECFA] bg-white">
                <div className="aspect-square animate-pulse bg-vk-50" />
                <div className="space-y-2 p-4">
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-vk-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-vk-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <button onClick={() => load(1)} className="vk-btn-outline mt-4">
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl bg-vk-50 px-6 py-14 text-center">
            <span className="vk-icon-chip mx-auto mb-4 !h-14 !w-14 !rounded-2xl !bg-white">
              <PackageOpen className="h-7 w-7" />
            </span>
            <p className="font-heading text-lg font-bold text-ink">
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
                className="vk-btn-primary mt-5"
              >
                Show everything
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="vk-bar-title text-lg text-ink sm:text-xl">
                {activeCategoryName ?? "All items"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Showing {products.length} of {total} item{total === 1 ? "" : "s"}
                {activeCategoryName ? ` in ${activeCategoryName}` : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
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
                  className="vk-btn-primary h-12 px-7"
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
        <section className="vk-band">
          <div className="vk-container py-10">
            <div className="mb-6">
              <span className="vk-pill">Your wishlist</span>
              <h2 className="vk-h2 mt-3">Saved for later</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {saved.slice(0, 5).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} categoryName={categoryName(p.category)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ RECENTLY VIEWED ═══ */}
      {recent.length > 0 && (
        <section>
          <div className="vk-container py-10">
            <div className="mb-6">
              <span className="vk-pill">Pick up where you left off</span>
              <h2 className="vk-h2 mt-3">Recently viewed</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {recent.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} categoryName={categoryName(p.category)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ TRUST STRIP — white cards with tinted icon chips. ═══ */}
      <section className="vk-band">
        <div className="vk-container grid grid-cols-1 gap-3 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="vk-card flex items-center gap-3 p-4">
            <span className="vk-icon-chip">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">Secure payments</p>
              <p className="text-xs text-muted-foreground">PCI-DSS Razorpay checkout</p>
            </div>
          </div>
          <div className="vk-card flex items-center gap-3 p-4">
            <span className="vk-icon-chip">
              <Truck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">
                {settings
                  ? `Free shipping above ₹${settings.freeShippingAbove.toLocaleString("en-IN")}`
                  : "Pan-India shipping"}
              </p>
              <p className="text-xs text-muted-foreground">{settings?.deliveryEstimate || "Carefully packed & shipped"}</p>
            </div>
          </div>
          <div className="vk-card flex items-center gap-3 p-4">
            <span className="vk-icon-chip">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">Every purchase gives</p>
              <p className="text-xs text-muted-foreground">Funds daily temple sevas</p>
            </div>
          </div>
          <div className="vk-card flex items-center gap-3 p-4">
            <span className="vk-icon-chip">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">Blessed & sanctified</p>
              <p className="text-xs text-muted-foreground">Items offered to the Lordships</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
