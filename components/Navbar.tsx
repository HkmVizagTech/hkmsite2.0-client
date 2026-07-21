"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, Sun, Moon, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ISKLogo from "@/assets/ISKCONGambheeramLogo.jpeg";
import HKVTLogo from "@/assets/HKVTLogo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Founder", href: "/founder" },
  { label: "Seva's", href: "/sevas" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blogs" },
  { label: "Schedule", href: "/daily-schedule" },
  { label: "Subhojanam", href: "/subhojanam" },
  { label: "Anna-Daan", href: "/anna-daan-seva" },
  { label: "Contact", href: "/contact" },
];

// Real temple darshan windows (source of truth — keep /daily-schedule's
// displayed timings in sync with this if it's ever updated again):
//   4:30 AM – 5:00 AM    (Mangala Aarti darshan)
//   7:15 AM – 12:20 PM   (morning darshan through Raj Bhog)
//   4:15 PM – 8:15 PM    (evening darshan through Shayan Aarti)
// Computed against India Standard Time specifically — NOT the visitor's
// local timezone, since devotees browsing from abroad should see the
// temple's actual current status, not a status based on their own clock.
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

  // Closed — figure out which reopening time is next, for a helpful label.
  const nextWindow = DARSHAN_WINDOWS.find((w) => minutesNow < w.startMin);
  const reopenLabel = nextWindow
    ? `Reopens ${nextWindow.label.split("· ")[1].split(" – ")[0]}`
    : "Reopens 4:30 AM";
  return { isOpen: false, label: `Darshan Closed · ${reopenLabel}` };
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darshanStatus, setDarshanStatus] = useState(getDarshanStatus());

  useEffect(() => {
    // Recompute every minute so the indicator flips live at 1:00 PM,
    // 4:30 PM, etc. without needing a page refresh.
    const interval = setInterval(() => setDarshanStatus(getDarshanStatus()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Persist theme choice — previously the toggle reset to light on every
  // navigation because this state remounts per page (colour "inversion" bug).
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hkm-theme");
      if (stored === "dark") setDarkMode(true);
    } catch {}
  }, []);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("hkm-theme", darkMode ? "dark" : "light");
    } catch {}
  }, [darkMode]);

  return (
    <>
      {
}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-gradient-navy text-primary-foreground"
          >
            <div className="container mx-auto flex h-8 items-center justify-between px-3 text-[10px] md:h-10 md:px-4 md:text-xs">
              <div className="flex items-center gap-4">
                <a href="tel:+919666611108" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                  <Phone className="w-3 h-3" />
                  <span>+91 96666 11108</span>
                </a>
                <a href="mailto:info.vizag@hkm-group.org" className="hidden sm:flex items-center gap-1.5 hover:text-secondary transition-colors">
                  <Mail className="w-3 h-3" />
                  <span>info.vizag@hkm-group.org</span>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      darshanStatus.isOpen ? "bg-green-400 animate-pulse" : "bg-white/40"
                    }`}
                  />
                  <Clock className="w-3 h-3" />
                  <span suppressHydrationWarning>{darshanStatus.label}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {
}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "top-2 mx-2 md:mx-8 rounded-2xl bg-background/92 backdrop-blur-xl shadow-elevated border border-border/50"
            : "top-8 md:top-10 bg-background/84 backdrop-blur-sm"
        }`}
      >
        <div className={`container mx-auto flex items-center justify-between ${
          scrolled ? "px-4 h-12 md:px-5 md:h-14" : "px-3 h-14 md:px-4 md:h-16"
        }`}>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={typeof ISKLogo === 'string' ? ISKLogo : ISKLogo.src}
              alt="ISKCON Visakhapatnam - Hare Krishna Movement Vizag"
              width={scrolled ? 64 : 74}
              height={scrolled ? 64 : 74}
              priority
              loading="eager"
              className="w-auto transition-all duration-300"
              style={{ width: 'auto' }}
            />
            {/* Secondary mark for the Vaikuntam temple project — hidden on
                mobile (hidden md:flex) since the compact mobile header has
                no room for two logos alongside the hamburger + toggle. */}
            <div className="hidden md:flex items-center gap-3">
              <span className="h-8 w-px bg-border" aria-hidden />
              <Image
                src={typeof HKVTLogo === 'string' ? HKVTLogo : HKVTLogo.src}
                alt="Hare Krishna Vaikuntam Cultural Complex"
                // width/height here just need to match the real aspect ratio
                // (2438x825 ≈ 2.96:1) so Next requests a properly
                // high-resolution source image -- the actual DISPLAYED size
                // is controlled by the height in the style prop below.
                // (Using a small width here was the bug: Next's optimizer
                // generates the file at that width, so the source image
                // itself came out only ~16px tall no matter what CSS said.)
                width={300}
                height={101}
                className="transition-all duration-300"
                style={{ height: scrolled ? '42px' : '48px', width: 'auto' }}
              />
            </div>
          </Link>

          {
}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap px-2.5 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-secondary rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button
              variant="default"
              className="rounded-full px-5 bg-gradient-ocean text-primary-foreground border-0 hover:opacity-90"
              asChild
            >
              <Link href="/donate">
                <Heart className="w-4 h-4 mr-1.5 fill-current" />
                Donate Now
              </Link>
            </Button>
          </div>

          {
}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {
}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden bg-background backdrop-blur-md border-t border-border overflow-hidden rounded-b-2xl"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="default"
                  className="mt-2 rounded-full bg-gradient-ocean text-primary-foreground border-0"
                  asChild
                >
                  <Link href="/donate">
                    <Heart className="w-4 h-4 mr-1.5 fill-current" />
                    Donate Now
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
