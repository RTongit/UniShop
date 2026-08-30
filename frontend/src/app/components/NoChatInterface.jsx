import { MessageCircle } from "lucide-react";
import React from "react";

const NoChatInterface = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[89vh]">
      <div className="flex flex-col items-center">
        <img
          src="/empty-chat.svg"
          alt="No messages"
          className="mb-5 md:size-40 size-20"
        />
        <h1 className="md:text-3xl text-xl font-medium">No Message yet</h1>
        <p className="mt-2 md:text-md text-sm text-gray-400">
          Search for an item and click the contact seller button to start a
          conversation.
        </p>
      </div>
    </div>
  );
};

export default NoChatInterface;
