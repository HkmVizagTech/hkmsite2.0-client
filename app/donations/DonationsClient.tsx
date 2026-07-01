"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Leaf, Mail, Phone, ShieldCheck, Utensils, X } from "lucide-react";

type DonationOption = {
  id: number;
  category: "ANNADAAN" | "GO SEVA";
  title: string;
  amount: number | null;
};

type CheckoutForm = {
  donorName: string;
  donorMobile: string;
  donorEmail: string;
  nationality: "Indian Citizen" | "Foreign Citizen";
  customAmount: string;
  wantPrasadam: boolean;
  want80G: boolean;
  panNumber: string;
  doorNo: string;
  building: string;
  street: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const donationOptions: DonationOption[] = [
  { id: 11, category: "ANNADAAN", title: "Feed 50 people", amount: 1501 },
  { id: 1, category: "ANNADAAN", title: "Feed 100 people", amount: 3001 },
  { id: 2, category: "ANNADAAN", title: "Feed 200 people", amount: 6001 },
  { id: 3, category: "ANNADAAN", title: "Feed 300 people", amount: 9001 },
  { id: 4, category: "ANNADAAN", title: "Feed 500 people", amount: 15001 },
  { id: 5, category: "ANNADAAN", title: "Feed 1000 people", amount: 30001 },
  { id: 6, category: "ANNADAAN", title: "Feed 2000 people", amount: 60001 },
  { id: 7, category: "ANNADAAN", title: "Feed 3000 people", amount: 90001 },
  { id: 8, category: "ANNADAAN", title: "Feed 5000 people", amount: 150000 },
  { id: 9, category: "ANNADAAN", title: "Feed 10,000 people", amount: 300000 },
  { id: 10, category: "ANNADAAN", title: "Donate any other Amount", amount: null },
  { id: 21, category: "GO SEVA", title: "Feed 10 Cows For A Day", amount: 1500 },
  { id: 12, category: "GO SEVA", title: "Medicines For Cow", amount: 2500 },
  { id: 13, category: "GO SEVA", title: "Feed A Cow For A Month", amount: 3500 },
  { id: 14, category: "GO SEVA", title: "Feed 5 Cows For A Week", amount: 5000 },
  { id: 15, category: "GO SEVA", title: "Green Grass For All Cows For A Day", amount: 9000 },
  { id: 16, category: "GO SEVA", title: "Fodder For All Cows For A Day", amount: 15000 },
  { id: 17, category: "GO SEVA", title: "Adopt A Cow For An Year", amount: 40000 },
  { id: 18, category: "GO SEVA", title: "Adopt 3 Cows For An Year", amount: 120000 },
  { id: 19, category: "GO SEVA", title: "Adopt 5 Cows For An Year", amount: 200000 },
  { id: 20, category: "GO SEVA", title: "Donate any other Amount", amount: null },
];

const initialForm: CheckoutForm = {
  donorName: "",
  donorMobile: "",
  donorEmail: "",
  nationality: "Indian Citizen",
  customAmount: "",
  wantPrasadam: false,
  want80G: false,
  panNumber: "",
  doorNo: "",
  building: "",
  street: "",
  area: "",
  pincode: "",
  city: "",
  state: "",
};

const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

const apiBase = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const loadRazorpay = () =>
  new Promise<void>((resolve, reject) => {
    const win = window as unknown as { Razorpay?: RazorpayConstructor };
    if (win.Razorpay) return resolve();

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay"));
    document.body.appendChild(script);
  });

export default function DonationsClient() {
  const [selected, setSelected] = useState<DonationOption | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const annadaan = donationOptions.filter((option) => option.category === "ANNADAAN");
  const goSeva = donationOptions.filter((option) => option.category === "GO SEVA");
  const finalAmount = selected?.amount ?? Number(form.customAmount || 0);
  const showTaxField = finalAmount >= 500;
  const showPrasadamField = finalAmount >= 1000;
  const needsAddress = form.want80G || form.wantPrasadam;

  const selectedSummary = useMemo(() => {
    if (!selected) return "";
    return `${selected.category} - ${selected.title}`;
  }, [selected]);

  const openCheckout = (option: DonationOption) => {
    setSelected(option);
    setForm(initialForm);
    setStatus({ type: "idle", message: "" });
  };

  const closeCheckout = () => {
    if (!submitting) setSelected(null);
  };

  const updateForm = (patch: Partial<CheckoutForm>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const validate = () => {
    if (!selected) return "Please select a seva.";
    if (!finalAmount || finalAmount < 100) return "Amount must be at least Rs.100.";
    if (!form.donorName.trim()) return "Donor name is required.";
    if (!/^[6-9]\d{9}$/.test(form.donorMobile)) return "Please enter a valid 10 digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.donorEmail)) return "Please enter a valid email address.";
    if (form.want80G && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber)) return "Please enter a valid PAN number.";
    if (needsAddress) {
      if (!form.area.trim() || !form.pincode.trim() || !form.city.trim() || !form.state.trim()) {
        return "Please fill address, pincode, city and state.";
      }
      if (!/^\d{6}$/.test(form.pincode)) return "Please enter a valid 6 digit pincode.";
    }
    return "";
  };

  const submitDonation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    if (!selected) return;
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const orderResponse = await fetch(`${apiBase()}/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: "donations",
          sourcePage: "donations",
          type: selected.category,
          sevaName: selected.title,
          name: form.donorName.trim(),
          email: form.donorEmail.trim().toLowerCase(),
          mobile: form.donorMobile,
          amount: finalAmount,
          certificate: form.want80G,
          panNumber: form.want80G ? form.panNumber : undefined,
          mahaprasadam: form.wantPrasadam,
          prasadamAddress: needsAddress
            ? {
                doorNo: form.doorNo,
                house: form.building,
                street: form.street,
                area: form.area,
                country: "India",
                state: form.state,
                city: form.city,
                pincode: form.pincode,
              }
            : null,
        }),
      });

      if (!orderResponse.ok) throw new Error("Unable to create payment order.");
      const order = await orderResponse.json();
      await loadRazorpay();

      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      new win.Razorpay({
        key: order.key,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "Hare Krishna Movement Vizag",
        description: selectedSummary,
        order_id: order.orderId,
        prefill: {
          name: form.donorName,
          email: form.donorEmail,
          contact: form.donorMobile,
        },
        notes: {
          sourcePage: "donations",
          sevaId: selected.id,
          sevaName: selected.title,
          sevaType: selected.category,
          nationality: form.nationality,
        },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyResponse = await fetch(`${apiBase()}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donationId: order.donationId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) throw new Error("Payment verification failed.");
            setStatus({ type: "success", message: "Thank you. Your donation has been received successfully." });
            setSelected(null);
          } catch (verifyError) {
            setStatus({
              type: "error",
              message: verifyError instanceof Error ? verifyError.message : "Payment verification failed.",
            });
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
        theme: {
          color: "#0f3b82",
        },
      }).open();
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Donation could not be completed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderOptions = (options: DonationOption[], accent: "amber" | "green") => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <article key={option.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex min-h-24 flex-col justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">{option.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{option.category}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xl font-bold text-primary">
                {option.amount ? `Rs. ${formatAmount(option.amount)}` : "Custom"}
              </p>
              <Button
                type="button"
                onClick={() => openCheckout(option)}
                className={accent === "amber" ? "bg-amber-500 text-amber-950 hover:bg-amber-400" : "bg-green-600 text-white hover:bg-green-500"}
              >
                Donate Now
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <>
      <main className="bg-gradient-warm">
        <section className="relative min-h-[78vh] overflow-hidden pt-32">
          <Image src="/assets/gallery-annadaan-1.jpg" alt="Annadaan seva" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/25" />
          <div className="container relative z-10 mx-auto px-4 py-20 text-white">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <Utensils className="mr-2 h-4 w-4" />
                Annadaan Seva and Go Seva
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Your open-hearted contribution will make a difference
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/85">
                Support food distribution for hungry and needy people, and help care for cows through daily seva.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-amber-500 text-amber-950 hover:bg-amber-400">
                  <a href="#annadaan">Annadaan</a>
                </Button>
                <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-500">
                  <a href="#goseva">Go Seva</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-10 text-primary-foreground">
          <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
            {[
              ["Daily feeding", "Offer prasadam to devotees and needy people."],
              ["Cow care", "Support fodder, grass and medicines for protected cows."],
              ["80G support", "PAN and address can be captured for eligible receipts."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border border-white/15 bg-white/10 p-5">
                <ShieldCheck className="mb-3 h-6 w-6 text-amber-300" />
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm text-white/80">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="annadaan" className="container mx-auto px-4 py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">We are thankful for your kind gesture</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Annadaan Seva</h2>
            </div>
            <Utensils className="hidden h-10 w-10 text-amber-500 md:block" />
          </div>
          {renderOptions(annadaan, "amber")}
        </section>

        <section id="goseva" className="bg-white/70 py-16 dark:bg-slate-950/30">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">Serve and protect cows</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Go Seva</h2>
              </div>
              <Leaf className="hidden h-10 w-10 text-green-600 md:block" />
            </div>
            {renderOptions(goSeva, "green")}
          </div>
        </section>

        <section className="bg-slate-950 py-12 text-white">
          <div className="container mx-auto grid gap-8 px-4 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Gentle Request</h2>
              <p className="mt-3 text-sm leading-7 text-white/75">
                While doing Paytm, UPI app payments or bank NEFT/RTGS, please send us a screenshot with complete address and PAN details.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <a className="inline-flex items-center gap-2 text-amber-300" href="tel:+919063020108">
                  <Phone className="h-4 w-4" />
                  9063 020 108
                </a>
                <a className="inline-flex items-center gap-2 text-amber-300" href="mailto:social@hkmvizag.org">
                  <Mail className="h-4 w-4" />
                  social@hkmvizag.org
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 p-6">
              <h3 className="text-xl font-bold">Donation Through Bank</h3>
              <p className="mt-4 text-sm leading-7 text-white/80">
                Beneficiary Name: HARE KRISHNA MOVEMENT INDIA<br />
                Bank Name: IDFC FIRST BANK LTD<br />
                A/c No: 10091415313<br />
                IFSC code: IDFB0080412
              </p>
            </div>
          </div>
        </section>
      </main>

      {status.message && !selected && (
        <div className={`fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-lg px-5 py-3 text-sm font-semibold shadow-lg ${
          status.type === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"
        }`}>
          {status.message}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background shadow-elevated">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Donation Checkout</p>
                <h2 className="text-xl font-bold text-foreground">{selected.title}</h2>
              </div>
              <button type="button" onClick={closeCheckout} className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitDonation} className="space-y-5 p-6">
              <div className="grid gap-4 rounded-lg bg-muted p-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Seva Name</p>
                  <p className="mt-1 font-bold text-foreground">{selected.title}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Seva Type</p>
                  <p className="mt-1 font-bold text-foreground">{selected.category}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Seva Amount</p>
                  <p className="mt-1 font-bold text-foreground">
                    {selected.amount ? `Rs. ${formatAmount(selected.amount)}` : "Enter amount"}
                  </p>
                </div>
              </div>

              {!selected.amount && (
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Enter Seva Amount *</span>
                  <Input
                    type="number"
                    min={100}
                    value={form.customAmount}
                    onChange={(event) => updateForm({ customAmount: event.target.value, want80G: false, wantPrasadam: false })}
                    placeholder="Enter amount"
                    className="mt-2"
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">Amount must be at least Rs.100.</span>
                </label>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Donor Name *</span>
                  <Input value={form.donorName} maxLength={39} onChange={(event) => updateForm({ donorName: event.target.value.replace(/[^a-zA-Z ]/g, "") })} placeholder="Your Name" className="mt-2" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Mobile Number *</span>
                  <Input value={form.donorMobile} maxLength={10} onChange={(event) => updateForm({ donorMobile: event.target.value.replace(/\D/g, "") })} placeholder="Your Mobile Number" className="mt-2" />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-foreground">E-Mail ID *</span>
                  <Input type="email" value={form.donorEmail} onChange={(event) => updateForm({ donorEmail: event.target.value.toLowerCase() })} placeholder="Your Email" className="mt-2" />
                </label>
              </div>

              <fieldset className="rounded-lg border border-border p-4">
                <legend className="px-2 text-sm font-semibold text-foreground">Payment Option *</legend>
                <div className="mt-2 flex flex-wrap gap-4">
                  {(["Indian Citizen", "Foreign Citizen"] as const).map((value) => (
                    <label key={value} className="flex items-center gap-2 text-sm text-foreground">
                      <input type="radio" checked={form.nationality === value} onChange={() => updateForm({ nationality: value })} />
                      {value}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-3">
                {showPrasadamField && (
                  <label className="flex items-start gap-3 rounded-lg border border-border p-4 text-sm text-foreground">
                    <input type="checkbox" checked={form.wantPrasadam} onChange={(event) => updateForm({ wantPrasadam: event.target.checked })} className="mt-1" />
                    I would like to receive Maha Prasadam (Only within India)
                  </label>
                )}
                {showTaxField && (
                  <label className="flex items-start gap-3 rounded-lg border border-border p-4 text-sm text-foreground">
                    <input type="checkbox" checked={form.want80G} onChange={(event) => updateForm({ want80G: event.target.checked })} className="mt-1" />
                    <span>
                      I wish to receive 80G Tax Exemption
                      <span className="mt-1 block text-xs text-muted-foreground">PAN and address are mandatory when 80G is selected.</span>
                    </span>
                  </label>
                )}
              </div>

              {form.want80G && (
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">PAN Number *</span>
                  <Input value={form.panNumber} maxLength={10} onChange={(event) => updateForm({ panNumber: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })} placeholder="Eg: ABCDE1234F" className="mt-2" />
                </label>
              )}

              {needsAddress && (
                <div className="grid gap-4 rounded-lg border border-border p-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">House No/Door No</span>
                    <Input value={form.doorNo} maxLength={39} onChange={(event) => updateForm({ doorNo: event.target.value })} className="mt-2" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">House/Apartment/Building Name</span>
                    <Input value={form.building} maxLength={39} onChange={(event) => updateForm({ building: event.target.value })} className="mt-2" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">Street Name</span>
                    <Input value={form.street} maxLength={39} onChange={(event) => updateForm({ street: event.target.value })} className="mt-2" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">Location/Area *</span>
                    <Input value={form.area} maxLength={39} onChange={(event) => updateForm({ area: event.target.value })} className="mt-2" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">PIN Code *</span>
                    <Input value={form.pincode} maxLength={6} onChange={(event) => updateForm({ pincode: event.target.value.replace(/\D/g, "") })} className="mt-2" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">City *</span>
                    <Input value={form.city} maxLength={30} onChange={(event) => updateForm({ city: event.target.value.toUpperCase().replace(/[^A-Z ]/g, "") })} className="mt-2" />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-foreground">State *</span>
                    <Input value={form.state} maxLength={30} onChange={(event) => updateForm({ state: event.target.value.toUpperCase().replace(/[^A-Z ]/g, "") })} className="mt-2" />
                  </label>
                </div>
              )}

              {status.type === "error" && <p className="rounded-lg bg-red-100 px-4 py-3 text-sm font-semibold text-red-700">{status.message}</p>}

              <Button type="submit" disabled={submitting} className="w-full bg-amber-500 py-6 text-base font-bold text-amber-950 hover:bg-amber-400">
                <Heart className="mr-2 h-5 w-5 fill-current" />
                {submitting ? "Opening Checkout..." : `Donate Rs. ${formatAmount(finalAmount || 0)}`}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
