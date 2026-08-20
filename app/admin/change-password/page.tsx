"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authClient";
import { useAuth } from "@/contexts/AuthContext";

export default function ChangePasswordPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const forced = !!user?.mustChangePassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch(`${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "")}/users/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      // Password changed — log out and require a fresh login with the new
      // password, rather than trying to patch mustChangePassword in the
      // live session state (simpler, and guarantees a clean session).
      await logout();
      router.push("/admin/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-3xl font-bold">
            {forced ? "Set Your Password" : "Change Password"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {forced
              ? "For security, please set your own password before continuing."
              : "Update your account password."}
          </p>
        </div>
        <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {forced ? "Password you were given" : "Current Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10" required minLength={8} placeholder="At least 8 characters" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" required minLength={8} />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
