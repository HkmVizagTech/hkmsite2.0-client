"use client";

// Slim "Prefer PhonePe / UPI?" strip shown right after the seva cards on the
// festival donation pages — the fallback for donors whose Razorpay checkout
// fails or who'd rather pay straight from their UPI app:
//   - "Pay with PhonePe" launches PhonePe with the temple's UPI details
//   - "Other UPI" opens Google Pay / Paytm / BHIM etc. (Android chooser)
//   - "Show QR" reveals the official QR for donors on a computer
//   - "Already paid?" opens WhatsApp with a ready message for the receipt
//     (direct UPI payments don't create a donation record on the website)
// Payment details live in lib/upi.ts.

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, QrCode, Smartphone } from "lucide-react";
import { RECEIPT_WHATSAPP, UPI_QR_IMAGE, UPI_VPA, phonePeLink, upiLink } from "@/lib/upi";

const PHONEPE_PURPLE = "#5f259f";

export default function PhonePeUpiCard({ campaign }: { campaign: string }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

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
    "I am attaching the payment screenshot.",
  ].join("\n");
  const whatsappHref = `https://wa.me/${RECEIPT_WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section aria-labelledby="pay-by-upi" className="pb-8 md:pb-10">
      <div className="vk-container">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e4d6f5] bg-[#faf7fe] px-4 py-3.5 md:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: PHONEPE_PURPLE }}
              >
                <Smartphone className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 id="pay-by-upi" className="font-heading text-[15px] font-bold leading-tight" style={{ color: PHONEPE_PURPLE }}>
                  Prefer PhonePe / UPI?
                </h2>
                <button
                  type="button"
                  onClick={copyVpa}
                  className="mt-0.5 flex max-w-full items-center gap-1 text-left text-xs text-muted-foreground hover:text-ink"
                  aria-label="Copy UPI ID"
                >
                  <span className="truncate">{UPI_VPA}</span>
                  {copied ? <Check className="h-3 w-3 shrink-0 text-green-600" /> : <Copy className="h-3 w-3 shrink-0" />}
                </button>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-[1fr_auto] gap-2">
              <a
                href={phonePeLink()}
                className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: PHONEPE_PURPLE }}
              >
                Pay with PhonePe
              </a>
              <a
                href={upiLink()}
                className="inline-flex h-10 items-center justify-center rounded-xl border bg-white px-3 text-sm font-semibold transition-colors hover:bg-[#f3ecfc]"
                style={{ borderColor: PHONEPE_PURPLE, color: PHONEPE_PURPLE }}
              >
                Other UPI
              </a>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#ece2f8] pt-2.5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => setShowQr((v) => !v)}
              aria-expanded={showQr}
              className="inline-flex items-center gap-1 font-semibold hover:underline"
              style={{ color: PHONEPE_PURPLE }}
            >
              <QrCode className="h-3.5 w-3.5" />
              {showQr ? "Hide QR" : "On a computer? Show QR"}
            </button>
            <span>
              Already paid?{" "}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#128C7E] hover:underline"
              >
                Send the screenshot on WhatsApp
              </a>{" "}
              for your receipt.
            </span>
          </div>

          {showQr && (
            <div className="mt-3 flex justify-center">
              <Image
                src={UPI_QR_IMAGE}
                alt={`UPI QR code — pay ${UPI_VPA}`}
                width={180}
                height={180}
                className="rounded-xl border border-[#ece2f8] bg-white p-1.5"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
