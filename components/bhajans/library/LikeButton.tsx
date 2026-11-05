"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useBhajanLibrary, type BhajanSnapshot } from "@/lib/bhajanLibrary";

/** Heart toggle for a bhajan. `song` is the snapshot saved to the library. 44px target. */
export default function LikeButton({ song, className = "", size = "md" }: { song: BhajanSnapshot; className?: string; size?: "sm" | "md" | "lg" }) {
  const { ready, isLiked, toggleLike } = useBhajanLibrary();
  const liked = ready && isLiked(song.slug);
  const [pop, setPop] = useState(false);
  useEffect(() => {
    if (!pop) return;
    const t = setTimeout(() => setPop(false), 280);
    return () => clearTimeout(t);
  }, [pop]);
  const icon = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? `Remove ${song.title} from liked bhajans` : `Like ${song.title}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!liked) setPop(true);
        toggleLike(song);
      }}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors motion-reduce:transition-none hover:bg-vk-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vk-500 ${liked ? "text-rose-600" : "text-vk-700 hover:text-vk-900"} ${className}`}
    >
      <Heart className={`${icon} transition-transform duration-200 motion-reduce:transition-none ${pop ? "scale-125" : "scale-100"}`} fill={liked ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}
