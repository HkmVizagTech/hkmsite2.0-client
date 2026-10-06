import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Globe2, Home as HomeIcon } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import { getT } from "@/lib/i18n/server";

const PRABHUPADA_IMG = "https://res.cloudinary.com/ddmzeqpkc/image/upload/prabhupada_home";

const facts = [
  { icon: Globe2, label: "Took Krishna consciousness worldwide", value: "1965" },
  { icon: HomeIcon, label: "Founded ISKCON in New York", value: "1966" },
  { icon: BookOpen, label: "Translated the Gita & Bhagavatam", value: "70+ vols" },
];

/** GVD "Fulfilling Srila Prabhupada's Dream" — full-width photo card with copy over a navy wash. */
export default async function DivineVision() {
  const t = await getT();
  return (
    <section className="vk-section">
      <div className="vk-container">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-vk-900 shadow-[0_30px_70px_-34px_rgba(10,18,51,0.75)]">
            <Image
              src={PRABHUPADA_IMG}
              alt={t("His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada")}
              fill
              sizes="(min-width: 1280px) 1248px, 100vw"
              className="-z-10 object-cover object-[70%_20%] grayscale-[35%]"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-vk-900 via-vk-900/85 to-vk-900/10" />
            <div className="grid gap-8 p-6 md:p-12 lg:grid-cols-[1.15fr_1fr] lg:p-14">
              <div className="max-w-xl">
                <span className="vk-pill-light mb-4">{t("Divine Vision")}</span>
                <h2 className="vk-h2 !text-white md:!text-[2.6rem]">
                  {t("Fulfilling Srila Prabhupada's mission in Visakhapatnam")}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-white/80 md:text-base">
                  {t("His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada, the Founder-Acharya of ISKCON, sailed to New York at the age of 69 to fulfil his spiritual master's order — to share the message of Lord Krishna with the whole world. Hare Krishna Vaikuntham is our humble offering to that mission: a temple, a kitchen for the hungry and a home for every sincere seeker in Vizag.")}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/founder" className="vk-btn-gold">
                    {t("Read the full story")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/blogs" className="vk-btn-ghost-light">
                    {t("His teachings")}
                  </Link>
                </div>
              </div>
              <div className="flex items-end lg:justify-end">
                <div className="grid w-full max-w-sm gap-3">
                  {facts.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                        <f.icon className="h-5 w-5 text-[hsl(var(--gold))]" />
                      </span>
                      <div>
                        <p className="text-xl font-extrabold leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                          {t(f.value)}
                        </p>
                        <p className="mt-1 text-[13px] text-white/75">{t(f.label)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
