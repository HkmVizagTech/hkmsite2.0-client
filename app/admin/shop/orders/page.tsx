"use client";

import { Fragment, useCallback, useEffect, useState, type ReactNode } from "react";
import { format } from "date-fns";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authFetch } from "@/lib/authClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const PAGE_SIZE = 20;

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
type FulfilmentStatus = "placed" | "packed" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  productName: string;
  variantLabel?: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface ShopOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  shippingAddress: { street: string; city: string; state: string; pincode: string; country: string };
  customerNote?: string;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  tracking?: { courier?: string; trackingNumber?: string; url?: string };
  adminNote?: string;
  statusHistory: { status: string; note?: string; at: string; byUserId?: string }[];
  stockShortfall: { productName: string; variantLabel?: string; requested: number; available: number }[];
  needsAttention: boolean;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  createdAt: string;
}

const rupees = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const FULFILMENT_STEPS: FulfilmentStatus[] = ["placed", "packed", "shipped", "delivered", "cancelled"];

const paymentBadge = (status: PaymentStatus) => {
  if (status === "paid") return <Badge className="border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Paid</Badge>;
  if (status === "refunded") return <Badge variant="secondary">Refunded</Badge>;
  if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
  return <Badge className="border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
};

const fulfilmentBadge = (status: FulfilmentStatus) => {
  if (status === "delivered") return <Badge className="border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Delivered</Badge>;
  if (status === "cancelled") return <Badge variant="destructive">Cancelled</Badge>;
  if (status === "shipped") return <Badge className="border-transparent bg-sky-100 text-sky-800 hover:bg-sky-100">Shipped</Badge>;
  if (status === "packed") return <Badge variant="secondary">Packed</Badge>;
  return <Badge variant="outline">Placed</Badge>;
};

const needsAttention = (o: ShopOrder) => o.needsAttention || (o.stockShortfall?.length || 0) > 0;

