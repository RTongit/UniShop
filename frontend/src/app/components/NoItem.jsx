import { MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const NoItem = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[89vh]">
      <div className="flex flex-col items-center gap-y-5">
        <img
          src="/emptyBox.svg"
          alt="No item"
          className="md:size-40 size-20"
        />
        <h1 className="md:text-2xl text-xl font-medium">No items found</h1>
      </div>
    </div>
  );
};

export default NoItem;
