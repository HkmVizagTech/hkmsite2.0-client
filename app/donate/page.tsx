"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, ShieldCheck, Sparkles,
  Gift, Award, Crown, ArrowRight,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import TempleCarousel from "@/components/TempleCarousel";
import { sevas, getSevaHref } from "@/lib/sevaConfig";

const PRIVILEGES = [
  { icon: Gift, title: "Prasadam at Home", desc: "Receive blessed prasadam delivered every month" },
  { icon: Sparkles, title: "Sankalpam Puja", desc: "Your name chanted in the temple's daily worship" },
  { icon: Award, title: "80G Tax Benefit", desc: "Government-recognized exemption certificate" },
  { icon: Crown, title: "Priority Access", desc: "VIP entry to special festivals and donor events" },
];

// The donation hub carousel shows each seva's own designed banner (same ones
// used at the top of the seva pages), linking through to the seva itself —
// instead of the home page hero banners.
const SEVA_SLIDES = [
  {
    src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785586948250-1785586945893-Gau-banner-desk.webp",
    mobileSrc: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785586947654-1785586945558-Gau-banner-mob.webp",
    title: "Gau Seva",
    linkUrl: "/gau-seva",
  },
  {
    src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785586501452-1785586500800-annadan-banner-desk.webp",
    mobileSrc: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785584926984-1785584925444-annadan-hero-mob.webp",
    title: "Anna Daan Seva",
    linkUrl: "/anna-daan-seva",
  },
  {
    src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785578235628-1785578235168-ChatGPTImageAug12026023314PM.webp",
    mobileSrc: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785578443691-1785578442854-ChatGPTImageAug12026032944PM.webp",
    title: "Gita Daan Seva",
    linkUrl: "/gita-daan-seva",
  },
  {
    src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785573838202-1785573837372-ChatGPTImageAug12026021301PM.webp",
    mobileSrc: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785580143643-1785580142535-vastraheromob.webp",
    title: "Vastra & Alankara Seva",
    linkUrl: "/alankara-vastra-seva",
  },
  {
    src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786528614525-1786528613759-ChatGPTImageAug122026022735PM.webp",
    mobileSrc: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786528614019-1786528613497-ChatGPTImageAug122026032403PM.webp",
    title: "Square Foot Seva",
    linkUrl: "/sqft-seva-campaign",
  },
  {
    src: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785588189215-1785588187426-brick-hero-desk.webp",
    mobileSrc: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785588190376-1785588188370-brick-hero-mob.webp",
    title: "Brick Seva",
    linkUrl: "/brick-seva-campaign",
  },
];

export default function DonateHubPage() {
  return (
    <PageLayout>
      <main className="bg-white dark:bg-background">
        {/* ══ HERO — common to all donations, no seva-specific numbers ══ */}
        <section className="overflow-hidden pt-[88px] md:pt-[104px]">
          <TempleCarousel slides={SEVA_SLIDES} fetchApiBanners={false} />
        </section>

        {/* ══ OTHER SEVAS GRID ══ */}
        <section id="sevas" className="border-t border-border py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">More Ways to Serve</p>
              <Ornament className="mb-5" />
              <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-5xl">
                Choose Your Seva
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Beyond temple construction, there are many ways to serve — each one a form of devotion.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sevas.map((seva) => {
                return (
                  <Link
                    key={seva.slug}
                    href={getSevaHref(seva)}
                    className="group overflow-hidden rounded-3xl border border-border bg-card shadow-warm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={seva.image}
                        alt={seva.title}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 92vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,85%,10%,0.78)] via-transparent to-transparent" />
                      <h3 className="absolute bottom-4 left-5 font-heading text-xl font-bold text-white">
                        {seva.icon} {seva.title}
                      </h3>
                    </div>
                    <div className="p-6">
                      <p className="mb-5 text-xs text-muted-foreground">{seva.tagline}</p>
                      <span className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-[15px] font-bold text-[hsl(220,60%,12%)] shadow-gold">
                        🪔 Sponsor {seva.shortTitle} <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ MANDIR NIRMAN SEVA — dedicated section, detailed treatment ══ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -inset-3 -rotate-2 rounded-2xl bg-gradient-gold opacity-15" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-elevated">
                  <Image
                    src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672822355-1783672821116-ChatGPTImageJul92026043238PM.png"
                    alt="Mandir Nirman Seva — temple construction"
                    fill
                    sizes="(min-width: 1024px) 480px, 92vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(220,60%,12%)]">
                  🏛️ Flagship Campaign
                </span>
                <Ornament className="mb-4 !justify-start" />
                <h2 className="mb-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
                  Mandir Nirman Seva
                </h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Be part of building the Hare Krishna Vaikuntham Temple, Visakhapatnam — every square
                  foot you sponsor becomes a permanent, eternal offering laid into the foundation of the
                  Lord&apos;s home.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/sqft-seva-campaign"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
                  >
                    🪔 Donate Now
                  </Link>
                  <Link
                    href="/sqft-seva-campaign/register"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Start Your Own Campaign
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ DONOR PRIVILEGES ══ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-3 font-heading text-2xl font-bold text-foreground md:text-3xl">
                Donor Privileges
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Every devotee who contributes receives these blessings
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              {PRIVILEGES.map((p) => (
                <div key={p.title} className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(42,92%,56%,0.12)] text-gold">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BOTTOM CTA ══ */}
        <section className="relative overflow-hidden bg-gradient-ocean py-16 text-center md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-3 font-heading text-2xl font-bold text-white md:text-4xl">
              Be Part of Building Vizag&apos;s Grandest Temple
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/85">
              Every contribution — big or small — brings us closer to completing this divine vision for Lord Krishna.
            </p>
            <Link
              href="/sqft-seva-campaign"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5 md:text-base"
            >
              <Heart className="h-4 w-4 fill-current" /> Donate Now
            </Link>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/70">
              <ShieldCheck className="h-3.5 w-3.5" /> Secured by Razorpay · 80G Tax Exempt
            </p>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
