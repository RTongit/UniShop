"use client";

import formatPrice from "@/app/constant/formatPrice";
import { KeyRound, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MarkSoldCodeModal({ item, onClose }) {
  const [verificationCode, setVerificationCode] = useState("");

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mark-sold-title"
        className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-black"
        >
          <X size={18} />
        </button>

        <div className="mb-5 grid size-12 place-items-center rounded-full bg-stone-100 text-stone-800">
          <KeyRound size={22} />
        </div>

        <h2 id="mark-sold-title" className="text-xl font-semibold text-stone-950">
          Confirm handoff
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Enter the 6-digit code provided by the buyer to mark this item as sold.
        </p>

        <div className="mt-5 rounded-xl bg-stone-50 px-4 py-3">
          <p className="truncate text-sm font-medium text-stone-900">{item.title}</p>
          <p className="mt-1 text-sm text-stone-500">{formatPrice(item.price)}</p>
        </div>

        <label htmlFor="handoff-code" className="mt-5 block text-sm font-medium text-stone-800">
          Verification code
        </label>
        <input
          id="handoff-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={verificationCode}
          onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter 6-digit code"
          className="mt-2 h-12 w-full rounded-lg border border-stone-300 bg-white px-4 text-center font-mono text-lg tracking-[0.45em] text-stone-950 outline-none transition placeholder:font-sans placeholder:text-sm placeholder:tracking-normal focus:border-stone-800 focus:ring-2 focus:ring-stone-200"
        />

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-stone-300 px-5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={verificationCode.length !== 6}
            onClick={() => toast.info("Code verification UI only — backend verification is not connected yet.")}
            className="h-11 rounded-lg bg-black px-5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            Verify code
          </button>
        </div>
      </section>
    </div>
  );
}
