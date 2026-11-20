"use client";

// Admin pages must never be statically cached at the CDN edge.
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CheckCircle2, Clock, Download, ExternalLink, IndianRupee, Loader2, MessageCircle, Pencil, Plus, RefreshCw,
  Search, Trash2, Users, XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
const BASE = `${API_URL}/programs`;

interface Venue { name: string; mapUrl?: string }
interface Counts { total: number; paid: number; pending: number; failed: number; free: number; collected: number }
interface Program {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  fee: number;
  startDate: string;
  endDate?: string;
  schedule?: string;
  duration?: string;
  forKids?: boolean;
  ageMin?: number;
  ageMax?: number;
  venues: Venue[];
  contactPhones: string[];
  capacity?: number;
  registrationOpen: boolean;
  whatsappNote?: string;
  counts: Counts;
}
interface Registration {
  _id: string;
  programId?: { _id: string; name: string; slug: string } | null;
  name: string;
  age?: number;
  parentName?: string;
  mobile: string;
  email?: string;
  venue?: string;
  amount: number;
  paymentStatus: "pending" | "paid" | "failed" | "free";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  failureReason?: string;
  manualPayment?: { mode?: string; note?: string };
  whatsapp?: { status?: string; error?: string };
  utm?: { source?: string; campaign?: string };
  createdAt: string;
}
interface Stats {
  total: number; paid: number; pending: number; failed: number; free: number; registered: number;
  collected: number; pendingAmount: number;
  venues: { venue: string; count: number }[];
  whatsapp: Record<string, number>;
}

const SITE = "https://www.harekrishnavizag.org";
const ymd = (d?: string | Date) => (d ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(d)) : "");
const nice = (d?: string) => (d ? new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" }) : "");
const niceTime = (d?: string) =>
  d ? new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "";
const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const fieldCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
const selectCls = "h-10 rounded-md border border-input bg-background px-3 text-sm";

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  free: "bg-sky-100 text-sky-700",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-700",
};
const STATUS_LABEL: Record<string, string> = { paid: "Paid", free: "Registered (free)", pending: "Pending", failed: "Failed" };
const WA_STYLE: Record<string, string> = { sent: "text-green-600", failed: "text-red-600", sending: "text-amber-600", not_sent: "text-muted-foreground" };

// Which programs the dropdown lists, by when they start (IST month).
type Period = "all" | "this" | "last" | "upcoming";
function inPeriod(p: Program, period: Period) {
  if (period === "all") return true;
  const now = new Date();
  const ym = (d: Date) => ymd(d).slice(0, 7);
  const start = ym(new Date(p.startDate));
  if (period === "this") return start === ym(now);
  if (period === "last") {
    const d = new Date(now);
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    return start === ym(d);
  }
  return new Date(p.startDate) > now; // upcoming
}

const EMPTY_FORM = {
  name: "", slug: "", tagline: "", fee: "", startDate: "", endDate: "", schedule: "", duration: "",
  forKids: false, ageMin: "", ageMax: "", venues: [{ name: "", mapUrl: "" }] as Venue[], contactPhones: "",
  capacity: "", registrationOpen: true, whatsappNote: "",
};

