"use client";

import formatPrice from "@/app/constant/formatPrice";
import { X } from "lucide-react";
import { useItemStore } from "../store/itemStore";

export default function ReleaseReservationModal({ item, onClose, onReleased }) {
  const { isReleasingReservation, releaseReservation } = useItemStore();

  if (!item) return null;

  async function handleRelease() {
    const success = await releaseReservation(item._id);
    if (success) {
      onReleased?.(item._id);
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17211d]/45 p-4 backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isReleasingReservation) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="release-reservation-title"
        className="relative w-full max-w-md rounded-lg border border-[#e7e3d8] bg-[#faf9f4] p-6 shadow-[0_24px_80px_rgba(24,42,34,0.2)] sm:p-8"
      >
        <button
          type="button"
          aria-label="Close dialog"
          disabled={isReleasingReservation}
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-[#66736a] transition hover:bg-[#eeede5] hover:text-[#1d352c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <h2 id="release-reservation-title" className="pr-12 font-serif text-2xl font-medium tracking-tight text-[#18352c]">
          Release this reservation?
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#687168]">
          The listing will become available to other students again, and the buyer will be notified in your chat.
        </p>

        <div className="mt-5 border-y border-[#e7e3d8] py-4">
          <p className="truncate text-sm font-medium text-[#18352c]">{item.title}</p>
          <p className="mt-1 text-sm text-[#788176]">{formatPrice(item.price)}</p>
        </div>

        <div className="mt-6">
          <button
            type="button"
            disabled={isReleasingReservation}
            onClick={handleRelease}
            className="h-11 w-full rounded-md bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isReleasingReservation ? "Releasing…" : "Release reservation"}
          </button>
        </div>
      </section>
    </div>
  );
}
