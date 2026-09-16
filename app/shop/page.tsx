"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  Product,
  ShopCategory,
  ShopSettings,
  fetchCategories,
  fetchProducts,
  fetchShopSettings,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { products: rows } = await fetchProducts({ category, search, sort, limit: 48 });
      setProducts(rows);
    } catch (e: any) {
      setError(e.message || "Could not load the shop.");
    } finally {
      setLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => {
    load();
  }, [load]);

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

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "var(--gradient-gold)", opacity: 0.25 }}
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--gradient-gold)", opacity: 0.12 }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
            <Sparkles className="h-3 w-3" /> Matchless Gifts
          </span>
          <h1 className="mt-3 max-w-2xl font-heading text-3xl font-bold leading-tight text-white sm:text-5xl">
            Books, puja items &amp; sacred gifts
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/75 sm:text-base">
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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
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
        </div>

        {/* Active filter chips */}
        {(category !== "all" || search) && (
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 pb-3 sm:px-6">
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
            <button
              onClick={() => {
                setCategory("all");
                setSearchInput("");
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
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
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
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
            <button onClick={load} className="mt-3 text-sm font-semibold text-primary underline">
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
                {products.length} item{products.length === 1 ? "" : "s"}
                {activeCategoryName ? ` in ${activeCategoryName}` : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} categoryName={categoryName(p.category)} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
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