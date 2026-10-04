"use client";

import { Heart } from "lucide-react";

interface StickyMobileBarProps {
  scrollToDonate: () => void;
  visible?: boolean;
}

export default function StickyMobileBar({ scrollToDonate, visible = true }: StickyMobileBarProps) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
      <div className="rounded-2xl border border-vk-100 bg-white/95 p-2 shadow-lift backdrop-blur">
        <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-11 w-full px-5">
          <Heart className="h-4 w-4 fill-current" /> Donate Now
        </button>
      </div>
    </div>
  );
}
