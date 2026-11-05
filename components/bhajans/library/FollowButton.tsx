"use client";

import { Bookmark, Check, Plus } from "lucide-react";
import { useBhajanLibrary, type FollowedItem } from "@/lib/bhajanLibrary";

/** Follow pill for composers (type="author") or Save pill for categories, moods and festivals. */
export default function FollowButton({ item, mode = "follow", className = "" }: { item: Omit<FollowedItem, "at">; mode?: "follow" | "save"; className?: string }) {
  const { ready, isFollowing, toggleFollow } = useBhajanLibrary();
  const on = ready && isFollowing(item.type, item.slug);
  const [off, onLabel] = mode === "save" ? ["Save", "Saved"] : ["Follow", "Following"];
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => toggleFollow(item)}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 text-sm font-bold ring-1 transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vk-500 ${on ? "bg-vk-600 text-white ring-vk-600 hover:bg-vk-700" : "bg-white text-vk-800 ring-vk-300 hover:bg-vk-50"} ${className}`}
    >
      {on ? <Check className="h-4 w-4" aria-hidden /> : mode === "save" ? <Bookmark className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
      {on ? onLabel : off}
    </button>
  );
}
