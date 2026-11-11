"use client";

// Admin pages must never be statically cached at the CDN edge.
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Download, IndianRupee, Loader2, Pencil, Plus, UserCheck, Users, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
// Links use the site the admin is on (www.hkmvizag.org in production).
const siteBase = () =>
  typeof window !== "undefined" && !/localhost|127\.0\.0\.1/.test(window.location.hostname) ? window.location.origin : "https://www.hkmvizag.org";

// Seva pages a preacher can share (each works with /CODE or /ID added). Festival pages only take donations while
// the festival is on.
const SEVA_LINKS: { group: string; items: { label: string; path: string }[] }[] = [
  {
    group: "Main sevas",
    items: [
      { label: "Anna Daan", path: "anna-daan-seva" },
      { label: "Gau Seva", path: "gau-seva" },
      { label: "Square Foot Seva", path: "sqft-seva-campaign" },
      { label: "Brick Seva", path: "brick-seva-campaign" },
      { label: "Gita Daan", path: "gita-daan-seva" },
      { label: "Alankara Vastra", path: "alankara-vastra-seva" },
      { label: "Subhojanam", path: "subhojanam" },
      { label: "Patron", path: "patron" },
      { label: "Special Occasion", path: "special-occasion" },
      { label: "Emergency Relief", path: "emergency-relief" },
    ],
  },
  {
    group: "Festival sevas",
    items: [
      { label: "Kartik Maas", path: "kartik-maas" },
      { label: "Diwali", path: "diwali" },
      { label: "Govardhan Puja", path: "govardhan-puja" },
      { label: "Vaikuntha Ekadashi", path: "vaikuntha-ekadashi" },
      { label: "Ekadashi", path: "ekadashi" },
      { label: "Pitru Paksha", path: "pitru-paksha" },
      { label: "Janmashtami", path: "janmashtami" },
      { label: "Radhashtami", path: "radhashtami" },
      { label: "Chaturmas", path: "chaturmas" },
      { label: "Vijayadashami", path: "vijayadashami" },
    ],
  },
];

interface Devotee { _id: string; name: string; code?: string; dccEnrolledById?: number | null; mobile?: string; email?: string; status: "active" | "hidden" }
interface Row { dccEnrolledById: number; name: string; code: string; count: number; total: number; donors: number; last: string }
interface Donation { _id: string; donorName: string; donorMobile?: string; amount: number; sevaName?: string; sourcePage?: string; status: string; createdAt: string; receiptNumber?: string; dccSyncStatus?: string; campaignerSlug?: string; manualPaymentMode?: string }
interface Detail { items: Donation[]; total: number; page: number; totalPages: number; daily: { _id: string; total: number; count: number }[] }

