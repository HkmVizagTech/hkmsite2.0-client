"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, CheckCircle2 } from "lucide-react";
import Dust from "./Dust";
import Embers from "./Embers";
import { INTRO_DONE } from "./Intro";
import { useLocale } from "@/components/i18n/LocaleProvider";

// three.js scene, loaded in the browser only; the painted 2D layers below show until it is ready (and stay if WebGL is unavailable).
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export const KK = {
  sky: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/gita/kk-sky.webp",
  armies: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/gita/kk-armies.webp",
  chariot: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/gita/kk-chariot.webp",
  fieldPortrait: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/gita/kk-field-portrait.webp",
  moment: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/gita/kk-moment.webp",
};

/** Layered Kurukshetra sunrise: sky, armies and the chariot move at different depths; the chariot rides in on load. */
export default function KkHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { t, locale, setLocale } = useLocale();
  // The chariot waits for the opening sequence to lift, then charges in.
  const [go, setGo] = useState(false);
  useEffect(() => {
    const on = () => setGo(true);
    // When the opening titles were already seen this visit (or are skipped), the intro finishes before this listener
    // exists, so its "done" signal would be missed and the chariot would wait for the 4s fallback. Check directly.
    let seen = false;
    try { seen = sessionStorage.getItem("kk-intro-seen") === "1"; } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setGo(true); return; }
    window.addEventListener(INTRO_DONE, on);
    const fallback = setTimeout(on, 4200);
    return () => { window.removeEventListener(INTRO_DONE, on); clearTimeout(fallback); };
  }, []);
  const [webgl, setWebgl] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {}
  }, []);
  const onReady = useCallback(() => setReady3d(true), []);
  // 3D on larger screens only. Phones get the painted layers, which load faster and stay sharp.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const use3d = webgl && !reduce && wide;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const armyY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);
  const chariotX = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const textO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate h-[calc(100svh-var(--header-h)-var(--bottom-nav-space,0px))] max-h-[680px] min-h-[600px] overflow-hidden bg-[#06080F] text-white md:h-[calc(100svh-var(--header-h))] md:min-h-[640px] md:max-h-[920px]">
      {use3d && (
        <div className={`absolute inset-0 -z-20 transition-opacity duration-700 ${ready3d ? "opacity-100" : "opacity-0"}`}>
          <Hero3D go={go} onReady={onReady} />
        </div>
      )}
      <div className={`transition-opacity duration-700 ${ready3d ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      {/* sky */}
      <motion.div style={reduce ? undefined : { y: skyY }} className="absolute inset-0 -z-30 scale-105">
        <div className={`absolute inset-0 hidden md:block ${reduce ? "" : "kk-push"}`}><Image src={KK.sky} alt="" fill priority sizes="100vw" className="object-cover object-[70%_70%] [filter:saturate(1.15)_contrast(1.05)]" /></div>
        {/* phones: the portrait battlefield (armies on both sides, sun on the horizon, open ground for the chariot) */}
        <div className={`absolute inset-0 md:hidden ${reduce ? "" : "kk-push"}`}><Image src={KK.fieldPortrait} alt="" fill priority sizes="100vw" className="object-cover object-[50%_62%]" /></div>
      </motion.div>
      {/* sun glow breathing near the horizon */}
      <div aria-hidden className="kk-sun absolute bottom-[14%] right-[18%] -z-20 h-[46vmin] w-[46vmin] rounded-full bg-[radial-gradient(circle,rgba(255,214,120,.55),rgba(255,180,80,.18)_40%,transparent_70%)]" />
      </div>
      {/* readability scrim for the headline */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,6,14,.82)_0%,rgba(4,6,14,.35)_45%,transparent_70%)] md:bg-[linear-gradient(90deg,rgba(4,6,14,.9)_0%,rgba(4,6,14,.55)_36%,transparent_62%)]" />
      <div aria-hidden className={`pointer-events-none absolute inset-0 z-[1] ${ready3d ? "shadow-[inset_0_0_90px_10px_rgba(4,6,14,.6)]" : "shadow-[inset_0_0_180px_60px_rgba(4,6,14,.85)]"}`} />

      <div className={`transition-opacity duration-700 ${ready3d ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      {/* armies on the horizon */}
      <motion.div style={reduce ? undefined : { y: armyY }} className="absolute inset-x-0 bottom-0 -z-10 hidden md:block">
        <div className="relative left-1/2 w-[190vw] -translate-x-1/2 md:w-full">
          <Image src={KK.armies} alt="" width={2172} height={724} sizes="(min-width:768px) 100vw, 190vw" priority className="h-auto w-full" />
        </div>
      </motion.div>

      </div>
      {/* dust low on the ground, embers rising (the 3D scene draws its own) */}
      {!ready3d && <Dust className="absolute inset-x-0 bottom-0 h-1/3 w-full" count={50} />}
      {!ready3d && <Embers className="absolute inset-0 z-[4] h-full w-full" count={55} />}
      {!ready3d && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-[#06080F] to-transparent" />}

      {/* the chariot */}
      <div className={`absolute bottom-[4%] left-[6vw] z-[3] w-[88vw] transition-opacity duration-700 md:bottom-[4%] md:left-[46%] md:w-[min(46vw,760px)] ${ready3d ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      <motion.div style={reduce ? undefined : { x: chariotX }}>
        <motion.div
          initial={reduce ? false : { x: "-70vw", opacity: 0 }}
          animate={reduce || go ? { x: 0, opacity: 1 } : { x: "-70vw", opacity: 0 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div className={reduce ? "" : "kk-gallop"}>
            <Image src={KK.chariot} alt={t("Lord Krishna and Arjuna on the golden chariot at Kurukshetra")} width={1316} height={699} priority sizes="(min-width:768px) 46vw, 94vw" className="h-auto w-full drop-shadow-[0_18px_24px_rgba(10,18,51,.35)]" />
          </div>
        </motion.div>
        {/* dust kicked up behind the wheels */}
        <div aria-hidden className="kk-plume absolute -left-[6%] bottom-[2%] h-[22%] w-[45%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,220,160,.55),transparent_70%)] blur-xl" />
      </motion.div>
      </div>

      {/* headline */}
      <motion.div style={reduce ? undefined : { y: textY, opacity: textO }} className="vk-container relative z-[5] pt-9 text-center md:pt-[8vh] md:text-left">
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }} className="max-w-2xl md:max-w-[600px]">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gold)/0.55)] bg-vk-900/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--gold))]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--gold))]" /> {t("Free live course · Online")}
            </span>
            {/* English / Telugu switch (the site's floating language button is hidden on this page) */}
            <span className="inline-flex rounded-full border border-white/25 bg-vk-900/40 p-0.5 text-[11px] font-bold" role="group" aria-label="Language">
              {(["en", "te"] as const).map((l) => (
                <button key={l} type="button" onClick={() => l !== locale && setLocale(l)} aria-pressed={locale === l} className={`rounded-full px-3 py-1 transition ${locale === l ? "bg-[#F6C752] text-[#0A1233]" : "text-white/80 hover:text-white"}`}>
                  {l === "en" ? "English" : "తెలుగు"}
                </button>
              ))}
            </span>
          </div>
          <p className="mt-4 font-serif-display text-base italic text-[#FFE6A3] md:mt-5 md:text-2xl">{t("Every life has its Kurukshetra.")}</p>
          <h1 className="mt-3 font-[family-name:var(--font-cinzel),var(--font-telugu)] text-[1.75rem] font-bold uppercase leading-[1.08] tracking-[0.03em] md:text-[3.4rem]">
            <span className="block text-white [text-shadow:0_2px_28px_rgba(0,0,0,.6)]">{t("Understand the")}</span>
            <span className="kk-gold-text block">{t("Bhagavad-gita")}</span>
            <span className="block text-white [text-shadow:0_2px_28px_rgba(0,0,0,.6)]">{t("in 18 days")}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-6 text-white/90 md:mx-0 md:mt-4 md:max-w-[520px] md:text-lg md:leading-8">
            {t("Arjuna found clarity on the battlefield. In one hour a day, live and free, you can find it too.")}
          </p>
          <div className="mt-5 flex flex-row flex-wrap items-center justify-center gap-2.5 md:mt-7 md:justify-start md:gap-3">
            <a href="#register" className="vk-btn-gold inline-flex h-11 items-center gap-2 px-5 text-[14px] font-bold md:h-12 md:px-7 md:text-[15px]">
              {t("Register Free")} <ArrowRight className="h-5 w-5" />
            </a>
            <a href="#dilemma" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/50 bg-vk-900/30 px-5 text-[14px] font-semibold md:h-12 md:px-6 md:text-[15px] text-white backdrop-blur-sm transition hover:bg-white/10">
              {t("Begin the story")} <ArrowDown className="h-4 w-4" />
            </a>
          </div>
          <ul className="mt-5 hidden flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/85 sm:flex md:justify-start">
            {["100% free", "Live Q&A every day", "Adults, youth and kids"].map((x) => (
              <li key={x} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))]" /> {t(x)}</li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
