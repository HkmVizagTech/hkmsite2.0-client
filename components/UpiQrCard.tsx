"use client";

// UPI QR payment card — replicates the "Scan & Pay with any UPI app" panel
// from annadan.harekrishnavizag.org, restyled to this site's saffron/gold
// theme. Open-amount QR: the donor enters the amount in their own UPI app.
//
// Payment details (the temple's Razorpay "Website UPI transactions" QR) come
// from lib/upi.ts, shared with the PhonePe / UPI strip on the seva pages.
// The QR is a standard `upi://pay` code that any UPI app can scan.

import { useState } from "react";
import { QrCode, Copy, Check, Smartphone } from "lucide-react";

import { UPI_VPA, UPI_QR_IMAGE, upiLink } from "@/lib/upi";

// Open-amount UPI intent string (no `am=` so donor sets the amount).
const UPI_STRING = upiLink();
const QR_IMG = UPI_QR_IMAGE;

export default function UpiQrCard({ note }: { note?: string }) {
  const [copied, setCopied] = useState(false);

  const copyVpa = () => {
    navigator.clipboard.writeText(UPI_VPA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="vk-card p-5 text-center md:p-6">
      <div className="mb-1.5 flex items-center justify-center gap-2.5">
        <span className="vk-icon-chip !h-9 !w-9"><QrCode className="h-4 w-4" /></span>
        <h3 className="font-heading text-lg font-bold text-ink">Pay via UPI</h3>
      </div>
      <p className="mb-4 text-[13px] text-muted-foreground">Scan the QR, or open your UPI app directly on this phone</p>

      {/* Open UPI App — on mobile, tapping this launches the installed UPI
          app (PhonePe, Google Pay, Paytm, BHIM, etc.) directly with the
          temple's VPA pre-filled, since scanning a QR shown on the same
          phone you're browsing with isn't possible. Same upi:// intent
          used to generate the QR below. */}
      <a
        href={UPI_STRING}
        className="vk-btn-gold mx-auto mb-4 h-12 w-full max-w-xs text-[15px] font-bold"
      >
        <Smartphone className="h-4 w-4" />
        Open UPI App to Pay
      </a>
      <p className="mb-4 text-[11px] text-muted-foreground">or scan below with any UPI app</p>

      <div className="mx-auto mb-4 inline-flex rounded-2xl border border-vk-100 bg-white p-2.5 shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={QR_IMG}
          alt="Scan to pay via PhonePe, Google Pay, Paytm or any UPI app"
          width={220}
          height={220}
          className="h-[200px] w-[200px] rounded-lg sm:h-[220px] sm:w-[220px]"
        />
      </div>

      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-vk-700">
        PhonePe · Google Pay · Paytm · BHIM
      </p>

      <p className="mb-1.5 text-xs text-muted-foreground">or pay to this UPI ID</p>
      <button
        onClick={copyVpa}
        className="mx-auto flex h-11 w-full max-w-xs items-center justify-between gap-2 rounded-xl border border-vk-200 bg-vk-50 px-3.5 text-sm transition-colors hover:border-vk-500"
        aria-label="Copy UPI ID"
      >
        <span className="truncate font-semibold text-foreground">{UPI_VPA}</span>
        {copied ? (
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-green-600">
            <Check className="h-3.5 w-3.5" /> Copied
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-vk-600">
            <Copy className="h-3.5 w-3.5" /> Copy
          </span>
        )}
      </button>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        {note ||
          "After paying by UPI, please WhatsApp us your payment screenshot with your name and PAN (for 80G) so we can send your receipt."}
      </p>
    </div>
  );
}