const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const nice = (d?: string) => (d ? new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "");
const ymd = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);
const RANGES = [
  { key: "month", label: "This month" },
  { key: "30", label: "Last 30 days" },
  { key: "year", label: "This year" },
  { key: "all", label: "All time" },
  { key: "custom", label: "Custom" },
];
const sel = "h-10 rounded-md border border-input bg-background px-3 text-sm";
const csvCell = (v: unknown) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export default function AdminPreachers() {
  const [tab, setTab] = useState("analytics");
  const [range, setRange] = useState("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [totals, setTotals] = useState({ count: 0, total: 0 });
  const [list, setList] = useState<Devotee[]>([]);
  const [pick, setPick] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // devotee list editing
  const [all, setAll] = useState<Devotee[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Devotee>>({});
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState("");

  const dates = useMemo(() => {
    const now = new Date();
    if (range === "month") return { from: ymd(new Date(now.getFullYear(), now.getMonth(), 1)), to: ymd(now) };
    if (range === "30") return { from: ymd(new Date(now.getTime() - 29 * 864e5)), to: ymd(now) };
    if (range === "year") return { from: ymd(new Date(now.getFullYear(), 0, 1)), to: ymd(now) };
    if (range === "custom") return { from, to };
    return { from: "", to: "" };
  }, [range, from, to]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (dates.from) p.set("from", dates.from);
      if (dates.to) p.set("to", dates.to);
      if (pick) { p.set("id", pick); p.set("page", String(page)); }
      const res = await authFetch(`${API_URL}/temple-devotees/admin/analytics?${p}`);
      const data = await res.json();
      if (res.ok) {
        setRows(data.preachers || []);
        setTotals(data.totals || { count: 0, total: 0 });
        setList(data.devotees || []);
        setDetail(data.donations || null);
      } else toast({ title: "Could not load", description: data.message, variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  }, [dates, pick, page]);

  const loadAll = useCallback(async () => {
    const res = await authFetch(`${API_URL}/temple-devotees/admin/list`);
    const data = await res.json();
    if (res.ok) setAll(data.devotees || []);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (tab === "devotees") loadAll(); }, [tab, loadAll]);
  useEffect(() => { setPage(1); }, [pick, dates]);

  const chosen = rows.find((r) => String(r.dccEnrolledById) === pick);
  const chosenDevotee = list.find((d) => String(d.dccEnrolledById) === pick);
  const maxDay = Math.max(1, ...(detail?.daily || []).map((d) => d.total));

  const exportCsv = () => {
    const head = ["Preacher", "Code", "DCC ID", "Donations", "Amount (Rs)", "Unique donors", "Last donation"];
    const lines = [head.join(","), ...rows.map((r) => [r.name, r.code, r.dccEnrolledById, r.count, r.total, r.donors, nice(r.last)].map(csvCell).join(","))];
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `preacher-donations-${dates.from || "all"}-to-${dates.to || ymd(new Date())}.csv`;
    a.click();
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(""), 1500);
  };

  const save = async (id: string | null) => {
    const body = { name: draft.name, code: draft.code, dccEnrolledById: draft.dccEnrolledById, mobile: draft.mobile, email: draft.email, status: draft.status };
    const res = await authFetch(id ? `${API_URL}/temple-devotees/admin/${id}` : `${API_URL}/temple-devotees/admin`, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      toast({ title: id ? "Saved" : "Devotee added" });
      setEditing(null);
      setAdding(false);
      setDraft({});
      loadAll();
      load();
    } else toast({ title: "Could not save", description: data.message, variant: "destructive" });
  };

  const editRow = (d: Partial<Devotee>, id: string | null) => (
    <tr key={id || "new"} className="border-b bg-primary/5">
      <td className="p-2"><Input value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" /></td>
      <td className="p-2"><Input value={draft.code || ""} onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} placeholder="ABRD" className="w-24" /></td>
      <td className="p-2"><Input type="number" value={draft.dccEnrolledById ?? ""} onChange={(e) => setDraft({ ...draft, dccEnrolledById: e.target.value === "" ? null : Number(e.target.value) })} placeholder="1" className="w-20" /></td>
      <td className="p-2"><Input value={draft.mobile || ""} onChange={(e) => setDraft({ ...draft, mobile: e.target.value })} placeholder="Mobile" /></td>
      <td className="p-2"><Input value={draft.email || ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Email" /></td>
      <td className="p-2">
        <select className={sel} value={draft.status || "active"} onChange={(e) => setDraft({ ...draft, status: e.target.value as Devotee["status"] })}>
          <option value="active">Active</option><option value="hidden">Hidden</option>
        </select>
      </td>
      <td className="p-2">
        <div className="flex gap-1">
          <Button size="sm" className="h-8 w-8 p-0" onClick={() => save(id)}><Check className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setEditing(null); setAdding(false); setDraft({}); }}><X className="h-4 w-4" /></Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight"><UserCheck className="h-6 w-6 text-primary" /> Preachers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Donations credited to a preacher: through their seva-page link (e.g. <code>/anna-daan-seva/ABRD</code>), a campaigner they referred, or a manual entry. Their receipts go to DCC under the preacher&apos;s ID. These are not counted in Admin → Donations, which shows only the temple&apos;s own donations (ID 36).
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="devotees">Devotee list &amp; links</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-4 space-y-4">
          <Card>
            <CardContent className="flex flex-wrap items-end gap-2 p-3">
              <select className={sel} value={pick} onChange={(e) => setPick(e.target.value)}>
                <option value="">All preachers</option>
                {list.map((d) => <option key={d._id} value={String(d.dccEnrolledById)}>{d.name}{d.code && d.code !== d.name ? ` (${d.code})` : ""}</option>)}
              </select>
              <select className={sel} value={range} onChange={(e) => setRange(e.target.value)}>
                {RANGES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
              {range === "custom" && (
                <>
                  <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto" />
                  <Input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className="w-auto" />
                </>
              )}
              <Button variant="outline" className="ml-auto gap-1" onClick={exportCsv} disabled={!rows.length}><Download className="h-4 w-4" /> Export CSV</Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: pick ? "Amount" : "Total amount", value: inr(pick ? chosen?.total || 0 : totals.total), icon: IndianRupee },
              { label: pick ? "Donations" : "Total donations", value: String(pick ? chosen?.count || 0 : totals.count), icon: Users },
              { label: pick ? "Unique donors" : "Active preachers", value: String(pick ? chosen?.donors || 0 : rows.length), icon: UserCheck },
              { label: "Average gift", value: inr(pick ? (chosen?.count ? chosen.total / chosen.count : 0) : totals.count ? totals.total / totals.count : 0), icon: IndianRupee },
            ].map((s) => (
              <Card key={s.label}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="mt-1 text-2xl font-bold">{s.value}</p></CardContent></Card>
            ))}
          </div>

          {loading ? (
            <p className="py-10 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></p>
          ) : !pick ? (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                    <tr><th className="p-3">Preacher</th><th className="p-3">Code · ID</th><th className="p-3 text-right">Donations</th><th className="p-3 text-right">Amount</th><th className="p-3 text-right">Donors</th><th className="p-3">Last donation</th><th className="p-3" /></tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No preacher donations in this period.</td></tr>
                    ) : rows.map((r) => (
                      <tr key={r.dccEnrolledById} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="p-3 font-medium">{r.name}</td>
                        <td className="p-3 text-muted-foreground">{r.code || "—"} · {r.dccEnrolledById}</td>
                        <td className="p-3 text-right">{r.count}</td>
                        <td className="p-3 text-right font-semibold">{inr(r.total)}</td>
                        <td className="p-3 text-right">{r.donors}</td>
                        <td className="p-3 text-xs text-muted-foreground">{nice(r.last)}</td>
                        <td className="p-3"><Button size="sm" variant="outline" onClick={() => setPick(String(r.dccEnrolledById))}>View</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : (
            <>
              {chosenDevotee && (chosenDevotee.code || chosenDevotee.dccEnrolledById != null) && (() => {
                const key = chosenDevotee.code || String(chosenDevotee.dccEnrolledById);
                const url = (path: string) => `${siteBase()}/${path}/${key}`;
                const allText = [`${chosenDevotee.name} — seva links`, ...SEVA_LINKS.flatMap((g) => g.items.map((i) => `${i.label}: ${url(i.path)}`))].join("\n");
                return (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{chosenDevotee.name}&apos;s seva links</p>
                          <p className="text-xs text-muted-foreground">Donations through these links raise the receipt under ID {chosenDevotee.dccEnrolledById}. Each page also works with /{chosenDevotee.dccEnrolledById}.</p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => copy(allText)}>
                          {copied === allText ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy all (for WhatsApp)
                        </Button>
                      </div>
                      {SEVA_LINKS.map((g) => (
                        <div key={g.group} className="mt-4">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</p>
                          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {g.items.map((i) => (
                              <div key={i.path} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium">{i.label}</p>
                                  <a href={url(i.path)} target="_blank" rel="noreferrer" className="block truncate text-xs text-primary hover:underline">{url(i.path).replace(/^https?:\/\//, "")}</a>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 w-8 shrink-0 p-0" title="Copy link" onClick={() => copy(url(i.path))}>
                                  {copied === url(i.path) ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })()}
              {detail && detail.daily.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <p className="mb-3 text-sm font-semibold">Daily amount</p>
                    <div className="flex h-36 items-end gap-1 overflow-x-auto">
                      {detail.daily.map((d) => (
                        <div key={d._id} className="flex min-w-[18px] max-w-[48px] flex-1 flex-col items-center justify-end" title={`${d._id}: ${inr(d.total)} (${d.count})`}>
                          <div className="w-full rounded-t bg-primary/80" style={{ height: `${Math.max(4, (d.total / maxDay) * 120)}px` }} />
                          <span className="mt-1 text-[9px] text-muted-foreground">{d._id.slice(8)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardContent className="overflow-x-auto p-0">
                  <table className="w-full min-w-[860px] text-sm">
                    <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                      <tr><th className="p-3">Donor</th><th className="p-3">Seva · Page</th><th className="p-3 text-right">Amount</th><th className="p-3">Status</th><th className="p-3">Receipt</th><th className="p-3">Via</th><th className="p-3">Date</th></tr>
                    </thead>
                    <tbody>
                      {!detail || detail.items.length === 0 ? (
                        <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No donations in this period.</td></tr>
                      ) : detail.items.map((d) => (
                        <tr key={d._id} className="border-b last:border-0">
                          <td className="p-3"><p className="font-medium">{d.donorName}</p><p className="text-xs text-muted-foreground">{d.donorMobile}</p></td>
                          <td className="p-3 text-xs">{d.sevaName || "—"}<br /><span className="text-muted-foreground">{d.sourcePage}</span></td>
                          <td className="p-3 text-right font-semibold">{inr(d.amount)}</td>
                          <td className="p-3 text-xs capitalize">{d.status}</td>
                          <td className="p-3 text-xs">{d.receiptNumber || "—"}{d.dccSyncStatus ? <span className="block text-muted-foreground">DCC: {d.dccSyncStatus}</span> : null}</td>
                          <td className="p-3 text-xs">{d.campaignerSlug ? "Campaigner" : d.manualPaymentMode ? "Manual entry" : "Preacher link"}</td>
                          <td className="p-3 text-xs text-muted-foreground">{nice(d.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              {detail && detail.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                  <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                  <span>Page {page} of {detail.totalPages}</span>
                  <Button size="sm" variant="outline" disabled={page >= detail.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="devotees" className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Each devotee&apos;s link is any seva page plus their code or ID, e.g. <code>/gau-seva/ABRD</code>. Unknown codes go to the default receipt (36).</p>
            <Button size="sm" className="gap-1" onClick={() => { setAdding(true); setEditing(null); setDraft({ status: "active" }); }}><Plus className="h-4 w-4" /> Add devotee</Button>
          </div>
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <tr><th className="p-3">Name</th><th className="p-3">Code</th><th className="p-3">DCC ID</th><th className="p-3">Mobile</th><th className="p-3">Email</th><th className="p-3">Status</th><th className="p-3">Link</th></tr>
                </thead>
                <tbody>
                  {adding && editRow(draft, null)}
                  {all.map((d) =>
                    editing === d._id ? editRow(draft, d._id) : (
                      <tr key={d._id} className={`border-b last:border-0 ${d.status === "hidden" ? "opacity-50" : ""}`}>
                        <td className="p-3 font-medium">{d.name}</td>
                        <td className="p-3">{d.code || "—"}</td>
                        <td className="p-3">{d.dccEnrolledById ?? "—"}</td>
                        <td className="p-3 text-xs">{d.mobile || "—"}</td>
                        <td className="p-3 text-xs">{d.email || "—"}</td>
                        <td className="p-3 text-xs capitalize">{d.status}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {d.code && <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => copy(`${siteBase()}/anna-daan-seva/${d.code}`)}>{copied === `${siteBase()}/anna-daan-seva/${d.code}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} /{d.code}</Button>}
                            {d.dccEnrolledById != null && <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setPick(String(d.dccEnrolledById)); setTab("analytics"); }}>All links</Button>}
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setEditing(d._id); setAdding(false); setDraft({ ...d }); }}><Pencil className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
