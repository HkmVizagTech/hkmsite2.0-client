import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart, Heart, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Reveal from "@/components/site/Reveal";
import { GoldPetals } from "@/components/home/HomeMagic";
import { getT } from "@/lib/i18n/server";

const TEMPLE_IMG =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784644186447-1784644185742-WhatsAppImage2026-07-03at1.56.13PM1.jpeg";

/**
 * Closing banner: "Be a part of the Lord's divine seva" on midnight blue with the temple gopuram shown clearly on the
 * right (golden rays behind it, petals falling), and "Volunteer to Serve" as a glass strip along the bottom.
 */
export default function JoinCTA({ lang }: { lang: string }) {
  const t = getT(lang);
  return (
    <section className="pb-6 pt-6 md:pb-10 md:pt-10">
      <div className="vk-container">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-[radial-gradient(80%_100%_at_75%_30%,#22409A_0%,#11225E_50%,#0A1640_100%)] text-white shadow-[0_40px_80px_-40px_rgba(10,22,64,.85)] ring-1 ring-[#F6C752]/35">
            <GoldPetals count={12} />

            {/* temple gopuram: clear on the right, fading into the blue */}
            <div className="relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[52%]">
              <div aria-hidden className="sp-rays absolute left-1/2 top-[45%] -z-10 aspect-square w-[150%] -translate-x-1/2 opacity-70" />
              <Image
                src={TEMPLE_IMG}
                alt={t("Hare Krishna Vaikuntham Temple, Visakhapatnam")}
                fill
                sizes="(min-width: 1024px) 680px, 100vw"
                className="object-cover object-center [mask-image:linear-gradient(180deg,#000_60%,transparent)] lg:[mask-image:linear-gradient(90deg,transparent,#000_30%)]"
              />
            </div>

            <div className="relative px-6 pb-6 pt-2 md:px-12 md:pb-10 lg:min-h-[560px] lg:w-[56%] lg:px-14 lg:pb-44 lg:pt-14">
              <span className="vk-pill-light mb-4 inline-flex">{t("Join Our Divine Journey")}</span>
              <h2 className="vk-h2 hm-gold md:!text-[3rem]">{t("Be a part of the Lord's divine seva")}</h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/80 md:text-base">
                {t("Every contribution and every visit is an offering at the lotus feet of the Lord. Help us build Hare Krishna Vaikuntham — a centre of devotion, simplicity and spiritual awakening for Visakhapatnam.")}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/donate" className="vk-btn-gold">
                  <Heart className="h-4 w-4 fill-current" /> {t("Donate Now")}
                </Link>
                <Link href="/contact" className="vk-btn-ghost-light">
                  <MapPin className="h-4 w-4" /> {t("Visit the temple")}
                </Link>
              </div>
            </div>

            {/* volunteer strip */}
            <div className="relative mx-4 mb-4 md:mx-6 md:mb-6 lg:absolute lg:inset-x-6 lg:bottom-6 lg:m-0 lg:max-w-[56%]">
              <div className="flex flex-col gap-4 rounded-2xl border border-[#F6C752]/35 bg-white/[0.08] p-5 backdrop-blur-md sm:flex-row sm:items-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F6C752] text-[#1A1240] shadow-[0_0_20px_rgba(246,199,82,.5)]">
                  <HandHeart className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif-display text-xl font-bold text-[#FFE6A3]">{t("Volunteer to Serve")}</h3>
                  <p className="mt-0.5 text-[13.5px] leading-snug text-white/75">
                    {t("Serve at festivals, prasadam distribution and outreach — and be spiritually transformed.")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link href="/volunteer" className="vk-btn !h-10 bg-white !px-4 text-sm text-vk-800 hover:bg-vk-50">
                    {t("Register")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://whatsapp.com/channel/0029VaZDEG67T8bWHjibTy2u"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("WhatsApp Channel")}
                    className="vk-btn-ghost-light !h-10 !px-4 text-sm"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-current" /> {t("WhatsApp")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