export default function AdminShopOrdersPage() {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [stats, setStats] = useState<{ paidRevenue: number; paidOrders: number }>({ paidRevenue: 0, paidOrders: 0 });
  const [attentionCount, setAttentionCount] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fulfilmentFilter, setFulfilmentFilter] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<ShopOrder | null>(null);

  const loadOrders = useCallback(async () => {
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (search.trim()) params.set("search", search.trim());
      if (paymentFilter !== "all") params.set("paymentStatus", paymentFilter);
      if (fulfilmentFilter !== "all") params.set("fulfilmentStatus", fulfilmentFilter);
      if (attentionOnly) params.set("needsAttention", "true");

      const res = await authFetch(`${API_URL}/shop-admin/orders?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not load orders.");
      setOrders(data.orders || []);
      setStats(data.stats || { paidRevenue: 0, paidOrders: 0 });
      setPagination(data.pagination || { page: 1, limit: PAGE_SIZE, total: 0, pages: 1 });
    } catch (err: any) {
      setError(err?.message || "Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, paymentFilter, fulfilmentFilter, attentionOnly]);

  // The list response only counts what the current filters matched, so the
  // "needs attention" tile has to ask separately — otherwise the number would
  // drop to zero the moment staff filter by, say, delivered orders.
  const loadAttentionCount = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/shop-admin/orders?needsAttention=true&limit=1`);
      const data = await res.json();
      if (res.ok && data.success) setAttentionCount(data.pagination?.total || 0);
    } catch {
      // A missing count is cosmetic; the table below is the source of truth.
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(loadOrders, 300);
    return () => clearTimeout(t);
  }, [loadOrders]);

  useEffect(() => {
    loadAttentionCount();
  }, [loadAttentionCount]);

  // Any filter change invalidates the current page number — staying on page 4
  // of a result set that now has one page shows an empty table.
  useEffect(() => {
    setPage(1);
  }, [search, paymentFilter, fulfilmentFilter, attentionOnly]);

  const refreshAll = async () => {
    await Promise.all([loadOrders(), loadAttentionCount()]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Shop Orders</h1>
          <p className="text-sm text-muted-foreground">Payments, packing and dispatch.</p>
        </div>
        <Button variant="outline" className="gap-1.5" onClick={refreshAll}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon={<IndianRupee className="h-4 w-4" />}
          label="Paid revenue"
          value={rupees(stats.paidRevenue)}
        />
        <StatTile
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Paid orders"
          value={String(stats.paidOrders)}
        />
        <StatTile
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Needs attention"
          value={String(attentionCount)}
          tone={attentionCount > 0 ? "warning" : "default"}
          onClick={() => setAttentionOnly(true)}
        />
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order number, name or mobile"
              className="pl-9"
            />
          </div>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={fulfilmentFilter} onValueChange={setFulfilmentFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Fulfilment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fulfilment</SelectItem>
              {FULFILMENT_STEPS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={attentionOnly ? "default" : "outline"}
            className="gap-1.5"
            onClick={() => setAttentionOnly((v) => !v)}
          >
            <AlertTriangle className="h-4 w-4" /> Needs attention
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No orders match these filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Fulfilment</TableHead>
                    <TableHead>Placed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => {
                    const flagged = needsAttention(o);
                    return (
                      <Fragment key={o._id}>
                        <TableRow className={flagged ? "border-b-0 bg-amber-50/70 hover:bg-amber-50" : undefined}>
                          <TableCell className="font-mono text-xs font-semibold">{o.orderNumber}</TableCell>
                          <TableCell>
                            <span className="font-medium">{o.customerName}</span>
                            <p className="text-xs text-muted-foreground">{o.customerMobile}</p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {o.items?.length || 0}
                          </TableCell>
                          <TableCell className="text-sm font-semibold">{rupees(o.total)}</TableCell>
                          <TableCell>{paymentBadge(o.paymentStatus)}</TableCell>
                          <TableCell>{fulfilmentBadge(o.fulfilmentStatus)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {o.createdAt ? format(new Date(o.createdAt), "d MMM yyyy, h:mm a") : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => setSelected(o)}>
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                        {flagged && (
                          <TableRow className="bg-amber-50/70 hover:bg-amber-50">
                            <TableCell colSpan={8} className="pt-0">
                              <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-100/70 px-3 py-2 text-xs text-amber-900">
                                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <div>
                                  <p className="font-semibold">
                                    Paid, but stock could not be fully reserved. Restock and ship, part-ship, or
                                    refund this order.
                                  </p>
                                  {o.stockShortfall?.length > 0 && (
                                    <ul className="mt-1 space-y-0.5">
                                      {o.stockShortfall.map((s, i) => (
                                        <li key={i}>
                                          {s.productName}
                                          {s.variantLabel ? ` (${s.variantLabel})` : ""} — ordered {s.requested},
                                          only {s.available} in stock
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} · {pagination.total} orders
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <OrderDetailDialog
        order={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onSaved={async () => {
          setSelected(null);
          await refreshAll();
        }}
      />
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone = "default",
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "default" | "warning";
  onClick?: () => void;
}) {
  return (
    <Card
      className={`${tone === "warning" ? "border-amber-300 bg-amber-50" : ""} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            tone === "warning" ? "text-amber-800" : "text-muted-foreground"
          }`}
        >
          {icon}
          {label}
        </div>
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function OrderDetailDialog({
  order,
  onOpenChange,
  onSaved,
}: {
  order: ShopOrder | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [fulfilmentStatus, setFulfilmentStatus] = useState<FulfilmentStatus>("placed");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (!order) return;
    setError(null);
    setConfirmCancel(false);
    setFulfilmentStatus(order.fulfilmentStatus);
    setPaymentStatus(order.paymentStatus);
    setCourier(order.tracking?.courier || "");
    setTrackingNumber(order.tracking?.trackingNumber || "");
    setTrackingUrl(order.tracking?.url || "");
    setAdminNote(order.adminNote || "");
  }, [order]);

  if (!order) return null;

  const save = async (overrides: Partial<Record<string, unknown>> = {}) => {
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        fulfilmentStatus,
        paymentStatus,
        tracking: { courier: courier.trim(), trackingNumber: trackingNumber.trim(), url: trackingUrl.trim() },
        adminNote: adminNote.trim(),
        ...overrides,
      };
      const res = await authFetch(`${API_URL}/shop-admin/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not update the order.");
      toast({ title: "Order updated." });
      onSaved();
    } catch (err: any) {
      setError(err?.message || "Could not update the order.");
    } finally {
      setSaving(false);
    }
  };

  const flagged = needsAttention(order);

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono">{order.orderNumber}</DialogTitle>
          <DialogDescription>
            {order.customerName} · {order.customerMobile}
            {order.customerEmail ? ` · ${order.customerEmail}` : ""}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
        )}

        {flagged && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">This order was paid but stock could not be fully reserved.</p>
              <p className="mt-0.5">
                Restock the items and ship in full, part-ship what you have, or refund the customer.
              </p>
              {order.stockShortfall?.length > 0 && (
                <ul className="mt-1.5 space-y-0.5 text-xs">
                  {order.stockShortfall.map((s, i) => (
                    <li key={i}>
                      {s.productName}
                      {s.variantLabel ? ` (${s.variantLabel})` : ""} — ordered {s.requested}, only {s.available} in
                      stock
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Items</h3>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                  {item.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image} alt="" className="h-11 w-11 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-md border border-dashed border-border">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variantLabel ? `${item.variantLabel} · ` : ""}
                      {rupees(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{rupees(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{rupees(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shippingCharge > 0 ? rupees(order.shippingCharge) : "Free"}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{rupees(order.total)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="mb-1.5 text-sm font-semibold">Shipping address</h3>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress?.street}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                <br />
                {order.shippingAddress?.country}
              </p>
              {order.customerNote && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-semibold">Customer note:</span> {order.customerNote}
                </p>
              )}
            </div>
            <div>
              <h3 className="mb-1.5 text-sm font-semibold">Payment</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Status: {order.paymentStatus}</p>
                {order.paidAt && <p>Paid: {format(new Date(order.paidAt), "d MMM yyyy, h:mm a")}</p>}
                {order.razorpayOrderId && <p className="font-mono">Order ID: {order.razorpayOrderId}</p>}
                {order.razorpayPaymentId && <p className="font-mono">Payment ID: {order.razorpayPaymentId}</p>}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="order-fulfilment">Fulfilment status</Label>
              <Select
                value={fulfilmentStatus}
                onValueChange={(v) => {
                  // Cancelling has a side effect staff need to be told about,
                  // so it goes through a confirmation instead of a plain save.
                  if (v === "cancelled") {
                    setConfirmCancel(true);
                    return;
                  }
                  setFulfilmentStatus(v as FulfilmentStatus);
                }}
              >
                <SelectTrigger id="order-fulfilment" className="capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FULFILMENT_STEPS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order-payment">Payment status</Label>
              <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}>
                <SelectTrigger id="order-payment" className="capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="order-courier">Courier</Label>
              <Input
                id="order-courier"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                placeholder="India Post"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order-tracking">Tracking number</Label>
              <Input
                id="order-tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order-tracking-url">Tracking URL</Label>
              <Input
                id="order-tracking-url"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="order-note">Admin note</Label>
            <Textarea
              id="order-note"
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Internal only — the customer never sees this."
            />
          </div>

          {order.statusHistory?.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 text-sm font-semibold">History</h3>
                <ol className="space-y-1.5 border-l border-border pl-4 text-xs text-muted-foreground">
                  {order.statusHistory.map((h, i) => (
                    <li key={i}>
                      <span className="font-medium capitalize text-foreground">{h.status}</span>
                      {h.note ? ` — ${h.note}` : ""}
                      <span className="ml-1">
                        · {h.at ? format(new Date(h.at), "d MMM yyyy, h:mm a") : ""}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Close
            </Button>
            <Button onClick={() => save()} disabled={saving} className="gap-1.5">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save changes
            </Button>
          </div>
        </div>

        <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel {order.orderNumber}?</AlertDialogTitle>
              <AlertDialogDescription>
                Every item on this order is returned to stock automatically, so you don&apos;t need to restock by
                hand.
                {order.paymentStatus === "paid"
                  ? " This order is already paid — cancelling does not refund the customer. Issue the refund in Razorpay and then set the payment status to Refunded."
                  : ""}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={saving}>Keep order</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  setFulfilmentStatus("cancelled");
                  save({ fulfilmentStatus: "cancelled" });
                }}
                disabled={saving}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {saving ? "Cancelling..." : "Cancel order"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
