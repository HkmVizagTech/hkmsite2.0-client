"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, PackageOpen, Megaphone } from "lucide-react";
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
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced so a search box doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchShopSettings().then(setSettings).catch(() => setSettings(null));
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

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--gradient-gold)", opacity: 0.3 }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            Temple Shop
          </span>
          <h1 className="mt-3 font-heading text-2xl font-bold text-white sm:text-4xl">
            Books, puja items &amp; sacred gifts
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">
            Every purchase supports the temple&apos;s daily sevas and prasadam distribution.
          </p>

          <div className="relative mt-6 max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for books, incense, malas…"
              className="h-12 w-full rounded-full border border-white/20 bg-background/95 pl-11 pr-4 text-sm text-foreground shadow-lg outline-none transition-colors focus:border-gold"
            />
          </div>
        </div>
      </section>

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

      {/* Filters */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                category === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-gold hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => setCategory(c.slug)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  category === c.slug
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-gold hover:text-foreground"
                }`}
              >
                {c.name}
                <span className="ml-1.5 opacity-60">{c.productCount}</span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cursor-pointer rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-medium text-foreground outline-none focus:border-gold sm:text-sm"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
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
            <p className="mb-4 text-xs text-muted-foreground">
              {products.length} item{products.length === 1 ? "" : "s"}
              {activeCategoryName ? ` in ${activeCategoryName}` : ""}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
