// Direct UPI payment details used by the "Pay with PhonePe / UPI" cards on the
// donation pages — the fallback for donors who can't complete Razorpay.
//
// Change the UPI ID here (or set NEXT_PUBLIC_UPI_VPA on Vercel) and every card
// and QR on the site follows.
export const UPI_VPA = process.env.NEXT_PUBLIC_UPI_VPA || "hkmivsp9.08@idfcbank";
export const UPI_PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "HARE KRISHNA MOVEMENT INDIA";

// WhatsApp number donors send their payment screenshot to (for the receipt).
export const RECEIPT_WHATSAPP = "918977761187";

/** Query string of a standard UPI intent. No `am`, so the donor types the amount. */
function upiQuery(note?: string) {
  // `pa` stays raw: several UPI apps reject a VPA with "@" encoded as %40.
  const params = [`pa=${UPI_VPA}`, `pn=${encodeURIComponent(UPI_PAYEE_NAME)}`, "cu=INR"];
  if (note) params.push(`tn=${encodeURIComponent(note.slice(0, 50))}`);
  return params.join("&");
}

/** Generic intent: any UPI app (Android shows the app chooser). Also what the QR encodes. */
export const upiLink = (note?: string) => `upi://pay?${upiQuery(note)}`;

/** Opens PhonePe directly (Android and iOS), with the temple's UPI ID filled in. */
export const phonePeLink = (note?: string) => `phonepe://pay?${upiQuery(note)}`;

export const upiQrImage = (note?: string, size = 260) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(upiLink(note))}`;
