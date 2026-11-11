"use client";

// Admin pages must never be statically cached at the CDN edge.
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, CalendarDays, Download, Link2, Loader2, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
const BASE = `${API_URL}/gita-course`;

type Phase = "upcoming" | "running" | "completed";
interface Batch {
  _id: string;
  name: string;
  ageGroup: "adults" | "youth" | "kids";
  language: "English" | "Telugu";
  startDate: string;
  endDate: string;
  classTime?: string;
  whatsappLink?: string;
  capacity?: number;
  registrationOpen: boolean;
  notes?: string;
  phase: Phase;
  counts: { total: number; [status: string]: number };
}
interface Registration {
  _id: string;
  name: string;
  kidName?: string;
  mobile: string;
  email?: string;
  city?: string;
  batch: string; // age group
  language?: string;
  preferredTime?: string;
  status: string;
  batchId?: { _id: string; name: string; startDate: string; endDate: string } | null;
  createdAt: string;
}

const AGE_LABEL: Record<string, string> = { adults: "Adults", youth: "Youth", kids: "Kids" };
const STATUSES = ["new", "contacted", "added", "completed", "dropped"];
const STATUS_LABEL: Record<string, string> = { new: "New", contacted: "Contacted", added: "Added to group", completed: "Completed", dropped: "Dropped" };
const PHASE_STYLE: Record<Phase, string> = {
  upcoming: "bg-amber-100 text-amber-800",
  running: "bg-green-100 text-green-700",
  completed: "bg-muted text-muted-foreground",
};

