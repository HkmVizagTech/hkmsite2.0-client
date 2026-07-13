"use client";

import { useEffect, useState, useCallback } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, ChevronLeft, ChevronRight, Tag, Download } from "lucide-react";

const apiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface Transaction {
  _id: string;
  id: string;
  donorName?: string;
  donorEmail?: string;
  donorMobile?: string;
  amount: number;
  date: string;
  status: string;
  panNumber?: string;
  receiptNumber?: string;
  razorpayPaymentId?: string;
  utm?: { source?: string; medium?: string; campaign?: string; content?: string; term?: string };
  whatsappReceiptSentAt?: string;
}

const statusColor: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
};

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);

    authFetch(`${apiUrl()}/donations-admin/transactions?${params.toString()}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions);
          setTotalPages(data.pagination.totalPages);
          setTotalAmount(data.pagination.totalAmount);
        }
      })
      .finally(() => setLoading(false));
  }, [page, search, status]);

  useEffect(() => {
    const t = setTimeout(fetchTransactions, 300); // debounce search
    return () => clearTimeout(t);
  }, [fetchTransactions]);

  const exportCsv = () => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    // authFetch attaches the Bearer token; window.open wouldn't include it,
    // so fetch the CSV as a blob and trigger the download manually.
    authFetch(`${apiUrl()}/donations-admin/export?${params.toString()}`, { credentials: "include" })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `donations-transactions-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, mobile, payment ID..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={status} onValueChange={(v) => { setPage(1); setStatus(v); }}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">₹{totalAmount.toLocaleString("en-IN")}</span> total across matching transactions
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No transactions match these filters.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {transactions.map((txn) => (
            <Card key={txn._id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelected(txn)}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{txn.donorName || "Anonymous"}</p>
                    <Badge className={statusColor[txn.status] || ""}>{txn.status}</Badge>
                    {txn.utm?.campaign && txn.utm.campaign !== "" && (
                      <Badge variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" /> {txn.utm.campaign}
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {txn.donorEmail} · {txn.donorMobile} · {new Date(txn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <p className="shrink-0 text-lg font-bold text-primary">₹{txn.amount.toLocaleString("en-IN")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Transaction Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <Row label="Donor" value={selected.donorName || "Anonymous"} />
              <Row label="Email" value={selected.donorEmail} />
              <Row label="Mobile" value={selected.donorMobile} />
              <Row label="Amount" value={`₹${selected.amount.toLocaleString("en-IN")}`} />
              <Row label="Status" value={selected.status} />
              <Row label="Date" value={new Date(selected.date).toLocaleString("en-IN")} />
              <Row label="Razorpay Payment ID" value={selected.razorpayPaymentId} />
              <Row label="PAN" value={selected.panNumber} />
              <Row label="Receipt Number" value={selected.receiptNumber} />
              <Row label="WhatsApp Receipt" value={selected.whatsappReceiptSentAt ? new Date(selected.whatsappReceiptSentAt).toLocaleString("en-IN") : "Not sent"} />
              {selected.utm && (selected.utm.source || selected.utm.campaign) && (
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Campaign Attribution</p>
                  <Row label="Source" value={selected.utm.source} />
                  <Row label="Medium" value={selected.utm.medium} />
                  <Row label="Campaign" value={selected.utm.campaign} />
                  {selected.utm.content && <Row label="Content" value={selected.utm.content} />}
                  {selected.utm.term && <Row label="Term" value={selected.utm.term} />}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}
