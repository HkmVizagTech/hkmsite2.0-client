"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Package, ChevronRight, LogIn, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDonorToken } from "@/lib/donorAuthClient";
import { ShopOrder, fetchMyOrders, formatINR } from "@/lib/shopApi";

const fulfilmentLabel: Record<string, { text: string; className: string }> = {
  placed: { text: "Order placed", className: "border-sky-200 bg-sky-50 text-sky-700" },
  packed: { text: "Packed", className: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  shipped: { text: "Shipped", className: "border-amber-200 bg-amber-50 text-amber-700" },
  delivered: { text: "Delivered", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  cancelled: { text: "Cancelled", className: "border-border bg-muted text-muted-foreground" },
};

export default function ShopOrdersPage() {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getDonorToken()) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    setAuthed(true);
    fetchMyOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
          style={{ background: "var(--gradient-gold)" }}
        >
          <LogIn className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Log in to see your orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the same mobile number you ordered with — we&apos;ll send a code on WhatsApp.
          </p>
        </div>
        <Link href="/donor/login?redirect=/shop/orders">
          <Button>Log in with WhatsApp OTP</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">My Orders</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border py-14 text-center">
          <ShoppingBag className="mx-auto mb-3 h-9 w-9 text-muted-foreground/50" />
          <p className="font-medium text-foreground">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Anything you order from the temple shop will appear here.</p>
          <Link href="/shop" className="mt-4 inline-block">
            <Button variant="outline">Browse the shop</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => {
            const meta = fulfilmentLabel[order.fulfilmentStatus] || fulfilmentLabel.placed;
            return (
              <Link
                key={order._id}
                href={`/shop/orders/${order.orderNumber}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-gold/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Package className="h-5 w-5 text-primary" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-sm font-semibold text-foreground">{order.orderNumber}</p>
                    <Badge variant="outline" className={meta.className}>
                      {meta.text}
                    </Badge>
                    {order.paymentStatus === "pending" && (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                        Payment pending
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {format(new Date(order.createdAt), "d MMM yyyy")} ·{" "}
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} · {formatINR(order.total)}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
