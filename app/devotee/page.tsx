"use client";

// Devotee login: sign in with the mobile number on the temple's devotee list (code by SMS + WhatsApp), then open the
// read-only Programs dashboard (filters + CSV export). Same session as the admin panel, with the "devotee" role, which
// the admin layout restricts to /admin/programs.
export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { setToken } from "@/lib/authClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

export default function DevoteeLogin() {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    setError("");
    const m = mobile.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(m)) return setError("Please enter your 10-digit mobile number.");
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/devotee-portal/send-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: m }) });
      const j = await res.json();
      if (res.ok) { setMobile(m); setStep("otp"); } else setError(j.message || "Could not send the code.");
    } catch { setError("Network error. Please try again."); }
    setBusy(false);
  };

  const verify = async () => {
    setError("");
    if (!/^\d{6}$/.test(otp)) return setError("Please enter the 6-digit code.");
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/devotee-portal/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile, otp }) });
      const j = await res.json();
      if (res.ok) {
        setToken(j.token);
        // Full page load so the admin session check runs again with the new token.
        window.location.href = "/admin/programs";
        return;
      }
      setError(j.message || "Incorrect code.");
    } catch { setError("Network error. Please try again."); }
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-vk-50/60 pb-16">
      <header className="border-b border-vk-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Image src="/assets/logo.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-contain" />
          <div>
            <p className="text-sm font-bold text-vk-800">Devotee Login</p>
            <p className="text-xs text-muted-foreground">ISKCON Gambheeram Visakhapatnam</p>
          </div>
        </div>
      </header>
      <div className="mx-auto mt-12 max-w-sm px-4">
        <div className="rounded-3xl border border-vk-100 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-ink">{step === "mobile" ? "Devotee login" : "Enter your code"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "mobile" ? "Use the mobile number registered with the temple. We'll send a code by SMS and WhatsApp." : <>Sent to <strong className="text-ink">+91 {mobile}</strong></>}
          </p>
          {step === "mobile" ? (
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" className="mt-5 h-12 w-full rounded-xl border border-vk-200 px-4 text-base outline-none focus:border-vk-500" />
          ) : (
            <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(e) => e.key === "Enter" && verify()} inputMode="numeric" autoComplete="one-time-code" placeholder="6-digit code" className="mt-5 h-12 w-full rounded-xl border border-vk-200 px-4 text-center text-lg tracking-[0.4em] outline-none focus:border-vk-500" />
          )}
          {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button onClick={step === "mobile" ? send : verify} disabled={busy} className="vk-btn-primary mt-5 h-12 w-full justify-center text-base">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} {step === "mobile" ? "Send code" : "Log in"}
          </button>
          {step === "otp" && (
            <button onClick={() => { setStep("mobile"); setOtp(""); setError(""); }} className="mt-3 w-full text-center text-sm text-vk-700 hover:underline">Change number or resend</button>
          )}
        </div>
      </div>
    </main>
  );
}
