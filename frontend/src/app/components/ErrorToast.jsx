"use client";

import { CircleX } from "lucide-react";

export default function ErrorToast({ message }) {
  return (
    <div role="alert" className="flex min-h-[72px] w-full overflow-hidden rounded-md bg-white shadow-lg">
      <div className="flex w-14 shrink-0 items-center justify-center bg-rose-500 text-white">
        <CircleX size={32} strokeWidth={1.5} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
        <strong className="text-base font-medium leading-5 text-slate-700">Error</strong>
        <span className="text-xs leading-4 text-slate-500">{message}</span>
      </div>
    </div>
  );
}
