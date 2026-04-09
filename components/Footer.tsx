"use client";

import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Heart, ArrowUp, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Founder", href: "/founder" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
];

const sevaLinks = [
  { label: "Seva's", href: "/sevas" },
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
      {
}
      <div className="bg-gradient-navy py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground">
              Support the Temple Mission
            </h3>
            <p className="text-primary-foreground/80 mt-1 max-w-lg">
              Your generous contribution helps us serve prasadam, conduct festivals, and spread devotion.
            </p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="shrink-0 text-base font-semibold px-8 rounded-full"
            asChild
          >
            <Link href="/donate">
              Donate Now <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {
}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src="/assets/vizag-temple-4.jpeg"
          alt="Hare Krishna Vaikuntham Temple Vizag"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,90%,12%,0.3)] via-transparent to-foreground" />
      </div>

      {
}
      <div className="bg-foreground pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {
}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-5">
                <span className="font-bold text-xl text-background block leading-tight">
                  Hare Krishna Movement
                </span>
                <span className="text-xs text-background/60 tracking-widest uppercase">
                  Visakhapatnam
                </span>
              </div>
              <p className="text-background/50 text-sm leading-relaxed mb-4">
                Hare Krishna Marg, Visakhapatnam,
                <br />
                Andhra Pradesh, India - 530003
              </p>
              <div className="flex gap-3 mb-4">
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
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {
}
            <div>
              <h4 className="font-semibold text-background text-lg mb-5 relative">
                Daily Schedule
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
              </h4>
              <div className="space-y-2 mt-4">
                {scheduleItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-background/50">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {
}
            <div>
              <h4 className="font-semibold text-background text-lg mb-5 relative">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
              </h4>
              <div className="space-y-3 mt-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-background/50 hover:text-primary hover:translate-x-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {
}
            <div>
              <h4 className="font-semibold text-background text-lg mb-5 relative">
                Get in Touch
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-full" />
              </h4>
              <div className="space-y-4 mt-4">
                {sevaLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-background/50 hover:text-primary hover:translate-x-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="tel:+919876543210"
                  className="flex items-start gap-3 text-sm text-background/50 hover:text-primary transition-colors group mt-4"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-primary" />
                  <span>+91 98765 43210</span>
                </a>
                <a
                  href="mailto:info@harekrishnavizag.org"
                  className="flex items-start gap-3 text-sm text-background/50 hover:text-primary transition-colors group"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-primary" />
                  <span>info@harekrishnavizag.org</span>
                </a>
              </div>
            </div>
          </div>

          {
}
          <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/40 text-sm flex items-center gap-1">
              © {new Date().getFullYear()} Hare Krishna Movement India, Visakhapatnam. Made with{" "}
              <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> for devotion.
            </p>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
