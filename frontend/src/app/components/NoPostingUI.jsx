import { MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const NoPostingUI = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[89vh]">
      <div className="flex flex-col items-center gap-y-5">
        <img
          src="/no-postings.svg"
          alt="No Post Item"
          className="md:size-40 size-20"
        />
        <h1 className="md:text-2xl text-xl font-medium">You have not posted yet</h1>
        <Link href="/post" className="border-2 px-3 py-2 hover:bg-slate-200">Start Selling </Link>
      </div>
    </div>
  );
};

export default NoPostingUI;
