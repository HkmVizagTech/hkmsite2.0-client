"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Loader2,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Phone,
  History,
  Repeat,
  Receipt,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { setDonorToken } from "@/lib/donorAuthClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const FEATURES = [
  { icon: History, text: "Your complete donation history in one place" },
  { icon: Receipt, text: "Download any past receipt instantly, anytime" },
  { icon: Repeat, text: "Manage your monthly seva subscriptions" },
  { icon: HeartHandshake, text: "Keep your details and prasadam address current" },
];

export default function DonorLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  // `sending` is the OTP request still in flight AFTER we've already moved to
  // the code screen; `loading` is a blocking action the donor must wait on.
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Where to land after a successful login. Defaults to the donor dashboard,
  // but the shop sends people here with ?redirect=/shop/orders so they end up
  // where they were actually going. Read straight off window.location rather
  // than via useSearchParams, which would force this page behind a Suspense
  // boundary at build time for one optional query parameter.
  const [redirectTo, setRedirectTo] = useState("/donor/dashboard");

  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("redirect");
    // Only same-site paths — never an absolute URL, which would turn this
    // login into an open redirect someone could point at a phishing page.
    if (target && target.startsWith("/") && !target.startsWith("//")) {
      setRedirectTo(target);
    }
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startCooldown = () => {
    setCooldown(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  /**
   * Requests an OTP.
   *
   * The code screen is shown IMMEDIATELY rather than after the request
   * resolves. The WhatsApp send takes a couple of seconds on Meta's side, and
   * making the donor watch a spinner for it was the slowest part of logging
   * in — while in reality they should already be switching to WhatsApp to
   * read the code. The request keeps running; its outcome lands on the screen
   * they are now looking at, and a genuine failure drops them back to the
   * number step with the reason.
   */
  const requestOtp = async (opts: { resend?: boolean } = {}) => {
    setError(null);
    if (mobile.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!opts.resend) setStep("otp");
    setSending(true);
    setSent(false);
    setOtp("");
    startCooldown();

    try {
      const res = await fetch(`${API_URL}/donor-auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not send OTP.");
      setSent(true);
    } catch (err) {
      // Back to the number — an unrecognised number is the common case here,
      // and it is fixed by editing the number, not by waiting for a code.
      setStep("mobile");
      setCooldown(0);
      if (timerRef.current) clearInterval(timerRef.current);
      setError(err instanceof Error ? err.message : "Could not send OTP.");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP sent to your WhatsApp.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/donor-auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not verify OTP.");
      setDonorToken(data.token);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify OTP.");
      setLoading(false);
    }
  };

  // Auto-submit as soon as all six digits are in — on a phone, tapping a
  // button after typing the last digit is pure friction.
  useEffect(() => {
    if (step === "otp" && otp.length === 6 && !loading) verifyOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  return (
    <PageLayout>
      {/* pt clears the fixed site navbar, matching the campaign pages. */}
      <main className="bg-background pt-[88px] md:pt-[104px]">
        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:py-16">
          {/* ── Left: why an account is worth having ──────────────── */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl p-7 text-white shadow-[var(--shadow-elevated)] sm:p-9">
              <Image
                src="/assets/hero-temple.jpg"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.92 }} />
              <div
                className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full blur-3xl"
                style={{ background: "var(--gradient-gold)", opacity: 0.25 }}
              />

              <div className="relative z-10">
                <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Donor Portal
                </span>
                <h1 className="mt-4 font-heading text-2xl font-bold leading-tight sm:text-3xl">
                  Welcome back to your seva journey
                </h1>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/75">
                  Log in with the mobile number you&apos;ve donated with — no password to remember.
                </p>

                <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
                  {FEATURES.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm leading-relaxed text-white/85">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right: the actual login ───────────────────────────── */}
          <div className="order-1 mx-auto w-full max-w-sm lg:order-2 lg:mx-0 lg:max-w-md">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)] sm:p-8">
              <div className="mb-6 flex flex-col items-center text-center">
                <span
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-gold)]"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  {step === "mobile" ? <Phone className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                </span>
                <h2 className="font-heading text-xl font-bold text-primary">
                  {step === "mobile" ? "Donor Login" : "Enter your code"}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {step === "mobile" ? (
                    "Enter the mobile number you've donated with."
                  ) : (
                    <>
                      Sent on WhatsApp to{" "}
                      <span className="font-semibold text-foreground">+91 {mobile}</span>
                    </>
                  )}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {step === "mobile" ? (
                  <motion.form
                    key="mobile-step"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      requestOtp();
                    }}
                    className="space-y-4"
                  >
                    <div className="relative flex items-center rounded-xl border border-border bg-background transition-colors focus-within:border-gold">
                      <Phone className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                      <span className="pointer-events-none border-r border-border py-3 pl-9 pr-2.5 text-sm text-muted-foreground">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        autoFocus
                        className="h-12 w-full bg-transparent px-3 text-base text-foreground outline-none placeholder:text-sm placeholder:text-muted-foreground"
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2" size="lg">
                      <MessageCircle className="h-4 w-4" />
                      Send code on WhatsApp
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="otp-step"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={verifyOtp}
                    className="space-y-5"
                  >
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                        <InputOTPGroup className="gap-1.5 sm:gap-2">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="h-12 w-10 rounded-lg border border-border text-lg font-semibold sm:h-14 sm:w-12 sm:text-xl"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {/* Delivery status, so the wait is explained rather than silent. */}
                    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      {sending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending your code…
                        </>
                      ) : sent ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Code sent — check WhatsApp
                        </>
                      ) : null}
                    </p>

                    <Button type="submit" disabled={loading || otp.length !== 6} className="w-full" size="lg">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Log In"}
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("mobile");
                          setError(null);
                          setSent(false);
                        }}
                        className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Change number
                      </button>
                      <button
                        type="button"
                        disabled={cooldown > 0 || sending || loading}
                        onClick={() => requestOtp({ resend: true })}
                        className="font-medium text-primary transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground"
                      >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-border pt-5 text-center text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-gold" />
                Secured with one-time WhatsApp verification — no password needed.
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Haven&apos;t donated yet?{" "}
              <Link href="/donate" className="font-semibold text-primary hover:underline">
                Begin your seva
              </Link>
            </p>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
