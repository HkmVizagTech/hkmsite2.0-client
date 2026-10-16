"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Package, ChevronRight, LogIn, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDonorToken } from "@/lib/donorAuthClient";
import { ShopOrder, fetchMyOrders, formatINR } from "@/lib/shopApi";

const fulfilmentLabel: Record<string, { text: string; className: string }> = {
  placed: { text: "Order placed", className: "border-sky-200 bg-sky-50 text-sky-700" },
  packed: { text: "Packed", className: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  shipped: { text: "Shipped", className: "border-amber-200 bg-amber-50 text-amber-700" },
  delivered: { text: "Delivered", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  cancelled: { text: "Cancelled", className: "border-vk-100 bg-vk-50 text-muted-foreground" },
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
        <Loader2 className="h-6 w-6 animate-spin text-vk-500" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="vk-icon-chip !h-14 !w-14 !rounded-2xl">
          <LogIn className="h-6 w-6" />
        </span>
        <div>
          <h1 className="vk-h3">Log in to see your orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the same mobile number you ordered with — we&apos;ll send a code on WhatsApp.
          </p>
        </div>
        <Link href="/donor/login?redirect=/shop/orders" className="vk-btn-primary h-11">
          Log in with WhatsApp OTP
        </Link>
      </div>
    );
  }

  return (
    <div className="vk-container max-w-3xl py-8 md:py-10">
      <span className="vk-pill mb-3">Matchless Gifts</span>
      <h1 className="vk-h2">My Orders</h1>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">{error}</div>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-vk-50 px-6 py-14 text-center">
          <span className="vk-icon-chip mx-auto mb-4 !h-14 !w-14 !rounded-2xl !bg-white">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <p className="font-heading text-lg font-bold text-ink">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Anything you order from Matchless Gifts will appear here.</p>
          <Link href="/shop" className="vk-btn-outline mt-5">
            Browse the shop
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
                className="vk-card vk-card-hover flex items-center gap-4 p-4"
              >
                <span className="vk-icon-chip">
                  <Package className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-sm font-semibold text-ink">{order.orderNumber}</p>
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

                <ChevronRight className="h-4 w-4 shrink-0 text-vk-500" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
