// Direct UPI payment details used by the "Prefer PhonePe / UPI?" strips and
// the UPI QR cards on the donation pages — the fallback for donors who can't
// complete the Razorpay checkout.
//
// This is the temple's Razorpay "Website UPI transactions" QR
// (Hare Krishna Movement India, IDFC First Bank). The query below is exactly
// what that QR encodes — keep `tr` (the QR's reference) so every payment made
// from the buttons is credited to the same QR in the Razorpay dashboard.
// To change it: decode the new QR, paste its query here and replace
// public/assets/upi-qr-hkm.png with the new QR image.
export const UPI_VPA = "harekrishnamove960950.rzp@rxairtel";
export const UPI_PAYEE_NAME = "Hare Krishna Movement India";
const UPI_QUERY =
  "cu=INR&mc=8398&mode=19&pa=harekrishnamove960950.rzp@rxairtel&tn=Payment%20To%20Hare%20Krishna%20Movement%20India&tr=TkXLOSHxVdX10Hqrv2";

/** The official QR image (cropped from the Razorpay poster, logo included). */
export const UPI_QR_IMAGE = "/assets/upi-qr-hkm.png";

// WhatsApp number donors send their payment screenshot to (for the receipt).
export const RECEIPT_WHATSAPP = "918977761187";

// Optional fixed amount (₹) — used by the checkout fallback so the UPI app
// opens with the exact seva amount instead of asking the donor to type it.
const withAmount = (amount?: number) =>
  amount && amount > 0 ? `${UPI_QUERY}&am=${amount.toFixed(2)}` : UPI_QUERY;

/** Generic intent: any UPI app (Android shows the app chooser). Same as the QR. */
export const upiLink = (amount?: number) => `upi://pay?${withAmount(amount)}`;

/** Opens PhonePe directly (Android and iOS) with the payee filled in. */
export const phonePeLink = (amount?: number) => `phonepe://pay?${withAmount(amount)}`;

/** API base for the public UPI-fallback endpoints. */
export const UPI_API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
