"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, HandHeart, Heart, IndianRupee, Leaf, Mail, Phone, ShieldCheck, Utensils, X } from "lucide-react";

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

type DonationPageSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  bannerImage: string;
  annadaanImage: string;
  goSevaImage: string;
  annadaanTitle: string;
  annadaanDescription: string;
  goSevaTitle: string;
  goSevaDescription: string;
  donationOptions: DonationOption[];
  impactItems: Array<{ title: string; text: string }>;
  bankDetails: {
    beneficiaryName: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
  };
  contact: {
    phone: string;
    email: string;
    note: string;
  };
};

const defaultDonationOptions: DonationOption[] = [
  { id: 101, category: "ANNADAAN", title: "Offer Annadaan Seva", amount: 251 },
  { id: 102, category: "ANNADAAN", title: "Support Annadaan Seva", amount: 500 },
  { id: 103, category: "ANNADAAN", title: "Sponsor Annadaan Seva", amount: 1000 },
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
  { id: 201, category: "GO SEVA", title: "Offer Gau Seva", amount: 251 },
  { id: 202, category: "GO SEVA", title: "Support Gau Seva", amount: 500 },
  { id: 203, category: "GO SEVA", title: "Sponsor Gau Seva", amount: 1000 },
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

const defaultSettings: DonationPageSettings = {
  heroEyebrow: "Annadaan Seva and Go Seva",
  heroTitle: "Serve prasadam. Protect cows. Offer with devotion.",
  heroSubtitle: "Continue the trusted Hare Krishna Vizag donation flow with a clearer seva experience for devotees.",
  bannerImage: "/assets/donations-annadana-real.jpg",
  annadaanImage: "/assets/donations-annadana-real.jpg",
  goSevaImage: "/assets/donations-gau-seva-real.jpeg",
  annadaanTitle: "Annadaan Seva",
  annadaanDescription: "Choose the number of people you would like to feed. Each offering supports prasadam distribution and community service.",
  goSevaTitle: "Go Seva",
  goSevaDescription: "Support daily care for cows through food, medicines, green grass and yearly adoption sevas.",
  donationOptions: defaultDonationOptions,
  impactItems: [
    { title: "Daily prasadam", text: "Offer food with dignity, devotion and care." },
    { title: "Protected cow care", text: "Support fodder, grass and medical needs." },
    { title: "Secure checkout", text: "Razorpay payment with receipt-ready donor details." },
  ],
  bankDetails: {
    beneficiaryName: "HARE KRISHNA MOVEMENT INDIA",
    bankName: "IDFC FIRST BANK LTD",
    accountNumber: "10091415313",
    ifsc: "IDFB0080412",
  },
  contact: {
    phone: "9063 020 108",
    email: "social@hkmvizag.org",
    note: "While doing Paytm, UPI app payments or bank NEFT/RTGS, please send us a screenshot with complete address and PAN details.",
  },
};

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
  const [settings, setSettings] = useState<DonationPageSettings>(defaultSettings);

  const donationOptions = settings.donationOptions.length ? settings.donationOptions : defaultDonationOptions;
  const annadaan = donationOptions.filter((option) => option.category === "ANNADAAN");
  const goSeva = donationOptions.filter((option) => option.category === "GO SEVA");
  const finalAmount = selected?.amount ?? Number(form.customAmount || 0);
  const showTaxField = finalAmount >= 500;
  const showPrasadamField = finalAmount >= 1000;
  const needsAddress = form.want80G || form.wantPrasadam;
  const phoneDigits = settings.contact.phone.replace(/\D/g, "");
  const phoneHref = phoneDigits.startsWith("91") ? `+${phoneDigits}` : `+91${phoneDigits}`;

  const selectedSummary = useMemo(() => {
    if (!selected) return "";
    return `${selected.category} - ${selected.title}`;
  }, [selected]);

  useEffect(() => {
    let active = true;
    fetch(`${apiBase()}/donation-page`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.page) return;
        setSettings({
          ...defaultSettings,
          ...data.page,
          bankDetails: { ...defaultSettings.bankDetails, ...(data.page.bankDetails || {}) },
          contact: { ...defaultSettings.contact, ...(data.page.contact || {}) },
          impactItems: Array.isArray(data.page.impactItems) && data.page.impactItems.length ? data.page.impactItems : defaultSettings.impactItems,
          donationOptions: Array.isArray(data.page.donationOptions) && data.page.donationOptions.length ? data.page.donationOptions : defaultDonationOptions,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {options.map((option) => (
        <article
          key={option.id}
          className={`group rounded-lg border bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-elevated dark:bg-slate-950 ${
            accent === "amber" ? "border-amber-200/80" : "border-emerald-200/80"
          }`}
        >
          <div className="flex min-h-36 flex-col justify-between gap-5">
            <div>
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                accent === "amber" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {accent === "amber" ? <Utensils className="h-5 w-5" /> : <Leaf className="h-5 w-5" />}
              </div>
              <h3 className="text-base font-bold leading-snug text-foreground">{option.title}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{option.category}</p>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-lg font-bold text-primary">
                {option.amount ? `Rs. ${formatAmount(option.amount)}` : "Custom"}
              </p>
              <Button
                type="button"
                onClick={() => openCheckout(option)}
                className={`h-10 rounded-lg px-3 text-sm font-bold ${
                  accent === "amber" ? "bg-amber-500 text-amber-950 hover:bg-amber-400" : "bg-emerald-600 text-white hover:bg-emerald-500"
                }`}
              >
                Donate Now <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <>
      <main className="bg-[#fff8ec]">
        <section className="relative overflow-hidden bg-slate-950 pt-28 text-white">
          <div className="absolute inset-0">
            <img src={settings.bannerImage} alt="Donation banner" className="h-full w-full object-cover opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/35" />
          </div>
          <div className="container relative z-10 mx-auto grid min-h-[680px] items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <HandHeart className="mr-2 h-4 w-4 text-amber-300" />
                {settings.heroEyebrow}
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                {settings.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
                {settings.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-lg bg-amber-500 text-amber-950 hover:bg-amber-400">
                  <a href="#annadaan">Offer Annadaan</a>
                </Button>
                <Button asChild size="lg" className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">
                  <a href="#goseva">Offer Go Seva</a>
                </Button>
              </div>
              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                {[
                  ["21", "seva options"],
                  ["80G", "details supported"],
                  ["Rs.100", "minimum custom seva"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-bold text-amber-300">{value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/65">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [settings.annadaanImage, "Annadaan", "Sponsor freshly served prasadam for devotees and needy people."],
                [settings.goSevaImage, "Go Seva", "Support fodder, medicines and daily care for protected cows."],
              ].map(([src, title, text]) => (
                <article key={title} className="overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-2xl backdrop-blur">
                  <div className="relative aspect-[4/3]">
                    <img src={src} alt={title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/75">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-amber-200/70 bg-white py-8 dark:bg-slate-950">
          <div className="container mx-auto grid gap-4 px-4 md:grid-cols-3">
            {[
              ...settings.impactItems,
            ].slice(0, 3).map(({ title, text }) => (
              <div key={title} className="flex items-start gap-4 rounded-lg border border-amber-100 bg-amber-50/60 p-5 dark:border-slate-800 dark:bg-slate-900">
                <CheckCircle2 className="mt-0.5 h-6 w-6 flex-none text-emerald-600" />
                <div>
                  <h2 className="text-base font-bold text-foreground">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="annadaan" className="container mx-auto px-4 py-16">
          <div className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-elevated">
              <img src={settings.annadaanImage} alt="Annadaan prasadam distribution" className="h-full w-full object-cover" />
            </div>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">We are thankful for your kind gesture</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">{settings.annadaanTitle}</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {settings.annadaanDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                {["Feed 50 to 10,000 people", "Custom amount available", "Prasadam option above Rs.1000"].map((item) => (
                  <span key={item} className="rounded-lg border border-amber-200 bg-white px-3 py-2 font-semibold text-amber-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {renderOptions(annadaan, "amber")}
        </section>

        <section id="goseva" className="bg-[#eef9f0] py-16 dark:bg-slate-950/30">
          <div className="container mx-auto px-4">
            <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Serve and protect cows</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground md:text-5xl">{settings.goSevaTitle}</h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {settings.goSevaDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  {["Daily care", "Fodder and grass", "Adoption sevas"].map((item) => (
                    <span key={item} className="rounded-lg border border-emerald-200 bg-white px-3 py-2 font-semibold text-emerald-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-elevated">
                <img src={settings.goSevaImage} alt="Go seva cow care" className="h-full w-full object-cover" />
              </div>
            </div>
            {renderOptions(goSeva, "green")}
          </div>
        </section>

        <section className="bg-slate-950 py-14 text-white">
          <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Offline donation support</p>
              <h2 className="mt-2 text-3xl font-bold">Gentle Request</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                {settings.contact.note}
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <a className="inline-flex items-center gap-2 text-amber-300" href={`tel:${phoneHref}`}>
                  <Phone className="h-4 w-4" />
                  {settings.contact.phone}
                </a>
                <a className="inline-flex items-center gap-2 text-amber-300" href={`mailto:${settings.contact.email}`}>
                  <Mail className="h-4 w-4" />
                  {settings.contact.email}
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/10 p-5">
                <IndianRupee className="mb-3 h-6 w-6 text-amber-300" />
                <h3 className="text-lg font-bold">Donation Through Bank</h3>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  Beneficiary Name: {settings.bankDetails.beneficiaryName}<br />
                  Bank Name: {settings.bankDetails.bankName}<br />
                  A/c No: {settings.bankDetails.accountNumber}<br />
                  IFSC code: {settings.bankDetails.ifsc}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 p-5">
                <ShieldCheck className="mb-3 h-6 w-6 text-emerald-300" />
                <h3 className="text-lg font-bold">Receipt Details</h3>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  Donor name, mobile, email, PAN and address are collected where required for follow-up and receipt support.
                </p>
              </div>
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
