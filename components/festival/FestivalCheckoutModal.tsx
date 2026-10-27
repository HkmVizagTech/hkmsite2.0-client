"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import DonationForm from "@/components/DonationForm";
import type { SevaSelection } from "./FestivalSevaGrid";

/** The checkout dialog (bottom sheet on phones) around the shared <DonationForm>, identical to the Kartik Maas page. */
export default function FestivalCheckoutModal({
  selected,
  onClose,
  sourcePage,
  festivalSlug,
  bannerImage,
  thankYouSource,
  trackContentName,
}: {
  selected: SevaSelection;
  onClose: () => void;
  sourcePage: string;
  festivalSlug: string;
  bannerImage: string;
  thankYouSource: string;
  trackContentName: string;
}) {
  // Lock the page behind the dialog and close on Escape.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-vk-900/70 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Offer ${selected.seva.title}`}
      onMouseDown={(event) => {
        // Backdrop only: a drag that starts inside the panel must not close it.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="kd-modal relative max-h-[92vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <style>{`
          .kd-modal::-webkit-scrollbar { width: 6px; }
          .kd-modal::-webkit-scrollbar-track { background: transparent; }
          .kd-modal::-webkit-scrollbar-thumb { background: #B9C8FB; border-radius: 9999px; }
        `}</style>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <DonationForm
          seva={selected.seva}
          sourcePage={sourcePage}
          festivalSlug={festivalSlug}
          bannerImage={bannerImage}
          initialAmount={selected.amount ?? undefined}
          startCustom={selected.amount === null}
          collapseAmount
          autoScrollOnMount={false}
          thankYouType="seva"
          thankYouSource={thankYouSource}
          trackContentName={trackContentName}
          variant="stacked"
        />
      </div>
    </div>
  );
}
