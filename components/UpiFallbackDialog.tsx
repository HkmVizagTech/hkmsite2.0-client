"use client";

// "Payment didn't go through? Pay with PhonePe / UPI" — offered by the
// donation checkouts when the Razorpay window fails or is closed without
// paying. The donation (with all the donor's details) already exists from
// POST /payments/order, so the donor only:
//   1. opens PhonePe / another UPI app with the exact amount filled in
//   2. taps "I've paid" and confirms the name shown in their UPI app
// The server stores the times and that name on the donation; an admin then
// matches it to the UPI payment (Admin → Donations → UPI to match) and the
// normal receipt / 80G / WhatsApp flow runs.
//
// Usage in a checkout:
//   const { offerUpi, upiFallbackDialog } = useUpiFallback();
//   ...Razorpay modal.ondismiss: () => offerUpi({ donationId, orderId, amount, campaign, donorName })
//   ...render {upiFallbackDialog}

import { useCallback, useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CheckCircle2, Loader2, QrCode, Smartphone, X } from "lucide-react";
import { Dialog, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RECEIPT_WHATSAPP, UPI_API_BASE, UPI_QR_IMAGE, UPI_VPA, phonePeLink, upiLink } from "@/lib/upi";

const PURPLE = "#5f259f";

export type UpiFallbackInfo = {
  donationId?: string;
  orderId?: string;
  amount: number;
  campaign: string; // e.g. "Pitru Paksha — Annadana Seva"
  donorName?: string;
};

type Step = "pay" | "confirm" | "done";

