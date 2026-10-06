// Fallback e-mail for the Razorpay checkout prefill.
//
// Every donation form on the site treats e-mail as optional, and most donors
// leave it blank. Razorpay's checkout, however, shows its own e-mail field and
// reads an empty `prefill.email` as "ask the donor for one" — so people who had
// just been told the field was optional were asked for it again on the payment
// sheet. That is what donors were complaining about: not our form, Razorpay's.
//
// Passing a house address keeps that field satisfied and the checkout quiet.
//
// IMPORTANT: this value goes ONLY into the Razorpay checkout options. The
// donation record still stores whatever the donor actually typed — usually
// nothing — so no donor is ever saved, receipted or mailed under this address.
// Razorpay's own payment confirmation for those donations will go here, so it
// needs to be a mailbox the temple actually monitors.
//
// Overridable without a code change via NEXT_PUBLIC_FALLBACK_DONOR_EMAIL.
export const FALLBACK_DONOR_EMAIL =
  process.env.NEXT_PUBLIC_FALLBACK_DONOR_EMAIL || "donor@hkmvizag.org";

/**
 * The e-mail to hand Razorpay: the donor's own if they typed one, otherwise the
 * house address. Whitespace-only input counts as blank, because " " in the
 * field would otherwise sail past a plain falsy check and leave Razorpay
 * prompting anyway.
 */
export function prefillEmail(email?: string | null): string {
  return String(email ?? "").trim() || FALLBACK_DONOR_EMAIL;
}
