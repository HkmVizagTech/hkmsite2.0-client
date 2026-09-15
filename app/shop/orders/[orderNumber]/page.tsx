"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Loader2,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  ChevronLeft,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopOrder, fetchMyOrder, formatINR } from "@/lib/shopApi";
import { getDonorToken } from "@/lib/donorAuthClient";

const STEPS = [
  { key: "placed", label: "Order placed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<ShopOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [justPlaced, setJustPlaced] = useState(false);

  // Read the flag from the URL directly rather than through useSearchParams,
  // which would force this page behind a Suspense boundary at build time for
  // what is only a congratulatory banner.
  useEffect(() => {
    if (typeof window !== "undefined") {
      setJustPlaced(new URLSearchParams(window.location.search).get("placed") === "1");
    }
  }, []);

  useEffect(() => {
    if (!orderNumber) return;
    if (!getDonorToken()) {
      setError("Please log in to view this order.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchMyOrder(orderNumber)
      .then((o) => !cancelled && setOrder(o))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-medium text-foreground">{error || "Order not found."}</p>
        <Link href="/shop/orders">
          <Button variant="outline" size="sm">My orders</Button>
        </Link>
      </div>
    );
  }

  const cancelled = order.fulfilmentStatus === "cancelled";
  const currentStep = STEPS.findIndex((s) => s.key === order.fulfilmentStatus);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/shop/orders"
        className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> All orders
      </Link>

      {justPlaced && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-900">Thank you! Your order is confirmed.</p>
            <p className="mt-0.5 text-sm text-emerald-800">
              We&apos;ve sent the details to your WhatsApp and will message you again when it ships.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-lg font-bold text-foreground">{order.orderNumber}</p>
            <p className="text-sm text-muted-foreground">
              Placed {format(new Date(order.createdAt), "d MMM yyyy, h:mm a")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{formatINR(order.total)}</p>
            <p className={`text-xs font-medium ${order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
              {order.paymentStatus === "paid"
                ? "Paid"
                : order.paymentStatus === "pending"
                  ? "Payment pending"
                  : order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Progress */}
        {cancelled ? (
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
            <XCircle className="h-4 w-4 shrink-0" />
            This order was cancelled. If you were charged, the refund is processed by the temple office.
          </div>
        ) : (
          <div className="mt-6 flex items-center">
            {STEPS.map((step, i) => {
              const done = i <= currentStep;
              const Icon = done ? step.icon : Clock;
              return (
                <div key={step.key} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={`text-[10px] font-medium sm:text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mx-1 h-0.5 flex-1 rounded ${i < currentStep ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {order.tracking?.trackingNumber && (
          <div className="mt-5 rounded-lg border border-border p-3 text-sm">
            <p className="font-semibold text-foreground">Tracking</p>
            <p className="text-muted-foreground">
              {order.tracking.courier ? `${order.tracking.courier} · ` : ""}
              <span className="font-mono">{order.tracking.trackingNumber}</span>
            </p>
            {order.tracking.url && (
              <a
                href={order.tracking.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary underline"
              >
                Track shipment <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="mb-3 font-semibold text-foreground">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.variantLabel ? `${item.variantLabel} · ` : ""}
                  {formatINR(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">{formatINR(item.lineTotal)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span className="font-medium text-foreground">
              {order.shippingCharge === 0 ? "Free" : formatINR(order.shippingCharge)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-bold">
            <span>Total</span>
            <span className="text-primary">{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="mb-2 flex items-center gap-1.5 font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-gold" /> Delivery address
        </h2>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{order.customerName}</span>
          <br />
          {order.shippingAddress?.street}
          <br />
          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
          <br />
          {order.customerMobile}
        </p>
      </div>
    </div>
  );
}
