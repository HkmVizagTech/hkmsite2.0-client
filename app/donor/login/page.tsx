"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import { setDonorToken } from "@/lib/donorAuthClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

export default function DonorLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) { clearInterval(timer); return 0; }
          return c - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) {
      setError("Please enter the OTP sent to your WhatsApp.");
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
      router.push("/donor/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fef6e4] px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <h1 className="font-heading text-xl font-bold text-[#772036]">Donor Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "mobile" ? "Enter the mobile number you've donated with." : `Enter the 6-digit code sent to ${mobile} via WhatsApp.`}
          </p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>}

          {step === "mobile" ? (
            <form onSubmit={requestOtp} className="mt-5 space-y-4">
              <Input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                autoFocus
              />
              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                Send OTP via WhatsApp
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="mt-5 space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP"
                maxLength={6}
                autoFocus
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Log In"}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep("mobile")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" /> Change number
                </button>
                <button
                  type="button"
                  disabled={cooldown > 0}
                  onClick={requestOtp as any}
                  className="text-primary disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
