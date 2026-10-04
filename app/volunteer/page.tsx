"use client";

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
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import WhatsAppIcon from "@/components/WhatsAppIcon";
// Volunteer registration is handled entirely inside the Vaikuntham app (the
// VCC volunteer system does not accept sign-ups made from this website), so
// the store links live in one shared place — see VaikunthamAppPromo.
import { AppStoreButtons } from "@/components/VaikunthamAppPromo";

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


export default function VolunteerPage() {
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero
          title="Volunteer"
          subtitle="Join the seva of the Hare Krishna Movement Visakhapatnam — volunteer for temple programs, festivals and community service."
          breadcrumb="Volunteer"
          backgroundImage="/assets/about-community.jpg"
        />

        {/* Why Volunteer */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Why Volunteer" title="The Joy of Selfless Service" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {WHY_VOLUNTEER.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="vk-card vk-card-hover h-full p-6">
                    <span className="vk-icon-chip mb-4 h-12 w-12">
                      <item.icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Register in the Vaikuntham app */}
        <section id="register" className="vk-section vk-band scroll-mt-[var(--header-h)]">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="How To Register"
              title="Volunteer Through the Vaikuntham App"
              subtitle={
                <>
                  All volunteer sign-ups for Hare Krishna Movement Vizag now happen in our official{" "}
                  <strong className="text-foreground">Vaikuntham</strong> app. Install it once to see every upcoming
                  seva opportunity, register in a tap, and receive your duty reminders directly on your phone.
                </>
              }
            />

            {/* Steps */}
            <ol className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3 md:mb-10 md:gap-5">
              {HOW_IT_WORKS.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 0.08}>
                  <div className="vk-card relative h-full p-6">
                    <span className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-vk-700 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="vk-icon-chip mb-4 h-12 w-12">
                      <step.icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/* Download buttons */}
            <Reveal>
              <div className="relative isolate mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 via-vk-700 to-vk-900 p-6 text-center md:p-10">
                <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-white/10" />
                <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-56 w-56 rounded-full bg-vk-500/25" />
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <Smartphone className="h-6 w-6" />
                </span>
                <h3 className="vk-h2 !text-white">Get the Vaikuntham App</h3>
                <p className="mx-auto mb-7 mt-3 max-w-lg text-[15px] text-white/85 md:text-base">
                  Free to download. Registration takes less than two minutes.
                </p>

                <AppStoreButtons className="justify-center" />

                <p className="mt-6 text-xs text-white/70 md:text-sm">
                  Search for <strong className="text-white">&ldquo;Vaikuntham&rdquo;</strong> if
                  the link does not open your store automatically.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="vk-section">
          <div className="vk-container">
            <Reveal>
              <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-vk-100 bg-gradient-to-br from-vk-100 via-vk-50 to-white p-6 text-center md:flex-row md:p-10 md:text-left">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg">
                  <WhatsAppIcon className="h-7 w-7 fill-current" />
                </span>
                <div className="flex-1">
                  <h2 className="vk-h3">Need Help Getting Started?</h2>
                  <p className="vk-lead mt-2">
                    Having trouble with the app, or looking for a way to serve that
                    isn&apos;t listed? Message us and a devotee will guide you personally.
                  </p>
                </div>
                <a
                  href="https://wa.me/918977761187?text=Hare%20Krishna!%20I%20would%20like%20to%20volunteer%20at%20HKM%20Vizag."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vk-btn-primary shrink-0 px-6 py-3"
                >
                  <WhatsAppIcon className="h-5 w-5 fill-current" />
                  Chat With Us on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
