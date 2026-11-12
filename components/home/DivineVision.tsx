import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Globe2, Home as HomeIcon } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import { getT } from "@/lib/i18n/server";
import { GoldPetals } from "@/components/home/HomeMagic";

// Srila Prabhupada's smiling portrait (R2), shown whole in a gold arch.
const PRABHUPADA_IMG = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/srila-prabhupada/prabhupada-portrait.webp";

const facts = [
  { icon: Globe2, label: "Took Krishna consciousness worldwide", value: "1965" },
  { icon: HomeIcon, label: "Founded ISKCON in New York", value: "1966" },
  { icon: BookOpen, label: "Translated the Gita & Bhagavatam", value: "70+ vols" },
];

/** GVD "Fulfilling Srila Prabhupada's Dream" — full-width photo card with copy over a navy wash. */
export default function DivineVision({ lang }: { lang: string }) {
  const t = getT(lang);
  return (
    <section className="vk-section">
      <div className="vk-container">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-[radial-gradient(80%_90%_at_80%_40%,#22409A_0%,#11225E_50%,#0A1640_100%)] shadow-[0_30px_70px_-34px_rgba(10,18,51,0.75)]">
            <GoldPetals count={12} />
            <div className="grid items-center gap-10 p-6 md:p-12 lg:grid-cols-[1.2fr_.8fr] lg:p-14">
              <div className="max-w-xl">
                <span className="vk-pill-light mb-4">{t("Divine Vision")}</span>
                <h2 className="vk-h2 hm-gold md:!text-[2.6rem]">
                  {t("Fulfilling Srila Prabhupada's mission in Visakhapatnam")}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-white/80 md:text-base">
                  {t("His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada, the Founder-Acharya of ISKCON, sailed to New York at the age of 69 to fulfil his spiritual master's order — to share the message of Lord Krishna with the whole world. Hare Krishna Vaikuntham is our humble offering to that mission: a temple, a kitchen for the hungry and a home for every sincere seeker in Vizag.")}
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2.5">
                  {facts.map((f) => (
                    <div key={f.label} className="rounded-2xl border border-[#F6C752]/30 bg-white/[0.06] p-3 text-white backdrop-blur-md">
                      <f.icon className="h-4 w-4 text-[hsl(var(--gold))]" />
                      <p className="mt-2 text-lg font-extrabold leading-none text-[#FFE6A3] md:text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                        {t(f.value)}
                      </p>
                      <p className="mt-1 text-[11.5px] leading-snug text-white/70 md:text-[12.5px]">{t(f.label)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/founder" className="vk-btn-gold">
                    {t("Read the full story")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/blogs" className="vk-btn-ghost-light">
                    {t("His teachings")}
                  </Link>
                </div>
              </div>

              {/* Srila Prabhupada in a gold arch, golden rays turning behind him */}
              <div className="relative mx-auto w-full max-w-[300px] md:max-w-[340px]">
                <div aria-hidden className="sp-rays absolute left-1/2 top-1/2 -z-10 aspect-square w-[190%] -translate-x-1/2 opacity-80" />
                <div aria-hidden className="absolute -inset-4 rounded-t-[999px] rounded-b-[2rem] bg-[radial-gradient(circle,rgba(246,199,82,.35),transparent_70%)] blur-xl" />
                <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-[3px] border-[#F6C752]/80 bg-[#0A1640] p-2 shadow-[0_0_60px_-10px_rgba(246,199,82,.55)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.6rem]">
                    <Image src={PRABHUPADA_IMG} alt={t("His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada")} fill sizes="340px" className="object-cover object-top" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
