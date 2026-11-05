"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Clock3, Heart, Trash2, Users } from "lucide-react";
import CoverArt from "../CoverArt";
import Avatar from "../taxonomy/Avatar";
import PlayAllButtons from "../taxonomy/PlayAllButtons";
import { PlayIcon } from "../browse/PlayFab";
import { usePlaySlug } from "../browse/usePlaySlug";
import LikeButton from "./LikeButton";
import { useBhajanLibrary } from "@/lib/bhajanLibrary";
import { taxonomyHref } from "@/lib/bhajansTaxonomy";
import { FOCUS, PILL } from "../taxonomy/ui";

type Tab = "liked" | "following" | "recent";

function Row({ s }: { s: { slug: string; title: string; artist: string; coverImage: string } }) {
  const { showPause, busy, onPlay } = usePlaySlug(s.slug);
  return (
    <li className="flex min-h-[60px] items-center gap-3 rounded-lg px-1 hover:bg-vk-50 sm:px-2">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-vk-100 shadow-[0_2px_6px_-3px_rgba(15,31,92,.3)]">
        <CoverArt title={s.title} src={s.coverImage} sizes="48px" showInitials={false} />
      </div>
      <Link href={`/bhajans/${s.slug}`} className={`min-w-0 flex-1 rounded-sm py-2 ${FOCUS}`}>
        <span className="block truncate text-[15px] font-bold leading-tight text-ink">{s.title}</span>
        <span className="mt-0.5 block truncate text-[13px] text-vk-700">{s.artist}</span>
      </Link>
      <button type="button" onClick={() => void onPlay()} aria-label={`${showPause ? "Pause" : "Play"} ${s.title}`} className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F6C752] text-[#0b1745] hover:brightness-105 ${FOCUS}`}>
        <PlayIcon busy={busy} pause={showPause} className="h-5 w-5" />
      </button>
      <LikeButton song={s} />
    </li>
  );
}

function Empty({ icon, title, text, cta, href }: { icon: ReactNode; title: string; text: string; cta: string; href: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl bg-vk-50 px-6 py-12 text-center ring-1 ring-vk-100">
      <span aria-hidden className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-vk-600 ring-1 ring-vk-200">{icon}</span>
      <h2 className="font-serif-display text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-vk-800">{text}</p>
      <Link href={href} className="vk-btn-gold mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full px-7 text-sm font-bold">{cta}</Link>
    </div>
  );
}

export default function LibraryClient() {
  const { ready, liked, following, recent, clearRecent } = useBhajanLibrary();
  const [tab, setTab] = useState<Tab>("liked");
  const tabs: { id: Tab; label: string; n: number }[] = [
    { id: "liked", label: "Liked bhajans", n: liked.length },
    { id: "following", label: "Following", n: following.length },
    { id: "recent", label: "Recently played", n: recent.length },
  ];
  return (
    <div>
      <div role="tablist" aria-label="Your library" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
        {tabs.map((t) => (
          <button key={t.id} id={`lib-tab-${t.id}`} role="tab" aria-selected={tab === t.id} aria-controls="lib-panel" type="button" onClick={() => setTab(t.id)} className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold ring-1 ${FOCUS} ${tab === t.id ? "bg-vk-600 text-white ring-vk-600" : "bg-white text-vk-800 ring-vk-200 hover:bg-vk-50"}`}>
            {t.label}
            {ready && t.n > 0 && <span className={`rounded-full px-2 text-xs ${tab === t.id ? "bg-white/20" : "bg-vk-100"}`}>{t.n}</span>}
          </button>
        ))}
      </div>

      <div id="lib-panel" role="tabpanel" aria-labelledby={`lib-tab-${tab}`} className="mt-6 min-h-[320px]">
        {!ready ? (
          <ul aria-hidden className="space-y-2">
            {[0, 1, 2, 3].map((i) => <li key={i} className="h-[60px] animate-pulse rounded-lg bg-vk-50 motion-reduce:animate-none" />)}
          </ul>
        ) : tab === "liked" ? (
          liked.length ? (
            <>
              <PlayAllButtons src={{ slugs: liked.map((l) => l.slug) }} label="Play all" className="mb-4" />
              <ul>{liked.map((s) => <Row key={s.slug} s={s} />)}</ul>
            </>
          ) : (
            <Empty icon={<Heart className="h-9 w-9" />} title="No liked bhajans yet" text="Tap the heart on any bhajan to keep it here for next time." cta="Browse bhajans" href="/bhajans" />
          )
        ) : tab === "following" ? (
          following.length ? (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {following.map((f) => (
                <li key={`${f.type}:${f.slug}`} className="min-w-0">
                  <Link href={taxonomyHref(f.type, f.slug)} className={`flex flex-col items-center rounded-2xl p-2 text-center hover:bg-vk-50 ${FOCUS}`}>
                    <Avatar name={f.name} src={f.image} className="h-28 w-28" sizes="120px" textClass="text-3xl" />
                    <span className="mt-3 line-clamp-2 w-full text-[15px] font-bold leading-snug text-ink">{f.name}</span>
                    <span className="text-[13px] capitalize text-vk-700">{f.type === "author" ? "Composer" : f.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon={<Users className="h-9 w-9" />} title="Not following anyone yet" text="Follow your favourite composers and save playlists to find them here." cta="Browse composers" href="/bhajans/authors" />
          )
        ) : recent.length ? (
          <>
            <div className="mb-3 flex justify-end">
              <button type="button" onClick={clearRecent} className={`${PILL} min-h-[44px]`}><Trash2 className="h-4 w-4" aria-hidden /> Clear history</button>
            </div>
            <ul>{recent.map((s) => <Row key={s.slug} s={s} />)}</ul>
          </>
        ) : (
          <Empty icon={<Clock3 className="h-9 w-9" />} title="Nothing played yet" text="Bhajans you listen to will appear here, newest first." cta="Start listening" href="/bhajans" />
        )}
      </div>
    </div>
  );
}
