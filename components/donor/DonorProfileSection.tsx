"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, User, CreditCard } from "lucide-react";
import AddressForm, { PrasadamAddress } from "@/components/AddressForm";

interface DonorProfile {
  donorId: string;
  name: string;
  mobile: string;
  email?: string;
  panNumber?: string | null;
  savedAddress?: PrasadamAddress | null;
}

interface Props {
  profile: DonorProfile;
  donorFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  apiUrl: string;
  onSaved: (updated: Partial<DonorProfile>) => void;
}

const BLANK_ADDRESS: PrasadamAddress = { street: "", city: "", state: "", pincode: "", country: "India" };

export default function DonorProfileSection({ profile, donorFetch, apiUrl, onSaved }: Props) {
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [panNumber, setPanNumber] = useState(profile.panNumber || "");
  const [address, setAddress] = useState<PrasadamAddress>(profile.savedAddress || BLANK_ADDRESS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const hasAddress = Boolean(address.street || address.city || address.state || address.pincode);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const res = await donorFetch(`${apiUrl}/donor/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          panNumber,
          address: hasAddress ? address : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not save your profile.");
      onSaved({ name, email, panNumber, savedAddress: hasAddress ? address : null });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      {error && <div role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dp-name" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Full Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
            <input
              type="text"
              id="dp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="vk-input pl-10"
            />
          </div>
        </div>
        <div>
          <p className="mb-1.5 block text-[13px] font-semibold text-ink/80">Mobile Number</p>
          <div className="flex h-11 items-center rounded-xl border border-vk-100 bg-vk-50 px-3.5 text-[15px] text-ink/70">
            +91 {profile.mobile}
          </div>
        </div>
        <div>
          <label htmlFor="dp-email" className="mb-1.5 block text-[13px] font-semibold text-ink/80">Email (optional)</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
            <input
              id="dp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="vk-input pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="dp-pan" className="mb-1.5 block text-[13px] font-semibold text-ink/80">PAN (for 80G certificates)</label>
          <div className="relative">
            <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400" />
            <input
              type="text"
              value={panNumber}
              id="dp-pan"
              onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
              placeholder="ABCDE1234F"
              className="vk-input pl-10 uppercase placeholder:normal-case"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-vk-100 bg-vk-50/60 p-4">
        <p className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">
          <span className="h-1.5 w-1.5 rounded-full bg-vk-500" /> Saved Prasadam Delivery Address
        </p>
        <AddressForm address={address} setAddress={setAddress} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="vk-btn-primary h-11 min-w-[140px] px-6">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
