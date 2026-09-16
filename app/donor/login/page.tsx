"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { setDonorToken } from "@/lib/donorAuthClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const FEATURES = [
  { icon: History, text: "See your complete donation history in one place" },
  { icon: Receipt, text: "Download any past receipt instantly, anytime" },
  { icon: Repeat, text: "Manage your monthly seva subscriptions" },
];

export default function DonorLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
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

  const requestOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (mobile.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/donor-auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not send OTP.");
      setStep("otp");
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
      setLoading(false);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left — brand panel, hidden below lg */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image
          src="/assets/hero-temple.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.9 }} />
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--gradient-gold)", opacity: 0.25 }}
        />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image
            src="/assets/hkvt-logo-full.png"
            alt="Hare Krishna Movement, Visakhapatnam"
            width={2438}
            height={825}
            className="h-11 w-auto"
          />
          <span className="font-heading text-lg font-semibold text-white">Hare Krishna Movement, Vizag</span>
        </Link>

        <div className="relative z-10 max-w-md space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              Donor Portal
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight text-white">
              Welcome back to your seva journey
            </h1>
            <p className="text-sm text-white/75">
              Log in with the mobile number you&apos;ve donated with to view your giving history and receipts.
            </p>
          </div>
          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-white/85">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/50">
          &copy; {new Date().getFullYear()} Hare Krishna Movement, Visakhapatnam
        </p>
      </div>

      {/* Right — login card */}
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <Image
            src="/assets/hkvt-logo-full.png"
            alt="Hare Krishna Movement, Visakhapatnam"
            width={2438}
            height={825}
            className="h-8 w-auto"
          />
          <span className="font-heading text-base font-semibold text-primary">Hare Krishna Movement, Vizag</span>
        </Link>

        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-elevated)] sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <span
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-gold)]"
              style={{ background: "var(--gradient-gold)" }}
            >
              {step === "mobile" ? <Phone className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </span>
            <h1 className="font-heading text-xl font-bold text-primary">
              {step === "mobile" ? "Donor Login" : "Verify your number"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {step === "mobile"
                ? "Enter the mobile number you've donated with."
                : (
                  <>
                    Enter the 6-digit code sent to <span className="font-semibold text-foreground">{mobile}</span> via WhatsApp.
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
                onSubmit={requestOtp}
                className="space-y-4"
              >
                <div className="relative flex items-center rounded-lg border border-border bg-background transition-colors focus-within:border-gold">
                  <Phone className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
                  <span className="pointer-events-none border-r border-border py-2.5 pl-9 pr-2.5 text-sm text-muted-foreground">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    autoFocus
                    className="h-11 w-full bg-transparent pl-3 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  Send OTP via WhatsApp
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
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-10 rounded-lg border border-border text-lg font-semibold sm:w-11"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button type="submit" disabled={loading || otp.length !== 6} className="w-full" size="lg">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Log In"}
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("mobile");
                      setError(null);
                    }}
                    className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Change number
                  </button>
                  <button
                    type="button"
                    disabled={cooldown > 0 || loading}
                    onClick={() => requestOtp()}
                    className="font-medium text-primary transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground"
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-border pt-5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-gold" />
            Secured with one-time WhatsApp verification — no password needed.
          </div>
        </div>
      </div>
    </div>
  );
}
