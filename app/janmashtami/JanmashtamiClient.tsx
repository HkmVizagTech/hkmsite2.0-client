"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Mail, MessageCircle, Phone, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SevaOption = {
  legacySevaId: number;
  label: string;
  amount: number | null;
};

type Seva = {
  slug: string;
  title: string;
  description: string;
  image: string;
  options: SevaOption[];
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

type SelectedOffering = {
  seva: Seva;
  option: SevaOption;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const banners = [
  {
    desktop: "/assets/janmashtami-skj25_1.webp",
    mobile: "/assets/janmashtami-skj25_m1.webp",
    alt: "Sri Krishna Janmashtami celebrations at Hare Krishna Movement Vizag",
  },
  {
    desktop: "/assets/janmashtami-skj25_2.webp",
    mobile: "/assets/janmashtami-skj25_m2.webp",
    alt: "Offer sevas for Sri Krishna Janmashtami at HKM Vizag",
  },
];

const sevas: Seva[] = [
  {
    slug: "annadana",
    title: "Annadana Seva",
    description: "Sponsor Anna-Daan to all the temple visitors in the name of your family or loved ones.",
    image: "/assets/janmashtami-sk1.webp",
    options: [
      { legacySevaId: 186, label: "Donate Rs. 15,001", amount: 15001 },
      { legacySevaId: 187, label: "Donate Rs. 9,001", amount: 9001 },
      { legacySevaId: 188, label: "Donate Rs. 6,001", amount: 6001 },
      { legacySevaId: 189, label: "Donate Rs. 3,001", amount: 3001 },
      { legacySevaId: 190, label: "Donate Rs. 1,501", amount: 1501 },
      { legacySevaId: 191, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "makhan-mishri",
    title: "Makhan Mishri Seva",
    description: "Receive the special blessings of Makhan Lal by sponsoring His very favourite Makhan Mishri.",
    image: "/assets/janmashtami-sk5.webp",
    options: [
      { legacySevaId: 192, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 193, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 194, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 195, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 196, label: "Donate Rs. 501", amount: 501 },
      { legacySevaId: 197, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "go-seva",
    title: "Go Seva",
    description: "Offer Gau Poshana Seva to protect and nourish the cows residing at our goshala.",
    image: "/assets/janmashtami-sk4.webp",
    options: [
      { legacySevaId: 198, label: "Donate Rs. 9,001", amount: 9001 },
      { legacySevaId: 199, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 200, label: "Donate Rs. 3,501", amount: 3501 },
      { legacySevaId: 201, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 202, label: "Donate Rs. 1,501", amount: 1501 },
      { legacySevaId: 203, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "abhisheka",
    title: "Abhisheka Seva",
    description: "Sponsor for a grand abhishekam for Radha Krishna on this auspicious day to welcome the Supreme Lord.",
    image: "/assets/janmashtami-sk3.webp",
    options: [
      { legacySevaId: 204, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 205, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 206, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 207, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 208, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 209, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "tulasi-archana",
    title: "Tulasi Archana Seva",
    description: "Sponsor a grand Archana for Radha Krishna on this auspicious day to welcome the Supreme Lord.",
    image: "/assets/janmashtami-sk6.webp",
    options: [
      { legacySevaId: 210, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 211, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 212, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 213, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 214, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 215, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "pushpalankara",
    title: "Pushpalankara Seva",
    description: "Sponsor a grand Garland for Radha Krishna on this auspicious day to welcome the Supreme Lord.",
    image: "/assets/janmashtami-sk2.webp",
    options: [
      { legacySevaId: 216, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 217, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 218, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 219, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 220, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 221, label: "Donate Any Other Amount", amount: null },
    ],
  },
];

const galleryImages = [
  "/assets/janmashtami-a75.webp",
  "/assets/janmashtami-a2.webp",
  "/assets/janmashtami-a3.webp",
  "/assets/janmashtami-a4.webp",
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

const apiBase = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");
const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

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

export default function JanmashtamiClient() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selected, setSelected] = useState<SelectedOffering | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" });

  const finalAmount = selected?.option.amount ?? Number(form.customAmount || 0);
  const showTaxField = finalAmount >= 500;
  const showPrasadamField = finalAmount >= 1000;
  const needsAddress = form.want80G || form.wantPrasadam;

  const selectedSummary = useMemo(() => {
    if (!selected) return "";
    return `${selected.seva.title} - ${selected.option.label}`;
  }, [selected]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % banners.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const updateForm = (patch: Partial<CheckoutForm>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const openCheckout = (seva: Seva, option: SevaOption) => {
    setSelected({ seva, option });
    setForm(initialForm);
    setStatus({ type: "idle", message: "" });
  };

  const closeCheckout = () => {
    if (!submitting) setSelected(null);
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
          sourcePage: "janmashtami",
          festivalSlug: "janmashtami",
          type: "Sri Krishna Janmashtami",
          sevaName: selected.seva.title,
          legacySevaId: selected.option.legacySevaId,
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
          sourcePage: "janmashtami",
          festivalSlug: "janmashtami",
          legacySevaId: selected.option.legacySevaId,
          sevaName: selected.seva.title,
          sevaOption: selected.option.label,
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
            setSelected(null);
            setStatus({ type: "success", message: "Thank you. Your Janmashtami seva has been received successfully." });
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
          color: "#772036",
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

  const moveSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + banners.length) % banners.length);
  };

  return (
    <main className="min-h-screen bg-[#fff8e7] text-slate-950">
      <section className="relative overflow-hidden bg-[#130922]">
        <div className="relative">
          {banners.map((banner, index) => (
            <a
              key={banner.desktop}
              href="#offer-seva"
              className={`block transition-opacity duration-700 ${index === activeSlide ? "relative opacity-100" : "absolute inset-0 opacity-0"}`}
              aria-hidden={index !== activeSlide}
            >
              <picture>
                <source media="(max-width: 640px)" srcSet={banner.mobile} />
                <img src={banner.desktop} alt={banner.alt} className="h-auto w-full" />
              </picture>
            </a>
          ))}
          <button
            type="button"
            onClick={() => moveSlide(-1)}
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-black/55 md:flex"
            aria-label="Previous banner"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => moveSlide(1)}
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-black/55 md:flex"
            aria-label="Next banner"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#201244,#5b1733_58%,#8d4412)] px-4 py-10 text-white md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#ffd96f]">Hare Krishna Movement Vizag</p>
            <h1 className="text-3xl font-bold leading-tight text-[#ffdb68] md:text-5xl">Sri Krishna Janmashtami</h1>
            <p className="mt-5 max-w-4xl text-base leading-8 text-white/92 md:text-lg">
              This Janmashtami, on the 15th & 16th of August, join the grand celebrations at HKM Vizag.
              Donate towards any of the sevas listed and receive special prasadam and the unlimited blessings of Lord Krishna.
            </p>
            <p className="mt-5 max-w-4xl border-l-4 border-[#ffdb68] pl-4 text-sm font-medium italic leading-7 text-white/90 md:text-base">
              "Whatever you do, whatever you eat, whatever you offer or give away... do that as an offering to Me." - Bhagavad-gita 9.27
            </p>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#ffdb68]" />
              <div>
                <h2 className="text-lg font-bold text-white">Secure Seva Offering</h2>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Uses the existing festival Razorpay account and preserves the legacy Janmashtami seva IDs from the old website.
                </p>
              </div>
            </div>
            <a
              href="#offer-seva"
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#ffcc3d] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#3b1605] shadow-lg transition hover:bg-[#ffd96f]"
            >
              Offer Seva
            </a>
          </div>
        </div>
      </section>

      <section id="offer-seva" className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a3a18]">Choose Your Offering</p>
            <h2 className="mt-2 text-3xl font-bold text-[#331447] md:text-4xl">Janmashtami Sevas</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sevas.map((seva) => (
              <article key={seva.slug} className="overflow-hidden rounded-lg bg-white shadow-[0_16px_45px_rgba(68,31,17,0.16)] ring-1 ring-amber-900/10">
                <img src={seva.image} alt={seva.title} className="h-56 w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-5">
                  <h3 className="text-2xl font-bold text-[#331447]">{seva.title}</h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{seva.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {seva.options.map((option) => (
                      <button
                        key={option.legacySevaId}
                        type="button"
                        onClick={() => openCheckout(seva, option)}
                        className={`rounded-md bg-[#ffc928] px-3 py-3 text-sm font-bold text-[#3a1905] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffdb68] hover:shadow-md ${
                          option.amount ? "" : "col-span-2"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080808] px-4 py-7 text-white">
        <div className="mx-auto max-w-6xl text-sm leading-7 md:text-base">
          Gentle Request! While doing Paytm/UPI App Payments or Bank (NEFT/ RTGS), please send us a screenshot along with complete address and PAN details on our Whatsapp Number{" "}
          <a className="font-bold text-[#ffdb68]" href="tel:+919063020108">+91 9063 020 108</a> or to our mail ID{" "}
          <a className="font-bold text-[#ffdb68]" href="mailto:social@hkmvizag.org">social@hkmvizag.org</a>. You may also call on this number for other queries.
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-lg border border-amber-900/15 bg-white p-6 shadow-[0_14px_35px_rgba(68,31,17,0.12)]">
          <h2 className="text-xl font-bold text-[#331447]">Donation Through Bank (NEFT/ RTGS)</h2>
          <p className="mt-4 leading-8 text-slate-700">
            Beneficiary Name : HARE KRISHNA MOVEMENT INDIA<br />
            Bank Name: IDFC FIRST BANK LTD<br />
            A/c No: 10091415313<br />
            IFSC code: IDFB0080412
          </p>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          {galleryImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Sri Krishna Janmashtami seva activity ${index + 1}`}
              className="h-full min-h-[220px] w-full rounded-lg object-cover shadow-[0_12px_32px_rgba(68,31,17,0.14)]"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </section>

      <footer className="bg-[#151515] px-4 py-10 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-[#ffdb68]">ABOUT US</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">
              We are trying to give human society an opportunity for a life of happiness, good health, peace of mind and all good qualities through God Consciousness.
            </p>
            <h3 className="mt-6 text-lg font-bold text-[#ffdb68]">SOCIAL CONNECT</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
              <a className="rounded-md bg-white/10 px-3 py-2 hover:bg-white/20" href="https://www.facebook.com/hkm.vizag" target="_blank" rel="noreferrer">Facebook</a>
              <a className="rounded-md bg-white/10 px-3 py-2 hover:bg-white/20" href="https://www.youtube.com/user/harekrishnavizag" target="_blank" rel="noreferrer">YouTube</a>
              <a className="rounded-md bg-white/10 px-3 py-2 hover:bg-white/20" href="https://www.instagram.com/hare_krishna_vizag/" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#ffdb68]">NAVIGATION</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li><a className="hover:text-white" href="/about">Hare Krishna Movement</a></li>
              <li><a className="hover:text-white" href="/contact">Contact Us</a></li>
              <li><a className="hover:text-white" href="/subhojanam">Subhojanam</a></li>
              <li><a className="hover:text-white" href="https://www.harekrishnavizag.org/terms_and_conditions">Terms & Conditions</a></li>
              <li><a className="hover:text-white" href="https://www.harekrishnavizag.org/cancellation_and_refund_policy">Refund Policy</a></li>
              <li><a className="hover:text-white" href="https://www.harekrishnavizag.org/privacy_policy">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#ffdb68]">ADDRESS</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">
              <strong className="text-white">Sri Nitai Gauranga Mandir</strong><br />
              Hare Krishna Movement<br />
              1-57/45, Plot No 45,<br />
              Chaya Kutir Apartment, Sandipini Nagar,<br />
              Endada, Visakhapatnam,<br />
              Andhra Pradesh 530045
            </p>
          </div>
          <div>
            <img src="/assets/janmashtami-hkv_logo.webp" alt="Hare Krishna Movement Vizag" className="h-auto w-36" loading="lazy" decoding="async" />
            <h3 className="mt-6 text-lg font-bold text-[#ffdb68]">CONTACT INFO</h3>
            <ul className="mt-3 space-y-3 text-sm text-white/75">
              <li><a className="flex items-center gap-2 hover:text-white" href="tel:+919063020108"><Phone className="h-4 w-4" /> 9063 020 108</a></li>
              <li><a className="flex items-center gap-2 hover:text-white" href="mailto:social@hkmvizag.org"><Mail className="h-4 w-4" /> social@hkmvizag.org</a></li>
              <li><a className="flex items-center gap-2 hover:text-white" href="https://wa.me/919063020108" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp 9063 020 108</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-5 text-sm text-white/60">
          Copyright &copy; 2026 Hare Krishna Vizag.
        </div>
      </footer>

      <a
        href="https://wa.me/919063020108"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#19b05f] text-sm font-black text-white shadow-2xl transition hover:scale-105"
        aria-label="Contact Janmashtami seva team on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {status.message && !selected && (
        <div className={`fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-lg px-5 py-3 text-sm font-semibold shadow-lg ${
          status.type === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"
        }`}>
          {status.message}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background shadow-elevated">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Janmashtami Checkout</p>
                <h2 className="text-xl font-bold text-foreground">{selected.seva.title}</h2>
              </div>
              <button type="button" onClick={closeCheckout} className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Close checkout">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitDonation} className="space-y-5 p-6">
              <div className="grid gap-4 rounded-lg bg-muted p-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Seva Name</p>
                  <p className="mt-1 font-bold text-foreground">{selected.seva.title}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Legacy Seva ID</p>
                  <p className="mt-1 font-bold text-foreground">{selected.option.legacySevaId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Seva Amount</p>
                  <p className="mt-1 font-bold text-foreground">
                    {selected.option.amount ? `Rs. ${formatAmount(selected.option.amount)}` : "Enter amount"}
                  </p>
                </div>
              </div>

              {!selected.option.amount && (
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

              <Button type="submit" disabled={submitting} className="w-full bg-[#ffc928] py-6 text-base font-bold text-[#3a1905] hover:bg-[#ffdb68]">
                <Heart className="mr-2 h-5 w-5 fill-current" />
                {submitting ? "Opening Checkout..." : `Donate Rs. ${formatAmount(finalAmount || 0)}`}
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
