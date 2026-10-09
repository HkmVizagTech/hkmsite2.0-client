"use client";

// Payment failures — why website donations fail, from the reasons Razorpay
// gives for each failed attempt plus the bank / UPI-app downtime alerts it
// sends (server: GET /donations/payment-failures).

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

type Summary = {
  days: number;
  checkouts: { started: number; completed: number; failed: number; pending: number };
  reasons: { description?: string; reason?: string; source?: string; donations: number; attempts: number; paidLater: number }[];
  byMethod: { method: string; via: string; donations: number }[];
  recent: {
    _id: string;
    donorName: string;
    donorMobile?: string;
    amount: number;
    sevaName?: string;
    sourcePage?: string;
    status: string;
    failedAttempts?: number;
    upiFallback?: { status?: string };
    paymentError?: { description?: string; reason?: string; source?: string; method?: string; bank?: string; wallet?: string; upiFlow?: string; at?: string };
  }[];
  downtime: { alerts: number; top: { what: string; n: number }[] };
};

// Razorpay's error_source in plain words
const SOURCE: Record<string, string> = {
  customer: "Donor side",
  bank: "Bank / UPI app",
  gateway: "Payment network",
  business: "Our setup",
  internal: "Razorpay",
};

const fmt = (s?: string) =>
  s ? new Date(s).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "—";
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pct = (n: number, d: number) => (d ? `${Math.round((n * 100) / d)}%` : "—");

export default function PaymentFailuresTab() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (d = days) => {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_URL}/donations/payment-failures?days=${d}`, { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Could not load");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const c = data?.checkouts;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Why payments fail</h2>
        <p className="text-sm text-muted-foreground">
          Razorpay’s own reason for each failed attempt, and the bank / UPI-app outages it announced. Reasons are recorded from
          9 Oct 2026 onwards.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[1, 7, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`rounded-full border px-3 py-1.5 text-sm ${days === d ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
          >
            {d === 1 ? "Last 24 hours" : `Last ${d} days`}
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => load()} disabled={loading}>
          <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {loading && !data ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : data && c ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Checkouts started", value: c.started, sub: "" },
              { label: "Paid", value: c.completed, sub: pct(c.completed, c.started) },
              { label: "Failed", value: c.failed, sub: pct(c.failed, c.started) },
              { label: "Left without paying", value: c.pending, sub: pct(c.pending, c.started) },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold">
                    {s.value} <span className="text-sm font-medium text-muted-foreground">{s.sub}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold">Top reasons</h3>
                {data.reasons.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">No failed payments recorded in this period.</p>
                ) : (
                  <table className="mt-3 w-full text-sm">
                    <thead className="text-left text-xs text-muted-foreground">
                      <tr>
                        <th className="pb-2">Reason (from Razorpay)</th>
                        <th className="pb-2">Side</th>
                        <th className="pb-2 text-right">Donors</th>
                        <th className="pb-2 text-right">Paid later</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reasons.map((r, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-2 pr-2">{r.description || r.reason || "Not given"}</td>
                          <td className="py-2 pr-2 text-muted-foreground">{SOURCE[r.source || ""] || r.source || "—"}</td>
                          <td className="py-2 text-right font-semibold">{r.donations}</td>
                          <td className="py-2 text-right">{r.paidLater}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-4">
                <div>
                  <h3 className="font-semibold">By payment method</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {data.byMethod.length === 0 && <li className="text-muted-foreground">—</li>}
                    {data.byMethod.map((m, i) => (
                      <li key={i} className="flex justify-between gap-3 border-t pt-1.5">
                        <span>
                          {m.method.toUpperCase()} <span className="text-muted-foreground">· {m.via}</span>
                        </span>
                        <span className="font-semibold">{m.donations}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="h-4 w-4 text-amber-600" /> Bank / UPI outages announced by Razorpay: {data.downtime.alerts}
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {data.downtime.top.map((d) => (
                      <li key={d.what} className="flex justify-between gap-3 border-t pt-1.5">
                        <span>{d.what}</span>
                        <span className="font-semibold">{d.n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold">Recent failed payments</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-2 pr-3">When</th>
                      <th className="pb-2 pr-3">Donor</th>
                      <th className="pb-2 pr-3">Seva</th>
                      <th className="pb-2 pr-3">Reason</th>
                      <th className="pb-2 pr-3">Method</th>
                      <th className="pb-2 pr-3 text-right">Tries</th>
                      <th className="pb-2">Now</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((d) => (
                      <tr key={d._id} className="border-t align-top">
                        <td className="whitespace-nowrap py-2 pr-3">{fmt(d.paymentError?.at)}</td>
                        <td className="py-2 pr-3">
                          {d.donorName}
                          <div className="text-xs text-muted-foreground">{d.donorMobile}</div>
                        </td>
                        <td className="py-2 pr-3">
                          {inr(d.amount)} · {d.sevaName}
                          <div className="text-xs text-muted-foreground">{d.sourcePage}</div>
                        </td>
                        <td className="py-2 pr-3">
                          {d.paymentError?.description || d.paymentError?.reason || "—"}
                          <div className="text-xs text-muted-foreground">{SOURCE[d.paymentError?.source || ""] || ""}</div>
                        </td>
                        <td className="whitespace-nowrap py-2 pr-3">
                          {(d.paymentError?.method || "").toUpperCase()}
                          <div className="text-xs text-muted-foreground">
                            {d.paymentError?.bank || d.paymentError?.wallet || d.paymentError?.upiFlow || ""}
                          </div>
                        </td>
                        <td className="py-2 pr-3 text-right">{d.failedAttempts || 1}</td>
                        <td className="whitespace-nowrap py-2">
                          {d.status === "completed" ? (
                            <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-700">Paid later</span>
                          ) : d.upiFallback?.status ? (
                            <span className="rounded bg-purple-50 px-1.5 py-0.5 text-xs font-semibold text-purple-700">Tried UPI</span>
                          ) : (
                            <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-700">Not paid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
