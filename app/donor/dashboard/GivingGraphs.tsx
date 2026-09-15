"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";
import { donorFetch } from "@/lib/donorAuthClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
const COLORS = ["#772036", "#c9922f", "#9a6b1f", "#4a7a6b", "#8a4a6b", "#5b6b9a", "#a3532b"];

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
      <Card>
        <CardContent className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!totals || totals.totalCount === 0) return null;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#772036]" />
          <h2 className="font-semibold">Your Giving, at a Glance</h2>
        </div>

        {monthly.length > 1 && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Monthly Trend</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthly}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Amount"]} />
                <Bar dataKey="amount" fill="#772036" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {bySeva.length > 1 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">By Seva</p>
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
              <div className="w-full space-y-1.5 sm:w-1/2">
                {bySeva.map((s, i) => (
                  <div key={s.sevaName} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {s.sevaName}
                    </span>
                    <span className="font-medium">₹{s.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
