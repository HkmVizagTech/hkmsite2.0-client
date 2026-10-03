"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Phone, Mail, Heart, ChevronDown, Home, User, Utensils, Info,
  ShoppingBag, Calendar, PartyPopper, Megaphone, Youtube, Instagram, Facebook,
} from "lucide-react";
import ISKLogo from "@/assets/ISKCONGambheeramLogo.jpeg";
import HKVTLogo from "@/assets/HKMV_logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import WhatsAppIcon from "@/components/WhatsAppIcon";

import { navEntries, isGroupActive } from "@/lib/navConfig";
import { NavListItem } from "@/components/NavListItem";
import { resolveMajorFestival, type MajorFestival } from "@/lib/majorFestival";
import { resolveCustomNavLink, type CustomNavLink } from "@/lib/customNavLink";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

// ── Mobile bottom bar (matches production site) ────────────────────
const bottomNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Founder", href: "/founder", icon: User },
  { label: "Subhojanam", href: "/subhojanam", icon: Utensils },
  { label: "About Us", href: "/about", icon: Info },
];

const socialLinks = [
  { icon: Youtube, href: "https://www.youtube.com/user/harekrishnavizag", label: "YouTube" },
  { icon: Instagram, href: "https://www.instagram.com/harekrishnavizag/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/hkm.vizag/", label: "Facebook" },
];

// ── Real temple darshan windows ──────────────────────────────────────
const DARSHAN_WINDOWS = [
  { startMin: 4 * 60 + 30, endMin: 5 * 60, label: "Darshan Open · 4:30 AM – 5:00 AM" },
  { startMin: 7 * 60 + 15, endMin: 12 * 60 + 20, label: "Darshan Open · 7:15 AM – 12:20 PM" },
  { startMin: 16 * 60 + 15, endMin: 20 * 60 + 15, label: "Darshan Open · 4:15 PM – 8:15 PM" },
];

