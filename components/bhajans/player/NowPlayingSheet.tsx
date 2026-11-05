"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, ChevronDown, ExternalLink, ListMusic, Mic2, Share2, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import CoverArt from "../CoverArt";
import LikeButton from "../library/LikeButton";
import { usePlayer, usePlayerActions } from "../playerContext";
import { showToast } from "../toast";
import { ICON_BTN, PlayToggle, RepeatButton, Seek, ShuffleButton, SpeedButton, TimeText } from "./controls";
import LyricsBody, { hasTranslations, hasWordByWord, type LyricsTab } from "./LyricsBody";
import { QueueList } from "./QueuePanel";
import { FollowChip, FollowTracker, useAutoFollow, useStoredFlag, type FollowMode } from "./follow";
import { LANG_LABEL, clientFetchBhajan, presentLanguages, type Bhajan } from "@/lib/bhajans";

export type SheetView = "player" | "lyrics" | "queue";

const docCache = new Map<string, Bhajan>();

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';
const LYRIC_SIZE = "clamp(1.5rem, 2.4vw, 2.25rem)";

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className = "",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; icon?: React.ReactNode }[];
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={`inline-flex max-w-full rounded-full bg-vk-100 p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 motion-reduce:transition-none ${
            value === o.id ? "bg-white text-vk-800 shadow-[0_1px_3px_rgba(11,23,69,.12)]" : "text-vk-700 hover:text-vk-900"
          }`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function LyricsPanel({ slug }: { slug: string }) {
  const { current } = usePlayer();
  const { seek } = usePlayerActions();
  const [doc, setDoc] = useState<Bhajan | null>(docCache.get(slug) || null);
  const [failed, setFailed] = useState(false);
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState<LyricsTab | null>(null);
  const [active, setActive] = useState(0);
  const [followIdx, setFollowIdx] = useState(-1);
  const [followMode, setFollowMode] = useState<FollowMode>(null);
  const [followOn, setFollowOn] = useStoredFlag("bhajan-follow-sheet", true);
  const scroller = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    setFailed(false);
    setActive(0);
    scroller.current?.scrollTo({ top: 0 });
    const cached = docCache.get(slug);
    if (cached) {
      setDoc(cached);
      return;
    }
    setDoc(null);
    let live = true;
    clientFetchBhajan(slug).then((d) => {
      if (!live) return;
      if (!d) return setFailed(true);
      docCache.set(slug, d);
      setDoc(d);
    });
    return () => {
      live = false;
    };
  }, [slug]);

  const langs = useMemo(() => (doc ? presentLanguages(doc) : []), [doc]);
  useEffect(() => {
    setLang((l) => (langs.length && !langs.includes(l) ? langs[0] : l));
  }, [langs]);

  const words = doc ? hasWordByWord(doc) : false;
  const trans = doc ? hasTranslations(doc) : false;
  const activeTab: LyricsTab = tab && (tab !== "word" || words) ? tab : trans ? "verse" : "full";
  const tabs: { id: LyricsTab; label: string }[] = [
    { id: "full", label: "Full verse" },
    { id: "verse", label: "Verse by verse" },
    ...(words ? [{ id: "word" as LyricsTab, label: "Word by word" }] : []),
  ];

  // The verse nearest the vertical centre of the pane is the focused one.
  const measure = useCallback(() => {
    raf.current = null;
    const el = scroller.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const mid = box.top + box.height / 2;
    let best = 0;
    let bestD = Infinity;
    el.querySelectorAll<HTMLElement>("[data-verse]").forEach((v) => {
      const r = v.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = Number(v.dataset.verse);
      }
    });
    setActive(best);
  }, []);
  const onScroll = () => {
    if (raf.current === null) raf.current = requestAnimationFrame(measure);
  };
  useEffect(() => () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
  }, []);

  const following = followOn && followIdx >= 0;
  const { away, resume } = useAutoFollow({ enabled: followOn, index: followIdx, rootRef: scroller });
  const times = current?.slug === slug ? current.verseTimes : undefined;

  const pick = (i: number) => {
    if (times && typeof times[i] === "number") seek(times[i] + 0.01);
    const el = scroller.current?.querySelector<HTMLElement>(`[data-verse="${i}"]`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    setActive(i);
  };

  return (
    <>
      {doc && <FollowTracker doc={doc} lang={lang} onChange={(i, m) => { setFollowIdx(i); setFollowMode(m); }} />}
      {doc && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 pb-3 pt-1">
          <Segmented value={activeTab} onChange={setTab} options={tabs} label="Lyrics view" className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" />
          {langs.length > 1 && (
            <Segmented value={lang} onChange={setLang} options={langs.map((l) => ({ id: l, label: LANG_LABEL[l] || l }))} label="Lyrics language" />
          )}
          {activeTab !== "word" && <FollowChip on={followOn} onToggle={() => setFollowOn(!followOn)} mode={followMode} />}
        </div>
      )}
      <div
        ref={scroller}
        onScroll={onScroll}
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 56px, #000 calc(100% - 96px), transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0, #000 56px, #000 calc(100% - 96px), transparent 100%)",
        }}
      >
        <div className="pb-[34dvh] pt-[10dvh] lg:pt-[18dvh]">
          {failed ? (
            <p className="text-ink/70">Lyrics could not be loaded.</p>
          ) : !doc ? (
            <div className="space-y-6" aria-busy="true" aria-label="Loading lyrics">
              {[80, 64, 72, 40].map((w, i) => (
                <div key={i} className="h-8 animate-pulse rounded-lg bg-vk-100 motion-reduce:animate-none" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : !langs.length ? (
            <p className="text-lg text-ink/70">Lyrics for this bhajan will be added soon.</p>
          ) : (
            <LyricsBody
              bhajan={doc}
              lang={lang}
              tab={activeTab}
              fontSize={LYRIC_SIZE}
              showNumbers={false}
              idPrefix="np-verse"
              dim={activeTab !== "word"}
              active={following ? followIdx : active}
              accent={following}
              onPick={activeTab === "word" ? undefined : pick}
            />
          )}
        </div>
      </div>
      {away && (
        <button
          type="button"
          onClick={resume}
          className="absolute bottom-6 left-1/2 z-10 inline-flex min-h-[44px] -translate-x-1/2 items-center gap-2 rounded-full bg-vk-700 px-4 text-sm font-semibold text-white shadow-[0_6px_14px_-8px_rgba(11,23,69,.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vk-500"
        >
          <ArrowDownToLine className="h-4 w-4" aria-hidden /> Back to current verse
        </button>
      )}
    </>
  );
}

function QueuePanel() {
  return (
    <>
      <div className="shrink-0 pb-2 pt-1">
        <h2 className="text-xl font-bold text-ink">Queue</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <QueueList />
      </div>
    </>
  );
}

export default function NowPlayingSheet({ initialView = "player" }: { initialView?: SheetView }) {
  const { current, playing, volume, hasNext } = usePlayer();
  const { setExpanded, next, prev, setVolume, toggleMute } = usePlayerActions();
  const rootRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<SheetView>(initialView);
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setExpanded(false);
      return;
    }
    setClosing(true);
    setTimeout(() => setExpanded(false), 190);
  }, [setExpanded]);

  // Escape closes, Tab is trapped inside the dialog, body scroll is locked, focus is restored on close.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (e.defaultPrevented) return;
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;
      const items = Array.from(rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (!rootRef.current.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [requestClose]);

  if (!current) return null;
  const panel = view === "queue" ? "queue" : "lyrics";
  const VolIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const sub = [current.artist, current.singer].filter(Boolean).join(" · ");
  const song = { slug: current.slug, title: current.title, artist: current.artist, coverImage: current.coverImage };
  const share = async () => {
    const url = `${window.location.origin}/bhajans/${current.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: current.title, url });
      else {
        await navigator.clipboard.writeText(url);
        showToast("Link copied");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
      data-closing={closing}
      className="bh-sheet fixed inset-0 z-[80] h-dvh overflow-hidden bg-[#f7f9ff] text-ink"
    >
      {/* Fresh light surface with a soft colour wash taken from the cover and a blue glow. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#f7f9ff_0%,#ffffff_100%)]">
        <div className="absolute inset-0 scale-[1.35] opacity-[.35] saturate-[1.3] blur-[60px] lg:blur-[90px]">
          <CoverArt title={current.title} src={current.coverImage} sizes="200px" showInitials={false} />
        </div>
        <div className="absolute inset-0 bg-white/60" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_18%_18%,rgba(47,91,211,.16),transparent_70%),radial-gradient(50%_45%_at_85%_85%,rgba(246,199,82,.12),transparent_70%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col pt-[env(safe-area-inset-top)]">
        {/* Header */}
        <div className="mx-auto grid w-full max-w-[1240px] shrink-0 grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 px-3 pb-1 pt-3 lg:px-8 lg:pt-5">
          <button data-autofocus type="button" onClick={requestClose} aria-label="Close now playing" className={ICON_BTN}>
            <ChevronDown className="h-7 w-7" aria-hidden />
          </button>
          <div className="min-w-0 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-vk-700">Playing from Bhajans</p>
            <p className="truncate text-sm font-semibold text-ink">{current.title}</p>
          </div>
          <div className="flex items-center">
            <button type="button" onClick={() => void share()} aria-label="Share" className={ICON_BTN}>
              <Share2 className="h-5 w-5" aria-hidden />
            </button>
            <Link href={`/bhajans/${current.slug}`} onClick={() => setExpanded(false)} aria-label={`Open the page for ${current.title}`} className={ICON_BTN}>
              <ExternalLink className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Stage */}
        <div
          className="mx-auto grid min-h-0 w-full max-w-[1240px] flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-16 lg:px-10 lg:pb-8"
          style={{
            ["--cm" as string]: "clamp(140px, min(72vw, calc(100dvh - 520px)), 400px)",
            ["--cd" as string]: "clamp(220px, calc(100dvh - 520px), 440px)",
          }}
        >
          {/* Cover with a soft coloured glow */}
          <div className={`row-start-1 min-h-0 items-center justify-center lg:col-start-1 lg:row-start-2 lg:flex ${view === "player" ? "flex" : "hidden"}`}>
            <div className={`relative w-[var(--cm)] transition-transform duration-500 ease-out motion-reduce:transition-none lg:w-[var(--cd)] ${playing ? "scale-100" : "scale-[.9]"}`}>
              <div aria-hidden className="absolute inset-3 translate-y-5 scale-95 overflow-hidden rounded-3xl opacity-60 blur-2xl">
                <CoverArt title={current.title} src={current.coverImage} sizes="120px" showInitials={false} />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-vk-100 ring-1 ring-white">
                <CoverArt title={current.title} src={current.coverImage} priority sizes="440px" />
              </div>
            </div>
          </div>

          {/* Lyrics / Queue pane */}
          <section
            aria-label={panel === "queue" ? "Queue" : "Lyrics"}
            className={`relative row-start-1 min-h-0 flex-col lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:flex lg:pt-2 ${view === "player" ? "hidden" : "flex"}`}
          >
            <div className="mb-3 hidden shrink-0 lg:block">
              <Segmented
                value={panel === "queue" ? "queue" : "lyrics"}
                onChange={(v) => setView(v)}
                label="Right panel"
                options={[
                  { id: "lyrics", label: "Lyrics", icon: <Mic2 className="h-4 w-4" aria-hidden /> },
                  { id: "queue", label: "Queue", icon: <ListMusic className="h-4 w-4" aria-hidden /> },
                ]}
              />
            </div>
            {panel === "queue" ? <QueuePanel /> : <LyricsPanel slug={current.slug} />}
          </section>

          {/* Meta + controls */}
          <div className="row-start-2 mx-auto w-full max-w-[460px] lg:col-start-1 lg:row-start-3 lg:max-w-none lg:pt-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className={`line-clamp-2 break-words font-bold leading-tight ${view === "player" ? "text-[1.625rem] lg:text-[1.875rem]" : "text-lg lg:text-[1.875rem]"}`}>{current.title}</h1>
                {sub && <p className="mt-1 truncate text-[15px] text-ink/70 lg:text-base">{sub}</p>}
              </div>
              <LikeButton song={song} size="lg" className="-mr-2 shrink-0" />
            </div>

            <div className="mt-3 lg:mt-5">
              <Seek label="Seek in this bhajan" className="bh-seek" />
              <div className="flex justify-between text-xs text-ink/70">
                <TimeText which="time" />
                <TimeText which="duration" />
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between">
              <ShuffleButton />
              <button type="button" onClick={prev} aria-label="Previous track" className={`${ICON_BTN} !h-12 !w-12`}>
                <SkipBack className="h-7 w-7" fill="currentColor" aria-hidden />
              </button>
              <PlayToggle size={76} />
              <button type="button" onClick={next} disabled={!hasNext} aria-label="Next track" className={`${ICON_BTN} !h-12 !w-12`}>
                <SkipForward className="h-7 w-7" fill="currentColor" aria-hidden />
              </button>
              <RepeatButton />
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <SpeedButton />
                <div className="hidden items-center gap-1 lg:flex">
                <button type="button" onClick={toggleMute} aria-label={volume > 0 ? "Mute" : "Unmute"} className={ICON_BTN}>
                  <VolIcon className="h-5 w-5" aria-hidden />
                </button>
                <input
                  type="range"
                  aria-label="Volume"
                  className="bh-range !w-[96px]"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  style={{ ["--p" as string]: `${volume * 100}%` }}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>
              <button
                type="button"
                onClick={() => setView((v) => (v === "queue" ? (matchMedia("(min-width: 1024px)").matches ? "lyrics" : "player") : "queue"))}
                aria-pressed={view === "queue"}
                aria-label="Queue"
                className={`${ICON_BTN} ${view === "queue" ? "!bg-vk-100 !text-vk-700" : ""}`}
              >
                <ListMusic className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {/* Phones: switch between the player, lyrics and queue. */}
            <Segmented
              value={view}
              onChange={setView}
              label="Show"
              className="mt-3 flex w-full lg:hidden"
              options={[
                { id: "player", label: "Player" },
                { id: "lyrics", label: "Lyrics", icon: <Mic2 className="h-4 w-4" aria-hidden /> },
                { id: "queue", label: "Queue", icon: <ListMusic className="h-4 w-4" aria-hidden /> },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
