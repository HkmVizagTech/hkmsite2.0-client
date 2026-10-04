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

  // Keep the tracker fresh while the page is open: the admin can mark the
  // order shipped / add tracking at any time, and the courier-sync job can
  // flip it to delivered between visits. A quiet 45s poll picks up all of
  // that without the customer having to refresh. Pauses when the tab is
  // hidden so we don't burn API calls in a background tab.
  useEffect(() => {
    if (!orderNumber || !getDonorToken()) return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    const tick = () => {
      fetchMyOrder(orderNumber)
        .then((o) => setOrder((current) => o || current))
        .catch(() => {});
    };
    const id = setInterval(tick, 45_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-vk-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-medium text-ink">{error || "Order not found."}</p>
        <Link href="/shop/orders" className="vk-btn-outline">
          My orders
        </Link>
      </div>
    );
  }

  const cancelled = order.fulfilmentStatus === "cancelled";
  const currentStep = STEPS.findIndex((s) => s.key === order.fulfilmentStatus);

  // Courier scan updates written by the auto-tracking sync, newest last —
  // show the most recent few so the customer sees movement without opening
  // the courier's own site.
  const latestCourierNotes = (order.statusHistory || [])
    .filter((h) => h.status === "tracking_note" && h.note?.startsWith("Auto: "))
    .slice(-3)
    .map((h) => h.note!.replace(/^Auto: /, ""));

  return (
    <div className="vk-container max-w-3xl py-8 md:py-10">
      <Link
        href="/shop/orders"
        className="mb-5 inline-flex items-center gap-1 rounded-full bg-vk-50 px-3 py-1.5 text-xs font-semibold text-vk-700 transition-colors hover:bg-vk-100 sm:text-[13px]"
      >
        <ChevronLeft className="h-4 w-4" /> All orders
      </Link>

      {justPlaced && (
        <div className="mb-6 overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50">
          <div className="p-5 text-center sm:p-7">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-3 font-heading text-xl font-bold text-emerald-900 sm:text-2xl">
              Thank you! Your order is confirmed.
            </h1>
            <p className="mt-1 text-sm text-emerald-800">
              A confirmation has been sent to your WhatsApp. We&apos;ll message you again the day it ships.
            </p>
            <div className="mx-auto mt-4 max-w-sm rounded-xl border border-emerald-200 bg-white/70 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Your reference number</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-emerald-900">{order.orderNumber}</p>
              <p className="mt-1 text-xs text-emerald-700">
                Keep this handy — quote it to our support team for any query, and
                use it to track your order status below.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-700">
              <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Status updates live below</span>
            </div>
          </div>
        </div>
      )}

      <div className="vk-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-vk-500">Reference number</p>
            <p className="font-mono text-lg font-bold text-ink">{order.orderNumber}</p>
            <p className="text-sm text-muted-foreground">
              Placed {format(new Date(order.createdAt), "d MMM yyyy, h:mm a")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-xl font-extrabold text-vk-700">{formatINR(order.total)}</p>
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
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-vk-50 px-3.5 py-2.5 text-sm text-muted-foreground">
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
                        done ? "bg-vk-700 text-white" : "bg-vk-100 text-vk-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={`text-[10px] font-medium sm:text-xs ${done ? "text-ink" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mx-1 h-1 flex-1 rounded-full ${i < currentStep ? "bg-vk-500" : "bg-vk-100"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {order.tracking?.trackingNumber && (
          <div className="mt-5 rounded-2xl bg-vk-50 p-4 text-sm">
            <p className="font-semibold text-ink">Tracking</p>
            <p className="text-muted-foreground">
              {order.tracking.courier ? `${order.tracking.courier} · ` : ""}
              <span className="font-mono">{order.tracking.trackingNumber}</span>
            </p>
            {order.tracking.url && (
              <a
                href={order.tracking.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-vk-500 underline"
              >
                Track shipment <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {/* Live courier updates — pushed into the order history by the
                auto-tracking sync (in transit / out for delivery scans). */}
            {latestCourierNotes.length > 0 && (
              <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                {latestCourierNotes.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="vk-card mt-5 p-5 sm:p-6">
        <h2 className="vk-bar-title mb-4 text-base text-ink">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-vk-50">
                {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.variantLabel ? `${item.variantLabel} · ` : ""}
                  {formatINR(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink">{formatINR(item.lineTotal)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1.5 rounded-2xl bg-vk-50 p-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-ink">{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span className="font-medium text-ink">
              {order.shippingCharge === 0 ? "Free" : formatINR(order.shippingCharge)}
            </span>
          </div>
          <div className="flex justify-between border-t border-vk-200 pt-2 font-bold text-ink">
            <span>Total</span>
            <span className="text-vk-700">{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="vk-card mt-5 p-5 sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-ink">
          <span className="vk-icon-chip !h-9 !w-9">
            <MapPin className="h-4 w-4" />
          </span>
          Delivery address
        </h2>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-ink">{order.customerName}</span>
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
