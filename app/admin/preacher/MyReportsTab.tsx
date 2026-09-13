"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, IndianRupee, Receipt } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface SevaBreakdown {
  sevaName: string;
  amount: number;
  count: number;
}

export default function MyReportsTab() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{ totalAmount: number; count: number } | null>(null);
  const [bySeva, setBySeva] = useState<SevaBreakdown[]>([]);

  useEffect(() => {
    authFetch(`${API_URL}/preacher/my-reports`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary || null);
        setBySeva(data.bySeva || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">My Reports</h2>
        <p className="text-sm text-muted-foreground mt-1">Your own totals, all time.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="mt-1 flex items-center gap-1 text-2xl font-bold text-primary">
                  <IndianRupee className="h-5 w-5" /> {(summary?.totalAmount || 0).toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Donations</p>
                <p className="mt-1 flex items-center gap-1 text-2xl font-bold">
                  <Receipt className="h-5 w-5 text-muted-foreground" /> {summary?.count || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-semibold">By Seva</p>
              {bySeva.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No donations recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {bySeva.map((s) => (
                    <div key={s.sevaName} className="flex items-center justify-between border-b border-border/50 pb-2 text-sm last:border-0">
                      <span>{s.sevaName}</span>
                      <div className="text-right">
                        <span className="font-semibold">₹{s.amount.toLocaleString("en-IN")}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{s.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
