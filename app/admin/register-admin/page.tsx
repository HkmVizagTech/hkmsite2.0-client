"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, AlertCircle, ShieldAlert } from "lucide-react";
import { authFetch } from "@/lib/authClient";

const CONFIRM_PHRASE = "CREATE ADMIN";

export default function RegisterFullAdmin() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.confirm !== CONFIRM_PHRASE) {
      setError(`Please type "${CONFIRM_PHRASE}" exactly to confirm.`);
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch(`${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "")}/users/register-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create admin account");
      setSuccess(`Admin account created for ${form.name} (${form.email}). They can log in now.`);
      setForm({ name: "", email: "", password: "", confirm: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold">Add a Full Admin</h1>
          <p className="text-muted-foreground mt-2">
            This account will have the same complete access you do — every admin page, every donation record,
            every setting. Only use this for someone you fully trust with that level of access.
          </p>
        </div>
        <div className="bg-card rounded-2xl shadow-elevated p-8 border-2 border-red-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="text-sm bg-green-50 text-green-700 p-3 rounded-lg">{success}</div>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input name="email" type="email" placeholder="them@example.com" value={form.email} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input name="password" type="password" placeholder="At least 8 characters" value={form.password} onChange={handleChange} className="pl-10" required minLength={8} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-red-700">
                Type <span className="font-mono font-bold">{CONFIRM_PHRASE}</span> to confirm
              </label>
              <Input
                name="confirm"
                placeholder={CONFIRM_PHRASE}
                value={form.confirm}
                onChange={handleChange}
                className="border-red-300 focus-visible:ring-red-400"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" size="lg" disabled={loading}>
              {loading ? "Creating..." : "Create Full Admin Account"}
            </Button>
          </form>
        </div>
        <p className="text-xs text-center mt-4 text-muted-foreground">
          Adding a Standard, Donations Admin, or Blog Manager account instead? Use{" "}
          <button onClick={() => router.push("/admin/register")} className="underline">the regular staff form</button>.
        </p>
      </motion.div>
    </div>
  );
}
