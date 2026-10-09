// Remembers the donor's most recent unpaid checkout on this device, so the
// "Prefer PhonePe / UPI?" strip on the same page can tie a PhonePe click back
// to the details they filled in the form (they show up in Admin → Donations →
// UPI to Match under that donation).
//
// Saved when the Razorpay window fails or is closed (UpiFallbackDialog's
// offerUpi). Kept for 3 hours, only for the page it was made on. Storage can be
// unavailable (private mode, blocked site data), so every access is guarded.

export type UpiAttempt = {
  donationId: string;
  orderId: string;
  amount: number;
  campaign: string;
  donorName?: string;
  path: string; // page the checkout was on
  at: number; // ms timestamp
};

const KEY = "hk_upi_attempt";
const MAX_AGE_MS = 3 * 60 * 60 * 1000;

export function saveUpiAttempt(a: Omit<UpiAttempt, "path" | "at">) {
  if (!a.donationId || !a.orderId || !(a.amount > 0)) return;
  try {
    const value: UpiAttempt = { ...a, path: window.location.pathname, at: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable — the strip just won't be linked */
  }
}

/** The recent unpaid attempt made on this page, or null. */
export function getUpiAttempt(): UpiAttempt | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as UpiAttempt;
    if (!a || Date.now() - a.at > MAX_AGE_MS || a.path !== window.location.pathname) return null;
    return a;
  } catch {
    return null;
  }
}

export function clearUpiAttempt() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
