"use client";

import MessageContainer from "@/app/components/MessageContainer.js";
import SideBar from "@/app/components/Sidebar.js";
import Spinner from "@/app/components/Spinner.js";
import { useAuthStore } from "@/app/store/authStore.js";
import { useChatStore } from "@/app/store/chatStore.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function MessagePage({ params }) {
  const { authUser, socket } = useAuthStore();
  const {
    myChats,
    isChatsLoading,
    getChats,
    isPostingChat,
    isMessagesLoading,
    getChatMessages,
    selectedChat,
  } = useChatStore();
  const { chatId } = use(params);
  const router = useRouter();

  useEffect(() => {
    if(!authUser) {router.replace("/login"); return;}
    if (authUser.verificationStatus !== "verified") {router.replace("/"); return;}
    if (!selectedChat) {router.replace("/chat"); return;}
    if (isPostingChat == false) getChats();
  }, [router, authUser, getChats, isPostingChat,selectedChat]);

  useEffect(() => {
    getChatMessages(chatId);
  }, [getChatMessages, chatId]);

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("JoinChat", chatId);

    // Need to make the return function :
    return () => {
      socket.emit("LeaveChat", chatId);
    };
  }, [chatId, socket, authUser]);

  if (!authUser) return null;
  if (authUser.verificationStatus !== "verified") return null;
  if(selectedChat==null) return null;
  if (isChatsLoading) return <Spinner />;
  if (isPostingChat) return <Spinner />;
  if (isMessagesLoading) return <Spinner />;

  return (
    <div className="flex h-[calc(100dvh-109px)] flex-col overflow-hidden bg-stone-100 p-2 sm:h-[calc(100dvh-121px)] md:h-[calc(100dvh-122px)] md:flex-row md:gap-x-3 md:p-3 lg:h-[calc(100dvh-78px)]">
      
      {/* Side bar containing chats */}
      <div className="gap-y-3 hidden w-full min-w-0 rounded-md h-full overflow-y-auto md:flex md:w-[360px] md:min-w-[360px] md:flex-none md:flex-col">
        <SideBar />
      </div>

      {/* Message container containing messages :  */}
      <div className="h-full min-h-0 w-full flex-1 overflow-hidden">
        <MessageContainer chatId={chatId} />
      </div>

    </div>
  );
}
