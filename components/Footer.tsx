"use client";

import { Facebook, Instagram, Youtube, Phone, Mail, Heart, ArrowUp, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Founder", href: "/founder" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Blogs", href: "/blogs" },
];

const sevaLinks = [
  { label: "Sevas", href: "/sevas" },
  { label: "Subhojanam", href: "/subhojanam" },
  { label: "Anna-Daan Seva", href: "/anna-daan-seva" },
  { label: "Daily Schedule", href: "/daily-schedule" },
  { label: "Donate", href: "/donate" },
  { label: "Contact Us", href: "/contact" },
];

const scheduleItems = [
  "Mangala Aarti - 4:30 AM",
  "Shringar Aarti - 7:30 AM",
  "Bhagavatam Class - 8:15 AM",
  "Rajbhog Aarti - 12:00 PM",
  "Dhoop Aarti - 4:30 PM",
  "Sandhya Aarti - 7:00 PM",
  "Shayan Aarti - 8:15 PM",
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative">
      <div className="bg-gradient-navy py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <div>
            <h3 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              Support the Temple Mission
            </h3>
            <p className="mt-1 max-w-lg text-primary-foreground/80">
              Your generous contribution helps us serve prasadam, conduct festivals, and spread devotion.
            </p>
          </div>
          <Button size="lg" variant="secondary" className="shrink-0 rounded-full px-8 text-base font-semibold" asChild>
            <Link href="/donate">
              Donate Now <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative h-[300px] w-full overflow-hidden md:h-[400px]">
        <Image
          src="/assets/home-footer-bg.webp"
          alt="Hare Krishna Vaikuntham Temple Vizag"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,90%,12%,0.25)] via-transparent to-foreground" />
      </div>

      <div className="bg-foreground pb-8 pt-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-5">
                <span className="block text-xl font-bold leading-tight text-background">Hare Krishna Movement</span>
                <span className="text-xs uppercase tracking-widest text-background/60">Visakhapatnam</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-background/50">
                Hare Krishna Marg, Visakhapatnam,
                <br />
                Andhra Pradesh, India - 530003
              </p>
              <div className="mb-4 flex gap-3">
                {[
                  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background/60 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="relative mb-5 text-lg font-semibold text-background">
                Daily Schedule
                <span className="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-primary" />
              </h4>
              <div className="mt-4 space-y-2">
                {scheduleItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-background/50">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="relative mb-5 text-lg font-semibold text-background">
                Quick Links
                <span className="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-primary" />
              </h4>
              <div className="mt-4 space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-background/50 transition-all duration-200 hover:translate-x-1 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="relative mb-5 text-lg font-semibold text-background">
                Get in Touch
                <span className="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-primary" />
              </h4>
              <div className="mt-4 space-y-4">
                {sevaLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-background/50 transition-all duration-200 hover:translate-x-1 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="tel:+919063020108"
                  className="group mt-4 flex items-start gap-3 text-sm text-background/50 transition-colors hover:text-primary"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 group-hover:text-primary" />
                  <span>+91 9063 020 108</span>
                </a>
                <a
                  href="mailto:info@harekrishnavizag.org"
                  className="group flex items-start gap-3 text-sm text-background/50 transition-colors hover:text-primary"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 group-hover:text-primary" />
                  <span>info@harekrishnavizag.org</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-6 md:flex-row">
            <p className="flex items-center gap-1 text-sm text-background/40">
              Copyright {new Date().getFullYear()} Hare Krishna Movement India, Visakhapatnam. Made with
              <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> for devotion.
            </p>
            <div className="flex items-center gap-4 text-xs text-background/40">
              <Link href="/privacy-policy" className="transition-colors hover:text-primary">Privacy Policy</Link>
              <span className="text-background/20">·</span>
              <Link href="/terms-and-conditions" className="transition-colors hover:text-primary">Terms</Link>
              <span className="text-background/20">·</span>
              <Link href="/refund-policy" className="transition-colors hover:text-primary">Refunds</Link>
            </div>
            <button
              onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background/60 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
