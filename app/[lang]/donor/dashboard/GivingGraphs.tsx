"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { donorFetch } from "@/lib/donorAuthClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
// Palette matched to the site's Vaikuntham Blue theme (vk ramp + gold accent).
const COLORS = ["#1E3A8A", "#2F5BD3", "#7F9BEF", "#F2B41F", "#172B6E", "#B9C8FB", "#2448B4"];

interface MonthlyPoint { month: string; amount: number; count: number }
interface SevaSlice { sevaName: string; amount: number; count: number }

export default function GivingGraphs() {
  const [loading, setLoading] = useState(true);
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([]);
  const [bySeva, setBySeva] = useState<SevaSlice[]>([]);
  const [totals, setTotals] = useState<{ totalAmount: number; totalCount: number } | null>(null);

  useEffect(() => {
    donorFetch(`${API_URL}/donor/my-summary`)
      .then((res) => res.json())
      .then((data) => {
        setMonthly(data.monthly || []);
        setBySeva(data.bySeva || []);
        setTotals(data.totals || null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-vk-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!totals || totals.totalCount === 0) return null;

  return (
    <>
        {monthly.length > 1 && (
          <div className="mb-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-vk-700">Monthly Trend</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthly}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Amount"]} />
                <Bar dataKey="amount" fill="#2F5BD3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {bySeva.length > 1 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-vk-700">By Seva</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ResponsiveContainer width="100%" height={180} className="sm:w-1/2">
                <PieChart>
                  <Pie data={bySeva} dataKey="amount" nameKey="sevaName" cx="50%" cy="50%" outerRadius={70}>
                    {bySeva.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Amount"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full min-w-0 space-y-1.5 sm:w-1/2">
                {bySeva.map((s, i) => (
                  <div key={s.sevaName} className="flex items-center justify-between gap-3 rounded-lg bg-vk-50 px-3 py-2 text-xs">
                    <span className="flex min-w-0 items-center gap-1.5 text-ink/80">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {s.sevaName}
                    </span>
                    <span className="shrink-0 font-semibold text-vk-700">₹{s.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
  </>
  );
}
