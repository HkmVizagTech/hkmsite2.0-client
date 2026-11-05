"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { clientFetchBhajanList, type BhajanList, type BhajanMeta, type BhajanQuery } from "@/lib/bhajans";
import { RESULTS_ID } from "./tones";

export interface Filters {
  mood: string;
  festival: string;
  artist: string;
  category: string;
  hasAudio: boolean;
  featured: boolean;
  sort: "" | "plays";
}
export const NO_FILTERS: Filters = { mood: "", festival: "", artist: "", category: "", hasAudio: false, featured: false, sort: "" };

interface Ctx {
  meta: BhajanMeta;
  q: string;
  setQ: (s: string) => void;
  /** Debounced, trimmed search text actually sent to the API. */
  searchText: string;
  filters: Filters;
  /** Replace the filters (search text is kept unless `keepSearch` is false). */
  apply: (f: Partial<Filters>, opts?: { keepSearch?: boolean; scroll?: boolean }) => void;
  toggle: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  filtering: boolean;
  list: BhajanList;
  loading: boolean;
  loadMore: () => void;
  clear: () => void;
  scrollToResults: (force?: boolean) => void;
  /** The query behind `list` (without paging). */
  query: BhajanQuery;
}
const BrowseCtx = createContext<Ctx | null>(null);
export const useBrowse = () => {
  const c = useContext(BrowseCtx);
  if (!c) throw new Error("BrowseProvider missing");
  return c;
};
/** Like useBrowse but returns null outside a BrowseProvider. */
export const useBrowseOptional = () => useContext(BrowseCtx);
const PAGE = 24;

export function BrowseProvider({ meta, initial, children }: { meta: BhajanMeta; initial: BhajanList; children: ReactNode }) {
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [list, setList] = useState<BhajanList>(initial);
  const [loading, setLoading] = useState(false);
  const first = useRef(true);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDq(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const query = useMemo<BhajanQuery>(
    () => ({
      q: dq || undefined,
      mood: filters.mood || undefined,
      festival: filters.festival || undefined,
      artist: filters.artist || undefined,
      category: filters.category || undefined,
      hasAudio: filters.hasAudio || undefined,
      featured: filters.featured || undefined,
      sort: filters.sort || (dq ? undefined : "featured"),
      limit: PAGE,
    }),
    [dq, filters],
  );
  const filtering = !!(dq || filters.mood || filters.festival || filters.artist || filters.category || filters.hasAudio || filters.featured || filters.sort);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    abort.current?.abort();
    if (!filtering) {
      setList(initial);
      setLoading(false);
      return;
    }
    const ac = new AbortController();
    abort.current = ac;
    setLoading(true);
    clientFetchBhajanList(query, ac.signal).then((r) => {
      if (ac.signal.aborted) return;
      setList(r);
      setLoading(false);
    });
  }, [query, filtering, initial]);

  const loadMore = useCallback(() => {
    if (loading || list.page >= list.pages) return;
    setLoading(true);
    clientFetchBhajanList({ ...query, page: list.page + 1 }).then((r) => {
      setList((l) => ({ ...r, items: [...l.items, ...r.items.filter((i) => !l.items.some((x) => x.slug === i.slug))] }));
      setLoading(false);
    });
  }, [loading, list.page, list.pages, query]);

  const scrollToResults = useCallback((force = true) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(RESULTS_ID);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (force || top < 80 || top > window.innerHeight * 0.6) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    });
  }, []);

  const apply = useCallback<Ctx["apply"]>(
    (f, opts) => {
      setFilters({ ...NO_FILTERS, ...f });
      if (opts?.keepSearch === false) {
        setQ("");
        setDq("");
      }
      if (opts?.scroll !== false) scrollToResults(true);
    },
    [scrollToResults],
  );

  const toggle = useCallback<Ctx["toggle"]>(
    (key, value) => {
      setFilters((f) => ({ ...f, [key]: f[key] === value ? NO_FILTERS[key] : value }));
      scrollToResults(false);
    },
    [scrollToResults],
  );

  const clear = useCallback(() => {
    setQ("");
    setDq("");
    setFilters(NO_FILTERS);
  }, []);

  const value: Ctx = { meta, q, setQ, searchText: dq, filters, apply, toggle, filtering, list, loading, loadMore, clear, scrollToResults, query };
  return <BrowseCtx.Provider value={value}>{children}</BrowseCtx.Provider>;
}

/** Hides its children (the shelves) while the visitor is searching or filtering. */
export function ShelvesGate({ children }: { children: ReactNode }) {
  const { filtering } = useBrowse();
  return filtering ? null : <>{children}</>;
}
