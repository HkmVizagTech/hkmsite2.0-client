"use client";

import { motion } from "framer-motion";
import {
  Heart,
  HandHeart,
  Users,
  Sparkles,
  Smartphone,
  UserPlus,
  CalendarCheck,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import TempleCarousel from "@/components/TempleCarousel";
import Ornament from "@/components/Ornament";

// ─────────────────────────────────────────────────────────────
// Vaikuntham app store links.
//
// Volunteer registration is handled entirely inside the Vaikuntham
// app (the VCC volunteer system does not accept sign-ups made from
// this website), so these two URLs are the only way a devotee can
// register.
// ─────────────────────────────────────────────────────────────
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=in.harekrishnavizag";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/vaikuntham/id6774589633";

const WHY_VOLUNTEER = [
  {
    icon: Heart,
    title: "Serve the Lord",
    desc: "Every act of service in the temple is an offering to Lord Krishna — the highest form of devotion.",
  },
  {
    icon: Users,
    title: "Build Community",
    desc: "Connect with like-minded devotees and create lasting bonds through selfless service together.",
  },
  {
    icon: Sparkles,
    title: "Spiritual Growth",
    desc: "Volunteering purifies the heart and accelerates your spiritual journey through karma yoga.",
  },
  {
    icon: HandHeart,
    title: "Make an Impact",
    desc: "Help distribute prasadam, organize festivals, and bring smiles to thousands of visitors.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Smartphone,
    title: "Install Vaikuntham",
    desc: "Download the free Vaikuntham app on Android or iPhone — it is our official volunteer platform.",
  },
  {
    icon: UserPlus,
    title: "Create Your Profile",
    desc: "Sign up with your mobile number and tell us the sevas and timings that suit you best.",
  },
  {
    icon: CalendarCheck,
    title: "Pick Your Seva",
    desc: "Browse upcoming festivals and temple activities in the app and confirm your slot in a tap.",
  },
];

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.51 1.51 0 01-.61-1.21V3.024c0-.474.24-.898.61-1.21zm10.89 10.89l2.302 2.302-10.937 6.22 8.635-8.522zm3.7-3.65l2.74 1.559c.83.472.83 1.303 0 1.775l-2.74 1.558-2.58-2.446 2.58-2.446zM4.864 1.15l10.937 6.22-2.302 2.302L4.864 1.15z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.05 12.536c-.026-2.657 2.17-3.93 2.27-3.993-1.236-1.807-3.16-2.055-3.844-2.083-1.636-.165-3.194.962-4.025.962-.83 0-2.11-.938-3.468-.912-1.785.026-3.43 1.038-4.35 2.636-1.853 3.213-.474 7.968 1.331 10.573.882 1.276 1.934 2.71 3.317 2.658 1.331-.053 1.834-.861 3.443-.861 1.61 0 2.062.861 3.47.835 1.432-.026 2.339-1.301 3.216-2.582 1.014-1.48 1.43-2.914 1.456-2.988-.032-.014-2.792-1.072-2.818-4.245zM14.47 4.5c.735-.89 1.231-2.129 1.096-3.363-1.06.043-2.343.706-3.103 1.596-.681.789-1.278 2.05-1.117 3.26 1.183.092 2.39-.601 3.124-1.493z" />
    </svg>
  );
}

export default function VolunteerPage() {
  return (
    <PageLayout>
      {/* HERO */}
      <section className="overflow-hidden pt-[88px] md:pt-[104px]">
        <TempleCarousel />
      </section>

      {/* Why Volunteer */}
      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3 font-medium">
              Why Volunteer
            </p>
            <Ornament className="mb-5" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              The Joy of Selfless Service
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_VOLUNTEER.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Register in the Vaikuntham app */}
      <section
        id="register"
        className="py-12 md:py-16 bg-white dark:bg-background border-t border-border"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3 font-medium">
              How To Register
            </p>
            <Ornament className="mb-5" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Volunteer Through the Vaikuntham App
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              All volunteer sign-ups for Hare Krishna Movement Vizag now happen
              in our official <strong className="text-foreground">Vaikuntham</strong> app.
              Install it once to see every upcoming seva opportunity, register in
              a tap, and receive your duty reminders directly on your phone.
            </p>
          </div>

          {/* Steps */}
          <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative rounded-2xl border border-border bg-card p-6 text-center"
              >
                <span className="absolute right-4 top-4 font-heading text-3xl font-bold text-primary/10">
                  {i + 1}
                </span>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Download buttons */}
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-ocean p-8 text-center md:p-10">
            <h3 className="mb-2 font-heading text-2xl font-bold text-white md:text-3xl">
              Get the Vaikuntham App
            </h3>
            <p className="mx-auto mb-8 max-w-lg text-sm text-white/85 md:text-base">
              Free to download. Registration takes less than two minutes.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-left transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                <GooglePlayIcon className="h-7 w-7 shrink-0 text-[hsl(220,60%,12%)]" />
                <span className="leading-tight text-[hsl(220,60%,12%)]">
                  <span className="block text-[10px] uppercase tracking-wide opacity-70">
                    Get it on
                  </span>
                  <span className="block text-base font-bold">Google Play</span>
                </span>
              </a>

              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-left transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                <AppleIcon className="h-7 w-7 shrink-0 text-[hsl(220,60%,12%)]" />
                <span className="leading-tight text-[hsl(220,60%,12%)]">
                  <span className="block text-[10px] uppercase tracking-wide opacity-70">
                    Download on the
                  </span>
                  <span className="block text-base font-bold">App Store</span>
                </span>
              </a>
            </div>

            <p className="mt-6 text-xs text-white/70">
              Search for <strong className="text-white">&ldquo;Vaikuntham&rdquo;</strong> if
              the link does not open your store automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-white py-16 text-center dark:bg-background md:py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="mb-3 font-heading text-2xl font-bold text-foreground md:text-4xl">
            Need Help Getting Started?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Having trouble with the app, or looking for a way to serve that
            isn&apos;t listed? Message us and a devotee will guide you personally.
          </p>
          <a
            href="https://wa.me/918977761187?text=Hare%20Krishna!%20I%20would%20like%20to%20volunteer%20at%20HKM%20Vizag."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5 md:text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat With Us on WhatsApp
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