function post(path: string, body: Record<string, unknown>) {
  return fetch(`${UPI_API_BASE}/payments/upi-fallback/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function UpiFallbackDialog({ info, onClose }: { info: UpiFallbackInfo | null; onClose: () => void }) {
  const [step, setStep] = useState<Step>("pay");
  const [showQr, setShowQr] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canClaim = !!(info?.donationId && info?.orderId);
  const amountLabel = info ? `₹${info.amount.toLocaleString("en-IN")}` : "";

  const markOpened = (app: "phonepe" | "other") => {
    if (!canClaim || !info) return;
    // fire-and-forget: the app switch must not wait on our API
    post("opened", { donationId: info.donationId, orderId: info.orderId, app }).catch(() => {});
  };

  const claim = async () => {
    if (!info || !canClaim) return;
    if (payerName.trim().length < 2) {
      setError("Please enter the name shown in your UPI app.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await post("claim", { donationId: info.donationId, orderId: info.orderId, payerName: payerName.trim() });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || "Could not save. Please try again.");
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const whatsappHref = info
    ? `https://wa.me/${RECEIPT_WHATSAPP}?text=${encodeURIComponent(
        [
          `Hare Krishna! The online payment failed, so I paid ${amountLabel} for ${info.campaign} by UPI.`,
          `Name: ${info.donorName || ""}`,
          "I am attaching the payment screenshot.",
        ].join("\n")
      )}`
    : "#";

  return (
    <Dialog open={!!info} onOpenChange={(o) => !o && onClose()}>
      {/* Own portal/overlay instead of <DialogContent>: the seva pages' checkout
          sheets sit at z-[100], and this has to open above them. */}
      <DialogPortal>
        <DialogOverlay className="z-[210]" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[211] grid max-h-[92vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-2xl border bg-background p-5 shadow-lg sm:p-6">
        {info && step === "pay" && (
          <>
            <DialogTitle className="font-heading text-lg" style={{ color: PURPLE }}>
              Payment didn&apos;t go through?
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Pay <strong className="text-ink">{amountLabel}</strong> for {info.campaign} straight to the temple with PhonePe or
              any UPI app.{canClaim ? " Your details are already saved." : ""}
            </DialogDescription>

            <div className="mt-1 grid gap-2.5">
              <a
                href={phonePeLink(info.amount)}
                onClick={() => markOpened("phonepe")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-bold text-white hover:opacity-90"
                style={{ backgroundColor: PURPLE }}
              >
                <Smartphone className="h-4 w-4" /> Pay {amountLabel} with PhonePe
              </a>
              <a
                href={upiLink(info.amount)}
                onClick={() => markOpened("other")}
                className="inline-flex h-11 items-center justify-center rounded-xl border bg-white text-sm font-semibold hover:bg-[#f6f0fd]"
                style={{ borderColor: PURPLE, color: PURPLE }}
              >
                GPay / Paytm / other UPI app
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowQr((v) => !v);
                markOpened("other");
              }}
              className="mx-auto mt-1 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
              style={{ color: PURPLE }}
            >
              <QrCode className="h-3.5 w-3.5" /> {showQr ? "Hide QR" : "On a computer? Scan the QR"}
            </button>
            {showQr && (
              <div className="flex flex-col items-center gap-1">
                <Image src={UPI_QR_IMAGE} alt={`UPI QR code — pay ${UPI_VPA}`} width={170} height={170} className="rounded-xl border bg-white p-1.5" />
                <p className="text-[11px] text-muted-foreground">Enter {amountLabel} in your UPI app · {UPI_VPA}</p>
              </div>
            )}

            <div className="mt-2 border-t pt-3">
              {canClaim ? (
                <button
                  type="button"
                  onClick={() => {
                    setPayerName(info.donorName || "");
                    setStep("confirm");
                  }}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-bold text-white hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4" /> I&apos;ve paid
                </button>
              ) : (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#25D366] text-sm font-bold text-white hover:opacity-90"
                >
                  Paid? Send the screenshot on WhatsApp
                </a>
              )}
              <p className="mt-2 text-center text-[11px] leading-5 text-muted-foreground">
                Already paid in the earlier payment window? Don&apos;t pay again — your receipt will arrive shortly.
              </p>
            </div>
          </>
        )}

        {info && step === "confirm" && (
          <>
            <DialogTitle className="font-heading text-lg" style={{ color: PURPLE }}>
              Confirm your UPI payment
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Enter the name shown in your UPI app for this {amountLabel} payment, so we can find it and send your receipt.
            </DialogDescription>
            <label className="mt-1 text-xs font-semibold text-ink" htmlFor="upi-payer-name">
              Name in your UPI app
            </label>
            <Input
              id="upi-payer-name"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              autoComplete="name"
              maxLength={80}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="mt-1 grid grid-cols-[auto_1fr] gap-2">
              <button type="button" onClick={() => setStep("pay")} className="h-11 rounded-xl border px-4 text-sm font-semibold text-ink/80">
                Back
              </button>
              <button
                type="button"
                onClick={claim}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Submit
              </button>
            </div>
          </>
        )}

        {info && step === "done" && (
          <div className="py-2 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <DialogTitle className="mt-3 font-heading text-lg text-ink">Thank you! Hare Krishna 🙏</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6">
              We&apos;ll match your {amountLabel} UPI payment and send your receipt on WhatsApp and email, usually within a day.
            </DialogDescription>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 h-11 w-full rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: PURPLE }}
            >
              Done
            </button>
          </div>
        )}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

/**
 * Hook for donation checkouts: call `offerUpi(...)` when the Razorpay window
 * fails or is closed, and render `upiFallbackDialog` once in the page.
 */
export function useUpiFallback() {
  const [info, setInfo] = useState<UpiFallbackInfo | null>(null);
  const [key, setKey] = useState(0);
  const offerUpi = useCallback((next: UpiFallbackInfo) => {
    if (!next.amount || next.amount <= 0) return;
    setKey((k) => k + 1); // fresh dialog state for every attempt
    setInfo(next);
  }, []);
  const upiFallbackDialog = <UpiFallbackDialog key={key} info={info} onClose={() => setInfo(null)} />;
  return { offerUpi, upiFallbackDialog };
}
