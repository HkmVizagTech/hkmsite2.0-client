"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock3, Copy, ListEnd, ListPlus, Minus, Pause, Play, Plus, Printer, Share2 } from "lucide-react";
import LikeButton from "./library/LikeButton";
import { FollowChip, FollowTracker, useAutoFollow, useStoredFlag, type FollowMode } from "./player/follow";
import { showToast } from "./toast";
import { LANG_LABEL, fmtDuration, lyricsAsText, presentLanguages, type Bhajan, type QueueItem } from "@/lib/bhajans";
import { usePlayer, usePlayerActions } from "./playerContext";
import { Equaliser } from "./player/controls";
import LyricsBody, { hasWordByWord, type LyricsTab } from "./player/LyricsBody";

const GHOST_BTN =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-ink/90 ring-1 ring-vk-200 transition-colors hover:bg-vk-100 hover:text-vk-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 disabled:opacity-40";

/** Share (native sheet when available, otherwise copies the link). */
export function ShareButton({ title, path, iconOnly = false }: { title: string; path: string; iconOnly?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={iconOnly ? "Share" : undefined}
      onClick={async () => {
        const url = `${window.location.origin}${path}`;
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
            return;
          }
          await navigator.clipboard.writeText(url);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* user cancelled */
        }
      }}
      className={GHOST_BTN}
    >
      {done ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      <span className={iconOnly ? "sr-only" : ""}>{done ? "Link copied" : "Share"}</span>
    </button>
  );
}

/** Hero action row: big gold play, like, play next, add to queue, share, copy lyrics. */
export function ActionRow({ queue, title, path, copyText, song }: { queue: QueueItem[]; title: string; path: string; copyText: string; song: { slug: string; title: string; artist: string; coverImage: string } }) {
  const { current, playing, queue: liveQueue } = usePlayer();
  const { play, toggle, enqueue, playNext } = usePlayerActions();
  const [copied, setCopied] = useState(false);
  const isCurrent = queue.some((t) => t.key === current?.key);
  const showPause = isCurrent && playing;
  const inQueue = queue.length > 0 && queue.every((t) => liveQueue.some((q) => q.key === t.key));
  const empty = liveQueue.length === 0;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
      {queue.length > 0 ? (
        <button
          type="button"
          onClick={() => (isCurrent ? toggle() : play(queue, 0))}
          className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#F6C752] px-8 text-base font-bold text-[#0b1745] shadow-[0_6px_14px_-8px_rgba(184,140,20,.55)] transition duration-150 hover:brightness-105 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vk-500 motion-reduce:transition-none sm:w-auto"
        >
          {showPause ? <Pause className="h-6 w-6" fill="currentColor" aria-hidden /> : <Play className="h-6 w-6" fill="currentColor" aria-hidden />}
          {showPause ? "Pause" : "Play"}
        </button>
      ) : (
        <span className="inline-flex h-11 items-center rounded-full bg-vk-50 px-5 text-sm font-semibold text-ink/85 ring-1 ring-vk-100">Lyrics only</span>
      )}
      <LikeButton song={song} size="lg" className="ring-1 ring-vk-200" />
      {queue.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => {
              playNext(queue);
              showToast(empty ? `Playing “${title}”` : `“${title}” will play next`);
            }}
            className={GHOST_BTN}
          >
            <ListPlus className="h-4 w-4" aria-hidden /> Play next
          </button>
          <button
            type="button"
            disabled={inQueue && !empty}
            onClick={() => {
              enqueue(queue);
              showToast(empty ? `Playing “${title}”` : `Added “${title}” to your queue`);
            }}
            className={GHOST_BTN}
          >
            {inQueue && !empty ? <Check className="h-4 w-4" aria-hidden /> : <ListEnd className="h-4 w-4" aria-hidden />}
            {inQueue && !empty ? "In queue" : "Add to queue"}
          </button>
        </>
      )}
      <ShareButton title={title} path={path} />
      {copyText && (
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(copyText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              /* ignore */
            }
          }}
          className={GHOST_BTN}
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Copied" : "Copy lyrics"}
        </button>
      )}
    </div>
  );
}

