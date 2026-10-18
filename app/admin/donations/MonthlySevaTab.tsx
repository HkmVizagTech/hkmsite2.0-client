"use client";

// Monthly Seva — every monthly (recurring) donation, one row per Razorpay
// subscription: who, how much, months paid and collected (our records), and
// Razorpay's live status / months charged / next charge for the rows on
// screen (server: GET /donations/subscriptions). Each month's charge is also
// an ordinary donation in Overview, with its own DCC and WhatsApp receipt.

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, RefreshCw, Repeat, Search } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface Live {
  status?: string;
  label?: string;
  paidCount?: number | null;
  remainingCount?: number | null;
  nextChargeAt?: string | null;
  endedAt?: string | null;
  error?: string;
}

interface Row {
  subscriptionId: string;
  donorName?: string;
  donorMobile?: string;
  donorEmail?: string;
  sevaName?: string;
  sourcePage?: string;
  account: string;
  startedAt: string;
  amount: number;
  monthsPaid: number;
  totalPaid: number;
  lastChargedAt?: string | null;
  missingReceipts: number;
  missedMonths?: number;
  live?: Live;
}

interface Data {
  total: number;
  page: number;
  totalPages: number;
  summary: { subscriptions: number; chargesRecorded: number; collected: number; thisMonthCharges: number; thisMonthAmount: number };
  subscriptions: Row[];
}

const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const day = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" }) : "—";

const STATUS_CLS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  authenticated: "bg-blue-100 text-blue-700",
  created: "bg-gray-100 text-gray-700",
  pending: "bg-amber-100 text-amber-700",
  halted: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-700",
  expired: "bg-gray-200 text-gray-700",
  completed: "bg-indigo-100 text-indigo-700",
  paused: "bg-amber-100 text-amber-700",
};

export default function MonthlySevaTab() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "25" });
      if (query) params.set("search", query);
      const res = await authFetch(`${API_URL}/donations/subscriptions?${params}`, { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Could not load monthly seva.");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load monthly seva.");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    load();
  }, [load]);

  const s = data?.summary;
  const rows = data?.subscriptions || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Repeat className="h-5 w-5 text-primary" /> Monthly Seva
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Donors who give every month through Razorpay autopay. Razorpay charges them each month on its own; every charge is
            recorded here as its own donation with a DCC and WhatsApp receipt. Status, months charged and the next charge date are
            Razorpay&apos;s live figures.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-1.5">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {s && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Monthly sevas", value: String(s.subscriptions), sub: "signed up (all time)" },
            { label: "Charges received", value: String(s.chargesRecorded), sub: "months paid, all donors" },
            { label: "Collected", value: inr(s.collected), sub: "from monthly seva" },
            { label: "This month", value: inr(s.thisMonthAmount), sub: `${s.thisMonthCharges} charge${s.thisMonthCharges === 1 ? "" : "s"}` },
          ].map((k) => (
            <Card key={k.label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <form
        className="flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setQuery(search.trim());
        }}
      >
        <Input placeholder="Search name, mobile, email, seva or sub_ ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button type="submit" size="sm" className="gap-1.5 shrink-0">
          <Search className="h-4 w-4" /> Search
        </Button>
      </form>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading && !data ? (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading… (checking each subscription with Razorpay)
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {query ? "No monthly seva matches that search." : "No monthly seva sign-ups yet."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const live = r.live || {};
            const statusKey = live.status || "";
            return (
              <Card key={r.subscriptionId}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 font-semibold">
                        {r.donorName || "—"} — {inr(r.amount)}/month
                        {live.error || !r.live ? (
                          <Badge className="bg-gray-100 text-gray-700">Live status unavailable</Badge>
                        ) : (
                          <Badge className={STATUS_CLS[statusKey] || "bg-gray-100 text-gray-700"}>{live.label || statusKey || "—"}</Badge>
                        )}
                      </div>
                      <p className="break-all text-xs text-muted-foreground">
                        {r.sevaName || "Monthly Seva"} · {r.donorMobile || "no phone"}
                        {r.donorEmail ? ` · ${r.donorEmail}` : ""} · {r.subscriptionId}
                        {r.account !== "default" ? ` · ${r.account} account` : ""}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{inr(r.totalPaid)}</p>
                      <p className="text-xs text-muted-foreground">collected</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
                    <p><span className="text-muted-foreground">Started </span>{day(r.startedAt)}</p>
                    <p>
                      <span className="text-muted-foreground">Months paid </span>
                      {r.monthsPaid}
                      {typeof live.paidCount === "number" && live.paidCount !== r.monthsPaid ? ` (Razorpay: ${live.paidCount})` : ""}
                    </p>
                    <p><span className="text-muted-foreground">Last charge </span>{day(r.lastChargedAt)}</p>
                    <p>
                      <span className="text-muted-foreground">Next charge </span>
                      {statusKey === "active" || statusKey === "authenticated" ? day(live.nextChargeAt) : "—"}
                    </p>
                  </div>

                  {(r.missedMonths || 0) > 0 && (
                    <p className="flex items-center gap-1.5 text-xs text-red-700">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Razorpay charged {r.missedMonths} more month{r.missedMonths === 1 ? "" : "s"} than the site recorded — a payment
                      notice was missed. The missing months can be recovered with the subscription backfill tool.
                    </p>
                  )}
                  {r.missingReceipts > 0 && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-700">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {r.missingReceipts} paid month{r.missingReceipts === 1 ? "" : "s"} without a DCC receipt yet — see the DCC receipts tab.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.total} monthly seva{data.total === 1 ? "" : "s"} · page {data.page} of {data.totalPages}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={page >= data.totalPages || loading} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
