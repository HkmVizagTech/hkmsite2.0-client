"use client";

// Slim "Prefer PhonePe / UPI?" strip shown right after the seva cards on the
// festival donation pages — the fallback for donors whose Razorpay checkout
// fails or who'd rather pay straight from their UPI app:
//   - "Pay with PhonePe" launches PhonePe with the temple's UPI details
//   - "Other UPI" opens Google Pay / Paytm / BHIM etc. (Android chooser)
//   - "Show QR" reveals the official QR for donors on a computer
//   - "Already paid?" opens WhatsApp with a ready message for the receipt
// When this device has a recent unpaid checkout on this page (the Razorpay
// window failed or was closed — lib/upiAttempt.ts), the strip is tied to it:
// it shows that amount and seva, opens the UPI app with the amount filled in,
// and records the click on that donation so it appears in Admin → Donations →
// UPI to Match with the details from the form.
// Payment details live in lib/upi.ts.

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy, QrCode, Smartphone } from "lucide-react";
import { RECEIPT_WHATSAPP, UPI_API_BASE, UPI_QR_IMAGE, UPI_VPA, phonePeLink, upiLink } from "@/lib/upi";
import { getUpiAttempt, type UpiAttempt } from "@/lib/upiAttempt";
import { useT } from "@/components/i18n/LocaleProvider";

const PHONEPE_PURPLE = "#5f259f";

export default function PhonePeUpiCard({ campaign }: { campaign: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  // Read after mount (storage is browser-only), so the server and first client
  // render match.
  const [attempt, setAttempt] = useState<UpiAttempt | null>(null);
  useEffect(() => {
    setAttempt(getUpiAttempt());
  }, []);
  const amountLabel = attempt ? `₹${attempt.amount.toLocaleString("en-IN")}` : "";

  const markOpened = (app: "phonepe" | "other") => {
    if (!attempt) return;
    // fire-and-forget: the app switch must not wait on our API
    fetch(`${UPI_API_BASE}/payments/upi-fallback/opened`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donationId: attempt.donationId, orderId: attempt.orderId, app, via: "strip" }),
      keepalive: true,
    }).catch(() => {});
  };

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
    `Hare Krishna! I have paid for ${attempt ? attempt.campaign : campaign + " seva"} by UPI.`,
    `Amount: ${attempt ? amountLabel : "₹"}`,
    `Name: ${attempt?.donorName || ""}`,
    "Mobile: ",
    "PAN (only if you need an 80G receipt): ",
    "I am attaching the payment screenshot.",
  ].join("\n");
  const whatsappHref = `https://wa.me/${RECEIPT_WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;
  // Split around {link} so the WhatsApp link sits wherever the language puts it.
  const [paidBefore, paidAfter = ""] = t("Already paid? {link} for your receipt.").split("{link}");

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
                  {t("Prefer PhonePe / UPI?")}
                </h2>
                {attempt && (
                  <p className="mt-0.5 text-xs font-semibold text-ink">
                    {t("For your {amount} donation · {campaign}", { amount: amountLabel, campaign: attempt.campaign })}
                  </p>
                )}
                <button
                  type="button"
                  onClick={copyVpa}
                  className="mt-0.5 flex max-w-full items-center gap-1 text-left text-xs text-muted-foreground hover:text-ink"
                  aria-label={t("Copy UPI ID")}
                >
                  <span className="truncate">{UPI_VPA}</span>
                  {copied ? <Check className="h-3 w-3 shrink-0 text-green-600" /> : <Copy className="h-3 w-3 shrink-0" />}
                </button>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-[1fr_auto] gap-2">
              <a
                href={phonePeLink(attempt?.amount)}
                onClick={() => markOpened("phonepe")}
                className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: PHONEPE_PURPLE }}
              >
                {t("Pay with PhonePe")}
              </a>
              <a
                href={upiLink(attempt?.amount)}
                onClick={() => markOpened("other")}
                className="inline-flex h-10 items-center justify-center rounded-xl border bg-white px-3 text-sm font-semibold transition-colors hover:bg-[#f3ecfc]"
                style={{ borderColor: PHONEPE_PURPLE, color: PHONEPE_PURPLE }}
              >
                {t("Other UPI")}
              </a>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#ece2f8] pt-2.5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => {
                if (!showQr) markOpened("other");
                setShowQr((v) => !v);
              }}
              aria-expanded={showQr}
              className="inline-flex items-center gap-1 font-semibold hover:underline"
              style={{ color: PHONEPE_PURPLE }}
            >
              <QrCode className="h-3.5 w-3.5" />
              {showQr ? t("Hide QR") : t("On a computer? Show QR")}
            </button>
            <span>
              {paidBefore}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#128C7E] hover:underline"
              >
                {t("Send the screenshot on WhatsApp")}
              </a>
              {paidAfter}
            </span>
          </div>

          {attempt && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("Your details from the form are saved — we'll match this UPI payment to {name} and send the receipt.", { name: attempt.donorName || t("you") })}
            </p>
          )}

          {showQr && (
            <div className="mt-3 flex justify-center">
              <Image
                src={UPI_QR_IMAGE}
                alt={t("UPI QR code — pay {vpa}", { vpa: UPI_VPA })}
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
