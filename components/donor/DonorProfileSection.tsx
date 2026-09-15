"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
          <div className="relative flex items-center rounded-lg border border-border bg-background focus-within:border-gold">
            <User className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Mobile Number</label>
          <div className="flex h-10 items-center rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground">
            +91 {profile.mobile}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Email (optional)</label>
          <div className="relative flex items-center rounded-lg border border-border bg-background focus-within:border-gold">
            <Mail className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">PAN (for 80G certificates)</label>
          <div className="relative flex items-center rounded-lg border border-border bg-background focus-within:border-gold">
            <CreditCard className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
              placeholder="ABCDE1234F"
              className="h-10 w-full bg-transparent pl-9 pr-3 text-sm uppercase text-foreground outline-none placeholder:normal-case"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background/60 p-4">
        <p className="mb-3 text-xs font-semibold text-foreground">Saved Prasadam Delivery Address</p>
        <AddressForm address={address} setAddress={setAddress} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
