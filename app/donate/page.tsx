"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart, ShieldCheck, Sparkles,
  Gift, Award, Crown, ArrowRight, Building2,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import TempleCarousel from "@/components/TempleCarousel";
import FestivalDonationsSection from "@/components/FestivalDonationsSection";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { sevas, getSevaHref } from "@/lib/sevaConfig";

const inr = (n: number) => n.toLocaleString("en-IN");

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
      <main className="bg-white pt-[var(--header-h)] dark:bg-background">
        {/* ══ HERO — each seva's own designed banner, linking through to it ══ */}
        <section className="overflow-hidden">
          <TempleCarousel slides={SEVA_SLIDES} fetchApiBanners={false} />
        </section>

        {/* ══ SEVA TILE GRID (GVD "Donate Generously") ══ */}
        <section id="sevas" className="vk-section scroll-mt-28">
          <div className="vk-container">
            <SectionHeading
              as="h1"
              align="center"
              eyebrow="More Ways to Serve"
              title="Choose Your Seva"
              subtitle="Beyond temple construction, there are many ways to serve — each one a form of devotion."
            />

            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3">
              {sevas.map((seva, index) => {
                const from = seva.tiers.length ? Math.min(...seva.tiers.map((t) => t.amount)) : undefined;
                return (
                  <Reveal key={seva.slug} delay={(index % 6) * 0.05} className="min-w-0">
                    <Link href={getSevaHref(seva)} className="vk-tile group block aspect-square sm:aspect-[4/3]">
                      <Image
                        src={seva.image}
                        alt={seva.title}
                        fill
                        sizes="(min-width: 1024px) 380px, 50vw"
                        className="object-cover"
                      />
                      <div className="vk-tile-caption">
                        <h3 className="text-[15px] font-bold leading-tight text-white md:text-xl">{seva.title}</h3>
                        <p className="mt-1 hidden text-[13px] leading-snug text-white/80 sm:line-clamp-2">
                          {seva.tagline}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          {from ? (
                            <p className="text-xs text-white/80 md:text-[13px]">From ₹{inr(from)}</p>
                          ) : (
                            <span />
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--gold))] px-2.5 py-1 text-[11px] font-bold text-ink shadow-gold transition-transform duration-300 group-hover:translate-x-0.5 md:px-3 md:py-1.5 md:text-xs">
                            <Heart className="h-3 w-3 fill-current" /> Donate
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ FESTIVAL SEVAS ══ */}
        <FestivalDonationsSection variant="donations" />

        {/* ══ MANDIR NIRMAN SEVA — flagship campaign ══ */}
        <section className="vk-section">
          <div className="vk-container">
            <Reveal>
              <div className="vk-card mx-auto grid max-w-6xl overflow-hidden !rounded-3xl md:grid-cols-[1fr_1.05fr]">
                <div className="relative min-h-[240px] md:min-h-[380px]">
                  <Image
                    src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672822355-1783672821116-ChatGPTImageJul92026043238PM.png"
                    alt="Mandir Nirman Seva — temple construction"
                    fill
                    sizes="(min-width: 768px) 560px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vk-900/40 to-transparent" />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <span className="vk-pill mb-4 self-start">
                    <Building2 className="h-3.5 w-3.5" /> Flagship Campaign
                  </span>
                  <h2 className="vk-h2">Mandir Nirman Seva</h2>
                  <p className="vk-lead mt-3">
                    Be part of building the Hare Krishna Vaikuntham Temple, Visakhapatnam — every square
                    foot you sponsor becomes a permanent, eternal offering laid into the foundation of the
                    Lord&apos;s home.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link href="/sqft-seva-campaign" className="vk-btn-gold h-12 px-7">
                      <Heart className="h-4 w-4 fill-current" /> Donate Now
                    </Link>
                    <Link href="/sqft-seva-campaign/register" className="vk-btn-outline h-12 px-7">
                      Start Your Own Campaign <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ DONOR PRIVILEGES ══ */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading
              align="center"
              title="Donor Privileges"
              subtitle="Every devotee who contributes receives these blessings"
            />
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {PRIVILEGES.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05}>
                  <div className="vk-card vk-card-hover h-full p-4 text-center md:p-5">
                    <span className="vk-icon-chip mx-auto mb-3">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mb-1 text-sm font-bold text-ink">{p.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BOTTOM CTA ══ */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-vk-800 via-vk-700 to-vk-500 px-6 py-12 text-center shadow-lift md:py-16">
              <div aria-hidden className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-white/10" />
              <div aria-hidden className="absolute -bottom-20 -left-10 -z-10 h-56 w-56 rounded-full bg-white/5" />
              <h2 className="vk-h2 mx-auto max-w-3xl !text-white">
                Be Part of Building Vizag&apos;s Grandest Temple
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/80">
                Every contribution — big or small — brings us closer to completing this divine vision for Lord Krishna.
              </p>
              <Link href="/sqft-seva-campaign" className="vk-btn-gold mt-7 h-12 px-8 text-[15px]">
                <Heart className="h-4 w-4 fill-current" /> Donate Now
              </Link>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/70">
                <ShieldCheck className="h-3.5 w-3.5" /> Secured by Razorpay · 80G Tax Exempt
              </p>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