/** Spotify-style table of recordings. */
export function TrackList({ queue }: { queue: QueueItem[] }) {
  const { current, playing } = usePlayer();
  const { play, toggle } = usePlayerActions();
  if (!queue.length) return null;
  return (
    <section aria-label="Recordings" className="vk-container pt-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-bold text-ink md:text-2xl">{queue.length > 1 ? "Recordings" : "Recording"}</h2>
        <div className="mt-3 grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-vk-100 px-3 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="flex justify-end pr-1"><Clock3 className="h-4 w-4" aria-label="Duration" /></span>
        </div>
        <ol className="mt-1">
          {queue.map((t, i) => {
            const isCur = current?.key === t.key;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => (isCur ? toggle() : play(queue, i))}
                  aria-label={`${isCur && playing ? "Pause" : "Play"} ${t.title}${t.singer ? ` sung by ${t.singer}` : ""}`}
                  className={`group grid min-h-[60px] w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-vk-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-vk-500 ${isCur ? "bg-vk-50" : ""}`}
                >
                  <span className="flex h-6 items-center justify-center text-sm tabular-nums text-ink/65">
                    {isCur ? (
                      <>
                        <span className="text-vk-600 group-hover:hidden"><Equaliser paused={!playing} /></span>
                        <span className="hidden text-ink group-hover:inline">
                          {playing ? <Pause className="h-4 w-4" fill="currentColor" aria-hidden /> : <Play className="h-4 w-4" fill="currentColor" aria-hidden />}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="group-hover:hidden group-focus-visible:hidden">{i + 1}</span>
                        <Play className="hidden h-4 w-4 text-ink group-hover:block group-focus-visible:block" fill="currentColor" aria-hidden />
                      </>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-[15px] font-semibold ${isCur ? "text-vk-700" : "text-ink"}`}>{t.title}</span>
                    <span className="block truncate text-[13px] text-ink/60">{t.singer || `Recording ${i + 1}`}</span>
                  </span>
                  <span className="pr-1 text-sm tabular-nums text-ink/65">{t.duration ? fmtDuration(t.duration) : ""}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const SIZES = ["clamp(1.25rem, 2vw, 1.5rem)", "clamp(1.4rem, 2.4vw, 1.8rem)", "clamp(1.6rem, 3vw, 2.1rem)", "clamp(1.8rem, 3.6vw, 2.5rem)"];
const LS_SIZE = "bhajan-size";
const LS_LANG = "bhajan-lang";
const LS_TAB = "bhajan-lyrics-tab";

const PRINT_CSS = `
@media print {
  body * { visibility: hidden !important; }
  .bh-print, .bh-print * { visibility: visible !important; }
  .bh-print { position: absolute !important; left: 0; top: 0; width: 100% !important; padding: 0 !important; color: #000 !important; }
  .bh-print .bh-noprint { display: none !important; }
  .bh-print .bh-printonly { display: block !important; }
  .bh-print [data-verse], .bh-print p { break-inside: avoid; opacity: 1 !important; transform: none !important; }
  .bh-print .vk-container { max-width: none !important; padding: 0 24px !important; }
}
.bh-printonly { display: none; }
`;

export function LyricsPanel({ bhajan }: { bhajan: Bhajan }) {
  const langs = useMemo(() => presentLanguages(bhajan), [bhajan]);
  const verses = bhajan.verses || [];
  const [lang, setLang] = useState<string>(langs[0] || "en");
  const [tab, setTab] = useState<LyricsTab>("verse");
  const [size, setSize] = useState(1);
  const [copied, setCopied] = useState(false);
  const { current } = usePlayer();
  const { seek } = usePlayerActions();
  const [followIdx, setFollowIdx] = useState(-1);
  const [followMode, setFollowMode] = useState<FollowMode>(null);
  const [followOn, setFollowOn] = useStoredFlag("bhajan-follow-page", false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const playingThis = current?.slug === bhajan.slug;
  useAutoFollow({ enabled: followOn && playingThis, index: followIdx, rootRef: bodyRef, listenOnWindow: true });
  const times = playingThis ? current?.verseTimes : undefined;

  // Remembered preferences: text size, language and view.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_SIZE);
      const sz = Number(raw);
      if (raw !== null && sz >= 0 && sz <= 3) setSize(sz);
      const l = localStorage.getItem(LS_LANG);
      if (l && langs.includes(l)) setLang(l);
      const t = localStorage.getItem(LS_TAB);
      if (t === "full" || t === "verse" || (t === "word" && hasWordByWord(bhajan))) setTab(t);
    } catch {
      /* ignore */
    }
  }, [langs, bhajan]);
  const remember = (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* ignore */
    }
  };
  const bump = (d: number) =>
    setSize((s) => {
      const n = Math.min(3, Math.max(0, s + d));
      remember(LS_SIZE, String(n));
      return n;
    });

  const hasWords = hasWordByWord(bhajan);
  const tabs: { id: LyricsTab; label: string }[] = [
    { id: "full", label: "Full verse" },
    { id: "verse", label: "Verse by verse" },
    ...(hasWords ? [{ id: "word" as LyricsTab, label: "Word by word" }] : []),
  ];

  if (!verses.length || !langs.length) {
    return (
      <section className="vk-container py-8" aria-label="Lyrics">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-ink md:text-2xl">Lyrics</h2>
          <p className="mt-3 rounded-2xl bg-vk-50 p-6 text-ink/75 ring-1 ring-vk-100">The lyrics for this bhajan will be added soon.</p>
        </div>
      </section>
    );
  }

  const shownVerses = verses.map((v, i) => ({ n: v.number ?? i + 1, has: !!v.text?.[lang as "en"]?.length })).filter((v) => v.has);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${bhajan.title}\n${bhajan.artist}\n\n${lyricsAsText(bhajan, lang)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };
  const round = "inline-flex h-11 w-11 items-center justify-center rounded-full text-ink/80 hover:bg-vk-100 hover:text-vk-700 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500";

  return (
    <section aria-label="Lyrics" className="bh-print pb-6 pt-8 md:pt-10">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div className="vk-container">
        <h2 className="mx-auto max-w-5xl text-xl font-bold text-ink md:text-2xl">Lyrics</h2>
        <div className="bh-printonly mx-auto max-w-5xl pb-4">
          <p className="text-2xl font-bold">{bhajan.title}</p>
          <p className="text-base">{bhajan.artist}</p>
        </div>
      </div>
      {/* Static toolbar (never sticky or floating). */}
      <div className="bh-noprint mt-3 border-y border-vk-100 bg-white">
        <div className="vk-container">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5">
            <div role="tablist" aria-label="Lyrics view" className="flex max-w-full overflow-x-auto rounded-full bg-vk-100 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  onClick={() => {
                    setTab(t.id);
                    remember(LS_TAB, t.id);
                  }}
                  className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 sm:px-4 sm:text-sm ${tab === t.id ? "bg-white text-vk-800 shadow-[0_1px_3px_rgba(11,23,69,.12)]" : "text-vk-700 hover:text-vk-900"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {playingThis && tab !== "word" && <div className="mr-1"><FollowChip on={followOn} onToggle={() => setFollowOn(!followOn)} mode={followMode} /></div>}
              {langs.length > 1 && (
                <div role="group" aria-label="Lyrics language" className="mr-1 flex gap-1.5">
                  {langs.map((l) => (
                    <button
                      key={l}
                      type="button"
                      aria-pressed={lang === l}
                      onClick={() => {
                        setLang(l);
                        remember(LS_LANG, l);
                      }}
                      className={`min-h-[40px] rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 ${lang === l ? "bg-vk-700 text-white" : "bg-white text-vk-800 ring-1 ring-vk-200 hover:bg-vk-50"}`}
                    >
                      {LANG_LABEL[l] || l}
                    </button>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => bump(-1)} aria-label="Smaller text" disabled={size === 0} className={round}><Minus className="h-4 w-4" aria-hidden /></button>
              <button type="button" onClick={() => bump(1)} aria-label="Larger text" disabled={size === 3} className={round}><Plus className="h-4 w-4" aria-hidden /></button>
              <button type="button" onClick={copy} aria-label="Copy lyrics" className={round}>
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              </button>
              <button type="button" onClick={() => window.print()} aria-label="Print lyrics" className={`${round} max-sm:hidden`}><Printer className="h-4 w-4" aria-hidden /></button>
            </div>
          </div>
          {shownVerses.length >= 5 && tab !== "word" && (
            <nav aria-label="Jump to verse" className="mx-auto max-w-5xl pb-3">
              <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
                {shownVerses.map((v) => (
                  <li key={v.n} className="shrink-0">
                    <a href={`#verse-${v.n}`} className="inline-flex min-h-[44px] items-center rounded-full bg-vk-50 px-4 text-[13px] font-semibold text-vk-800 ring-1 ring-vk-200 hover:bg-vk-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500">
                      Verse {v.n}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      <FollowTracker doc={bhajan} lang={lang} onChange={(i, m) => { setFollowIdx(i); setFollowMode(m); }} />
      <div className="vk-container pt-8 md:pt-12" role="tabpanel">
        <div ref={bodyRef} className="mx-auto max-w-5xl">
          <LyricsBody
            bhajan={bhajan}
            lang={lang}
            tab={tab}
            fontSize={SIZES[size]}
            maxWidth="44rem"
            copyable
            active={playingThis ? followIdx : -1}
            accent={playingThis && followIdx >= 0}
            onPick={playingThis && times && tab !== "word" ? (i) => typeof times[i] === "number" && seek(times[i] + 0.01) : undefined}
          />
        </div>
      </div>
    </section>
  );
}
