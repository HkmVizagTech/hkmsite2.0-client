"use client";

import { memo, useCallback, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Bhajan, BhajanVerse, LangCode } from "@/lib/bhajans";

export type LyricsTab = "full" | "verse" | "word";

export function hasTranslations(b: Bhajan): boolean {
  return (b.verses || []).some((v) => Object.values(v.translation || {}).some((t) => !!t));
}
export function hasWordByWord(b: Bhajan): boolean {
  return (b.verses || []).some((v) => v.wordByWord && Object.values(v.wordByWord).some((w) => w && w.length));
}

/**
 * Lyric renderer shared by the song page and the now-playing sheet (light theme).
 * `fontSize` is any CSS font-size (e.g. a clamp()); translations use a fixed readable size.
 * Transliteration is set in a serif with generous leading; Indic scripts get extra leading.
 * `focus` enables the Apple Music effect (the active verse is full strength, the rest recede; click to centre).
 */
export default function LyricsBody({
  bhajan,
  lang,
  tab,
  fontSize,
  showNumbers = true,
  maxWidth,
  className = "",
  copyable = false,
  idPrefix = "verse",
  dim = false,
  active,
  accent = false,
  onPick,
}: {
  bhajan: Bhajan;
  lang: string;
  tab: LyricsTab;
  fontSize: string;
  showNumbers?: boolean;
  maxWidth?: string;
  className?: string;
  copyable?: boolean;
  idPrefix?: string;
  /** Apple Music effect: every verse except `active` recedes. */
  dim?: boolean;
  /** Verse index (into `bhajan.verses`) that is currently being sung or focused; -1 for none. */
  active?: number;
  /** Show the soft accent bar on the active verse. */
  accent?: boolean;
  /** Click/tap on a verse. */
  onPick?: (verseIndex: number) => void;
}) {
  const [copied, setCopied] = useState<number | null>(null);
  const verses = bhajan.verses || [];
  const lines = (v: BhajanVerse) => v.text?.[lang as LangCode] || [];
  const tr = (v: BhajanVerse) => v.translation?.[lang as LangCode] || v.translation?.en || "";
  const num = (v: BhajanVerse, i: number) => v.number ?? i + 1;

  const copyVerse = async (v: BhajanVerse, i: number) => {
    try {
      await navigator.clipboard.writeText([lines(v).join("\n"), tab === "verse" ? tr(v) : ""].filter(Boolean).join("\n\n"));
      setCopied(i);
      setTimeout(() => setCopied((c) => (c === i ? null : c)), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const copyRef = useRef(copyVerse);
  copyRef.current = copyVerse;
  const copyStable = useCallback((i: number) => void copyRef.current(verses[i], i), [verses]);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const pickStable = useCallback((i: number) => pickRef.current?.(i), []);

  if (tab === "word") {
    const rows = verses
      .map((v, i) => ({ v, i, wbw: v.wordByWord?.[lang as LangCode] || v.wordByWord?.en || [] }))
      .filter((r) => r.wbw.length);
    if (!rows.length) return <p className="text-ink/70">Word-by-word meanings are not available for this bhajan.</p>;
    return (
      <ol className={`space-y-10 ${className}`} style={{ maxWidth }}>
        {rows.map(({ v, i, wbw }) => (
          <li key={i} id={`${idPrefix}-${num(v, i)}`} className="scroll-mt-24">
            <span className="mb-3 block text-[13px] font-bold uppercase tracking-[0.16em] text-vk-700">Verse {num(v, i)}</span>
            <dl className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-px overflow-hidden rounded-2xl bg-vk-100 text-[15px] ring-1 ring-vk-100 sm:text-base">
              {wbw.map((w, j) => (
                <div key={j} className="contents">
                  <dt className="break-words bg-white px-4 py-2.5 font-semibold text-vk-700">{w.word}</dt>
                  <dd className="break-words bg-white px-4 py-2.5 text-slate-600">{w.meaning}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    );
  }

  const translit = lang === "en";
  const shown = verses.map((v, i) => ({ v, i })).filter(({ v }) => lines(v).length);
  return (
    <div lang={lang} className={`space-y-10 text-ink md:space-y-12 ${className}`} style={{ maxWidth }}>
      {shown.map(({ v, i }) => (
        <Verse
          key={i}
          i={i}
          n={num(v, i)}
          lines={lines(v)}
          translation={tab === "verse" ? tr(v) : ""}
          showNumber={showNumbers && tab === "verse"}
          fontSize={fontSize}
          translit={translit}
          idPrefix={idPrefix}
          copyable={copyable}
          copied={copied === i}
          onCopy={copyStable}
          dim={dim}
          isActive={active === i}
          accent={accent}
          clickable={!!onPick}
          onPick={pickStable}
        />
      ))}
    </div>
  );
}

const Verse = memo(function Verse({
  i, n, lines, translation, showNumber, fontSize, translit, idPrefix, copyable, copied, onCopy, dim, isActive, accent, clickable, onPick,
}: {
  i: number;
  n: number;
  lines: string[];
  translation: string;
  showNumber: boolean;
  fontSize: string;
  translit: boolean;
  idPrefix: string;
  copyable: boolean;
  copied: boolean;
  onCopy: (i: number) => void;
  dim: boolean;
  isActive: boolean;
  accent: boolean;
  clickable: boolean;
  onPick: (i: number) => void;
}) {
  const lit = isActive && accent;
  return (
    <div
      id={`${idPrefix}-${n}`}
      data-verse={i}
      data-active={isActive ? "true" : undefined}
      onClick={clickable ? () => onPick(i) : undefined}
      className={`group/verse relative scroll-mt-24 origin-left border-l-4 pl-4 transition duration-200 motion-reduce:transition-none ${copyable ? "pr-12" : ""} ${lit ? "border-vk-700" : "border-transparent"} ${
        clickable ? "cursor-pointer" : ""
      } ${dim ? (isActive ? "scale-[1.02] opacity-100" : "scale-[.94] opacity-40 hover:opacity-70") : isActive && accent ? "scale-[1.01]" : ""}`}
    >
      {showNumber && <span className="mb-3 block text-[13px] font-bold uppercase leading-none tracking-[0.16em] text-vk-700">Verse {n}</span>}
      <p
        className={`whitespace-pre-line break-words ${translit ? "font-serif-display font-semibold leading-[1.45] tracking-[0.005em]" : "font-semibold leading-[1.75]"}`}
        style={{ fontSize }}
      >
        {lines.join("\n")}
      </p>
      {translation && (
        <p lang="en" className="mt-3 max-w-[60ch] text-base font-normal leading-relaxed text-slate-600 md:text-[1.0625rem]">
          {translation}
        </p>
      )}
      {copyable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(i);
          }}
          aria-label={`Copy verse ${n}`}
          className="bh-noprint absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-full text-vk-700 transition-opacity duration-150 hover:bg-vk-50 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/verse:opacity-100"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        </button>
      )}
    </div>
  );
});
