"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, X } from "lucide-react";

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
  heroEyebrow: "Hare Krishna Movement Vizag",
  heroTitle: "Donate Annadaan and Gau Seva Online",
  heroSubtitle: "Support prasadam distribution and protected cow care with a heartfelt seva offering.",
  bannerImage: "/assets/donations-annadana-real.jpg",
  annadaanImage: "/assets/donations-annadana-real.jpg",
  goSevaImage: "/assets/donations-gau-seva-real.jpeg",
  annadaanTitle: "Annadaan Seva",
  annadaanDescription: "Choose the number of people you would like to feed. Each offering supports prasadam distribution and community service.",
  goSevaTitle: "Gau Seva",
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
    phone: "89777 61187",
    email: "mukunda@hkmvizag.org",
    note: "Gentle Request! While doing Paytm/UPI App Payments or Bank (NEFT/RTGS), please send us a screenshot along with complete address and PAN details.",
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

  const renderOptions = (options: DonationOption[]) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <article
          key={option.id}
          className="flex min-h-[188px] flex-col items-center justify-between border border-[#f0d9a2] bg-white px-5 py-6 text-center shadow-[0_3px_12px_rgba(136,84,10,0.12)]"
        >
          <div>
            <h3 className="text-[18px] font-semibold leading-snug text-[#30241d]">{option.title}</h3>
            <p className="mt-4 min-h-7 text-[20px] font-bold text-[#c02218]">
              {option.amount ? `Rs. ${formatAmount(option.amount)}` : ""}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => openCheckout(option)}
            className="mt-5 h-11 rounded-none bg-[#f4bd16] px-8 text-[13px] font-bold uppercase tracking-wide text-[#2c2109] shadow-none hover:bg-[#e9ac08]"
          >
            Donate Now
          </Button>
        </article>
      ))}
    </div>
  );

  return (
    <>
      <main className="bg-[#fff7e5] text-[#30241d]">
        <section className="bg-[#fff7e5] pt-8">
          <div className="mx-auto max-w-6xl px-4">
            <img src={settings.bannerImage} alt="Donation banner" className="h-auto w-full border border-[#f1d99d] object-cover shadow-[0_5px_18px_rgba(117,72,12,0.16)]" />
          </div>
          <div className="mx-auto max-w-5xl px-4 py-9 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#9b1d15]">{settings.heroEyebrow}</p>
            <h1 className="text-4xl font-extrabold leading-tight text-[#3d2a17] md:text-6xl">{settings.heroTitle}</h1>
            <h2 className="mx-auto mt-4 max-w-3xl text-xl font-semibold leading-8 text-[#7b3f17] md:text-2xl">{settings.heroSubtitle}</h2>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <a href="#annadaan" className="inline-flex h-12 min-w-40 items-center justify-center bg-[#f4bd16] px-8 text-sm font-bold uppercase tracking-wide text-[#2c2109] hover:bg-[#e9ac08]">
                Annadaan
              </a>
              <a href="#goseva" className="inline-flex h-12 min-w-40 items-center justify-center bg-[#f4bd16] px-8 text-sm font-bold uppercase tracking-wide text-[#2c2109] hover:bg-[#e9ac08]">
                Go Seva
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white py-8">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-5 md:grid-cols-2">
              <img src={settings.annadaanImage} alt="Annadaan seva" className="h-64 w-full border border-[#f1d99d] object-cover" />
              <img src={settings.goSevaImage} alt="Gau seva" className="h-64 w-full border border-[#f1d99d] object-cover" />
            </div>
          </div>
        </section>

        <section id="annadaan" className="bg-[#fff7e5] py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-bold text-[#3d2a17] md:text-4xl">We are thankful for your kind gesture!</h2>
            <h3 className="mt-9 bg-[#f4bd16] px-5 py-4 text-center text-2xl font-extrabold uppercase tracking-wide text-[#3d2a17]">
              {settings.annadaanTitle}
            </h3>
            <p className="mx-auto mt-5 max-w-4xl text-center text-base leading-7 text-[#6e4a2f]">{settings.annadaanDescription}</p>
            <div className="mt-8">{renderOptions(annadaan)}</div>
          </div>
        </section>

        <section id="goseva" className="bg-[#fff7e5] pb-14">
          <div className="mx-auto max-w-6xl px-4">
            <h3 className="bg-[#f4bd16] px-5 py-4 text-center text-2xl font-extrabold uppercase tracking-wide text-[#3d2a17]">
              {settings.goSevaTitle}
            </h3>
            <p className="mx-auto mt-5 max-w-4xl text-center text-base leading-7 text-[#6e4a2f]">{settings.goSevaDescription}</p>
            <div className="mt-8">{renderOptions(goSeva)}</div>
          </div>
        </section>

        <section className="border-y border-[#e9cf90] bg-white py-10">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-base font-semibold leading-8 text-[#4a3422]">
              {settings.contact.note} You may also call on this number for other queries:{" "}
              <a className="font-bold text-[#b82017]" href={`tel:${phoneHref}`}>+91 {settings.contact.phone}</a>{" "}
              or mail{" "}
              <a className="font-bold text-[#b82017]" href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>.
            </p>
            <div className="mt-8 max-w-3xl">
              <h3 className="text-xl font-bold text-[#3d2a17]">Donation Through Bank (NEFT/ RTGS)</h3>
              <p className="mt-4 text-base leading-8 text-[#4a3422]">
                Beneficiary Name : {settings.bankDetails.beneficiaryName}<br />
                Bank Name: {settings.bankDetails.bankName}<br />
                A/c No: {settings.bankDetails.accountNumber}<br />
                IFSC code: {settings.bankDetails.ifsc}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fff7e5] py-10">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-2">
            <img src={settings.annadaanImage} alt="Annadaan supporters" className="h-72 w-full border border-[#f1d99d] object-cover" />
            <img src={settings.goSevaImage} alt="Gau seva supporters" className="h-72 w-full border border-[#f1d99d] object-cover" />
          </div>
        </section>

        <section className="bg-[#2f2118] py-12 text-white">
          <div className="mx-auto grid max-w-6xl gap-9 px-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold uppercase text-[#f4bd16]">About Us</h3>
              <p className="mt-4 text-sm leading-7 text-white/75">
                We are trying to give human society an opportunity for a life of happiness, good health, peace of mind and good qualities through God Consciousness.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase text-[#f4bd16]">Social Connect</h3>
              <div className="mt-4 flex flex-col gap-2 text-sm text-white/75">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f4bd16]">Facebook</a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f4bd16]">YouTube</a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f4bd16]">Instagram</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase text-[#f4bd16]">Address</h3>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Sri Radha Madan Mohan Mandir<br />
                Hare Krishna Movement<br />
                IIM Rd, opp. Akshaya Patra Foundation,<br />
                Gambhiram, Visakhapatnam,<br />
                Andhra Pradesh 531163
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase text-[#f4bd16]">Contact Info</h3>
              <div className="mt-4 flex flex-col gap-2 text-sm text-white/75">
                <a href={`tel:${phoneHref}`} className="hover:text-[#f4bd16]">+91 {settings.contact.phone}</a>
                <a href={`mailto:${settings.contact.email}`} className="hover:text-[#f4bd16]">{settings.contact.email}</a>
                <a href={`https://wa.me/${phoneHref.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#f4bd16]">
                  WhatsApp {settings.contact.phone}
                </a>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-4 pt-6 text-center text-xs text-white/55">
            Copyright &copy; 2026 Hare Krishna Movement India.
          </p>
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
