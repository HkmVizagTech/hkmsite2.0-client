"use client";

// "Prefer PhonePe / UPI?" card shown right after the seva cards on the festival
// donation pages. It is the fallback for donors whose Razorpay payment fails or
// who simply prefer to pay from their UPI app:
//   - "Open in PhonePe" launches PhonePe with the temple's UPI ID filled in
//   - "Other UPI app" opens Google Pay / Paytm / BHIM etc. (Android chooser)
//   - the QR is for donors on a computer, scanned with their phone
//   - "Already paid?" opens WhatsApp with a ready message so the office can
//     send the receipt (direct UPI payments don't reach our donation records)
// The UPI ID itself lives in lib/upi.ts.

import { useState } from "react";
import { Check, Copy, MessageCircle, QrCode, Smartphone } from "lucide-react";
import { RECEIPT_WHATSAPP, UPI_VPA, phonePeLink, upiLink, upiQrImage } from "@/lib/upi";

const PHONEPE_PURPLE = "#5f259f";

export default function PhonePeUpiCard({ campaign }: { campaign: string }) {
  const [copied, setCopied] = useState(false);
  const note = `${campaign} Seva`;

  const copyVpa = () => {
    navigator.clipboard
      .writeText(UPI_VPA)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const whatsappText = [
    `Hare Krishna! I have paid for ${campaign} seva by UPI.`,
    "Amount: ₹",
    "Name: ",
    "Mobile: ",
    "PAN (only if you need an 80G receipt): ",
    "Address (for 80G / prasadam): ",
    "I am attaching the payment screenshot.",
  ].join("\n");
  const whatsappHref = `https://wa.me/${RECEIPT_WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section aria-labelledby="pay-by-upi" className="pb-10 md:pb-14">
      <div className="vk-container">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#e4d6f5] bg-gradient-to-br from-[#f6f0fd] via-white to-white shadow-card">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[#ece2f8] px-5 py-4 md:px-7">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ backgroundColor: PHONEPE_PURPLE }}
            >
              <Smartphone className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="pay-by-upi" className="font-heading text-lg font-bold md:text-xl" style={{ color: PHONEPE_PURPLE }}>
                Prefer PhonePe / UPI?
              </h2>
              <p className="text-[13px] leading-5 text-muted-foreground md:text-sm">
                If the online payment doesn&apos;t go through, pay the temple directly from your UPI app.
              </p>
            </div>
          </div>

          <div className="grid gap-6 px-5 py-5 md:grid-cols-[auto_1fr] md:items-center md:px-7 md:py-6">
            {/* QR — for donors on a computer */}
            <div className="order-2 mx-auto flex flex-col items-center md:order-1 md:mx-0">
              <div className="rounded-2xl border border-[#ece2f8] bg-white p-2 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={upiQrImage(note)}
                  alt={`UPI QR code to pay ${UPI_VPA}`}
                  width={176}
                  height={176}
                  loading="lazy"
                  className="h-32 w-32 rounded-lg md:h-44 md:w-44"
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <QrCode className="h-3.5 w-3.5" /> Scan with any UPI app
              </p>
            </div>

            <div className="order-1 min-w-0 md:order-2">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">UPI ID</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="break-all font-heading text-lg font-bold md:text-xl" style={{ color: PHONEPE_PURPLE }}>
                  {UPI_VPA}
                </span>
                <button
                  type="button"
                  onClick={copyVpa}
                  aria-label="Copy UPI ID"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: PHONEPE_PURPLE }}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <a
                  href={phonePeLink(note)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: PHONEPE_PURPLE }}
                >
                  <Smartphone className="h-4 w-4" />
                  Open in PhonePe
                </a>
                <a
                  href={upiLink(note)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 bg-white px-4 text-[15px] font-bold transition-colors hover:bg-[#f6f0fd]"
                  style={{ borderColor: PHONEPE_PURPLE, color: PHONEPE_PURPLE }}
                >
                  GPay / Paytm / other UPI
                </a>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                The apps open on your phone. On a computer, scan the QR instead.
              </p>
            </div>
          </div>

          {/* Already paid */}
          <div className="flex flex-col items-start gap-3 border-t border-[#ece2f8] bg-[#faf7fe] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <p className="text-sm leading-6 text-ink/80">
              <span className="font-bold text-ink">Already paid?</span> Send us the payment screenshot on WhatsApp so we can
              send your receipt (and 80G certificate, if you need one).
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
