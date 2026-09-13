"use client";

// Preacher's Raise Receipt — records a festival seva donation a preacher
// personally collected (cash/bank/UPI/cheque) on behalf of a donor. Same
// underlying endpoint (POST /donations/manual) as the admin Manual Entry
// tool, so the same DCC sync + WhatsApp receipt pipeline applies — the
// donor gets a real receipt exactly as if an admin had entered it. The
// donor is also automatically linked to (or assigned to) this preacher.
//
// Deliberately simpler than the admin version — no "search existing
// pending donation" mode, since that reconciliation tool needs broader
// donation-list access a preacher isn't granted.

import { useEffect, useRef, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, FileText, UtensilsCrossed, Search, User, X } from "lucide-react";
import AddressForm, { type PrasadamAddress } from "@/components/AddressForm";
import DonorExtrasFields from "@/components/DonorExtrasFields";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const PAYMENT_MODES = [
  { value: "upi", label: "UPI (direct to our VPA)" },
  { value: "bank", label: "Bank Transfer (NEFT/IMPS/RTGS)" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
];

const SEVA_OPTIONS = [
  "General Seva", "Anna Daan Seva", "Gau Seva", "Gita Daan Seva",
  "Square Foot Seva", "Brick Seva", "Vastra & Alankara Seva",
  "Pushpalankara Seva", "Abhisheka Seva", "Tulasi Archana Seva",
  "Makhan Mishri Seva", "Naivedhya Seva", "Sadhu Bhojan Seva",
  "Rama Taraka Yajna", "Panaka Kosambari Seva", "Subhojanam",
  "Janmashtami Seva", "Donations (General)", "Other",
];

const emptyAddress: PrasadamAddress = { street: "", city: "", state: "", pincode: "", country: "India" };

export default function RaiseReceiptTab() {
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ _id: string; donorId: string; name: string; mobile: string; email?: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<{ donorId: string; name: string } | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [result, setResult] = useState<{ receiptNumber?: string; donorId?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMobile, setDonorMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [sevaName, setSevaName] = useState(SEVA_OPTIONS[0]);
  const [otherSevaName, setOtherSevaName] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [note, setNote] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [want80G, setWant80G] = useState(false);
  const [wantPrasadam, setWantPrasadam] = useState(false);
  const [address, setAddress] = useState<PrasadamAddress>(emptyAddress);
  const [sevakName, setSevakName] = useState("");
  const [dob, setDob] = useState("");

  const resetForm = () => {
    setDonorName(""); setDonorEmail(""); setDonorMobile(""); setAmount("");
    setSevaName(SEVA_OPTIONS[0]); setOtherSevaName(""); setPaymentDate(new Date().toISOString().slice(0, 10));
    setUtrNumber(""); setPaymentMode("cash"); setNote("");
    setPanNumber(""); setWant80G(false); setWantPrasadam(false); setAddress(emptyAddress);
    setSevakName(""); setDob("");
    setSearchQuery(""); setSearchResults([]); setSelectedDonor(null);
  };

  // Debounced search-as-you-type against existing donors (by name,
  // mobile digits, or Donor ID) so a repeat donor's details can be
  // pulled in instead of retyped — and so a small mobile-number typo
  // doesn't silently create a duplicate Donor record.
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await authFetch(`${API_URL}/preacher/search-donor?q=${encodeURIComponent(searchQuery.trim())}`, { credentials: "include" });
        const data = await res.json();
        setSearchResults(data.donors || []);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [searchQuery]);

  const selectDonor = (donor: { donorId: string; name: string; mobile: string; email?: string }) => {
    setDonorName(donor.name);
    setDonorMobile(donor.mobile);
    setDonorEmail(donor.email || "");
    setSelectedDonor({ donorId: donor.donorId, name: donor.name });
    setSearchQuery("");
    setSearchResults([]);
  };

  const clearSelectedDonor = () => {
    setSelectedDonor(null);
    setDonorName(""); setDonorMobile(""); setDonorEmail("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!donorName.trim()) return setError("Please enter the donor's name.");
    if (sevaName === "Other" && !otherSevaName.trim()) return setError("Please specify the seva/purpose.");
    if (!amount || Number(amount) <= 0) return setError("Please enter a valid amount.");
    if (!utrNumber.trim()) return setError("Please enter the UTR / reference number.");
    if (!donorMobile.trim()) return setError("Please provide the donor's mobile number.");

    setSubmitting(true);
    try {
      const resolvedSevaName = sevaName === "Other" ? otherSevaName.trim() : sevaName;
      const res = await authFetch(`${API_URL}/donations/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim() || undefined,
          donorMobile: donorMobile.trim(),
          amount: Number(amount),
          sevaName: resolvedSevaName,
          type: resolvedSevaName,
          utrNumber: utrNumber.trim(),
          manualPaymentMode: paymentMode,
          paymentDate,
          manualEntryNote: note.trim() || undefined,
          panNumber: want80G ? panNumber.trim() : undefined,
          certificate: want80G,
          wantPrasadam,
          prasadamAddress: wantPrasadam ? address : undefined,
          sevakName: sevakName.trim() || undefined,
          dob: dob || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to record donation");

      setResult({ receiptNumber: data.donation?.receiptNumber, donorId: data.donation?.donorId });
      resetForm();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Raise a Receipt</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Record a seva donation you personally collected — the donor will be linked to you and
          receive their real receipt via WhatsApp automatically.
        </p>
      </div>

      {result && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-5 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-green-800">Donation recorded successfully.</p>
              <p className="text-green-700 mt-1">
                Receipt: {result.receiptNumber || "syncing…"}
                {result.donorId && <> · Donor ID: {result.donorId}</>}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <form onSubmit={submit}>
        <Card>
          <CardContent className="p-5 space-y-5">
            {/* Search existing donor — optional. Autofills name/mobile/
                email below when picked; otherwise proceed as a new donor. */}
            <div>
              {selectedDonor ? (
                <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{selectedDonor.name}</span>
                    <span className="text-xs text-muted-foreground">({selectedDonor.donorId})</span>
                  </span>
                  <button type="button" onClick={clearSelectedDonor} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <label className="text-sm font-medium">Search existing donor (optional)</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, mobile, or Donor ID"
                      className="pl-9"
                    />
                    {searching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
                  </div>
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                      {searchResults.map((d) => (
                        <button
                          key={d._id}
                          type="button"
                          onClick={() => selectDonor(d)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span>
                            <span className="font-medium">{d.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">{d.mobile}</span>
                          </span>
                          <span className="text-xs text-muted-foreground">{d.donorId}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">Not found? Just fill in the details below for a new donor.</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Donor Name *</label>
                <Input value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className="text-sm font-medium">Amount (₹) *</label>
                <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1001" />
              </div>
              <div>
                <label className="text-sm font-medium">Mobile *</label>
                <Input value={donorMobile} onChange={(e) => setDonorMobile(e.target.value)} placeholder="10-digit mobile" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="Optional" />
              </div>
              <div>
                <label className="text-sm font-medium">Seva / Purpose</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={sevaName}
                  onChange={(e) => setSevaName(e.target.value)}
                >
                  {SEVA_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {sevaName === "Other" && (
                  <Input className="mt-2" value={otherSevaName} onChange={(e) => setOtherSevaName(e.target.value)} placeholder="Specify the seva or purpose" />
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Payment Date</label>
                <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
              </div>
            </div>

            <div className="border-t pt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Payment Mode *</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  {PAYMENT_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">UTR / Reference Number *</label>
                <Input value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} placeholder="e.g. 412345678901" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Note (optional)</label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Collected at Sunday satsang" />
            </div>

            <div className="border-t pt-4 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={want80G} onChange={(e) => setWant80G(e.target.checked)} className="h-4 w-4" />
                <FileText className="h-4 w-4" /> Wants 80G receipt
              </label>
              {want80G && (
                <Input value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} placeholder="PAN Number" maxLength={10} />
              )}
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={wantPrasadam} onChange={(e) => setWantPrasadam(e.target.checked)} className="h-4 w-4" />
                <UtensilsCrossed className="h-4 w-4" /> Wants Maha Prasadam delivery
              </label>
              {wantPrasadam && <AddressForm address={address} setAddress={setAddress} />}
            </div>

            <div className="border-t pt-4">
              <DonorExtrasFields sevakName={sevakName} dob={dob} onSevakNameChange={setSevakName} onDobChange={setDob} collapsible />
            </div>

            <Button type="submit" disabled={submitting} className="gap-2 w-full sm:w-auto">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Record Donation
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
