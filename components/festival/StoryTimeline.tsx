"use client";

import Reveal from "@/components/site/Reveal";
import { useT } from "@/components/i18n/LocaleProvider";

export type TimelineStep = { n: string; title: string; text: string; date?: string };

/**
 * A reverent, light vertical timeline: numbered gold markers on a thin line, each step a clean card. Text only, so it
 * reads well on any phone and stays faithful to the scriptures instead of illustrating them.
 */
export default function StoryTimeline({ steps }: { steps: TimelineStep[] }) {
  const t = useT();
  return (
    <ol className="relative mx-auto max-w-3xl">
      <span aria-hidden className="absolute bottom-3 left-[21px] top-3 w-px bg-gradient-to-b from-[hsl(var(--gold)/0.1)] via-[hsl(var(--gold)/0.7)] to-[hsl(var(--gold)/0.1)] md:left-[25px]" />
      {steps.map((s, i) => (
        <Reveal as="li" key={s.n} delay={Math.min(i, 3) * 0.05} className="relative flex gap-4 pb-6 last:pb-0 md:gap-6 md:pb-8">
          <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-heading text-base font-extrabold text-ink shadow-gold md:h-[52px] md:w-[52px] md:text-lg">
            {s.n}
          </span>
          <div className="vk-card min-w-0 flex-1 p-5 md:p-6">
            {s.date && <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--gold-deep))]">{t(s.date)}</p>}
            <h3 className="font-heading text-lg font-bold text-ink md:text-xl">{t(s.title)}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground md:text-base md:leading-7">{t(s.text)}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
