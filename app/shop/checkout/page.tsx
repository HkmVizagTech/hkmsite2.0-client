"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Phone,
  MapPin,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AddressForm, { PrasadamAddress } from "@/components/AddressForm";
import { useCart } from "@/contexts/CartContext";
import { donorFetch, getDonorToken, setDonorToken } from "@/lib/donorAuthClient";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { CartQuote, SHOP_API, quoteCart, formatINR } from "@/lib/shopApi";

const BLANK_ADDRESS: PrasadamAddress = { street: "", city: "", state: "", pincode: "", country: "India" };

// Same local-cast pattern as components/DonationForm.tsx rather than a
// `declare global` augmentation — one checkout script, two call sites, no
// global type that both files have to agree on forever.
type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clearCart, itemCount } = useCart();
  const razorpayReady = useRazorpayPreload();

  // Auth (WhatsApp OTP — the same mechanism as the donor portal, but via the
  // shop endpoint, which will also accept a number that has never donated)
  const [loggedIn, setLoggedIn] = useState(false);
  const [otpStep, setOtpStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<PrasadamAddress>(BLANK_ADDRESS);
  const [note, setNote] = useState("");

  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [busy, setBusy] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoggedIn(!!getDonorToken());
  }, []);

  // Pull the customer's saved details once they're logged in, so a returning
  // devotee doesn't retype the address they already gave us.
  const loadProfile = useCallback(async () => {
    try {
      const res = await donorFetch(`${SHOP_API}/donor/me`);
      if (!res.ok) return;
      const data = await res.json();
      const donor = data.donor || {};
      setName((n) => n || donor.name || "");
      setEmail((e) => e || donor.email || "");
      if (donor.savedAddress) {
        setAddress((a) => (a.street ? a : { ...BLANK_ADDRESS, ...donor.savedAddress }));
      }
    } catch {
      // A failed prefill is a minor inconvenience, not a blocker — the form
      // still works empty.
    }
  }, []);

  useEffect(() => {
    if (loggedIn) loadProfile();
  }, [loggedIn, loadProfile]);

  const refreshQuote = useCallback(async () => {
    if (lines.length === 0) {
      setQuote(null);
      return;
    }
    try {
      setQuote(await quoteCart(lines));
    } catch (e: any) {
      setError(e.message);
    }
  }, [lines]);

  useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (mobile.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setBusy(true);
    try {
      // The shop-specific endpoint: unlike the donor portal's, it accepts a
      // number with no history and creates the customer record on the spot.
      const res = await fetch(`${SHOP_API}/donor-auth/shop/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not send OTP.");
      setOtpStep("otp");
      setOtp("");
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError("Enter the 6-digit code sent to your WhatsApp.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${SHOP_API}/donor-auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not verify OTP.");
      setDonorToken(data.token);
      setLoggedIn(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const placeOrder = async () => {
    setError(null);
    if (!name.trim()) return setError("Please enter the name for this order.");
    if (!address.street || !address.city || !address.state || !/^\d{6}$/.test(address.pincode)) {
      return setError("Please complete the delivery address, including a valid 6-digit PIN code.");
    }

    setPaying(true);
    try {
      const res = await donorFetch(`${SHOP_API}/shop/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines,
          shippingAddress: address,
          customerName: name.trim(),
          customerEmail: email.trim() || undefined,
          customerNote: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not start checkout.");

      await razorpayReady();

      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable. Please refresh and try again.");

      const rzp = new win.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "Hare Krishna Movement, Vizag",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: data.customer?.name,
          contact: data.customer?.mobile,
          email: data.customer?.email || undefined,
        },
        theme: { color: "#0a2a66" },
        handler: async (response: any) => {
          try {
            const verifyRes = await donorFetch(`${SHOP_API}/shop/orders/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData.message || "Verification failed.");
            clearCart();
            router.push(`/shop/orders/${data.orderNumber}?placed=1`);
          } catch (err: any) {
            // The payment itself may well have succeeded — the webhook
            // confirms it independently — so never tell the devotee it
            // failed. Send them to the order page, which shows the real
            // status once the webhook lands.
            clearCart();
            router.push(`/shop/orders/${data.orderNumber}?placed=1`);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message);
      setPaying(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
        <p className="font-medium text-foreground">Your cart is empty.</p>
        <Link href="/shop">
          <Button variant="outline">Browse the shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Checkout</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* Step 1 — identify the customer */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  loggedIn ? "bg-emerald-100 text-emerald-700" : "bg-primary text-primary-foreground"
                }`}
              >
                {loggedIn ? <CheckCircle2 className="h-4 w-4" /> : "1"}
              </span>
              <h2 className="font-semibold text-foreground">Your details</h2>
            </div>

            {loggedIn ? (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Name for this order</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-gold"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-gold"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            ) : otpStep === "mobile" ? (
              <form onSubmit={sendOtp} className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  We&apos;ll send a one-time code to your WhatsApp to confirm your number — no password needed.
                </p>
                <div className="relative flex items-center rounded-lg border border-border bg-background focus-within:border-gold">
                  <Phone className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                  <span className="pointer-events-none border-r border-border py-2.5 pl-9 pr-2.5 text-sm text-muted-foreground">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="h-11 w-full bg-transparent px-3 text-sm outline-none"
                  />
                </div>
                <Button type="submit" disabled={busy} className="w-full gap-2">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  Send OTP via WhatsApp
                </Button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to <span className="font-semibold text-foreground">{mobile}</span>.
                </p>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} className="h-12 w-10 rounded-lg border border-border text-lg font-semibold" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button type="submit" disabled={busy || otp.length !== 6} className="w-full">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setOtpStep("mobile")}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Change number
                  </button>
                  <button
                    type="button"
                    disabled={cooldown > 0 || busy}
                    onClick={() => sendOtp()}
                    className="font-medium text-primary disabled:text-muted-foreground"
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Step 2 — where it goes */}
          <section className={`rounded-2xl border border-border bg-card p-5 ${loggedIn ? "" : "opacity-50"}`}>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <h2 className="flex items-center gap-1.5 font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-gold" /> Delivery address
              </h2>
            </div>
            <fieldset disabled={!loggedIn}>
              <AddressForm address={address} setAddress={setAddress} />
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Note for the temple (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 500))}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  placeholder="Anything we should know about this order"
                />
              </div>
            </fieldset>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 font-semibold text-foreground">Order summary</h2>

            {!quote ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="max-h-56 space-y-2.5 overflow-y-auto">
                  {quote.items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || "base"}`} className="flex gap-2.5 text-sm">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-medium text-foreground">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variantLabel ? `${item.variantLabel} · ` : ""}Qty {item.quantity}
                        </p>
                        {item.freeShipping && (
                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">Free delivery</p>
                        )}
                      </div>
                      <p className="font-semibold text-foreground">{formatINR(item.lineTotal)}</p>
                    </div>
                  ))}
                </div>

                {quote.problems.length > 0 && (
                  <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Some items are no longer available. Please
                    <Link href="/shop" className="mx-1 font-semibold underline">
                      update your cart
                    </Link>
                    before paying.
                  </div>
                )}

                <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatINR(quote.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className={quote.shippingCharge === 0 ? "font-medium text-emerald-600" : "font-medium text-foreground"}>
                      {quote.shippingCharge === 0 ? "Free" : formatINR(quote.shippingCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatINR(quote.total)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="mt-4 w-full"
                  disabled={!loggedIn || paying || quote.problems.length > 0 || !quote.shopEnabled}
                  onClick={placeOrder}
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Opening payment…
                    </>
                  ) : !quote.shopEnabled ? (
                    "Shop is closed"
                  ) : (
                    `Pay ${formatINR(quote.total)}`
                  )}
                </Button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                  Secure payment via Razorpay
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
