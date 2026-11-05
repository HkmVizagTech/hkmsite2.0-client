"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ExternalLink, Heart, Link2, ListEnd, ListPlus, MoreHorizontal } from "lucide-react";
import { useBhajanLibrary, type BhajanSnapshot } from "@/lib/bhajanLibrary";
import { usePlayer, usePlayerActions } from "../playerContext";
import { fetchQueue } from "./queueFetch";
import { showToast } from "../toast";
import { FOCUS } from "./tones";

const W = 216;
const ITEM = `flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-ink hover:bg-vk-50 disabled:opacity-45 ${FOCUS} focus-visible:-outline-offset-2`;

/** "..." button with Play next / Add to queue / Open / Copy link. The menu is portalled so scroll rows never clip it. */
export default function CardMenu({ slug, title, hasAudio, song, className = "" }: { slug: string; title: string; hasAudio: boolean; song?: BhajanSnapshot; className?: string }) {
  const lib = useBhajanLibrary();
  const liked = lib.ready && lib.isLiked(slug);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const { queue } = usePlayer();
  const { playNext, enqueue } = usePlayerActions();

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (!open || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    const h = 5 * 44 + 16;
    const left = Math.min(Math.max(8, r.right - W), window.innerWidth - W - 8);
    const below = r.bottom + 4;
    const top = below + h > window.innerHeight - 8 ? Math.max(8, r.top - h - 4) : below;
    setPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLElement>("button:not([disabled]),a")?.focus();
    const away = (e: Event) => {
      const t = e.target as Node;
      if (!menu.current?.contains(t) && !btn.current?.contains(t)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const els = Array.from(menu.current?.querySelectorAll<HTMLElement>("button:not([disabled]),a") || []);
        const i = els.indexOf(document.activeElement as HTMLElement);
        if (!els.length) return;
        e.preventDefault();
        els[(i + (e.key === "ArrowDown" ? 1 : -1) + els.length) % els.length].focus();
      }
    };
    const dismiss = () => setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc, true);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc, true);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open, close]);

  const act = async (kind: "next" | "end") => {
    close();
    const q = await fetchQueue(slug);
    const item = q[0];
    if (!item) {
      showToast("This bhajan has no audio yet.", "error");
      return;
    }
    const empty = queue.length === 0;
    if (kind === "next") {
      playNext([item]);
      showToast(empty ? `Playing “${title}”` : `“${title}” will play next`);
    } else if (queue.some((t) => t.key === item.key)) {
      showToast(`“${title}” is already in your queue`);
    } else {
      enqueue([item]);
      showToast(empty ? `Playing “${title}”` : `Added “${title}” to your queue`);
    }
  };

  const copy = async () => {
    close();
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/bhajans/${slug}`);
      showToast("Link copied");
    } catch {
      showToast("Couldn’t copy the link", "error");
    }
  };

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-label={`More options for ${title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-vk-800 transition duration-150 motion-reduce:transition-none hover:bg-vk-100 ${FOCUS} ${className}`}
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden />
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={menu}
            role="menu"
            aria-label={`Options for ${title}`}
            style={{ top: pos.top, left: pos.left, width: W }}
            className="fixed z-[100] rounded-xl border border-vk-100 bg-white p-1 text-ink shadow-[0_10px_24px_-14px_rgba(11,23,69,.35)]"
          >
            <button role="menuitem" type="button" disabled={!hasAudio} onClick={() => void act("next")} className={ITEM}>
              <ListPlus className="h-4 w-4 shrink-0 text-vk-600" aria-hidden /> Play next
            </button>
            <button role="menuitem" type="button" disabled={!hasAudio} onClick={() => void act("end")} className={ITEM}>
              <ListEnd className="h-4 w-4 shrink-0 text-vk-600" aria-hidden /> Add to queue
            </button>
            {song && (
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  close();
                  const now = lib.toggleLike(song);
                  showToast(now ? `Saved “${title}” to your library` : `Removed “${title}” from your library`);
                }}
                className={ITEM}
              >
                <Heart className="h-4 w-4 shrink-0 text-vk-600" fill={liked ? "currentColor" : "none"} aria-hidden /> {liked ? "Remove from liked" : "Like"}
              </button>
            )}
            <Link role="menuitem" href={`/bhajans/${slug}`} onClick={() => close()} className={ITEM}>
              <ExternalLink className="h-4 w-4 shrink-0 text-vk-600" aria-hidden /> Open bhajan
            </Link>
            <button role="menuitem" type="button" onClick={() => void copy()} className={ITEM}>
              <Link2 className="h-4 w-4 shrink-0 text-vk-600" aria-hidden /> Copy link
            </button>
            {!hasAudio && <p className="px-3 pb-2 pt-1 text-[13px] text-ink/70">Lyrics only, no audio yet.</p>}
          </div>,
          document.body,
        )}
    </>
  );
}
