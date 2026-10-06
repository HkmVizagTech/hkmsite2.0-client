"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Clock, Copy, Facebook, FileCheck2, Heart, Instagram, Mail, MessageCircle, Phone, Plus, ShieldCheck, User, Youtube, UtensilsCrossed, X } from "lucide-react";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { useDonorPrefill } from "@/lib/donorPrefill";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import JanmashtamiGallery from "@/components/JanmashtamiGallery";
import JanmashtamiImportanceSection from "@/components/janmashtami/JanmashtamiImportanceSection";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useAttribution } from "@/lib/useAttribution";
import { prefillEmail } from "@/lib/razorpayPrefill";

type SevaOption = {
  legacySevaId: number;
  label: string;
  amount: number | null;
  subtitle?: string;
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
  sevakName: string;
  dob: string;
};

type SelectedOffering = {
  seva: Seva;
  option: SevaOption;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const banners = [
  {
    desktop: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1787055655171-1787055654678-janmashtami2banner.webp",
    mobile: "/assets/janmashtami-skj26_m1.webp",
    alt: "Sri Krishna Janmashtami celebrations at ISKCON Gambheeram Visakhapatnam",
  },
  {
    desktop: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1787055656278-1787055654943-janmashtami2banner2.webp",
    mobile: "/assets/janmashtami-skj26_m2.webp",
    alt: "Offer sevas for Sri Krishna Janmashtami at ISKCON Gambheeram Visakhapatnam",
  },
];

const sevas: Seva[] = [
  // ── Row 1 ──
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
    slug: "gau-seva",
    title: "Gau Seva",
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
  // ── Row 2 — Abhisheka & Naivedhya moved up ──
  {
    slug: "abhisheka",
    title: "Abhisheka Seva",
    description: "Sponsor the sacred Abhishekam of Sri Sri Radha Madan Mohan — morning and Kalash bathing ceremonies on Janmashtami.",
    image: "/assets/janmashtami-sk3.webp",
    options: [
      { legacySevaId: 240, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 241, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 242, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 243, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 244, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 245, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "naivedhya",
    title: "Naivedhya Seva",
    description: "Sponsor the sacred food offering to Lord Krishna — Naivedhya is the devotional offering of prepared dishes to the Lord.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833545819-1785833545717-naivedya.jpeg",
    options: [
      { legacySevaId: 246, label: "Donate Rs. 11,111", amount: 11111 },
      { legacySevaId: 247, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 248, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 304, label: "Donate Rs. 4,001", amount: 4001 },
      { legacySevaId: 249, label: "Donate Rs. 3,001", amount: 3001 },
      { legacySevaId: 250, label: "Donate Rs. 1,501", amount: 1501 },
      { legacySevaId: 251, label: "Donate Any Other Amount", amount: null },
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
  // ── Remaining sevas ──
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
    slug: "vastrabharana",
    title: "Vastrabharana Seva",
    description: "Sponsor exquisite garments and divine ornaments for Sri Sri Radha Madan Mohan on Janmashtami.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
    options: [
      { legacySevaId: 258, label: "Donate Rs. 1,50,000", amount: 150000 },
      { legacySevaId: 259, label: "Donate Rs. 1,00,008", amount: 100008 },
      { legacySevaId: 260, label: "Donate Rs. 75,001", amount: 75001 },
      { legacySevaId: 307, label: "Donate Rs. 60,001", amount: 60001 },
      { legacySevaId: 261, label: "Donate Rs. 51,001", amount: 51001 },
      { legacySevaId: 262, label: "Donate Rs. 25,001", amount: 25001 },
      { legacySevaId: 263, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "chappan-bhog",
    title: "Chappan Bhog Seva",
    description: "Sponsor the grand offering of 56 dishes to Lord Krishna — a magnificent feast of devotion on His appearance day.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833232608-1785833231421-chapan-bhog.webp",
    options: [
      { legacySevaId: 222, label: "Donate Rs. 75,555", amount: 75555 },
      { legacySevaId: 223, label: "Donate Rs. 51,001", amount: 51001 },
      { legacySevaId: 224, label: "Donate Rs. 35,001", amount: 35001 },
      { legacySevaId: 308, label: "Donate Rs. 25,001", amount: 25001 },
      { legacySevaId: 225, label: "Donate Rs. 21,001", amount: 21001 },
      { legacySevaId: 226, label: "Donate Rs. 11,001", amount: 11001 },
      { legacySevaId: 227, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "mandapa",
    title: "Mandapa Seva",
    description: "Sponsor the sacred Mandapa decoration for the grand Janmashtami celebrations at ISKCON Gambheeram Visakhapatnam.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833231776-1785833231103-ChatGPTImageAug42026021053PM.webp",
    options: [
      { legacySevaId: 228, label: "Donate Rs. 55,555", amount: 55555 },
      { legacySevaId: 229, label: "Donate Rs. 35,001", amount: 35001 },
      { legacySevaId: 230, label: "Donate Rs. 25,001", amount: 25001 },
      { legacySevaId: 309, label: "Donate Rs. 21,001", amount: 21001 },
      { legacySevaId: 231, label: "Donate Rs. 15,001", amount: 15001 },
      { legacySevaId: 232, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 233, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "japa-yagna",
    title: "Japa Yagna Seva",
    description: "Sponsor the Japa Yagna — a collective chanting of the holy names of Lord Krishna on His divine appearance day.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833232341-1785833231402-ChatGPTImageAug42026020855PM.webp",
    options: [
      { legacySevaId: 252, label: "Donate Rs. 7,777", amount: 7777 },
      { legacySevaId: 253, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 254, label: "Donate Rs. 3,001", amount: 3001 },
      { legacySevaId: 310, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 255, label: "Donate Rs. 2,001", amount: 2001 },
      { legacySevaId: 256, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 257, label: "Donate Any Other Amount", amount: null },
    ],
  },
];

const galleryImages = [
  "/assets/janmashtami-a75.webp",
  "/assets/janmashtami-a2.webp",
  "/assets/janmashtami-a3.webp",
  "/assets/janmashtami-a4.webp",
];

const TRUST_BADGES = [
  { icon: FileCheck2, label: "80G Tax Exemption" },
  { icon: UtensilsCrossed, label: "Mahaprasadam Sent" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: ShieldCheck, label: "Secure Razorpay Checkout" },
];

const initialForm: CheckoutForm = {
  donorName: "",
  donorMobile: "",
  donorEmail: "",
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
  sevakName: "",
  dob: "",
};

const apiBase = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");
const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

export interface JanmashtamiCampaigner {
  name: string;
  slug: string;
  message?: string;
  raisedAmount?: number;
  donorCount?: number;
}

export default function JanmashtamiClient({ campaigner }: { campaigner?: JanmashtamiCampaigner } = {}) {
  const reduce = useReducedMotion();
  const attribution = useAttribution(campaigner ? `/janmashtami2/c/${campaigner.slug}` : "janmashtami2");
  const razorpayReady = useRazorpayPreload();
  const searchParams = useSearchParams();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selected, setSelected] = useState<SelectedOffering | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" });
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  // Donor pre-fill: logged-in profile auto-fills name/email/mobile; a
  // returning donor's phone lookup fills the same fields after they type
  // their 10-digit number. PAN/address are filled only when 80G/prasadam
  // are selected.
  const { lookupHint, prefill, handle80GToggle, handlePrasadamToggle } = useDonorPrefill({
    form,
    setForm,
    fieldMap: { name: "donorName", email: "donorEmail", mobile: "donorMobile" },
    onMahaPrasadamSelect: (saved) => {
      setForm((current) =>
        !current.street && !current.area && !current.city && !current.state && !current.pincode
          ? {
              ...current,
              street: (saved.street || "").trim(),
              city: saved.city,
              state: saved.state,
              pincode: saved.pincode,
            }
          : current
      );
    },
  });

  const openCheckout = (seva: Seva, option: SevaOption) => {
    setSelected({ seva, option });
    setForm(
      prefill
        ? {
            ...initialForm,
            donorName: prefill.name,
            donorMobile: prefill.mobile,
            donorEmail: prefill.email,
            panNumber: prefill.panNumber,
          }
        : initialForm
    );
    setStatus({ type: "idle", message: "" });
  };

  const closeCheckout = () => {
    if (!submitting) setSelected(null);
  };

  // Deep-linking into the checkout modal — same contract as /janmashtami:
  //   ads      ?seva=abhisheka
  //   reminder ?seva=abhisheka&amount=2100
  //
  // This page opens a modal per seva *tier* rather than an inline form, so the
  // amount picks the matching tier when there is one; otherwise the seva's
  // open-amount option is opened with the value pre-filled. An unknown slug is
  // ignored, so a stale ad link still shows a working page.
  useEffect(() => {
    const sevaParam = searchParams.get("seva");
    if (!sevaParam) return;

    const seva = sevas.find((s) => s.slug === sevaParam);
    if (!seva) return;

    const amount = Number(searchParams.get("amount") || 0);
    const hasAmount = Number.isFinite(amount) && amount >= 100;

    const tier = hasAmount ? seva.options.find((o) => o.amount === amount) : undefined;
    const openOption = seva.options.find((o) => o.amount == null);
    const option = tier || openOption || seva.options[0];
    if (!option) return;

    openCheckout(seva, option);
    if (!tier && hasAmount && option.amount == null) {
      // No tier matches — an old price, or an amount the donor typed. Restore
      // it into the custom-amount box. openCheckout resets the form first, so
      // this merge lands on top of a clean initialForm.
      updateForm({ customAmount: String(amount) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const validate = () => {
    if (!selected) return "Please select a seva.";
    if (!finalAmount || finalAmount < 100) return "Amount must be at least Rs.100.";
    if (!form.donorName.trim()) return "Donor name is required.";
    if (!/^[6-9]\d{9}$/.test(form.donorMobile)) return "Please enter a valid 10 digit mobile number.";
    if (form.donorEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.donorEmail.trim())) return "Please enter a valid email address, or leave it blank.";
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
          sourcePage: campaigner ? `/donations/janmashtami2/c/${campaigner.slug}` : "donations/janmashtami2",
          // Page hero banner — used as the header image of the pending-payment WhatsApp reminder.
          bannerImage: banners[0]?.desktop,
          campaignerSlug: campaigner?.slug || undefined,
          utm: attribution.payload().utm,
          festivalSlug: "janmashtami",
          type: "Sri Krishna Janmashtami",
          sevaName: selected.seva.title,
          // Stored on the donation so the pending-payment reminder can link
          // straight back to this seva (?seva=<slug>) if the donor drops off.
          sevaSlug: selected.seva.slug,
          legacySevaId: selected.option.legacySevaId,
          name: form.donorName.trim(),
          email: form.donorEmail.trim().toLowerCase(),
          mobile: form.donorMobile,
          amount: finalAmount,
          sevakName: form.sevakName.trim() || undefined,
          dob: form.dob || undefined,
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
      await razorpayReady();

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
          email: prefillEmail(form.donorEmail),
          contact: form.donorMobile,
        },
        notes: {
          sourcePage: "donations/janmashtami2",
          festivalSlug: "janmashtami",
          legacySevaId: selected.option.legacySevaId,
          sevaName: selected.seva.title,
          sevaOption: selected.option.label,
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
            window.location.assign(`/payment/thank-you?type=seva&seva=${encodeURIComponent(selected?.seva.title || "Janmashtami seva")}&amount=${finalAmount}&source=${encodeURIComponent("the Janmashtami seva programme")}`);
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

  const fieldLabel = "mb-1.5 block text-[13px] font-semibold text-ink/80";
  const fieldIcon = "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400";
  const stepLabel = "text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700";

  return (
    <main className="min-h-screen bg-white text-ink">
      <WhatsAppFloatButton />
      {campaigner && (
        <div className="bg-gradient-to-r from-vk-700 via-vk-600 to-vk-500 px-4 py-3 text-center text-white">
          <p className="text-sm md:text-base">
            🙏 You are supporting <span className="font-bold">{campaigner.name}</span>&apos;s Janmashtami seva campaign
            {typeof campaigner.donorCount === "number" && campaigner.donorCount > 0 && (
              <span> · {campaigner.donorCount} devotee{campaigner.donorCount === 1 ? "" : "s"} joined · ₹{(campaigner.raisedAmount || 0).toLocaleString("en-IN")} raised</span>
            )}
          </p>
          {campaigner.message && (
            <p className="mt-0.5 text-xs italic text-white/80 md:text-sm">&ldquo;{campaigner.message}&rdquo;</p>
          )}
        </div>
      )}

      {/* ---------- Banner carousel (inset rounded card) ---------- */}
      <section className="bg-gradient-to-b from-vk-50 to-white">
        <div>
          <div className="relative overflow-hidden bg-vk-900">
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
              className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-vk-700 shadow-card backdrop-blur transition hover:bg-white md:flex"
              aria-label="Previous banner"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-vk-700 shadow-card backdrop-blur transition hover:bg-white md:flex"
              aria-label="Next banner"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ---------- Intro ---------- */}
      <section className="vk-section">
        <div className="vk-container">
          <Reveal className="grid gap-6 md:grid-cols-[1.35fr_0.65fr] md:items-center md:gap-10">
            <div className="min-w-0">
              <span className="vk-pill mb-4">Hare Krishna Movement</span>
              <h1 className="vk-h1">Sri Krishna Janmashtami</h1>
              <p className="vk-lead mt-4 max-w-3xl">
                This Janmashtami, on the 4th & 5th of September, join the grand celebrations at ISKCON Gambheeram Visakhapatnam.
                Donate towards any of the sevas listed and receive special prasadam and the unlimited blessings of Lord Krishna.
              </p>
              <blockquote className="mt-5 max-w-3xl rounded-r-2xl border-l-4 border-vk-500 bg-vk-50 px-4 py-3 font-serif-display text-[15px] italic leading-relaxed text-vk-700 md:text-base">
                "Whatever you do, whatever you eat, whatever you offer or give away... do that as an offering to Me." - Bhagavad-gita 9.27
              </blockquote>
            </div>
            <div className="rounded-3xl bg-gradient-navy p-5 text-white shadow-lift sm:p-6">
              <div className="flex items-start gap-3">
                <span className="vk-icon-chip bg-white/10 text-[hsl(var(--gold))]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white">Offer Seva This Janmashtami</h2>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Your offering sustains the midnight Abhisheka, the grand Nandotsava feast, and every sacred ritual performed at ISKCON Gambheeram Visakhapatnam on Lord Krishna&apos;s appearance day.
                  </p>
                </div>
              </div>
              <motion.a
                href="#offer-seva"
                animate={reduce ? undefined : { boxShadow: ["0 0 0 0 rgba(255,219,104,0.4)", "0 0 0 16px rgba(255,219,104,0)", "0 0 0 0 rgba(255,219,104,0.4)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="vk-btn-gold mt-5 h-12 w-full text-[15px] font-bold"
              >
                <Heart className="h-4 w-4 fill-current" />
                Offer Seva
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Trust strip ---------- */}
      <section className="border-y border-vk-100 bg-vk-50 py-3">
        <div className="vk-container flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10">
          {TRUST_BADGES.map((b) => (
            <span key={b.label} className="flex items-center gap-2 text-xs font-semibold text-ink md:text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-vk-500 ring-1 ring-vk-100">
                <b.icon className="h-3.5 w-3.5" />
              </span>
              {b.label}
            </span>
          ))}
        </div>
      </section>

      <style>{`
        .form-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .form-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .form-scroll::-webkit-scrollbar-thumb {
          background: #B9C8FB;
          border-radius: 9999px;
        }
        .form-scroll::-webkit-scrollbar-thumb:hover {
          background: #7F9BEF;
        }
        .form-scroll {
          scrollbar-width: thin;
          scrollbar-color: #B9C8FB transparent;
        }
      `}</style>

      {/* ---------- Seva cards ---------- */}
      <section id="offer-seva" className="vk-section vk-band">
        <div className="vk-container">
          <SectionHeading
            eyebrow="Choose Your Offering"
            title="Janmashtami Sevas"
            subtitle="Select a sacred seva and receive the divine blessings of Lord Krishna"
            align="center"
          />

          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, staggerChildren: reduce ? 0 : 0.08 }}
            className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
          >
            {sevas.map((seva, idx) => (
              <motion.article
                key={seva.slug}
                initial={reduce ? undefined : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: reduce ? 0 : idx * 0.08 }}
                className="vk-card vk-card-hover group flex min-w-0 flex-col overflow-hidden"
              >
                {/* Image with navy gradient + title */}
                <div className="relative h-48 overflow-hidden bg-vk-900 md:h-56">
                  <Image
                    src={seva.image}
                    alt={seva.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vk-900/85 via-vk-900/30 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 right-4 text-lg font-bold text-white drop-shadow-md md:text-xl">{seva.title}</h3>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <p className="text-[13px] leading-relaxed text-muted-foreground md:text-sm">{seva.description}</p>

                  {/* Amount tiers */}
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                    {seva.options.map((option, optIdx) => {
                      const isTopTier = optIdx === 0;
                      const isCustom = !option.amount;
                      const hasSubtitle = !!option.subtitle;
                      return (
                        <button
                          key={`${seva.slug}-${optIdx}`}
                          type="button"
                          onClick={() => openCheckout(seva, option)}
                          aria-label={`${seva.title} - ${option.label}`}
                          className={`relative flex min-h-[52px] min-w-0 items-center justify-center rounded-xl border px-3 py-2.5 text-center transition-all ${
                            hasSubtitle ? "flex-col gap-1" : ""
                          } ${
                            isCustom
                              ? "col-span-2 border-dashed border-vk-300 bg-white text-vk-700 hover:border-vk-500 hover:bg-vk-50"
                              : "border-vk-200 bg-white hover:border-vk-400 hover:bg-vk-50"
                          }`}
                        >
                          {isTopTier && !hasSubtitle && (
                            <span className="absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--gold))]">
                              <svg className="h-2.5 w-2.5 text-ink" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.4 5.7 21l2.3-7L2 9.4h7.6z"/></svg>
                            </span>
                          )}
                          {option.amount ? (
                            <span className="block leading-tight">
                              <span className="text-[12px] font-semibold text-vk-500">₹</span>{" "}
                              <span className="text-base font-extrabold text-vk-700">{formatAmount(option.amount)}</span>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1.5">
                              <Plus className="h-4 w-4 text-vk-500" />
                              <span className="text-[13px] font-semibold">Donate Other Amount</span>
                            </span>
                          )}
                          {hasSubtitle && (
                            <span className="inline-block rounded-full bg-[hsl(var(--gold))] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                              {option.subtitle}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- UPI / bank payment request ---------- */}
      <section className="py-8 md:py-10">
        <div className="vk-container">
          <div className="flex items-start gap-3 rounded-2xl border border-vk-100 bg-vk-50 p-4 text-sm leading-7 text-ink sm:p-5 md:text-[15px]">
            <span className="vk-icon-chip hidden bg-white sm:inline-flex">
              <MessageCircle className="h-5 w-5" />
            </span>
            <p className="min-w-0">
              <strong className="font-bold text-vk-700">Gentle Request!</strong> While doing Paytm/UPI App Payments or Bank (NEFT/ RTGS), please send us a screenshot along with complete address and PAN details on our Whatsapp Number{" "}
              <a className="whitespace-nowrap font-bold text-vk-700 underline decoration-vk-300 underline-offset-4 hover:decoration-vk-500" href="tel:+918977761187">+91 89777 61187</a> or to our mail ID{" "}
              <a className="break-all font-bold text-vk-700 underline decoration-vk-300 underline-offset-4 hover:decoration-vk-500" href="mailto:social@hkmvizag.org">social@hkmvizag.org</a>. You may also call on this number for other queries.
            </p>
          </div>
        </div>
      </section>

      <JanmashtamiImportanceSection />

      {/* ---------- Bank details ---------- */}
      <section className="vk-section">
        <div className="vk-container">
          <div className="vk-card mx-auto max-w-3xl p-5 sm:p-6">
            <h2 className="vk-bar-title text-xl text-ink">Donation Through Bank (NEFT/ RTGS)</h2>
            <div className="mt-4 space-y-2">
              {[
                { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
                { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
                { label: "A/c No", value: "10091415313" },
                { label: "IFSC Code", value: "IDFB0080412" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-vk-50 px-4 py-2.5 text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
                    <span className="select-all break-all font-semibold text-ink">{value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(value);
                      setCopiedField(label);
                      setTimeout(() => setCopiedField(null), 1500);
                    }}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-vk-500 transition-colors hover:bg-white hover:text-vk-700"
                    title={`Copy ${label}`}
                    aria-label={`Copy ${label}`}
                  >
                    {copiedField === label ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <JanmashtamiGallery />

      {/* ---------- Photo tiles ---------- */}
      <section className="pb-10 md:pb-16">
        <div className="vk-container grid gap-4 md:grid-cols-2">
          {galleryImages.map((src, index) => (
            <div key={src} className="vk-tile aspect-[4/3]">
              <img
                src={src}
                alt={`Sri Krishna Janmashtami seva activity ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      <footer className="relative overflow-hidden bg-gradient-navy text-white">
        <div className="vk-container relative pb-8 pt-14">
          {/* Top devotional strip */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent sm:w-48" />
            <p className="font-serif-display text-lg italic leading-relaxed text-white/90 md:text-xl">
              &ldquo;Hare Krishna Hare Krishna, Krishna Krishna Hare Hare&rdquo;
            </p>
            <p className="font-serif-display text-lg italic leading-relaxed text-white/90 md:text-xl">&ldquo;Hare Rama Hare Rama, Rama Rama Hare Hare&rdquo;</p>
          </div>

          {/* Main grid */}
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand column */}
            <div className="md:col-span-4">
              <div>
                <p className="font-heading text-xl font-bold text-white">Hare Krishna Movement</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/50">Visakhapatnam</p>
              </div>
              <p className="mt-6 text-sm leading-7 text-white/70">
                Giving human society an opportunity for a life of happiness, good health, peace of mind, and all good qualities through God Consciousness.
              </p>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-3">
                {[
                  { icon: Facebook, href: "https://www.facebook.com/hkm.vizag", label: "Facebook" },
                  { icon: Youtube, href: "https://www.youtube.com/user/harekrishnavizag", label: "YouTube" },
                  { icon: Instagram, href: "https://www.instagram.com/hare_krishna_vizag/", label: "Instagram" },
                  { icon: MessageCircle, href: "https://wa.me/918977761187", label: "WhatsApp" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-3">
              <h3 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-vk-300">
                <span className="h-px w-4 bg-vk-300/60" />
                Explore
              </h3>
              <ul className="space-y-3 text-sm text-white/70">
                {[
                  { label: "Hare Krishna Movement", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Subhojanam", href: "/subhojanam" },
                  { label: "Terms & Conditions", href: "/terms-and-conditions" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                      <span className="h-1 w-1 rounded-full bg-white/30 transition-all group-hover:w-3 group-hover:bg-vk-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-white/10 pt-6">
            <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-white/45 md:flex-row md:text-left">
              <p>&copy; 2026 Hare Krishna Movement Visakhapatnam. All rights reserved.</p>
              <p className="flex items-center gap-1.5">
                Crafted with <Heart className="h-3 w-3 fill-current text-vk-300" /> for Sri Krishna Janmashtami
              </p>
            </div>
          </div>
        </div>
      </footer>

      {status.message && !selected && (
        <div className={`fixed bottom-6 left-1/2 z-[120] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl px-4 py-3 text-center text-[13px] font-semibold shadow-lift ${
          status.type === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"
        }`}>
          {status.message}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-vk-900/70 p-3 backdrop-blur-sm sm:p-4">
          <div className="vk-card form-scroll relative max-h-[92vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden !rounded-3xl">
            {/* Summary strip */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-7">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Janmashtami Checkout</p>
                <h2 className="text-lg font-bold text-white">{selected.seva.title}</h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Seva Amount</p>
                {selected.option.amount ? (
                  <p className="font-heading text-2xl font-extrabold text-[hsl(var(--gold))] sm:text-3xl">
                    ₹{formatAmount(selected.option.amount)}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-white/90">Enter amount below</p>
                )}
              </div>
              <button
                type="button"
                onClick={closeCheckout}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close checkout"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitDonation} className="space-y-5 p-4 sm:p-6">
              {!selected.option.amount && (
                <label className="block">
                  <span className={fieldLabel}>Enter Seva Amount *</span>
                  <span
                    className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 transition ${
                      form.customAmount
                        ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                        : "border-dashed border-vk-200 bg-white focus-within:border-vk-500"
                    }`}
                  >
                    <span className="text-sm font-semibold text-vk-700">₹</span>
                    <input
                      type="number"
                      min={100}
                      value={form.customAmount}
                      onChange={(event) => updateForm({ customAmount: event.target.value, want80G: false, wantPrasadam: false })}
                      placeholder="Enter amount"
                      className="h-full w-full min-w-0 bg-transparent text-[15px] font-semibold outline-none"
                    />
                  </span>
                  <span className="mt-1.5 block text-xs text-muted-foreground">Amount must be at least Rs.100.</span>
                </label>
              )}

              <div>
                <p className={`${stepLabel} mb-3`}>Your Details</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className={fieldLabel}>Donor Name *</span>
                    <span className="relative block">
                      <User className={fieldIcon} />
                      <input value={form.donorName} maxLength={39} onChange={(event) => updateForm({ donorName: event.target.value.replace(/[^a-zA-Z ]/g, "") })} placeholder="Your Name" className="vk-input pl-10" />
                    </span>
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Mobile Number *</span>
                    <span className="relative block">
                      <Phone className={fieldIcon} />
                      <input value={form.donorMobile} maxLength={10} onChange={(event) => updateForm({ donorMobile: event.target.value.replace(/\D/g, "") })} placeholder="Your Mobile Number" className="vk-input pl-10" />
                    </span>
                  </label>
                  <label className="block md:col-span-2">
                    <span className={fieldLabel}>E-Mail ID (optional)</span>
                    <span className="relative block">
                      <Mail className={fieldIcon} />
                      <input type="email" value={form.donorEmail} onChange={(event) => updateForm({ donorEmail: event.target.value.toLowerCase() })} placeholder="Your Email" className="vk-input pl-10" />
                    </span>
                  </label>
                </div>
              </div>

              {lookupHint}

              <DonorExtrasFields
                sevakName={form.sevakName}
                dob={form.dob}
                onSevakNameChange={(v) => updateForm({ sevakName: v })}
                onDobChange={(v) => updateForm({ dob: v })}
                collapsible
              />

              <div className="space-y-3">
                {showPrasadamField && (
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3 text-[13px] font-medium text-ink">
                    <input type="checkbox" checked={form.wantPrasadam} onChange={(event) => {
                    const next = event.target.checked;
                    updateForm({ wantPrasadam: next });
                    handlePrasadamToggle(next);
                  }} className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700" />
                    <span>I would like to receive Maha Prasadam (Only within India)</span>
                  </label>
                )}
                {showTaxField && (
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3 text-[13px] font-medium text-ink">
                    <input type="checkbox" checked={form.want80G} onChange={(event) => {
                    const next = event.target.checked;
                    updateForm({ want80G: next });
                    handle80GToggle(next);
                  }} className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700" />
                    <span>
                      I wish to receive 80G Tax Exemption
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">PAN and address are mandatory when 80G is selected.</span>
                    </span>
                  </label>
                )}
              </div>

              {form.want80G && (
                <label className="block">
                  <span className={fieldLabel}>PAN Number *</span>
                  <input value={form.panNumber} maxLength={10} onChange={(event) => updateForm({ panNumber: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })} placeholder="Eg: ABCDE1234F" className="vk-input" />
                </label>
              )}

              {needsAddress && (
                <div className="grid gap-3 rounded-xl border border-vk-100 bg-vk-50/60 p-3.5 sm:grid-cols-2 sm:gap-4">
                  <label className="block">
                    <span className={fieldLabel}>House No/Door No</span>
                    <input value={form.doorNo} maxLength={39} onChange={(event) => updateForm({ doorNo: event.target.value })} className="vk-input" />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>House/Apartment/Building Name</span>
                    <input value={form.building} maxLength={39} onChange={(event) => updateForm({ building: event.target.value })} className="vk-input" />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Street Name</span>
                    <input value={form.street} maxLength={39} onChange={(event) => updateForm({ street: event.target.value })} className="vk-input" />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Location/Area *</span>
                    <input value={form.area} maxLength={39} onChange={(event) => updateForm({ area: event.target.value })} className="vk-input" />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>PIN Code *</span>
                    <input value={form.pincode} maxLength={6} onChange={(event) => updateForm({ pincode: event.target.value.replace(/\D/g, "") })} className="vk-input" />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>City *</span>
                    <input value={form.city} maxLength={30} onChange={(event) => updateForm({ city: event.target.value.toUpperCase().replace(/[^A-Z ]/g, "") })} className="vk-input" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={fieldLabel}>State *</span>
                    <input value={form.state} maxLength={30} onChange={(event) => updateForm({ state: event.target.value.toUpperCase().replace(/[^A-Z ]/g, "") })} className="vk-input" />
                  </label>
                </div>
              )}

              {status.type === "error" && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{status.message}</p>}

              <motion.div
                animate={submitting || reduce ? undefined : { scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <button type="submit" disabled={submitting} className="vk-btn-gold h-12 w-full text-[15px] font-bold">
                  <Heart className="h-4 w-4 fill-current" />
                  {submitting ? "Opening Checkout..." : `Donate Rs. ${formatAmount(finalAmount || 0)}`}
                </button>
              </motion.div>

              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-vk-500" />
                  Secure Razorpay Checkout
                </span>
                <span className="inline-flex items-center gap-1">
                  <FileCheck2 className="h-3.5 w-3.5 text-vk-500" />
                  80G Tax Exemption
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