export default function AdminPrograms() {
  // The "devotee" role is read-only: dashboard, filters and CSV export. All edit controls are hidden for it
  // (the server also refuses those calls).
  const { user } = useAuth();
  const readOnly = user?.role === "devotee";
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [period, setPeriod] = useState<Period>("all");
  const [programId, setProgramId] = useState("");

  // filters
  const [status, setStatus] = useState("");
  const [venue, setVenue] = useState("");
  const [wa, setWa] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState<Stats | null>(null);
  const [items, setItems] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  // program form
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  // mark-paid dialog
  const [payFor, setPayFor] = useState<Registration | null>(null);
  const [payMode, setPayMode] = useState("Cash");
  const [payNote, setPayNote] = useState("");

  const LIMIT = 25;

  const loadPrograms = useCallback(async () => {
    setLoadingPrograms(true);
    try {
      const res = await authFetch(BASE);
      const data = await res.json();
      if (res.ok) setPrograms(data.items || []);
      else toast({ title: "Could not load programs", description: data.message, variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setLoadingPrograms(false);
  }, []);

  const listed = useMemo(() => programs.filter((p) => inPeriod(p, period)), [programs, period]);
  const selected = programs.find((p) => p._id === programId) || null;

  // When the period hides the chosen program, fall back to "all in this period".
  useEffect(() => {
    if (programId && !listed.some((p) => p._id === programId)) setProgramId("");
  }, [listed, programId]);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (programId) p.set("programId", programId);
    if (status) p.set("status", status);
    if (venue) p.set("venue", venue);
    if (wa) p.set("whatsapp", wa);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    if (q.trim()) p.set("q", q.trim());
    return p;
  }, [programId, status, venue, wa, from, to, q]);

  // A period with no single program chosen means "every program in that period" —
  // the server filters by one programId, so with several we load per program and add up.
  const scopeIds = useMemo(() => (programId ? [programId] : period === "all" ? [] : listed.map((p) => p._id)), [programId, period, listed]);

  const load = useCallback(async () => {
    setLoadingRegs(true);
    try {
      if (!programId && period !== "all" && scopeIds.length === 0) {
        setStats(null); setItems([]); setTotal(0);
        setLoadingRegs(false);
        return;
      }
      if (scopeIds.length > 1) {
        // several programs: sum the stats, and list registrations program by program
        const all = await Promise.all(scopeIds.map(async (id) => {
          const p = new URLSearchParams(params); p.set("programId", id);
          const [s, r] = await Promise.all([
            authFetch(`${BASE}/stats?${p}`).then((x) => x.json()),
            authFetch(`${BASE}/registrations?${p}&limit=200`).then((x) => x.json()),
          ]);
          return { s: s.stats as Stats, r };
        }));
        const sum: Stats = { total: 0, paid: 0, pending: 0, failed: 0, free: 0, registered: 0, collected: 0, pendingAmount: 0, venues: [], whatsapp: {} };
        const venueMap: Record<string, number> = {};
        for (const { s } of all) {
          if (!s) continue;
          (["total", "paid", "pending", "failed", "free", "registered", "collected", "pendingAmount"] as const).forEach((k) => { sum[k] += s[k] || 0; });
          s.venues.forEach((v) => { venueMap[v.venue] = (venueMap[v.venue] || 0) + v.count; });
          Object.entries(s.whatsapp || {}).forEach(([k, v]) => { sum.whatsapp[k] = (sum.whatsapp[k] || 0) + v; });
        }
        sum.venues = Object.entries(venueMap).map(([venue, count]) => ({ venue, count })).sort((a, b) => b.count - a.count);
        const merged = all.flatMap(({ r }) => r.items || []).sort((a: Registration, b: Registration) => b.createdAt.localeCompare(a.createdAt));
        setStats(sum);
        setTotal(merged.length);
        setItems(merged.slice((page - 1) * LIMIT, page * LIMIT));
      } else {
        const p = new URLSearchParams(params);
        if (scopeIds.length === 1) p.set("programId", scopeIds[0]);
        const lp = new URLSearchParams(p); lp.set("page", String(page)); lp.set("limit", String(LIMIT));
        const [sRes, rRes] = await Promise.all([authFetch(`${BASE}/stats?${p}`), authFetch(`${BASE}/registrations?${lp}`)]);
        const [s, r] = await Promise.all([sRes.json(), rRes.json()]);
        if (sRes.ok) setStats(s.stats); else toast({ title: "Could not load stats", description: s.message, variant: "destructive" });
        if (rRes.ok) { setItems(r.items || []); setTotal(r.total || 0); }
        else toast({ title: "Could not load registrations", description: r.message, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setLoadingRegs(false);
  }, [params, page, scopeIds, programId, period]);

  useEffect(() => { loadPrograms(); }, [loadPrograms]);
  useEffect(() => { if (!loadingPrograms) load(); }, [load, loadingPrograms]);
  useEffect(() => { setPage(1); }, [params, period]);
  useEffect(() => { setVenue(""); }, [programId]);

  const venueOptions = useMemo(() => {
    const src = selected ? [selected] : listed;
    return Array.from(new Set(src.flatMap((p) => p.venues.map((v) => v.name))));
  }, [selected, listed]);

  // ------------------------------------------------------------- program form
  const openNew = () => { setEditing(null); setForm({ ...EMPTY_FORM, venues: [{ name: "", mapUrl: "" }] }); setSlugTouched(false); setFormOpen(true); };
  const openEdit = (p: Program) => {
    setEditing(p);
    setSlugTouched(true);
    setForm({
      name: p.name, slug: p.slug, tagline: p.tagline || "", fee: String(p.fee ?? ""), startDate: ymd(p.startDate), endDate: ymd(p.endDate),
      schedule: p.schedule || "", duration: p.duration || "", forKids: !!p.forKids, ageMin: p.ageMin != null ? String(p.ageMin) : "",
      ageMax: p.ageMax != null ? String(p.ageMax) : "", venues: p.venues.length ? p.venues.map((v) => ({ ...v })) : [{ name: "", mapUrl: "" }],
      contactPhones: (p.contactPhones || []).join(", "), capacity: p.capacity ? String(p.capacity) : "", registrationOpen: p.registrationOpen,
      whatsappNote: p.whatsappNote || "",
    });
    setFormOpen(true);
  };

  const saveProgram = async () => {
    if (!form.name.trim() || !form.slug.trim() || !form.startDate) {
      toast({ title: "Name, page link and start date are required", variant: "destructive" });
      return;
    }
    if (form.endDate && form.endDate < form.startDate) {
      toast({ title: "End date must be on or after the start date", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        fee: Number(form.fee) || 0,
        capacity: Number(form.capacity) || 0,
        venues: form.venues.filter((v) => v.name.trim()),
        contactPhones: form.contactPhones.split(/[,/]/).map((s) => s.trim()).filter(Boolean),
      };
      const res = await authFetch(editing ? `${BASE}/${editing._id}` : BASE, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: editing ? "Program updated" : "Program created" });
        setFormOpen(false);
        await loadPrograms();
        if (!editing && data.program?._id) { setPeriod("all"); setProgramId(data.program._id); }
      } else toast({ title: "Could not save", description: data.message, variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const toggleOpen = async (p: Program) => {
    const res = await authFetch(`${BASE}/${p._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ registrationOpen: !p.registrationOpen }) });
    if (res.ok) { toast({ title: p.registrationOpen ? "Registrations closed" : "Registrations opened" }); loadPrograms(); }
  };

  const deleteProgram = async (p: Program) => {
    if (!confirm(`Delete program "${p.name}"?`)) return;
    const res = await authFetch(`${BASE}/${p._id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) { toast({ title: "Program deleted" }); if (programId === p._id) setProgramId(""); loadPrograms(); }
    else toast({ title: "Could not delete", description: data.message, variant: "destructive" });
  };

  // ------------------------------------------------------------- row actions
  const rowAction = async (r: Registration, path: string, body?: object) => {
    setBusyId(r._id);
    try {
      const res = await authFetch(`${BASE}/registrations/${r._id}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || {}),
      });
      const data = await res.json();
      toast({ title: res.ok ? data.message || "Done" : "Failed", description: res.ok ? undefined : data.message, variant: res.ok ? undefined : "destructive" });
      if (res.ok) { load(); loadPrograms(); }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setBusyId(null);
  };

  const confirmMarkPaid = async () => {
    if (!payFor) return;
    const r = payFor;
    setPayFor(null);
    await rowAction(r, "mark-paid", { mode: payMode, note: payNote });
    setPayNote("");
  };

  const exportCsv = async () => {
    try {
      const res = await authFetch(`${BASE}/registrations/export?${params}`);
      if (!res.ok) { toast({ title: "Export failed", variant: "destructive" }); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected?.slug || "programs"}-registrations-${ymd(new Date())}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast({ title: "Export failed", description: e.message, variant: "destructive" });
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const statCards = stats
    ? [
        { label: "Registrations", value: stats.total, sub: `${stats.registered} confirmed`, icon: Users, cls: "text-vk-600 bg-vk-50", key: "" },
        { label: "Paid", value: stats.paid, sub: inr(stats.collected), icon: CheckCircle2, cls: "text-green-700 bg-green-50", key: "paid" },
        { label: "Pending", value: stats.pending, sub: stats.pending ? `${inr(stats.pendingAmount)} not paid` : "—", icon: Clock, cls: "text-amber-700 bg-amber-50", key: "pending" },
        { label: "Failed", value: stats.failed, sub: "payment failed", icon: XCircle, cls: "text-red-700 bg-red-50", key: "failed" },
        { label: "Collected", value: inr(stats.collected), sub: `${stats.whatsapp.sent || 0} WhatsApp sent`, icon: IndianRupee, cls: "text-emerald-700 bg-emerald-50", key: null },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-sm text-muted-foreground">Registrations and fee payments for courses and programs. No DCC receipt — a WhatsApp thank-you is sent instead.</p>
        </div>
        {!readOnly && <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> New program</Button>}
      </div>

      {/* program picker */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Programs starting</span>
            <div className="flex rounded-md border p-0.5">
              {([["all", "All"], ["this", "This month"], ["last", "Last month"], ["upcoming", "Upcoming"]] as [Period, string][]).map(([k, label]) => (
                <button key={k} onClick={() => setPeriod(k)} className={`rounded px-3 py-1.5 text-sm ${period === k ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex min-w-[240px] flex-1 flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Program</span>
            <select className={selectCls} value={programId} onChange={(e) => setProgramId(e.target.value)} disabled={loadingPrograms}>
              <option value="">{period === "all" ? "All programs" : `All programs in this period (${listed.length})`}</option>
              {listed.map((p) => (
                <option key={p._id} value={p._id}>{p.name} — starts {nice(p.startDate)}{p.registrationOpen ? "" : " (closed)"}</option>
              ))}
            </select>
          </label>
          {selected && (
            <div className="flex flex-wrap items-center gap-2">
              <a href={`${SITE}/${selected.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1 rounded-md border px-3 text-sm hover:bg-muted">
                <ExternalLink className="h-4 w-4" /> /{selected.slug}
              </a>
              {!readOnly && <Button variant="outline" onClick={() => toggleOpen(selected)}>{selected.registrationOpen ? "Close registrations" : "Open registrations"}</Button>}
              {!readOnly && <Button variant="outline" size="icon" onClick={() => openEdit(selected)} aria-label="Edit program"><Pencil className="h-4 w-4" /></Button>}
            </div>
          )}
        </CardContent>
        {selected && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t px-4 py-3 text-sm text-muted-foreground">
            <span>Fee: <b className="text-foreground">{selected.fee ? inr(selected.fee) : "Free"}</b></span>
            <span>Starts: <b className="text-foreground">{nice(selected.startDate)}</b></span>
            {selected.schedule && <span>{selected.schedule}</span>}
            {selected.forKids && <span>Ages {selected.ageMin ?? "?"}–{selected.ageMax ?? "?"}</span>}
            {selected.venues.length > 0 && <span>Venues: {selected.venues.map((v) => v.name).join(", ")}</span>}
            {selected.capacity ? <span>Seats: {selected.counts.paid + selected.counts.free}/{selected.capacity}</span> : null}
            <Badge className={selected.registrationOpen ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}>{selected.registrationOpen ? "Open" : "Closed"}</Badge>
          </div>
        )}
      </Card>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {statCards.map((c) => (
          <button
            key={c.label}
            type="button"
            disabled={c.key === null}
            onClick={() => c.key !== null && setStatus(c.key)}
            className={`rounded-xl border bg-card p-4 text-left transition ${c.key !== null ? "hover:shadow-md" : ""} ${c.key !== null && status === c.key ? "ring-2 ring-primary" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <span className={`rounded-lg p-1.5 ${c.cls}`}><c.icon className="h-4 w-4" /></span>
            </div>
            <div className="mt-2 text-2xl font-bold">{c.value}</div>
            <div className="text-xs text-muted-foreground">{c.sub}</div>
          </button>
        ))}
        {!stats && !loadingRegs && <p className="col-span-full text-sm text-muted-foreground">No programs in this period.</p>}
      </div>
      {stats && stats.venues.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Confirmed by venue:</span>
          {stats.venues.map((v) => <Badge key={v.venue} variant="outline">{v.venue}: {v.count}</Badge>)}
        </div>
      )}

      {/* filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <label className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search name, parent, phone, email, payment ID" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="completed">Confirmed (paid + free)</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="free">Free</option>
          </select>
          {venueOptions.length > 0 && (
            <select className={selectCls} value={venue} onChange={(e) => setVenue(e.target.value)}>
              <option value="">All venues</option>
              {venueOptions.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          )}
          <select className={selectCls} value={wa} onChange={(e) => setWa(e.target.value)}>
            <option value="">WhatsApp: any</option>
            <option value="sent">WhatsApp sent</option>
            <option value="failed">WhatsApp failed</option>
            <option value="not_sent">Not sent</option>
          </select>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">Registered from
            <input type="date" className={selectCls} value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">to
            <input type="date" className={selectCls} value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          {(status || venue || wa || from || to || q) && (
            <Button variant="ghost" onClick={() => { setStatus(""); setVenue(""); setWa(""); setFrom(""); setTo(""); setQ(""); }}>Clear</Button>
          )}
          <Button variant="outline" onClick={() => load()} aria-label="Refresh"><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" /> Export CSV</Button>
        </CardContent>
      </Card>

      {/* registrations */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Registered</th>
                  {!selected && <th className="px-4 py-3">Program</th>}
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Parent / contact</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingRegs && (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
                )}
                {!loadingRegs && items.length === 0 && (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No registrations match these filters.</td></tr>
                )}
                {!loadingRegs && items.map((r) => (
                  <tr key={r._id} className="border-b align-top last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">{niceTime(r.createdAt)}</td>
                    {!selected && <td className="px-4 py-3">{r.programId?.name || "—"}</td>}
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.name}</div>
                      {r.age != null && <div className="text-xs text-muted-foreground">Age {r.age}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {r.parentName && <div>{r.parentName}</div>}
                      <a href={`https://wa.me/91${r.mobile}`} target="_blank" rel="noreferrer" className="text-vk-600 hover:underline">{r.mobile}</a>
                      {r.email && <div className="text-xs text-muted-foreground">{r.email}</div>}
                    </td>
                    <td className="px-4 py-3">{r.venue || "—"}</td>
                    <td className="px-4 py-3">{r.amount ? inr(r.amount) : "Free"}</td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS_STYLE[r.paymentStatus]}>{STATUS_LABEL[r.paymentStatus]}</Badge>
                      {r.paymentStatus === "paid" && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {r.manualPayment?.mode ? `${r.manualPayment.mode} at venue` : r.razorpayPaymentId}
                        </div>
                      )}
                      {r.paymentStatus === "failed" && r.failureReason && <div className="mt-1 max-w-[180px] text-xs text-red-600">{r.failureReason}</div>}
                      {r.utm?.campaign && <div className="mt-1 text-xs text-muted-foreground">via {r.utm.campaign}</div>}
                    </td>
                    <td className={`px-4 py-3 text-xs ${WA_STYLE[r.whatsapp?.status || "not_sent"]}`} title={r.whatsapp?.error || ""}>
                      {r.paymentStatus === "paid" || r.paymentStatus === "free" ? (r.whatsapp?.status || "not_sent").replace("_", " ") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {readOnly ? null : busyId === r._id ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                          <>
                            {(r.paymentStatus === "pending" || r.paymentStatus === "failed") && r.razorpayOrderId && (
                              <Button size="sm" variant="outline" onClick={() => rowAction(r, "check-payment")} title="Ask Razorpay whether this was paid">Check payment</Button>
                            )}
                            {(r.paymentStatus === "pending" || r.paymentStatus === "failed") && (
                              <Button size="sm" variant="outline" onClick={() => { setPayFor(r); setPayMode("Cash"); setPayNote(""); }}>Mark paid</Button>
                            )}
                            {(r.paymentStatus === "paid" || r.paymentStatus === "free") && (
                              <Button size="sm" variant="ghost" onClick={() => rowAction(r, "whatsapp")} title={r.whatsapp?.status === "sent" ? "Send the thank-you again" : "Send the thank-you"}>
                                <MessageCircle className="mr-1 h-4 w-4" />{r.whatsapp?.status === "sent" ? "Resend" : "Send"}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>{total} registration{total === 1 ? "" : "s"}</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span>Page {page} of {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* all programs overview */}
      {!selected && listed.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="border-b px-4 py-3 font-semibold">Programs</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="px-4 py-2">Program</th><th className="px-4 py-2">Starts</th><th className="px-4 py-2">Fee</th><th className="px-4 py-2">Paid</th><th className="px-4 py-2">Pending</th><th className="px-4 py-2">Failed</th><th className="px-4 py-2">Collected</th><th className="px-4 py-2" /></tr>
                </thead>
                <tbody>
                  {listed.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-2"><button className="font-medium text-vk-600 hover:underline" onClick={() => setProgramId(p._id)}>{p.name}</button>{!p.registrationOpen && <Badge variant="outline" className="ml-2">Closed</Badge>}</td>
                      <td className="px-4 py-2">{nice(p.startDate)}</td>
                      <td className="px-4 py-2">{p.fee ? inr(p.fee) : "Free"}</td>
                      <td className="px-4 py-2">{p.counts.paid + p.counts.free}</td>
                      <td className="px-4 py-2">{p.counts.pending}</td>
                      <td className="px-4 py-2">{p.counts.failed}</td>
                      <td className="px-4 py-2">{inr(p.counts.collected)}</td>
                      <td className="px-4 py-2 text-right">
                        {!readOnly && <Button size="icon" variant="ghost" onClick={() => openEdit(p)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>}
                        {!readOnly && p.counts.total === 0 && <Button size="icon" variant="ghost" onClick={() => deleteProgram(p)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* create / edit program */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit program" : "New program"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2 space-y-1 text-sm">Program name *
              <input className={fieldCls} value={form.name} placeholder="Bala Samskriti" onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) }))} />
            </label>
            <label className="space-y-1 text-sm">Page link *
              <div className="flex items-center rounded-md border border-input">
                <span className="pl-3 text-muted-foreground">/</span>
                <input className="h-10 w-full bg-transparent px-1 text-sm outline-none" value={form.slug} onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: slugify(e.target.value) })); }} />
              </div>
              <span className="text-xs text-muted-foreground">Must match the program's page on the website, e.g. bala-samskriti.</span>
            </label>
            <label className="space-y-1 text-sm">Fee (₹) — 0 for free
              <input type="number" min={0} className={fieldCls} value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
            </label>
            <label className="sm:col-span-2 space-y-1 text-sm">Tagline
              <input className={fieldCls} value={form.tagline} placeholder="Vedic Culture & Values for Kids" onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">Start date *
              <input type="date" className={fieldCls} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">End date
              <input type="date" className={fieldCls} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">Schedule
              <input className={fieldCls} value={form.schedule} placeholder="Every Sunday, 10:30 AM to 1:30 PM" onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">Duration
              <input className={fieldCls} value={form.duration} placeholder="3 months" onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={form.forKids} onChange={(e) => setForm({ ...form, forKids: e.target.checked })} />
              Kids' program (form asks for the child's name and age, and a parent's name)
            </label>
            <label className="space-y-1 text-sm">Min age
              <input type="number" min={0} className={fieldCls} value={form.ageMin} onChange={(e) => setForm({ ...form, ageMin: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">Max age
              <input type="number" min={0} className={fieldCls} value={form.ageMax} onChange={(e) => setForm({ ...form, ageMax: e.target.value })} />
            </label>
            <div className="sm:col-span-2 space-y-2 text-sm">
              <div>Venues (people choose one when registering)</div>
              {form.venues.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <input className={`${fieldCls} max-w-[40%]`} placeholder="Venue name" value={v.name} onChange={(e) => setForm((f) => ({ ...f, venues: f.venues.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) }))} />
                  <input className={fieldCls} placeholder="Google Maps link (https://...)" value={v.mapUrl || ""} onChange={(e) => setForm((f) => ({ ...f, venues: f.venues.map((x, j) => (j === i ? { ...x, mapUrl: e.target.value } : x)) }))} />
                  <Button variant="ghost" size="icon" onClick={() => setForm((f) => ({ ...f, venues: f.venues.filter((_, j) => j !== i) }))} aria-label="Remove venue"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, venues: [...f.venues, { name: "", mapUrl: "" }] }))}><Plus className="mr-1 h-4 w-4" /> Add venue</Button>
            </div>
            <label className="space-y-1 text-sm">Contact numbers
              <input className={fieldCls} value={form.contactPhones} placeholder="9985364430, 7207108219" onChange={(e) => setForm({ ...form, contactPhones: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm">Seats (0 = no limit)
              <input type="number" min={0} className={fieldCls} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </label>
            <label className="sm:col-span-2 space-y-1 text-sm">Extra line in the WhatsApp thank-you (optional)
              <input className={fieldCls} value={form.whatsappNote} placeholder="Please arrive 10 minutes early on the first day." onChange={(e) => setForm({ ...form, whatsappNote: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={form.registrationOpen} onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })} />
              Registrations open
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={saveProgram} disabled={saving}>{saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}{editing ? "Save" : "Create program"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* mark paid at venue */}
      <Dialog open={!!payFor} onOpenChange={(o) => !o && setPayFor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Mark {payFor?.name} as paid</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">For a fee collected at the venue. The WhatsApp thank-you is sent to {payFor?.mobile}.</p>
          <label className="space-y-1 text-sm">Paid by
            <select className={fieldCls} value={payMode} onChange={(e) => setPayMode(e.target.value)}>
              <option>Cash</option><option>UPI</option><option>Bank transfer</option><option>Other</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">Note (receipt no., UPI ref…)
            <input className={fieldCls} value={payNote} onChange={(e) => setPayNote(e.target.value)} />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPayFor(null)}>Cancel</Button>
            <Button onClick={confirmMarkPaid}>Mark paid</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
