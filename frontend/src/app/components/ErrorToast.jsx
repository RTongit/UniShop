"use client";

import { CircleX } from "lucide-react";

export default function ErrorToast({ message }) {
  return (
    <div role="alert" className="flex min-h-[60px] w-full max-w-[calc(100vw-24px)] overflow-hidden rounded-md bg-white shadow-lg sm:min-h-[72px] sm:max-w-none">
      <div className="flex w-11 shrink-0 items-center justify-center bg-rose-500 text-white sm:w-14">
        <CircleX className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-1.5 sm:px-3 sm:py-2">
        <strong className="text-sm font-medium leading-5 text-slate-700 sm:text-base">Error</strong>
        <span className="break-words text-[11px] leading-4 text-slate-500 sm:text-xs">{message}</span>
      </div>
    </div>
  );
}
