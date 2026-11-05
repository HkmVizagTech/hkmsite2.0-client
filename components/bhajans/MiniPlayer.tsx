"use client";

import { useEffect, useState } from "react";
import { ListMusic, Maximize2, SkipBack, SkipForward, Volume1, Volume2, VolumeX, X } from "lucide-react";
import CoverArt from "./CoverArt";
import LikeButton from "./library/LikeButton";
import { usePlayer, usePlayerActions, usePlayerTime } from "./playerContext";
import NowPlayingSheet, { type SheetView } from "./player/NowPlayingSheet";
import { QueueDrawer } from "./player/QueuePanel";
import { Equaliser, ICON_BTN, PLAYER_CSS, PlayToggle, RepeatButton, Seek, ShuffleButton, SpeedButton } from "./player/controls";
import { fmtDuration } from "@/lib/bhajans";

function MobileProgress() {
  const { time, duration } = usePlayerTime();
  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-vk-100 lg:hidden">
      <div className="h-full bg-[#F6C752]" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Elapsed() {
  const { time, duration } = usePlayerTime();
  return (
    <p className="text-xs tabular-nums text-ink/70" aria-hidden>
      {fmtDuration(time)} <span className="text-ink/40">/</span> {fmtDuration(duration)}
    </p>
  );
}

function Volume() {
  const { volume } = usePlayer();
  const { setVolume, toggleMute } = usePlayerActions();
  const Icon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  return (
    <div className="group/vol relative">
      <button type="button" onClick={toggleMute} aria-label={volume > 0 ? "Mute" : "Unmute"} title="Mute (M)" className={ICON_BTN}>
        <Icon className="h-5 w-5" aria-hidden />
      </button>
      <div className="invisible absolute bottom-full left-1/2 z-10 -translate-x-1/2 pb-2 opacity-0 transition duration-150 group-focus-within/vol:visible group-focus-within/vol:opacity-100 group-hover/vol:visible group-hover/vol:opacity-100 motion-reduce:transition-none">
        <div className="w-36 rounded-xl border border-vk-100 bg-white px-4 py-2 shadow-[0_8px_20px_-14px_rgba(11,23,69,.35)]">
          <input
            type="range"
            aria-label="Volume"
            className="bh-range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            style={{ ["--p" as string]: `${volume * 100}%` }}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Bottom player. Desktop: a docked bar with a seek line along its top edge. Mobile: an inset rounded card above the bottom nav.
 * Opening it shows the full-screen now-playing sheet.
 */
export default function MiniPlayer() {
  const { current, expanded, hasNext, queueOpen, queue, playing } = usePlayer();
  const { setExpanded, next, prev, close, setQueueOpen } = usePlayerActions();
  const [sheetView, setSheetView] = useState<SheetView>("player");
  const active = !!current;

  useEffect(() => {
    const el = document.documentElement;
    if (active) el.dataset.player = "on";
    else delete el.dataset.player;
    return () => {
      delete el.dataset.player;
    };
  }, [active]);

  // Below lg the queue lives in the full-screen sheet; the right-hand drawer is desktop only.
  useEffect(() => {
    if (queueOpen && !window.matchMedia("(min-width: 1024px)").matches) {
      setQueueOpen(false);
      setSheetView("queue");
      setExpanded(true);
    }
  }, [queueOpen, setQueueOpen, setExpanded]);

  if (!current) return null;
  const open = (v: SheetView) => {
    setSheetView(v);
    setExpanded(true);
  };
  const song = { slug: current.slug, title: current.title, artist: current.artist, coverImage: current.coverImage };
  const sub = current.singer || current.artist;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PLAYER_CSS }} />
      <div
        role="region"
        aria-label="Audio player"
        className="fixed inset-x-0 bottom-[var(--bottom-nav-space)] z-[49] px-2 pb-2 lg:bottom-0 lg:px-0 lg:pb-0"
      >
        <div
          onClick={(e) => {
            if (window.matchMedia("(min-width: 1024px)").matches) return;
            if (!(e.target as HTMLElement).closest("button,a,input,[role=menu]")) open("player");
          }}
          className="bh-up relative mx-auto flex h-16 max-w-3xl cursor-pointer items-center gap-2 overflow-hidden rounded-2xl bg-white pl-2.5 pr-1 text-ink shadow-[0_8px_20px_-14px_rgba(11,23,69,.3)] ring-1 ring-vk-100 lg:h-[88px] lg:max-w-none lg:cursor-default lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6 lg:overflow-visible lg:rounded-none lg:px-5 lg:shadow-none lg:ring-0 lg:border-t lg:border-vk-100"
        >
          {/* Desktop: seek line along the top edge */}
          <div className="hidden lg:contents">
            <Seek label="Seek" className="bh-line" />
          </div>

          {/* Left: cover, title, heart, equaliser */}
          <div className="flex min-w-0 flex-1 items-center gap-1 lg:flex-none">
            <button
              type="button"
              onClick={() => open("player")}
              aria-label={`Open now playing: ${current.title}`}
              className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl py-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500"
            >
              <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-vk-100 lg:h-14 lg:w-14">
                <CoverArt title={current.title} src={current.coverImage} sizes="56px" showInitials={false} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="block truncate text-[15px] font-semibold leading-snug group-hover:underline">{current.title}</span>
                  {playing && <Equaliser className="hidden shrink-0 text-vk-600 lg:inline-flex" />}
                </span>
                <span className="block truncate text-[13px] text-ink/70">{sub}</span>
              </span>
            </button>
            <LikeButton song={song} size="sm" className="shrink-0" />
          </div>

          {/* Desktop centre: transport + time */}
          <div className="hidden flex-col items-center gap-0.5 lg:flex">
            <div className="flex items-center gap-2">
              <ShuffleButton />
              <button type="button" onClick={prev} aria-label="Previous track" className={ICON_BTN}>
                <SkipBack className="h-5 w-5" fill="currentColor" aria-hidden />
              </button>
              <PlayToggle size={48} />
              <button type="button" onClick={next} disabled={!hasNext} aria-label="Next track" className={ICON_BTN}>
                <SkipForward className="h-5 w-5" fill="currentColor" aria-hidden />
              </button>
              <RepeatButton />
            </div>
            <Elapsed />
          </div>

          {/* Desktop right: compact cluster */}
          <div className="hidden items-center justify-end gap-1 lg:flex">
            <SpeedButton className="mr-1" />
            <button type="button" onClick={() => setQueueOpen(!queueOpen)} aria-label={`Queue, ${queue.length} track${queue.length === 1 ? "" : "s"}`} aria-pressed={queueOpen} title="Queue (Q)" className={`${ICON_BTN} relative ${queueOpen ? "!bg-vk-100 !text-vk-700" : ""}`}>
              <ListMusic className="h-5 w-5" aria-hidden />
              {queue.length > 1 && (
                <span aria-hidden className="absolute right-0.5 top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-vk-700 px-1 text-[11px] font-bold leading-none text-white">{queue.length}</span>
              )}
            </button>
            <Volume />
            <button type="button" onClick={() => open("lyrics")} aria-label="Open full-screen player with lyrics" title="Expand" className={ICON_BTN}>
              <Maximize2 className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" onClick={close} aria-label="Close player" title="Close player" className={`${ICON_BTN} !text-ink/50 hover:!text-ink`}>
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {/* Mobile right */}
          <div className="flex items-center gap-0.5 lg:hidden">
            <PlayToggle size={40} />
            <button type="button" onClick={next} disabled={!hasNext} aria-label="Next track" className={ICON_BTN}>
              <SkipForward className="h-5 w-5" fill="currentColor" aria-hidden />
            </button>
          </div>

          <MobileProgress />
        </div>
      </div>
      <QueueDrawer />
      {expanded && <NowPlayingSheet initialView={sheetView} />}
    </>
  );
}
