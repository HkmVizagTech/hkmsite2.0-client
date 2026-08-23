"use client";

// Reports tab — Today/Yesterday/This Week/This Month/This Year/Custom
// views of donation performance: total raised, count, average, seva-wise
// breakdown, status breakdown, and a trend chart, each compared against
// the equivalent previous period.

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IndianRupee, Receipt, TrendingUp, TrendingDown, Minus, Download, Loader2, CalendarRange,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const PERIODS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

interface ReportData {
  period: string;
  range: { start: string; end: string };
  summary: {
    totalAmount: number;
    count: number;
    avgDonation: number;
    previousPeriod: { totalAmount: number; count: number };
    percentChange: number | null;
  };
  sevaBreakdown: { name: string; amount: number; count: number }[];
  statusBreakdown: { status: string; amount: number; count: number }[];
  series: { date: string; amount: number; count: number }[];
  granularity: "day" | "month";
}

export default function ReportsTab() {
  const [period, setPeriod] = useState("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    if (period === "custom" && (!customFrom || !customTo)) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ period });
      if (period === "custom") { params.set("from", customFrom); params.set("to", customTo); }
      const res = await authFetch(`${API_URL}/donations/report?${params.toString()}`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load report");
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const exportCsv = () => {
    if (!data) return;
    const rows = [
      ["Report period", PERIODS.find((p) => p.value === period)?.label || period],
      ["Range", `${new Date(data.range.start).toLocaleDateString("en-IN")} - ${new Date(data.range.end).toLocaleDateString("en-IN")}`],
      [],
      ["Total Raised", String(data.summary.totalAmount)],
      ["Donations", String(data.summary.count)],
      ["Average Donation", String(data.summary.avgDonation)],
      [],
      ["Seva", "Amount", "Count"],
      ...data.sevaBreakdown.map((s) => [s.name, String(s.amount), String(s.count)]),
      [],
      ["Status", "Amount", "Count"],
      ...data.statusBreakdown.map((s) => [s.status, String(s.amount), String(s.count)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-report-${period}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const trend = data?.summary.percentChange;
  const TrendIcon = trend == null ? Minus : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend == null ? "text-muted-foreground" : trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-muted-foreground";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Reports</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Donation performance by period, compared against the equivalent time before it.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <Button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={period === p.value ? "" : "bg-transparent border border-border text-foreground hover:bg-muted"}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {period === "custom" && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarRange className="h-4 w-4" /> From
          </label>
          <Input type="date" value={customFrom} max={customTo || undefined} onChange={(e) => setCustomFrom(e.target.value)} className="w-auto" />
          <label className="text-sm text-muted-foreground">To</label>
          <Input type="date" value={customTo} min={customFrom || undefined} onChange={(e) => setCustomTo(e.target.value)} className="w-auto" />
          <Button onClick={fetchReport} disabled={!customFrom || !customTo}>Generate</Button>
        </div>
      )}

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating report...
        </div>
      ) : data ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {new Date(data.range.start).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              {" – "}
              {new Date(data.range.end).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <Button onClick={exportCsv} className="gap-2 bg-transparent border border-border text-foreground hover:bg-muted">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Raised</p>
                    <p className="text-2xl font-bold mt-1">₹{data.summary.totalAmount.toLocaleString("en-IN")}</p>
                    {data.summary.percentChange !== null && (
                      <span className={`flex items-center gap-1 text-xs mt-1 ${trendColor}`}>
                        <TrendIcon className="h-3.5 w-3.5" />
                        {Math.abs(data.summary.percentChange)}% vs previous period
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted text-green-600"><IndianRupee className="w-5 h-5" /></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Donations</p>
                    <p className="text-2xl font-bold mt-1">{data.summary.count}</p>
                    <span className="text-xs text-muted-foreground">
                      previous period: {data.summary.previousPeriod.count}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted text-blue-500"><Receipt className="w-5 h-5" /></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div>
                  <p className="text-sm text-muted-foreground">Average Donation</p>
                  <p className="text-2xl font-bold mt-1">₹{data.summary.avgDonation.toLocaleString("en-IN")}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend chart */}
          {data.series.length > 1 && (
            <Card>
              <CardContent className="p-5">
                <p className="mb-3 text-sm font-semibold">Trend ({data.granularity === "month" ? "by month" : "by day"})</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.series}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Amount"]} />
                    <Bar dataKey="amount" fill="hsl(30,85%,50%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Seva breakdown + status breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="mb-3 text-sm font-semibold">By Seva</p>
                {data.sevaBreakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No completed donations in this period.</p>
                ) : (
                  <div className="space-y-2">
                    {data.sevaBreakdown.map((s) => (
                      <div key={s.name} className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0">
                        <span>{s.name}</span>
                        <div className="text-right">
                          <span className="font-semibold">₹{s.amount.toLocaleString("en-IN")}</span>
                          <span className="text-muted-foreground ml-2 text-xs">{s.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="mb-3 text-sm font-semibold">By Status</p>
                <div className="space-y-2">
                  {data.statusBreakdown.map((s) => (
                    <div key={s.status} className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0">
                      <span className="capitalize">{s.status}</span>
                      <div className="text-right">
                        <span className="font-semibold">₹{s.amount.toLocaleString("en-IN")}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{s.count}</span>
                      </div>
                    </div>
                  ))}
                  {data.statusBreakdown.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center">No records in this period.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
