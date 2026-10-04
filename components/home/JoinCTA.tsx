import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart, Heart } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Reveal from "@/components/site/Reveal";

/** GVD closing pair: "Volunteer to Serve" + "Join Our Divine Journey" banner. */
export default function JoinCTA() {
  return (
    <section className="pb-4 pt-6 md:pt-10">
      <div className="vk-container grid gap-5 lg:grid-cols-[1fr_1.35fr]">
        <Reveal>
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 to-vk-800 p-7 text-white md:p-9">
            <div aria-hidden className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/10" />
            <div aria-hidden className="absolute -right-6 top-10 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <HandHeart className="h-6 w-6" />
              </span>
              <h2 className="vk-h2 !text-white">Volunteer to Serve</h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/80">
                Offer your time and talents in the loving service of Sri Sri Radha Madan Mohan. Support festivals,
                prasadam distribution and outreach — come serve and be spiritually transformed.
              </p>
            </div>
            <div className="relative mt-6 flex flex-wrap gap-3">
              <Link href="/volunteer" className="vk-btn bg-white text-vk-800 hover:bg-vk-50">
                Register as Volunteer <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://whatsapp.com/channel/0029VaZDEG67T8bWHjibTy2u"
                target="_blank"
                rel="noopener noreferrer"
                className="vk-btn-ghost-light"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                WhatsApp Channel
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative isolate h-full min-h-[320px] overflow-hidden rounded-3xl bg-vk-900">
            <Image
              src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784644186447-1784644185742-WhatsAppImage2026-07-03at1.56.13PM1.jpeg"
              alt="Hare Krishna Vaikuntham Temple, Visakhapatnam"
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="-z-10 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-vk-900/95 via-vk-800/80 to-vk-700/20" />
            <div className="flex h-full max-w-lg flex-col justify-center p-7 text-white md:p-10">
              <span className="vk-pill-light mb-4 self-start">Join Our Divine Journey</span>
              <h2 className="vk-h2 !text-white">Be a part of the Lord&apos;s divine seva</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">
                Every contribution and every visit is an offering at the lotus feet of the Lord. Help us build Hare
                Krishna Vaikuntham — a centre of devotion, simplicity and spiritual awakening for Visakhapatnam.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/donate" className="vk-btn-gold">
                  <Heart className="h-4 w-4 fill-current" /> Donate Now
                </Link>
                <Link href="/contact" className="vk-btn-ghost-light">
                  Visit the temple
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
