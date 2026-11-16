"use client";

import {
  Facebook, Instagram, Youtube, Phone, Mail, Heart, ArrowUp, Navigation, MapPin, Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useT } from "@/components/i18n/LocaleProvider";
import VaikunthamAppPromo from "@/components/VaikunthamAppPromo";
import HKVTLogo from "@/assets/HKMV_logo.png";

// Four short, clearly named columns (the full menu lives in the header).
const footerCols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Temple",
    links: [
      { label: "Plan Your Visit", href: "/iskcon-vizag-temple" },
      { label: "Daily Schedule", href: "/daily-schedule" },
      { label: "Festivals", href: "/festival" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Seva",
    links: [
      { label: "Anna Daan", href: "/anna-daan-seva" },
      { label: "Gau Seva", href: "/gau-seva" },
      { label: "Temple Construction", href: "/sqft-seva-campaign" },
      { label: "All Sevas", href: "/donate" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Srila Prabhupada", href: "/founder" },
      { label: "Our Acharyas", href: "/acharyas" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];


const socials = [
  { icon: Youtube, href: "https://www.youtube.com/user/harekrishnavizag", label: "YouTube" },
  { icon: Instagram, href: "https://www.instagram.com/harekrishnavizag/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/hkm.vizag/", label: "Facebook" },
];

// Srila Prabhupada's ISKCON Visakhapatnam — directions link (the short link
// resolves to the same Google Maps listing).
const MAPS_DIRECTIONS_URL = "https://maps.app.goo.gl/Yg2imkSEDxuY5u2K9?g_st=aw";

// Cloudinary (ddmzeqpkc) now answers 401, so the image is served from R2 (same picture the Founder page uses).
const PRABHUPADA_IMG = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793324889281-1793324889228-prabhupada-home.avif";

const colTitle = "mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white/90";

const Footer = () => {
  const t = useT();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-16 md:mt-24">
      <div className="relative overflow-hidden bg-gradient-navy text-white/75">
        {/* Temple line-art + soft glows */}
        <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-vk-500/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-vk-400/10 blur-3xl" />

        <div className="vk-container relative">
          {/* ── Brand + Prabhupada quote card (GVD footer header) ── */}
          <div className="flex flex-col gap-6 pt-10 md:pt-14 lg:flex-row lg:items-center lg:gap-10">
            <Link href="/" className="shrink-0" aria-label={t("Home")}>
              <Image
                src={typeof HKVTLogo === "string" ? HKVTLogo : HKVTLogo.src}
                alt={t("Hare Krishna Vaikuntham Cultural Centre")}
                width={795}
                height={288}
                className="h-14 w-auto brightness-0 invert md:h-16"
              />
            </Link>

            <div className="grid flex-1 overflow-hidden rounded-3xl bg-white text-ink shadow-[0_24px_50px_-24px_rgba(0,0,0,0.6)] sm:grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_1fr]">
              <div className="relative hidden h-full min-h-[150px] w-40 sm:block md:w-48">
                <Image
                  src={PRABHUPADA_IMG}
                  alt={t("His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada")}
                  fill
                  sizes="192px"
                  className="object-cover object-top grayscale"
                />
              </div>
              <div className="p-5 md:p-6">
                <p className="text-base font-bold leading-snug md:text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  {t("A sacred place for seva, soul upliftment &")}{" "}
                  <span className="font-serif-display italic text-vk-600">{t("Krishna Consciousness.")}</span>
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
                  {t("Inspired by Srila Prabhupada's vision, we serve with devotion, compassion and commitment — since 2008 in Visakhapatnam.")}
                </p>
              </div>
              <div className="hidden border-l border-vk-100 p-5 md:block md:p-6">
                <p className="font-serif-display text-lg italic leading-snug text-ink">
                  &ldquo;{t("If you want peace, then you must develop Krishna consciousness.")}&rdquo;
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-vk-600">— {t("Srila Prabhupada")}</p>
              </div>
            </div>
          </div>

          {/* ── Link columns ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
            {/* Visit */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <h3 className={colTitle}>{t("Visit Us")}</h3>
              <address className="flex gap-3 text-sm not-italic leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-vk-400" />
                <span>
                  {t("Hare Krishna Vaikuntham Cultural Centre, Door No: 8-22, IIM Rd, near Akshaya Patra Foundation Kitchen, Gambhiram, Visakhapatnam, Andhra Pradesh 531163")}
                </span>
              </address>
              <p className="mt-3 flex gap-3 text-sm leading-relaxed">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-vk-400" />
                <span>{t("Darshan daily: 4:30 – 5:00 AM, 7:15 AM – 12:20 PM, 4:15 – 8:15 PM")}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="vk-btn-ghost-light">
                  <Navigation className="h-4 w-4" />
                  {t("Get Directions")}
                </a>
                <Link href="/donate" className="vk-btn-gold">
                  <Heart className="h-4 w-4 fill-current" />
                  {t("Donate")}
                </Link>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <a href="tel:+918977761187" className="flex items-center gap-3 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 text-vk-400" /> +91 89777 61187
                </a>
                <a href="mailto:social@hkmvizag.org" className="flex items-center gap-3 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 text-vk-400" /> social@hkmvizag.org
                </a>
              </div>
            </div>

            {footerCols.map((col) => (
              <div key={col.title}>
                <h3 className={colTitle}>{t(col.title)}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm transition-colors hover:text-white">{t(l.label)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── App promo ─────────────────────────────────────────── */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <VaikunthamAppPromo />
          </div>

          {/* ── Follow us ─────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">{t("Follow us on")}</p>
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-vk-800 transition-transform hover:-translate-y-0.5"
                >
                  <s.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
              <a
                href="https://whatsapp.com/channel/0029VaZDEG67T8bWHjibTy2u"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("Join our WhatsApp channel")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                {t("Join Channel")}
              </a>
            </div>
          </div>

          {/* ── Bottom bar ────────────────────────────────────────── */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center md:flex-row md:text-left">
            <p className="text-[13px] text-white/50">
              {t("© {year} Hare Krishna Movement India, Visakhapatnam. All rights reserved.", { year: new Date().getFullYear() })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-white/50">
              <Link href="/donor/login" className="transition-colors hover:text-white">{t("Donor Login")}</Link>
              <span className="text-white/20">·</span>
              <Link href="/privacy-policy" className="transition-colors hover:text-white">{t("Privacy Policy")}</Link>
              <span className="text-white/20">·</span>
              <Link href="/terms-and-conditions" className="transition-colors hover:text-white">{t("Terms")}</Link>
              <span className="text-white/20">·</span>
              <Link href="/refund-policy" className="transition-colors hover:text-white">{t("Refunds")}</Link>
              <button
                type="button"
                onClick={scrollToTop}
                className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white hover:text-vk-800"
                aria-label={t("Back to top")}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