const ymd = (d?: string) => (d ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(d)) : "");
const nice = (d?: string) => (d ? new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" }) : "");
const base = "h-10 rounded-md border border-input bg-background px-3 text-sm";
const field = `${base} w-full`;

const EMPTY_FORM = { name: "", ageGroup: "adults", language: "English", startDate: "", endDate: "", classTime: "", whatsappLink: "", capacity: "", registrationOpen: true, notes: "" };

export default function AdminGitaCourse() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [unassigned, setUnassigned] = useState(0);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [tab, setTab] = useState("batches");

  // registrations
  const [items, setItems] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [fBatch, setFBatch] = useState("");
  const [fAge, setFAge] = useState("");
  const [fLang, setFLang] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBatch, setBulkBatch] = useState("");

  // batch form
  const [editing, setEditing] = useState<Batch | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const loadBatches = useCallback(async () => {
    setLoadingBatches(true);
    try {
      const res = await authFetch(`${BASE}/batches`);
      const data = await res.json();
      if (res.ok) {
        setBatches(data.batches || []);
        setUnassigned(data.unassigned || 0);
      } else toast({ title: "Could not load batches", description: data.message, variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setLoadingBatches(false);
  }, []);

  const filters = useMemo(() => {
    const p = new URLSearchParams();
    if (fBatch) p.set("batchId", fBatch);
    if (fAge) p.set("ageGroup", fAge);
    if (fLang) p.set("language", fLang);
    if (fStatus) p.set("status", fStatus);
    if (q.trim()) p.set("q", q.trim());
    return p;
  }, [fBatch, fAge, fLang, fStatus, q]);

  const loadRegs = useCallback(async () => {
    setLoadingRegs(true);
    try {
      const p = new URLSearchParams(filters);
      p.set("page", String(page));
      p.set("limit", "50");
      const res = await authFetch(`${BASE}/registrations?${p}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(Math.max(1, data.totalPages || 1));
      } else toast({ title: "Could not load registrations", description: data.message, variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setLoadingRegs(false);
  }, [filters, page]);

  useEffect(() => { loadBatches(); }, [loadBatches]);
  useEffect(() => { if (tab === "registrations") loadRegs(); }, [tab, loadRegs]);
  useEffect(() => { setPage(1); setSelected(new Set()); }, [filters]);

  const openNew = () => { setEditing(null); setForm({ ...EMPTY_FORM }); setFormOpen(true); };
  const openEdit = (b: Batch) => {
    setEditing(b);
    setForm({ name: b.name, ageGroup: b.ageGroup, language: b.language, startDate: ymd(b.startDate), endDate: ymd(b.endDate), classTime: b.classTime || "", whatsappLink: b.whatsappLink || "", capacity: b.capacity ? String(b.capacity) : "", registrationOpen: b.registrationOpen, notes: b.notes || "" });
    setFormOpen(true);
  };

  const saveBatch = async () => {
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      toast({ title: "Name, start date and end date are required", variant: "destructive" });
      return;
    }
    if (form.endDate < form.startDate) {
      toast({ title: "The end date must be on or after the start date", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await authFetch(editing ? `${BASE}/batches/${editing._id}` : `${BASE}/batches`, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) || 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: editing ? "Batch updated" : "Batch created" });
        setFormOpen(false);
        loadBatches();
      } else toast({ title: "Could not save", description: data.message, variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const toggleOpen = async (b: Batch) => {
    const res = await authFetch(`${BASE}/batches/${b._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ registrationOpen: !b.registrationOpen }) });
    if (res.ok) loadBatches();
  };

  const deleteBatch = async (b: Batch) => {
    if (!confirm(`Delete batch "${b.name}"?`)) return;
    const res = await authFetch(`${BASE}/batches/${b._id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) { toast({ title: "Batch deleted" }); loadBatches(); }
    else toast({ title: "Could not delete", description: data.message, variant: "destructive" });
  };

  const exportCsv = async (params: URLSearchParams, label: string) => {
    try {
      const res = await authFetch(`${BASE}/registrations/export?${params}`);
      if (!res.ok) { toast({ title: "Export failed", variant: "destructive" }); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gita-registrations-${label}-${ymd(new Date().toISOString())}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
  };
  const exportBatch = (b: Batch) => exportCsv(new URLSearchParams({ batchId: b._id }), b.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase());

  const updateReg = async (id: string, patch: { status?: string; batchId?: string | null }) => {
    const res = await authFetch(`${BASE}/registrations/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    const data = await res.json();
    if (res.ok) {
      setItems((xs) => xs.map((x) => (x._id === id ? data.data : x)));
      if (patch.batchId !== undefined) loadBatches();
    } else toast({ title: "Could not update", description: data.message, variant: "destructive" });
  };

  const bulkMove = async (patch: { status?: string; batchId?: string | null }) => {
    if (!selected.size) return;
    const res = await authFetch(`${BASE}/registrations/bulk`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [...selected], ...patch }) });
    const data = await res.json();
    if (res.ok) {
      toast({ title: `Updated ${data.modified} registration${data.modified === 1 ? "" : "s"}` });
      setSelected(new Set());
      loadRegs();
      loadBatches();
    } else toast({ title: "Could not update", description: data.message, variant: "destructive" });
  };

  const allOnPage = items.length > 0 && items.every((x) => selected.has(x._id));
  const totals = batches.reduce((a, b) => a + (b.counts?.total || 0), 0) + unassigned;
  const running = batches.filter((b) => b.phase === "running").length;
  const upcoming = batches.filter((b) => b.phase === "upcoming").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight"><BookOpen className="h-6 w-6 text-primary" /> Gita Course</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Batches and registrations for the free &quot;Understand Gita in 18 Days&quot; course. New registrations go to the earliest open batch for their age group and language.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> New batch</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total registrations", value: totals },
          { label: "Running batches", value: running },
          { label: "Upcoming batches", value: upcoming },
          { label: "Not in a batch", value: unassigned },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="mt-1 text-2xl font-bold">{s.value}</p></CardContent></Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
        </TabsList>

        {/* ── Batches ── */}
        <TabsContent value="batches" className="mt-4 space-y-3">
          {unassigned > 0 && (
            <Card className="border-amber-300 bg-amber-50">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm text-amber-900">
                <span><strong>{unassigned}</strong> registration{unassigned === 1 ? " is" : "s are"} not in a batch (no open batch matched when they registered).</span>
                <Button size="sm" variant="outline" onClick={() => { setFBatch("none"); setTab("registrations"); }}>Assign them</Button>
              </CardContent>
            </Card>
          )}
          {loadingBatches ? (
            <p className="py-12 text-center text-muted-foreground">Loading…</p>
          ) : batches.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No batches yet. Create the first one with “New batch”.</CardContent></Card>
          ) : (
            batches.map((b) => (
              <Card key={b._id}>
                <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-semibold">
                      {b.name}
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${PHASE_STYLE[b.phase]}`}>{b.phase}</span>
                      <Badge variant="outline">{AGE_LABEL[b.ageGroup]}</Badge>
                      <Badge variant="outline">{b.language}</Badge>
                      {!b.registrationOpen && <Badge variant="secondary">Registration closed</Badge>}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {nice(b.startDate)} – {nice(b.endDate)}</span>
                      {b.classTime && <span>{b.classTime}</span>}
                      <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {b.counts?.total || 0}{b.capacity ? ` / ${b.capacity}` : ""} registered</span>
                      {b.whatsappLink ? <a href={b.whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Link2 className="h-3.5 w-3.5" /> WhatsApp group</a> : <span className="text-amber-700">No WhatsApp link</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setFBatch(b._id); setTab("registrations"); }}>View</Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => exportBatch(b)}><Download className="h-3.5 w-3.5" /> CSV</Button>
                    <Button size="sm" variant="outline" onClick={() => toggleOpen(b)}>{b.registrationOpen ? "Close registration" : "Open registration"}</Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(b)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50" onClick={() => deleteBatch(b)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ── Registrations ── */}
        <TabsContent value="registrations" className="mt-4 space-y-3">
          <Card>
            <CardContent className="flex flex-wrap items-end gap-2 p-3">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, mobile, email, city" className="pl-9" />
              </div>
              <select value={fBatch} onChange={(e) => setFBatch(e.target.value)} className={base}>
                <option value="">All batches</option>
                <option value="none">Not in a batch</option>
                {batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
              <select value={fAge} onChange={(e) => setFAge(e.target.value)} className={base}>
                <option value="">All ages</option>
                <option value="adults">Adults</option><option value="youth">Youth</option><option value="kids">Kids</option>
              </select>
              <select value={fLang} onChange={(e) => setFLang(e.target.value)} className={base}>
                <option value="">All languages</option>
                <option>English</option><option>Telugu</option>
              </select>
              <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={base}>
                <option value="">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
              <Button variant="outline" className="gap-1" onClick={() => exportCsv(filters, fBatch === "none" ? "unassigned" : fBatch ? (batches.find((b) => b._id === fBatch)?.name || "batch").replace(/[^a-z0-9]+/gi, "-").toLowerCase() : "filtered")}>
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </CardContent>
          </Card>

          {selected.size > 0 && (
            <Card className="border-primary/30">
              <CardContent className="flex flex-wrap items-center gap-2 p-3 text-sm">
                <strong>{selected.size} selected</strong>
                <select value={bulkBatch} onChange={(e) => setBulkBatch(e.target.value)} className={base}>
                  <option value="">Move to batch…</option>
                  {batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
                <Button size="sm" disabled={!bulkBatch} onClick={() => bulkMove({ batchId: bulkBatch })}>Move</Button>
                <select defaultValue="" onChange={(e) => { if (e.target.value) bulkMove({ status: e.target.value }); e.target.value = ""; }} className={base}>
                  <option value="">Set status…</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
                <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full min-w-[960px] text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3"><input type="checkbox" checked={allOnPage} onChange={() => setSelected(allOnPage ? new Set() : new Set(items.map((x) => x._id)))} /></th>
                    <th className="p-3">Name</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Age · Language</th>
                    <th className="p-3">City · Time</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRegs ? (
                    <tr><td colSpan={8} className="p-10 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
                  ) : items.length === 0 ? (
                    <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No registrations match these filters.</td></tr>
                  ) : (
                    items.map((r) => (
                      <tr key={r._id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="p-3"><input type="checkbox" checked={selected.has(r._id)} onChange={() => setSelected((s) => { const n = new Set(s); if (n.has(r._id)) n.delete(r._id); else n.add(r._id); return n; })} /></td>
                        <td className="p-3">
                          <p className="font-medium">{r.name}</p>
                          {r.kidName && <p className="text-xs text-muted-foreground">Child: {r.kidName}</p>}
                          {r.email && <p className="text-xs text-muted-foreground">{r.email}</p>}
                        </td>
                        <td className="p-3"><a href={`https://wa.me/91${r.mobile}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{r.mobile}</a></td>
                        <td className="p-3">{AGE_LABEL[r.batch] || r.batch} · {r.language || "—"}</td>
                        <td className="p-3 text-xs">{r.city || "—"}<br /><span className="text-muted-foreground">{r.preferredTime || "No preference"}</span></td>
                        <td className="p-3">
                          <select value={r.batchId?._id || ""} onChange={(e) => updateReg(r._id, { batchId: e.target.value || null })} className={`${base} !h-8 w-44 text-xs`}>
                            <option value="">Not in a batch</option>
                            {batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                          </select>
                        </td>
                        <td className="p-3">
                          <select value={r.status} onChange={(e) => updateReg(r._id, { status: e.target.value })} className={`${base} !h-8 w-36 text-xs`}>
                            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                          </select>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{nice(r.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{total} registration{total === 1 ? "" : "s"}</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span>Page {page} of {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit batch" : "New batch"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <label className="text-xs font-medium">Batch name *
              <Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Adults · Telugu · Dec 2026" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium">Age group *
                <select className={`${field} mt-1`} value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}>
                  <option value="adults">Adults (25+)</option><option value="youth">Youth (16–25)</option><option value="kids">Kids (15 and below)</option>
                </select>
              </label>
              <label className="text-xs font-medium">Language *
                <select className={`${field} mt-1`} value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                  <option>English</option><option>Telugu</option>
                </select>
              </label>
              <label className="text-xs font-medium">Start date *
                <Input className="mt-1" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </label>
              <label className="text-xs font-medium">End date *
                <Input className="mt-1" type="date" min={form.startDate || undefined} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </label>
              <label className="text-xs font-medium">Class time
                <Input className="mt-1" value={form.classTime} onChange={(e) => setForm({ ...form, classTime: e.target.value })} placeholder="e.g. 7:00 PM to 8:00 PM" />
              </label>
              <label className="text-xs font-medium">Capacity (0 = no limit)
                <Input className="mt-1" type="number" min={0} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              </label>
            </div>
            <label className="text-xs font-medium">WhatsApp group link
              <Input className="mt-1" value={form.whatsappLink} onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })} placeholder="https://chat.whatsapp.com/..." />
              <span className="mt-1 block font-normal text-muted-foreground">People who register for this batch are sent to this group.</span>
            </label>
            <label className="text-xs font-medium">Notes
              <Input className="mt-1" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Instructor, Zoom link, anything internal" />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.registrationOpen} onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })} />
              Open for new registrations
            </label>
            <Button onClick={saveBatch} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Save changes" : "Create batch"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
