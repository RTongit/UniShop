"use client";

import formatPrice from "@/app/constant/formatPrice";
import { X } from "lucide-react";
import { useState } from "react";
import { useItemStore } from "../store/itemStore";

export default function MarkSoldCodeModal({ item, onClose, onSold }) {
  const [verificationCode, setVerificationCode] = useState("");
  const {isVerifying,markItemSold} = useItemStore()

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17211d]/45 p-4 backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mark-sold-title"
        className="relative w-full max-w-md rounded-[1.75rem] border border-[#e7e3d8] bg-[#faf9f4] p-6 shadow-[0_24px_80px_rgba(24,42,34,0.2)] sm:p-8"
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-[#66736a] transition hover:bg-[#eeede5] hover:text-[#1d352c]"
        >
          <X size={18} />
        </button>

        <img
          src="/favicon.ico"
          alt="UniShop bell logo"
          className="mb-3 size-8 object-contain"
        />
        <h2 id="mark-sold-title" className="font-serif text-2xl font-medium tracking-tight text-[#18352c]">
          Confirm handoff
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#687168]">
          Enter the 6-digit code provided by the buyer to mark this item as sold.
        </p>

        <div className="mt-6 border-y border-[#e7e3d8] py-4">
          <p className="truncate text-sm font-medium text-[#18352c]">{item.title}</p>
          <p className="mt-1 text-sm text-[#788176]">{formatPrice(item.price)}</p>
        </div>

        <label htmlFor="handoff-code" className="mt-5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#687168]">
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
          className="mt-2 h-13 w-full rounded-xl border border-[#d9d8cb] bg-white px-4 text-center font-mono text-lg tracking-[0.45em] text-[#18352c] outline-none transition placeholder:font-sans placeholder:text-sm placeholder:tracking-normal focus:border-[#53684e] focus:ring-2 focus:ring-[#dfe4d8]"
        />

        <div className="mt-6">
          <button
            type="button"
            disabled={verificationCode.length !== 6 || isVerifying}
            onClick={async ()=>{
              // sending a request to backend
              const success = await markItemSold(item._id, verificationCode)

              // closes the form if code gets accepted and also update the label to sold 
              if(success) {
                onSold?.(item._id);
                onClose();
              }

            }}
            className="h-12 w-full rounded-xl bg-[#18352c] px-5 text-sm font-semibold text-white transition hover:bg-[#28483c] disabled:cursor-not-allowed disabled:bg-[#c8cec4]"
          >
            {(isVerifying) ? "Verifying..." : "Verify code"}
          </button>
        </div>
      </section>
    </div>
  );
}
