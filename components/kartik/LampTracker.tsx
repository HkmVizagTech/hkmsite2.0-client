"use client";

import { useEffect, useState } from "react";

// Kartik Maas 2026: Sharad Purnima, 26 October, to Kartik Purnima, 24 November (30 days). Update next year.
const START = "2026-10-26";
const DAYS = 30;

const istToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const dayDiff = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

/** One diya: brass bowl and (when lit) a flickering flame. */
function Diya({ lit, current }: { lit: boolean; current: boolean }) {
  return (
    <svg viewBox="0 0 48 56" className="h-full w-full overflow-visible" aria-hidden>
      {lit && (
        <g data-flame className={`km-flame ${current ? "km-flame-strong" : ""}`}>
          <ellipse cx="24" cy="20" rx="14" ry="16" fill="url(#km-glow)" opacity={current ? 0.9 : 0.55} />
          <path d="M24 4c5 6 8 11 8 16a8 8 0 0 1-16 0c0-4 3-8 8-16Z" fill="url(#km-flame)" />
          <path d="M24 13c2.4 3 3.6 5.3 3.6 7.6a3.6 3.6 0 0 1-7.2 0c0-2.3 1.2-4.6 3.6-7.6Z" fill="#FFF7D6" />
        </g>
      )}
      <path d="M5 30h38c0 11-8 18-19 18S5 41 5 30Z" fill={lit ? "url(#km-brass)" : "#B9C8FB"} />
      <path d="M5 30h38" stroke={lit ? "#FFE49A" : "#DCE4FF"} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="15" y="47" width="18" height="4" rx="2" fill={lit ? "#B8860B" : "#9FB2EE"} />
    </svg>
  );
}

export default function LampTracker({ onOffer }: { onOffer: () => void }) {
  // Computed after mount so the server HTML and the first client render agree.
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => {
    setDay(dayDiff(START, istToday()) + 1);
  }, []);

  const lit = day === null ? 0 : Math.max(0, Math.min(DAYS, day));
  const started = day !== null && day >= 1;
  const finished = day !== null && day > DAYS;
  const headline = day === null ? "Thirty days, thirty lamps" : !started ? "The month of lamps begins soon" : finished ? "Thirty lamps, lit" : `Day ${lit} of ${DAYS}`;
  const sub =
    day === null
      ? "Kartik is the month of the daily lamp."
      : !started
        ? `Damodar month begins on 26 October. ${Math.abs(day - 1)} day${Math.abs(day - 1) === 1 ? "" : "s"} to go.`
        : finished
          ? "Damodar month has been completed. Hare Krishna."
          : `${DAYS - lit} more lamp${DAYS - lit === 1 ? "" : "s"} to light before Kartik Purnima on 24 November.`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-vk-50 via-white to-white py-14 md:py-20" aria-labelledby="km-lamps">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="km-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD36B" />
            <stop offset="1" stopColor="#FF7A18" />
          </linearGradient>
          <linearGradient id="km-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6C752" />
            <stop offset="1" stopColor="#B8860B" />
          </linearGradient>
          <radialGradient id="km-glow">
            <stop offset="0" stopColor="#FFC24D" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FFC24D" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <div className="vk-container">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <span className="vk-pill-soft">The daily lamp</span>
          <h2 id="km-lamps" className="mt-4 font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.025em] text-ink md:text-[2.6rem]">
            {headline}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">{sub}</p>
        </div>

        <div data-lamps className="mx-auto mt-9 grid max-w-4xl grid-cols-6 gap-x-2 gap-y-5 sm:grid-cols-10 sm:gap-x-3 md:gap-y-6">
          {Array.from({ length: DAYS }, (_, i) => {
            const n = i + 1;
            const isLit = n <= lit;
            return (
              <div key={n} data-lamp className="flex flex-col items-center">
                <div className="h-11 w-9 sm:h-12 sm:w-10">
                  <Diya lit={isLit} current={isLit && n === lit && !finished} />
                </div>
                <span className={`mt-1 text-[10px] font-semibold tabular-nums ${isLit ? "text-vk-700" : "text-ink/35"}`}>{n}</span>
              </div>
            );
          })}
        </div>

        <div data-reveal className="mt-10 flex justify-center">
          <button type="button" onClick={onOffer} className="vk-btn-gold h-12 px-7 text-[15px] font-bold">
            {started && !finished ? "Light today's lamp — offer a seva" : "Offer your seva"}
          </button>
        </div>
      </div>
    </section>
  );
}
