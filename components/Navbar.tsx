"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, Sun, Moon, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { label: "Schedule", href: "/daily-schedule" },
  { label: "Subhojanam", href: "/subhojanam" },
  { label: "Anna-Daan", href: "/anna-daan-seva" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
            <div className="container mx-auto px-4 flex items-center justify-between h-10 text-xs">
              <div className="flex items-center gap-4">
                <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                  <Phone className="w-3 h-3" />
                  <span>+91 98765 43210</span>
                </a>
                <a href="mailto:info@harekrishnavizag.org" className="hidden sm:flex items-center gap-1.5 hover:text-secondary transition-colors">
                  <Mail className="w-3 h-3" />
                  <span>info@harekrishnavizag.org</span>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <Clock className="w-3 h-3" />
                  <span>Darshan Open 4:30 - 20:30</span>
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
            ? "top-3 mx-4 md:mx-8 rounded-2xl bg-background/90 backdrop-blur-xl shadow-elevated border border-border/50"
            : "top-10 bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className={`container mx-auto flex items-center justify-between ${
          scrolled ? "px-5 h-14" : "px-4 h-16"
        }`}>
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/assets/logo.png" 
              alt="Hare Krishna Movement Vizag" 
              width={scrolled ? 32 : 40}
              height={scrolled ? 32 : 40}
              className="w-auto transition-all duration-300"
            />
          </Link>

          {
}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative ${
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
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
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
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground"
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border overflow-hidden rounded-b-2xl"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-left px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
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
