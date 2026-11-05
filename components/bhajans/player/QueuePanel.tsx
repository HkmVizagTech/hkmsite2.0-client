"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, ListMusic, Trash2, X } from "lucide-react";
import CoverArt from "../CoverArt";
import { usePlayer, usePlayerActions } from "../playerContext";
import { Equaliser, RepeatButton, ShuffleButton } from "./controls";
import { fmtDuration, type QueueItem } from "@/lib/bhajans";

const MINI = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/70 hover:bg-vk-100 hover:text-vk-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500 disabled:opacity-30 disabled:hover:bg-transparent sm:h-9 sm:w-9";

function Row({ t, i, last, cur, playing, canMove }: { t: QueueItem; i: number; last: boolean; cur: boolean; playing: boolean; canMove: boolean }) {
  const { play, removeAt, moveBy, toggle } = usePlayerActions();
  const { queue } = usePlayer();
  return (
    <li className={`flex items-center gap-2 rounded-xl py-1.5 pl-2 pr-1 transition-colors duration-150 ${cur ? "bg-vk-50" : "hover:bg-vk-50"}`}>
      <button
        type="button"
        onClick={() => (cur ? toggle() : play(queue, i))}
        aria-current={cur ? "true" : undefined}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500"
      >
        <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-vk-100">
          <CoverArt title={t.title} src={t.coverImage} sizes="48px" showInitials={false} />
          {cur && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-vk-600">
              <Equaliser paused={!playing} />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-[15px] font-semibold ${cur ? "text-vk-700" : "text-ink"}`}>{t.title}</span>
          <span className="block truncate text-[13px] text-ink/65">{t.singer || t.artist}{t.duration ? ` · ${fmtDuration(t.duration)}` : ""}</span>
        </span>
      </button>
      {!cur && (
        <span className="flex shrink-0 items-center">
          {canMove && (
            <>
              <button type="button" onClick={() => moveBy(i, -1)} disabled={i === 0} aria-label={`Move ${t.title} up`} className={MINI}><ArrowUp className="h-4 w-4" aria-hidden /></button>
              <button type="button" onClick={() => moveBy(i, 1)} disabled={last} aria-label={`Move ${t.title} down`} className={MINI}><ArrowDown className="h-4 w-4" aria-hidden /></button>
            </>
          )}
          <button type="button" onClick={() => removeAt(i)} aria-label={`Remove ${t.title} from queue`} className={MINI}><X className="h-4 w-4" aria-hidden /></button>
        </span>
      )}
    </li>
  );
}

/** Now playing, Next up (reorderable with up/down buttons, removable) and Earlier. Used by the drawer and the mobile sheet. */
export function QueueList({ className = "" }: { className?: string }) {
  const { queue, index, playing } = usePlayer();
  const { clearUpcoming } = usePlayerActions();
  if (!queue.length) {
    return (
      <div className="rounded-2xl bg-vk-50 p-6 text-center">
        <ListMusic className="mx-auto h-8 w-8 text-vk-500" aria-hidden />
        <p className="mt-2 font-bold text-ink">Your queue is empty</p>
        <p className="mt-1 text-sm text-ink/70">Use “Add to queue” on any bhajan with audio.</p>
      </div>
    );
  }
  const upcoming = queue.length - index - 1;
  const head = "mb-1 mt-4 flex items-center justify-between px-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/65";
  return (
    <div className={className}>
      <h3 className={`${head} !mt-0`}>Now playing</h3>
      <ul><Row t={queue[index]} i={index} last cur playing={playing} canMove={false} /></ul>

      <div className={head}>
        <h3>Next up{upcoming > 0 ? ` · ${upcoming}` : ""}</h3>
        {upcoming > 0 && (
          <button type="button" onClick={clearUpcoming} className="-mr-1 inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold normal-case tracking-normal text-vk-700 hover:bg-vk-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500">
            <Trash2 className="h-4 w-4" aria-hidden /> Clear
          </button>
        )}
      </div>
      {upcoming > 0 ? (
        <ul>
          {queue.slice(index + 1).map((t, k) => (
            <Row key={t.key} t={t} i={index + 1 + k} last={index + 1 + k === queue.length - 1} cur={false} playing={playing} canMove />
          ))}
        </ul>
      ) : (
        <p className="px-2 py-3 text-sm text-ink/70">Nothing queued after this one.</p>
      )}

      {index > 0 && (
        <>
          <h3 className={head}>Earlier</h3>
          <ul className="opacity-80">
            {queue.slice(0, index).map((t, i) => (
              <Row key={t.key} t={t} i={i} last={false} cur={false} playing={playing} canMove />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/** Desktop slide-over from the right. Sits above the player bar, solid white. */
export function QueueDrawer() {
  const { queueOpen } = usePlayer();
  const { setQueueOpen } = usePlayerActions();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!queueOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQueueOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [queueOpen, setQueueOpen]);
  if (!queueOpen) return null;
  return (
    <aside
      aria-label="Queue"
      className="bh-drawer fixed bottom-[var(--player-h,84px)] right-0 top-0 z-[60] hidden w-[400px] max-w-full flex-col border-l border-vk-100 bg-white text-ink shadow-[-12px_0_28px_-24px_rgba(11,23,69,.3)] lg:flex"
    >
      <div className="flex items-center justify-between gap-2 border-b border-vk-100 px-4 py-2">
        <h2 className="text-xl font-bold">Queue</h2>
        <div className="flex items-center">
          <ShuffleButton />
          <RepeatButton />
          <button ref={closeRef} type="button" onClick={() => setQueueOpen(false)} aria-label="Close queue" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink/85 hover:bg-vk-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-6 pt-3">
        <QueueList />
      </div>
      <style>{`@keyframes bh-drawer{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}.bh-drawer{animation:bh-drawer .2s cubic-bezier(.2,.8,.2,1) both}@media(prefers-reduced-motion:reduce){.bh-drawer{animation:none}}`}</style>
    </aside>
  );
}
