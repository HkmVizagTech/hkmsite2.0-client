"use client";

interface StickyMobileBarProps {
  scrollToDonate: () => void;
  visible?: boolean;
}

export default function StickyMobileBar({ scrollToDonate, visible = true }: StickyMobileBarProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 pt-1 md:hidden">
      <button
        onClick={scrollToDonate}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-5 py-2 text-xs font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)]"
      >
        🪔 Donate Now
      </button>
    </div>
  );
}
