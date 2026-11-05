"use client";

// Admin pages show live data; never cache them at the edge.
export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Music2, Search, Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight, Star, Headphones, ExternalLink,
} from "lucide-react";

interface BhajanSummary {
  _id: string;
  slug: string;
  title: string;
  artist?: string;
  categories?: string[];
  moods?: string[];
  festivals?: string[];
  coverImage?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  hasAudio?: boolean;
  trackCount?: number;
}

type Labels = { categories: Record<string, string>; moods: Record<string, string>; festivals: Record<string, string> };

const PAGE_SIZE = 30;
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

type PubFilter = "all" | "true" | "false";
type Flag = "any" | "featured" | "audio";

export default function AdminBhajans() {
  const [items, setItems] = useState<BhajanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [published, setPublished] = useState<PubFilter>("all");
  const [flag, setFlag] = useState<Flag>("any");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<{ all?: number; pub?: number; draft?: number }>({});
  const [labels, setLabels] = useState<Labels>({ categories: {}, moods: {}, festivals: {} });
  const [busyId, setBusyId] = useState<string | null>(null);
  const reqId = useRef(0);

  const fetchList = async (opts: { q?: string; published?: PubFilter; flag?: Flag; page?: number } = {}) => {
    const query = opts.q ?? q;
    const pub = opts.published ?? published;
    const fl = opts.flag ?? flag;
    const targetPage = opts.page ?? 1;
    const my = ++reqId.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(targetPage), published: pub });
      if (query.trim()) params.set("q", query.trim());
      if (fl === "featured") params.set("featured", "true");
      if (fl === "audio") params.set("hasAudio", "true");
      const res = await authFetch(`${API_URL}/bhajans/admin/list?${params.toString()}`, { credentials: "include" });
      const json = await res.json();
      if (my !== reqId.current) return;
      if (res.ok) {
        setItems(json.items || []);
        setPage(json.page || targetPage);
        setPages(Math.max(1, json.pages || 1));
        setTotal(json.total || 0);
      } else toast({ title: "Failed to load bhajans", description: json.message, variant: "destructive" });
    } catch (e: any) {
      if (my === reqId.current) toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      if (my === reqId.current) setLoading(false);
    }
  };

  const fetchCounts = async () => {
    const one = async (pub: PubFilter) => {
      try {
        const res = await authFetch(`${API_URL}/bhajans/admin/list?limit=1&page=1&published=${pub}`, { credentials: "include" });
        const json = await res.json();
        return res.ok ? (json.total as number) : undefined;
      } catch {
        return undefined;
      }
    };
    const [all, pub, draft] = await Promise.all([one("all"), one("true"), one("false")]);
    setCounts({ all, pub, draft });
  };

  useEffect(() => {
    fetchList({ q: "", published: "all", flag: "any", page: 1 });
    fetchCounts();
    fetch(`${API_URL}/bhajans/meta`)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m) return;
        const map = (arr: any[] = []) => Object.fromEntries(arr.map((x) => [x.slug, x.label]));
        setLabels({ categories: map(m.categories), moods: map(m.moods), festivals: map(m.festivals) });
      })
      .catch(() => {});
  }, []);

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(1, p), pages);
    if (next === page) return;
    fetchList({ page: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = async (item: BhajanSummary, field: "isPublished" | "isFeatured", value: boolean) => {
    setBusyId(item._id);
    const prev = item[field];
    setItems((l) => l.map((x) => (x._id === item._id ? { ...x, [field]: value } : x)));
    try {
      const res = await authFetch(`${API_URL}/bhajans/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [field]: value }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `Update failed (status ${res.status})`);
      if (field === "isPublished") fetchCounts();
    } catch (e: any) {
      setItems((l) => l.map((x) => (x._id === item._id ? { ...x, [field]: prev } : x)));
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item: BhajanSummary) => {
    if (!window.confirm(`Delete "${item.title}"? Its audio files are deleted too. This cannot be undone.`)) return;
    setBusyId(item._id);
    try {
      const res = await authFetch(`${API_URL}/bhajans/${item._id}`, { method: "DELETE", credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Delete failed");
      toast({ title: "Deleted", description: item.title });
      await fetchList({ page: items.length === 1 && page > 1 ? page - 1 : page });
      fetchCounts();
    } catch (e: any) {
      toast({ title: "Failed to delete", description: e.message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  // The server may not filter by featured/audio on the admin list, so apply
  // those two filters here as well (they only trim the current page then).
  const visible = items.filter((b) =>
    flag === "featured" ? b.isFeatured : flag === "audio" ? b.hasAudio || (b.trackCount || 0) > 0 : true
  );

  const chips = (b: BhajanSummary) => [
    ...(b.moods || []).map((s) => ({ k: `m-${s}`, t: labels.moods[s] || s, c: "bg-sky-50 text-sky-700" })),
    ...(b.festivals || []).map((s) => ({ k: `f-${s}`, t: labels.festivals[s] || s, c: "bg-amber-50 text-amber-700" })),
  ];

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition ${
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted"
    }`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Music2 className="h-6 w-6 text-primary" /> Vaishnava Bhajans
          </h1>
          <p className="text-sm text-muted-foreground">
            {counts.all ?? "–"} total · {counts.pub ?? "–"} published · {counts.draft ?? "–"} unpublished
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/bhajans/new">
            <Plus className="mr-1.5 h-4 w-4" /> Add bhajan
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search title, composer or lyrics…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchList({ page: 1 })}
            className="pl-9 text-base sm:text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([["all", "All"], ["true", "Published"], ["false", "Unpublished"]] as [PubFilter, string][]).map(([v, l]) => (
            <button key={v} className={pill(published === v)} onClick={() => { setPublished(v); fetchList({ published: v, page: 1 }); }}>
              {l}
            </button>
          ))}
          <span className="mx-1 hidden w-px bg-border sm:block" />
          {([["any", "Any"], ["featured", "Featured"], ["audio", "Has audio"]] as [Flag, string][]).map(([v, l]) => (
            <button key={v} className={pill(flag === v)} onClick={() => { setFlag(v); fetchList({ flag: v, page: 1 }); }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {!loading && total > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} bhajans
        </p>
      )}

      {loading ? (
        <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading bhajans…
        </p>
      ) : visible.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Music2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No bhajans match. Try another search or add a new one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {visible.map((b) => (
            <Card key={b._id} className={b.isPublished === false ? "opacity-80" : undefined}>
              <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-sky-100 to-blue-200">
                    {b.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.coverImage} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-blue-400">
                        <Music2 className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Link href={`/admin/bhajans/${b._id}`} className="truncate font-semibold hover:underline">
                        {b.title}
                      </Link>
                      {b.isPublished === false && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">Draft</span>
                      )}
                      {b.isFeatured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {b.artist || "Unknown composer"}
                      {" · "}
                      <span className="inline-flex items-center gap-0.5">
                        <Headphones className="inline h-3 w-3" /> {b.trackCount ?? 0} track{(b.trackCount ?? 0) === 1 ? "" : "s"}
                      </span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {chips(b).slice(0, 4).map((c) => (
                        <span key={c.k} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${c.c}`}>{c.t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                  <label className="flex items-center gap-1.5 text-xs">
                    <Switch checked={!!b.isPublished} disabled={busyId === b._id} onCheckedChange={(v) => toggle(b, "isPublished", v)} />
                    Published
                  </label>
                  <label className="flex items-center gap-1.5 text-xs">
                    <Switch checked={!!b.isFeatured} disabled={busyId === b._id} onCheckedChange={(v) => toggle(b, "isFeatured", v)} />
                    Featured
                  </label>
                  <div className="flex gap-1.5">
                    {b.isPublished && (
                      <Button asChild size="sm" variant="outline" className="h-8 px-2" title="View on site">
                        <a href={`/bhajans/${b.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline" className="h-8 px-2" title="Edit">
                      <Link href={`/admin/bhajans/${b._id}`}><Pencil className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-red-600 hover:bg-red-50"
                      disabled={busyId === b._id}
                      title="Delete"
                      onClick={() => remove(b)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && pages > 1 && <Pager page={page} pages={pages} onGo={goToPage} />}
    </div>
  );
}

function pageWindow(page: number, pages: number): (number | "…")[] {
  const set = new Set<number>([1, pages, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

function Pager({ page, pages, onGo }: { page: number; pages: number; onGo: (p: number) => void }) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
      <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onGo(page - 1)}>
        <ChevronLeft className="mr-1 h-4 w-4" /> Prev
      </Button>
      {pageWindow(page, pages).map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground">…</span>
        ) : (
          <Button
            key={n}
            size="sm"
            variant={n === page ? "default" : "outline"}
            className="min-w-9"
            aria-current={n === page ? "page" : undefined}
            onClick={() => onGo(n)}
          >
            {n}
          </Button>
        )
      )}
      <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => onGo(page + 1)}>
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </nav>
  );
}
