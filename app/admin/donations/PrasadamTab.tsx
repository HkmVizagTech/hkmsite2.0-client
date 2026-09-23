"use client";

// Prasadam tab — every donation where the donor opted for Maha Prasadam
// delivery, with an admin-managed dispatch lifecycle (pending → dispatched
// → delivered, or cancelled), courier/tracking details, and a CSV download
// for the courier run. Backed by /donations/prasadam-requests,
// /donations/:id/prasadam-status and /donations/prasadam-export.
//
// Scope: main-site seva/campaign donations only. The standalone /donations
// page family is excluded server-side (it has its own dedicated admin), so
// its donors never appear here. All counts are prasadam opt-ins only —
// donors who never ticked the prasadam box are never counted.

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Download, Search, Package, PackageCheck, Truck, XCircle, Clock, Eye, X, CalendarRange, AlertTriangle,
} from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface PrasadamAddress {
  doorNo?: string;
  house?: string;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

interface PrasadamRequest {
  _id: string;
  donorName: string;
  donorEmail?: string;
  donorMobile?: string;
  amount: number;
  status: string; // payment status
  sevaName?: string;
  type?: string;
  sourcePage?: string;
  createdAt: string;
  prasadamAddress?: PrasadamAddress;
  prasadamStatus?: "pending" | "dispatched" | "delivered" | "cancelled";
  prasadamCourier?: string;
  prasadamTrackingNumber?: string;
  prasadamDispatchedAt?: string;
  prasadamDeliveredAt?: string;
  prasadamNotes?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  receiptNumber?: string;
}

type StatusFilter = "all" | "not_dispatched" | "pending" | "dispatched" | "delivered" | "cancelled";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "not_dispatched", label: "To Dispatch" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  dispatched: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

const formatAddress = (a?: PrasadamAddress) => {
  if (!a) return "";
  return [a.doorNo, a.house, a.street, a.area, a.city, a.state, a.pincode, a.country]
    .filter(Boolean)
    .join(", ");
};

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-";

// Badge count for a filter tab. The server reports old records (pre-dating
// tracking, prasadamStatus undefined) under "pending" — which is exactly
// what the "To Dispatch" tab shows, so it borrows that count.
const countFor = (v: StatusFilter, counts: Record<string, number>) =>
  v === "all" ? counts.all : v === "not_dispatched" ? counts.pending : counts[v];

// Pretty label for a sourcePage value — "ekadashi" → "Ekadashi".
const prettyPage = (p: string) =>
  (p || "").replace(/^\//, "").replace(/[-_/]+/g, " ").trim()
    ? p.replace(/^\//, "").replace(/[-_/]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : p;

export default function PrasadamTab() {
  const [list, setList] = useState<PrasadamRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("not_dispatched");
  const [search, setSearch] = useState("");
  const [sevaFilter, setSevaFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({});
  const [sevaOptions, setSevaOptions] = useState<string[]>([]);
  const [pageOptions, setPageOptions] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);

  // Update modal state
  const [editing, setEditing] = useState<PrasadamRequest | null>(null);
  const [form, setForm] = useState({ prasadamStatus: "pending", prasadamCourier: "", prasadamTrackingNumber: "", prasadamNotes: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), status: statusFilter });
      if (search) params.set("q", search);
      if (sevaFilter !== "all") params.set("seva", sevaFilter);
      if (pageFilter !== "all") params.set("sourcePage", pageFilter);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      const res = await authFetch(`${API_URL}/donations/prasadam-requests?${params.toString()}`, { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setList(json.requests || []);
        setTotal(json.total || 0);
        setBadgeCounts(json.badgeCounts || {});
        setSevaOptions(json.filterOptions?.sevas || []);
        setPageOptions(json.filterOptions?.pages || []);
      } else {
        // Distinguish "API failed / server not deployed" from "no requests".
        setError(json.message || `Server error (${res.status})`);
        setList([]);
        setTotal(0);
      }
    } catch {
      setError("Could not reach the server. If the backend was just updated, it may need a restart.");
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, search, sevaFilter, pageFilter, dateFrom, dateTo]);

  useEffect(() => {
    const t = setTimeout(fetchList, 250);
    return () => clearTimeout(t);
  }, [fetchList]);

  const resetPage = () => setPage(1);

  const downloadCsv = () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter });
      if (search) params.set("q", search);
      if (sevaFilter !== "all") params.set("seva", sevaFilter);
      if (pageFilter !== "all") params.set("sourcePage", pageFilter);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      window.open(`${API_URL}/donations/prasadam-export?${params.toString()}`, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const openEditor = (r: PrasadamRequest) => {
    setEditing(r);
    setSaveMsg(null);
    setForm({
      prasadamStatus: r.prasadamStatus || "pending",
      prasadamCourier: r.prasadamCourier || "",
      prasadamTrackingNumber: r.prasadamTrackingNumber || "",
      prasadamNotes: r.prasadamNotes || "",
    });
  };

  const saveStatus = async () => {
    if (!editing) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await authFetch(`${API_URL}/donations/${editing._id}/prasadam-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        setEditing(null);
        fetchList();
      } else {
        setSaveMsg(j.message || "Failed to update");
      }
    } catch {
      setSaveMsg("Network error");
    } finally {
      setSaving(false);
    }
  };

  const statusIcon = (s?: string) => {
    if (s === "delivered") return <PackageCheck className="w-3.5 h-3.5" />;
    if (s === "dispatched") return <Truck className="w-3.5 h-3.5" />;
    if (s === "cancelled") return <XCircle className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  const hasActiveFilters = sevaFilter !== "all" || pageFilter !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-4">
      {/* Header row: description + download */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="w-4 h-4" />
          Main-site donors who opted for Maha Prasadam — track dispatch &amp; delivery.
        </div>
        <Button className="gap-2 bg-transparent border border-border text-foreground hover:bg-muted" onClick={downloadCsv} disabled={downloading}>
          <Download className="w-4 h-4" /> Download CSV
        </Button>
      </div>

      {/* Error banner — API failed is NOT the same as "no data" */}
      {error && !loading && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Could not load prasadam requests</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Status tabs with counts */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => { setStatusFilter(t.value); resetPage(); }}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === t.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {t.label}
            {countFor(t.value, badgeCounts) !== undefined && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${statusFilter === t.value ? "bg-primary-foreground/20" : "bg-muted"}`}>
                {countFor(t.value, badgeCounts) ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search name, mobile, email, pincode or tracking no."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); resetPage(); }}
          className="pl-10"
        />
      </div>

      {/* Seva / page / date filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={sevaFilter}
          onChange={(e) => { setSevaFilter(e.target.value); resetPage(); }}
        >
          <option value="all">All Sevas</option>
          {sevaOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={pageFilter}
          onChange={(e) => { setPageFilter(e.target.value); resetPage(); }}
        >
          <option value="all">All Pages</option>
          {pageOptions.map((p) => (
            <option key={p} value={p}>{prettyPage(p)}</option>
          ))}
        </select>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarRange className="h-4 w-4" /> From
          </label>
          <Input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => { setDateFrom(e.target.value); resetPage(); }}
            className="w-auto"
          />
          <label className="text-sm text-muted-foreground">To</label>
          <Input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => { setDateTo(e.target.value); resetPage(); }}
            className="w-auto"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Today", days: 0 },
            { label: "Last 7 days", days: 7 },
            { label: "Last 30 days", days: 30 },
            { label: "This month", days: -1 },
          ].map((preset) => (
            <Button
              key={preset.label}
              className="h-8 px-3 text-xs bg-transparent border border-border text-foreground hover:bg-muted"
              onClick={() => {
                const today = new Date();
                const toStr = today.toISOString().slice(0, 10);
                let fromStr = toStr;
                if (preset.days === -1) {
                  fromStr = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
                } else if (preset.days > 0) {
                  const d = new Date(today);
                  d.setDate(d.getDate() - preset.days);
                  fromStr = d.toISOString().slice(0, 10);
                }
                setDateFrom(fromStr);
                setDateTo(toStr);
                resetPage();
              }}
            >
              {preset.label}
            </Button>
          ))}
          {hasActiveFilters && (
            <Button
              className="h-8 px-3 text-xs bg-transparent border border-border text-foreground hover:bg-muted"
              onClick={() => { setSevaFilter("all"); setPageFilter("all"); setDateFrom(""); setDateTo(""); resetPage(); }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Donor</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Delivery Address</th>
                  <th className="px-4 py-3 text-left font-medium">Seva / Source</th>
                  <th className="px-4 py-3 text-left font-medium">Prasadam Status</th>
                  <th className="px-4 py-3 text-left font-medium">Courier / Tracking</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-muted-foreground"><Loader2 className="inline mr-2 h-4 w-4 animate-spin" />Loading...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-6 text-muted-foreground">{error ? "—" : "No prasadam requests match these filters."}</td></tr>
                ) : list.map((r) => {
                  const ps = r.prasadamStatus || "pending";
                  return (
                    <tr key={r._id} className="border-b hover:bg-muted/30 align-top">
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.donorName || "Anonymous"}</div>
                        <div className="text-xs text-muted-foreground">{r.donorMobile || "-"}</div>
                        <div className="text-xs text-muted-foreground">{r.donorEmail || ""}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">₹{(r.amount || 0).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 max-w-[260px]">
                        <div className="text-xs leading-5">{formatAddress(r.prasadamAddress) || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div>{r.sevaName || r.type || "-"}</div>
                        <div className="text-muted-foreground">{r.sourcePage ? prettyPage(r.sourcePage) : ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${STATUS_BADGE[ps] || ""} gap-1`}>
                          {statusIcon(ps)} {ps}
                        </Badge>
                        {r.prasadamDispatchedAt && (
                          <div className="mt-1 text-[10px] text-muted-foreground">Sent {fmtDate(r.prasadamDispatchedAt)}</div>
                        )}
                        {r.prasadamDeliveredAt && (
                          <div className="text-[10px] text-muted-foreground">Delivered {fmtDate(r.prasadamDeliveredAt)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {r.prasadamCourier || <span className="text-muted-foreground">-</span>}
                        {r.prasadamTrackingNumber && <div className="font-mono text-[11px]">{r.prasadamTrackingNumber}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <Button className="gap-1.5 h-8 px-3 text-xs bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => openEditor(r)}>
                          <Eye className="w-3.5 h-3.5" /> Update
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {total > 0 ? `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}` : "No results"}
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <span className="text-sm px-2">Page {page}</span>
          <Button disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      {/* Update modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-background rounded-2xl p-6 w-full max-w-md shadow-elevated max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold">Prasadam Delivery</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Donor</span><span className="font-medium">{editing.donorName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mobile</span><span>{editing.donorMobile || "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold">₹{(editing.amount || 0).toLocaleString("en-IN")}</span></div>
              <div className="border-t pt-2">
                <div className="text-xs text-muted-foreground mb-1">Delivery Address</div>
                <div className="text-xs leading-5">{formatAddress(editing.prasadamAddress) || "-"}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <select
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.prasadamStatus}
                  onChange={(e) => setForm((f) => ({ ...f, prasadamStatus: e.target.value }))}
                >
                  <option value="pending">Pending (not yet sent)</option>
                  <option value="dispatched">Dispatched (given to courier)</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Courier (e.g. Delhivery, Blue Dart, India Post)</label>
                <Input
                  value={form.prasadamCourier}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, prasadamCourier: e.target.value }))}
                  placeholder="Courier name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Tracking number</label>
                <Input
                  value={form.prasadamTrackingNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, prasadamTrackingNumber: e.target.value }))}
                  placeholder="AWB / consignment number"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Notes (internal)</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[70px]"
                  value={form.prasadamNotes}
                  onChange={(e) => setForm((f) => ({ ...f, prasadamNotes: e.target.value }))}
                  placeholder="e.g. donor unreachable, re-dispatch scheduled..."
                />
              </div>
              {saveMsg && <p className="text-xs text-red-600">{saveMsg}</p>}
              <div className="flex gap-2 pt-1">
                <Button onClick={saveStatus} disabled={saving} className="flex-1 gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
                </Button>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
