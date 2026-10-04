"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
   * Requests an OTP and only then shows the code screen.
   *
   * This deliberately waits for the server. An earlier version jumped to the
   * code screen immediately to hide the couple of seconds the WhatsApp send
   * takes — but that turned a provider outage into a screen that cheerfully
   * asked for a code nobody had been sent. The server now answers only once
   * the message has actually been accepted, so "Enter your code" means the
   * code is genuinely on its way, and an outage is reported here instead.
   */
  const requestOtp = async (opts: { resend?: boolean } = {}) => {
    setError(null);
    if (mobile.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSending(true);
    setSent(false);

    try {
      const res = await fetch(`${API_URL}/donor-auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not send OTP.");

      if (!opts.resend) setStep("otp");
      setOtp("");
      setSent(true);
      startCooldown();
    } catch (err) {
      // Stay where we are. On the number step that is where the fix lives
      // (wrong number); on a resend the donor keeps the code box they may
      // still receive a message for.
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
      <main className="bg-white pt-[var(--header-h)]">
        <section className="vk-band">
          <div className="vk-container grid gap-6 py-10 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
          {/* ── Left: why an account is worth having ──────────────── */}
          <div className="order-2 min-w-0 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-[0_24px_50px_-24px_rgba(30,58,138,0.7)] sm:p-9">
              <Image
                src="/assets/hero-temple.jpg"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-vk-800/95 via-vk-700/90 to-vk-600/85" />
              <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />

              <div className="relative z-10">
                <span className="vk-pill-light">Donor Portal</span>
                <h1 className="mt-4 font-heading text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-3xl">
                  Welcome back to your seva journey
                </h1>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/80">
                  Log in with the mobile number you&apos;ve donated with — no password to remember.
                </p>

                <ul className="mt-7 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                  {FEATURES.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3 rounded-xl bg-white/10 px-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[hsl(var(--gold))]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm leading-relaxed text-white/90">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right: the actual login ───────────────────────────── */}
          <div className="order-1 mx-auto w-full min-w-0 max-w-md lg:order-2 lg:mx-0">
            <div className="vk-card !rounded-3xl p-5 sm:p-8">
              <div className="mb-6 flex flex-col items-center text-center">
                <span className="vk-icon-chip mb-4 !h-14 !w-14 !rounded-2xl">
                  {step === "mobile" ? <Phone className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                </span>
                <h2 className="font-heading text-xl font-bold text-ink">
                  {step === "mobile" ? "Donor Login" : "Enter your code"}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {step === "mobile" ? (
                    "Enter the mobile number you've donated with."
                  ) : (
                    <>
                      Sent on WhatsApp to{" "}
                      <span className="font-semibold text-ink">+91 {mobile}</span>
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
                    className="mb-4 overflow-hidden rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700"
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
                    <div>
                      <label htmlFor="donor-login-mobile" className="mb-1.5 block text-[13px] font-semibold text-ink/80">
                        Mobile number
                      </label>
                      <div className="relative flex h-12 items-center rounded-xl border border-vk-200 bg-white transition focus-within:border-vk-500 focus-within:shadow-[0_0_0_3px_rgba(47,91,211,0.15)]">
                        <Phone className="pointer-events-none absolute left-3.5 h-4 w-4 text-vk-400" />
                        <span className="pointer-events-none border-r border-vk-200 py-2.5 pl-10 pr-2.5 text-sm font-semibold text-vk-700">
                          +91
                        </span>
                        <input
                          id="donor-login-mobile"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          autoFocus
                          className="h-full w-full min-w-0 bg-transparent px-3 text-base text-ink outline-none placeholder:text-sm placeholder:text-muted-foreground/70"
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={sending} className="vk-btn-primary h-12 w-full text-[15px] font-bold">
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending code…
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4" /> Send code on WhatsApp
                        </>
                      )}
                    </button>
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
                              className="h-12 w-10 rounded-xl border border-vk-200 bg-white text-lg font-bold text-ink first:rounded-l-xl last:rounded-r-xl sm:h-14 sm:w-12 sm:text-xl"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {/* Delivery status, so the wait is explained rather than silent. */}
                    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      {sending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Resending your code…
                        </>
                      ) : sent ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Code sent — check WhatsApp
                        </>
                      ) : null}
                    </p>

                    <button type="submit" disabled={loading || otp.length !== 6} className="vk-btn-primary h-12 w-full text-[15px] font-bold">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Log In"}
                    </button>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("mobile");
                          setError(null);
                          setSent(false);
                        }}
                        className="flex min-h-[44px] items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-vk-700"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Change number
                      </button>
                      <button
                        type="button"
                        disabled={cooldown > 0 || sending || loading}
                        onClick={() => requestOtp({ resend: true })}
                        className="min-h-[44px] font-semibold text-vk-700 transition-colors hover:text-vk-500 disabled:cursor-not-allowed disabled:text-muted-foreground"
                      >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-vk-100 pt-5 text-center text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-vk-500" />
                Secured with one-time WhatsApp verification — no password needed.
              </div>
            </div>

            <p className="mt-4 text-center text-[13px] text-muted-foreground">
              Haven&apos;t donated yet?{" "}
              <Link href="/donate" className="font-semibold text-vk-700 underline-offset-4 hover:underline">
                Begin your seva
              </Link>
            </p>
          </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