const getDarshanStatus = () => {
  const istNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const minutesNow = istNow.getHours() * 60 + istNow.getMinutes();

  const activeWindow = DARSHAN_WINDOWS.find(
    (w) => minutesNow >= w.startMin && minutesNow < w.endMin
  );
  if (activeWindow) return { isOpen: true, label: activeWindow.label };

  const nextWindow = DARSHAN_WINDOWS.find((w) => minutesNow < w.startMin);
  const reopenLabel = nextWindow
    ? `Reopens ${nextWindow.label.split("· ")[1].split(" – ")[0]}`
    : "Reopens 4:30 AM";
  return { isOpen: false, label: `Darshan Closed · ${reopenLabel}` };
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darshanStatus, setDarshanStatus] = useState(getDarshanStatus);
  const [menuCanScroll, setMenuCanScroll] = useState(false);
  const menuScrollRef = useRef<HTMLDivElement>(null);
  // Live refs to each collapsible category wrapper so we can scroll an opened
  // one fully into view inside the sheet.
  const groupRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [festival, setFestival] = useState<MajorFestival | null>(null);
  const [customLink, setCustomLink] = useState<CustomNavLink | null>(null);
  // Which "More" menu category is expanded (single-open accordion — opening
  // one closes any that was open before).
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Dark mode removed sitewide — theme is forced to light in ThemeProvider.
  const pathname = usePathname();

  // ── Darshan interval ──────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setDarshanStatus(getDarshanStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Major festival + custom link in the navbar ─────────────────────
  // Reads the admin overrides from site-content (public endpoint), then
  // resolves which festival to highlight (`"auto"` keeps the automatic
  // calendar pick; `"none"` hides the item entirely) and whether the
  // separate custom nav link is enabled. Both are independent slots and can
  // show at the same time.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let festivalOverride: string | null = null;
      let customLinkOverride: { enabled?: boolean; label?: string; href?: string } | null = null;
      try {
        const res = await fetch(`${API_URL}/site-content`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          festivalOverride = data?.content?.navbar?.majorFestival ?? "none";
          customLinkOverride = data?.content?.navbar?.customLink ?? null;
        }
      } catch {
        festivalOverride = "none";
      }
      if (!cancelled) {
        setFestival(resolveMajorFestival(festivalOverride));
        setCustomLink(resolveCustomNavLink(customLinkOverride));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Scroll detection ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile menu on navigation ───────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  // ── Detect mobile menu overflow for scroll hint ───────────────────
  useEffect(() => {
    if (!mobileOpen) return;
    const el = menuScrollRef.current;
    if (!el) return;
    const update = () =>
      setMenuCanScroll(
        el.scrollHeight > el.clientHeight + 1 &&
          el.scrollTop + el.clientHeight < el.scrollHeight - 8
      );
    const timer = setTimeout(update, 320);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [mobileOpen, openGroup]);

  // ── Toggle mobile menu ────────────────────────────────────────────
  const toggleMobile = () => setMobileOpen((v) => !v);

  // ── Toggle a collapsible category in the mobile "More" menu ───────
  // Only one category stays open at a time; tapping the open one closes it.
  // After toggling we wait for the fold/unfold animation, then glide the
  // opened category fully into view (or bring a closed one's header back).
  const toggleGroup = (label: string) => {
    if (openGroup === label) {
      setOpenGroup(null);
      window.setTimeout(() => scrollGroupIntoView(label), 320);
    } else {
      setOpenGroup(label);
      window.setTimeout(() => scrollGroupIntoView(label), 340);
    }
  };

  // Smoothly scroll the mobile sheet so the target category slot is visible.
  const scrollGroupIntoView = (label: string) => {
    const container = menuScrollRef.current;
    const el = groupRefs.current.get(label);
    if (!container || !el) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const elTop = eRect.top - cRect.top + container.scrollTop;
    container.scrollTo({
      top: Math.max(0, elTop - 12),
      behavior: "smooth",
    });
  };

  // Link styling shared by the mobile "More" menu rows.
  const mobileLinkCls = (active: boolean) =>
    `flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors ${
      active ? "text-vk-700 bg-vk-100" : "text-ink hover:text-vk-700 hover:bg-vk-50"
    }`;

  // Desktop top-level link styling (GVD: ink text, brand colour when active,
  // with a small underline dot).
  const topLinkCls = (active: boolean) =>
    `relative inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors min-[1440px]:px-3 min-[1440px]:text-[14px] ${
      active ? "text-vk-700" : "text-ink/80 hover:text-vk-700"
    }`;

  const activeDot = (
    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-vk-500" aria-hidden />
  );

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Top info bar (GVD: tinted strip with contact, darshan pill, socials) ── */}
      <div
        className={`fixed inset-x-0 top-0 z-[60] h-8 bg-vk-100 text-ink transition-transform duration-300 md:h-10 ${
          scrolled ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="vk-container flex h-full items-center justify-between gap-3 text-[11px] md:text-[13px]">
          <div className="flex min-w-0 items-center gap-2 md:gap-4">
            <a
              href="mailto:social@hkmvizag.org"
              aria-label="Email social@hkmvizag.org"
              className="hidden items-center gap-2 font-medium transition-colors hover:text-vk-700 sm:inline-flex"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-vk-700 shadow-sm md:h-7 md:w-7">
                <Mail className="h-3.5 w-3.5" />
              </span>
              <span className="hidden lg:inline">social@hkmvizag.org</span>
            </a>
            <a
              href="tel:+918977761187"
              aria-label="Call +91 89777 61187"
              className="inline-flex items-center gap-2 whitespace-nowrap font-medium transition-colors hover:text-vk-700"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-vk-700 shadow-sm md:h-7 md:w-7">
                <Phone className="h-3.5 w-3.5" />
              </span>
              <span className="hidden min-[430px]:inline">+91 89777 61187</span>
            </a>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 font-medium shadow-sm md:px-3.5">
              <span className="relative flex h-2 w-2">
                {darshanStatus.isOpen && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    darshanStatus.isOpen ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </span>
              <span suppressHydrationWarning className="whitespace-nowrap">
                {darshanStatus.label}
              </span>
            </span>
            <div className="hidden items-center gap-1 md:flex">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-white hover:text-vk-700"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
              <a
                href="https://whatsapp.com/channel/0029VaZDEG67T8bWHjibTy2u"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp channel"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-white hover:text-[#25D366]"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile menu backdrop ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-vk-900/40 backdrop-blur-[2px] xl:hidden"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Main nav bar ─────────────────────────────────────────── */}
      <nav
        aria-label="Main"
        className={`fixed z-50 transition-all duration-300 ${
          scrolled
            ? "inset-x-2 top-2 rounded-2xl border border-vk-200/70 bg-white/90 shadow-nav backdrop-blur-xl md:inset-x-6"
            : "inset-x-0 top-8 border-b border-vk-100 bg-white md:top-10"
        }`}
      >
        <div
          className={`vk-container flex items-center justify-between gap-4 ${
            scrolled ? "h-14 md:h-16" : "h-14 md:h-16"
          }`}
        >
          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Hare Krishna Movement Vizag — Home">
            <Image
              src={typeof ISKLogo === "string" ? ISKLogo : ISKLogo.src}
              alt="ISKCON Gambheeram Visakhapatnam - Hare Krishna Movement Vizag"
              width={300}
              height={112}
              priority
              loading="eager"
              className="h-8 w-auto shrink-0 md:h-11 lg:h-9 min-[1440px]:h-11"
            />
            <div className="flex shrink-0 items-center gap-2 md:gap-3">
              <span className="h-6 w-px shrink-0 bg-vk-200 md:h-8" aria-hidden />
              <Image
                src={typeof HKVTLogo === "string" ? HKVTLogo : HKVTLogo.src}
                alt="Hare Krishna Movement Vizag"
                width={795}
                height={288}
                className="h-7 w-auto shrink-0 md:h-11 lg:h-9 min-[1440px]:h-11"
              />
            </div>
          </Link>

          {/* ── Desktop nav with hover dropdowns (hidden below lg) ── */}
          <div className="hidden items-center gap-0.5 xl:flex">
            {navEntries.map((entry) => {
              if (entry.kind === "link") {
                const active = pathname === entry.href;
                return (
                  <Link key={entry.href} href={entry.href} className={topLinkCls(active)}>
                    {entry.label}
                    {active && activeDot}
                  </Link>
                );
              }

              if (entry.kind === "festival") {
                // Only rendered while a major festival is active — either
                // auto-picked from the calendar or set by an admin.
                if (!festival) return null;
                const activeF =
                  pathname === festival.href || pathname.startsWith(festival.href);
                return (
                  <Link key={festival.href} href={festival.href} className={topLinkCls(activeF)}>
                    {festival.label}
                    {activeF && activeDot}
                  </Link>
                );
              }

              if (entry.kind === "customLink") {
                // Only rendered while an admin has enabled this separate
                // custom nav link. Styled like the festival slot.
                if (!customLink) return null;
                const activeC =
                  pathname === customLink.href || pathname.startsWith(customLink.href);
                return (
                  <Link key={customLink.href} href={customLink.href} className={topLinkCls(activeC)}>
                    {customLink.label}
                    {activeC && activeDot}
                  </Link>
                );
              }

              const group = entry.group;
              const groupActive = isGroupActive(group, pathname);
              const colCount =
                group.items.length > 4 ? "w-[560px] grid-cols-2" : "w-[360px] grid-cols-1";

              return (
                <div key={group.label} className="group/dropdown relative">
                  <button
                    type="button"
                    aria-haspopup="true"
                    className={topLinkCls(groupActive)}
                  >
                    {group.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover/dropdown:rotate-180" />
                    {groupActive && activeDot}
                  </button>
                  {/* Dropdown — absolutely positioned under this trigger */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 group-hover/dropdown:opacity-100 group-focus-within/dropdown:visible group-focus-within/dropdown:opacity-100">
                    <ul className={`grid gap-1 rounded-2xl border border-vk-100 bg-white p-2.5 shadow-[0_24px_48px_-20px_rgba(10,18,51,0.35)] ${colCount}`}>
                      {group.items.map((item) => (
                        <NavListItem
                          key={item.href}
                          href={item.href}
                          title={item.label}
                          description={item.description}
                          icon={item.icon}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop right actions (Donate) ─────── */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/donate" className="vk-btn-gold !rounded-xl !px-4 min-[1440px]:!px-5">
              <Heart className="h-4 w-4 fill-current" />
              Donate Now
            </Link>
            {/* Small laptops (lg–xl): the full menu doesn't fit, so it opens
                in the same sheet the mobile "More" button uses. */}
            <button
              type="button"
              onClick={toggleMobile}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-vk-200 text-vk-700 transition-colors hover:bg-vk-50 xl:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* ── Mobile: Donate Now button ─────────────────────────── */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <Link href="/donate" className="vk-btn-gold !h-9 !rounded-xl !px-3.5 !py-0 !text-[12px]">
              <Heart className="h-3.5 w-3.5 fill-current" />
              Donate
            </Link>
          </div>
        </div>

        {/* ── Mobile "More" sheet ─────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-sheet"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className={`absolute top-full flex max-h-[calc(100dvh-96px)] flex-col overflow-hidden bg-white shadow-elevated md:max-h-[calc(100dvh-112px)] lg:!inset-x-auto lg:right-4 lg:mt-2 lg:w-[440px] lg:!rounded-2xl lg:border lg:border-vk-100 ${
                scrolled
                  ? "inset-x-0 mt-2 rounded-2xl border border-vk-100"
                  : "inset-x-0 rounded-b-3xl border-t border-vk-100"
              }`}
            >
              {/* Scrollable body */}
              <div ref={menuScrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
                <div className="mb-2 grid grid-cols-2 gap-2">
                  {festival && (
                    <Link
                      href={festival.href}
                      className={mobileLinkCls(pathname === festival.href || pathname.startsWith(festival.href))}
                    >
                      <PartyPopper className="h-4 w-4 text-vk-500" />
                      {festival.label}
                    </Link>
                  )}
                  {customLink && (
                    <Link
                      href={customLink.href}
                      className={mobileLinkCls(pathname === customLink.href || pathname.startsWith(customLink.href))}
                    >
                      <Megaphone className="h-4 w-4 text-vk-500" />
                      {customLink.label}
                    </Link>
                  )}
                  <Link href="/shop" className={mobileLinkCls(pathname === "/shop")}>
                    <ShoppingBag className="h-4 w-4 text-vk-500" />
                    Shop
                  </Link>
                  <Link href="/donor/login" className={mobileLinkCls(pathname === "/donor/login")}>
                    <User className="h-4 w-4 text-vk-500" />
                    Donor Login
                  </Link>
                  <Link href="/ekadashi" className={mobileLinkCls(pathname === "/ekadashi")}>
                    <Calendar className="h-4 w-4 text-vk-500" />
                    Ekadashi
                  </Link>
                  <Link
                    href="/festival"
                    className={mobileLinkCls(pathname === "/festival" || pathname.startsWith("/festivals"))}
                  >
                    <PartyPopper className="h-4 w-4 text-vk-500" />
                    Festivals
                  </Link>
                </div>

                <p className="px-1 pb-2 pt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Explore by Category
                </p>
                {navEntries
                  .filter(
                    (entry): entry is Extract<typeof entry, { kind: "group" }> => entry.kind === "group"
                  )
                  .map((entry) => {
                    const group = entry.group;
                    const GroupIcon = group.icon;
                    const open = openGroup === group.label;
                    return (
                      <div
                        key={group.label}
                        ref={(el) => {
                          if (el) groupRefs.current.set(group.label, el);
                          else groupRefs.current.delete(group.label);
                        }}
                        className="mb-1 overflow-hidden rounded-2xl"
                      >
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.label)}
                          aria-expanded={open}
                          className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold transition-all duration-200 ${
                            open
                              ? "bg-vk-50 text-vk-700 ring-1 ring-inset ring-vk-200"
                              : "text-ink hover:bg-vk-50 hover:text-vk-700"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {GroupIcon && (
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                                  open ? "bg-vk-700 text-white" : "bg-vk-100 text-vk-700"
                                }`}
                              >
                                <GroupIcon className="h-4 w-4" />
                              </span>
                            )}
                            <span>{group.label}</span>
                          </span>
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                              open ? "rotate-180 bg-vk-700 text-white" : "bg-vk-50 text-vk-700"
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </button>
                        <motion.div
                          initial={false}
                          animate={
                            open
                              ? { height: "auto", opacity: 1, y: 0 }
                              : { height: 0, opacity: 0, y: -6 }
                          }
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="ml-7 mt-1 flex flex-col gap-0.5 border-l-2 border-vk-100 pb-2 pl-4">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
                                  pathname === item.href
                                    ? "bg-vk-100 font-semibold text-vk-700"
                                    : "text-ink/75 hover:bg-vk-50 hover:text-vk-700"
                                }`}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}

                {/* Scroll hint — shown only while there is actually more below */}
                {menuCanScroll && (
                  <div className="pointer-events-none sticky bottom-0 z-10 -mt-10 flex h-10 items-end justify-center bg-gradient-to-t from-white via-white/80 to-transparent pb-1">
                    <ChevronDown className="h-4 w-4 animate-bounce text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Sticky footer actions — always visible, never buried in the scroll */}
              <div className="border-t border-vk-100 bg-vk-50/70 px-4 py-3">
                <div className="mb-3 flex items-center justify-center gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-vk-700 shadow-sm"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/donate" className="vk-btn-gold h-11 flex-1">
                    <Heart className="h-4 w-4 fill-current" />
                    Donate Now
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="vk-btn-outline h-11 flex-1"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Fixed bottom navigation bar — mobile only ──────────────── */}
      <AnimatePresence>
        {!mobileOpen && (
          <motion.nav
            aria-label="Quick links"
            initial={false}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-vk-100 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_-8px_rgba(10,18,51,0.18)] backdrop-blur-lg lg:hidden"
          >
            <div className="flex items-stretch">
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10.5px] font-medium transition-colors ${
                      active ? "text-vk-700" : "text-ink/55"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                        active ? "bg-vk-100" : ""
                      }`}
                    >
                      <Icon className={`h-[18px] w-[18px] ${active ? "stroke-[2.4px]" : "stroke-[1.75px]"}`} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}

              {/* More — opens/closes the hamburger menu */}
              <button
                type="button"
                onClick={toggleMobile}
                aria-expanded={mobileOpen}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10.5px] font-medium transition-colors ${
                  mobileOpen ? "text-vk-700" : "text-ink/55"
                }`}
              >
                <span className="flex h-7 w-12 items-center justify-center rounded-full">
                  {mobileOpen ? (
                    <X className="h-[18px] w-[18px] stroke-[2.4px]" />
                  ) : (
                    <Menu className="h-[18px] w-[18px] stroke-[1.75px]" />
                  )}
                </span>
                More
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
