"use client";
import Link from "next/link";
import { useChatStore } from "../store/chatStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useEffect, useState } from "react";
import formatDate from "../constant/formatDate.js";
import { useRouter } from "next/navigation.js";

export default function SideBar() {
  const { myChats, setMyChats, unsetMyChats, selectedChat, setSelectedChat,markChatAsRead, chatFilter, setChatFilter } = useChatStore();
  const { authUser,socket} = useAuthStore();
  const router = useRouter()
  const [onlineUsers, setOnlineUsers] = useState([]);

  const filteredChats = myChats.filter((chat) => {
    if (chatFilter === "All") return true;
    const currentUserIsBuyer = authUser.userId.toString() === chat.buyer._id.toString();
    return chatFilter === "Buying" ? currentUserIsBuyer : !currentUserIsBuyer;
  });

  useEffect(()=>{
    if(!socket) return;
    function handleChatNotification(message) {
      const chat = message.chat
      const isBuyer = (authUser.userId.toString()==chat.buyer.toString()) ? true : false;
      setMyChats(chat._id.toString(),isBuyer)
    }

    socket.on("newChatNotification",handleChatNotification);

    return ()=>{socket.off("newChatNotification",handleChatNotification)}
  },[socket,setMyChats,authUser])

  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    const requestOnlineUsers = () => socket.emit("getOnlineUsers");
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("connect", requestOnlineUsers);
    if (socket.connected) requestOnlineUsers();
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("connect", requestOnlineUsers);
    };
  }, [socket]);

  return (
    <div className="flex h-full w-full min-h-0 flex-col bg-white px-2 py-2">
      {/* Filter button */}
      <div className="mb-2 flex shrink-0 gap-1 rounded-xl border border-gray-200 bg-white p-1">
        {["All", "Buying", "Selling"].map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={chatFilter === filter}
            onClick={() => setChatFilter(filter)}
            className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${chatFilter === filter ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-y-3 overflow-y-auto">
      {filteredChats.map((chat, i) => (
        <button
          key={i}
          onClick={async () => {
            setSelectedChat(chat);
            const isBuyer = (authUser.userId.toString()==chat.buyer._id.toString()) ? true : false;
            if((authUser.userId==chat.buyer._id.toString() && chat.buyerHasUnreadMessage==true) || (authUser.userId==chat.seller._id.toString() && chat.sellerHasUnreadMessage==true)) {
              unsetMyChats(chat._id,isBuyer)
              await markChatAsRead(chat._id);
            }
            router.push(`/chat/${chat._id}`);

          }}
          className={`border-b border-gray-300 ${(selectedChat && (selectedChat._id == chat._id)) ? "bg-stone-200 rounded-xl" : "bg-white"} py-3 px-2 hover:bg-stone-200 hover:rounded-xl`}
        >
          <div className="flex justify-between">

            {/*Left Section*/}
            <div className="flex gap-x-3">  
              {/* Profile Pic */}
              <div className="relative size-10 shrink-0">
                <img
                  src={`${authUser.userId === chat.buyer._id.toString() ?   
                  chat.seller.profilePic || "/defaultProfilePic.jpg"
                  : 
                  chat.buyer.profilePic || "/defaultProfilePic.jpg"
                }`
                }
                  alt="/profilePic"
                  className="size-full rounded-full object-cover"
                />
                {onlineUsers.includes((authUser.userId === chat.buyer._id.toString() ? chat.seller._id : chat.buyer._id).toString()) && (
                  <span title="Online" className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />
                )}
              </div>

              {/* User info */}
              <div className="flex flex-col gap-y-2 items-start">
                <span className="font-medium">
                  {authUser.userId === chat.buyer._id.toString()
                    ? 
                    (<div className="flex flex-col gap-y-1 items-start">
                      <span>{chat.seller.name}</span>
                      <span className="text-sm text-gray-500">Seller</span>
                    </div>)
                    : 
                    (<div className="flex flex-col gap-y-1 items-start">
                      <span>{chat.buyer.name}</span>
                      <span className="text-sm text-gray-500">Buyer</span>
                    </div>)
                  }
                </span>
                <span className="text-sm text-start">{chat.item.title}</span>
              </div>

            </div>

            {/*Right section*/}
            <div className="flex flex-col gap-y-2 items-end">

              {/* Time of last chat*/}
              {chat && chat.newMessageTime!="" ? 
              (<span className="text-[11px]">{formatDate(chat.newMessageTime)}</span>)
              : null}
              
              {/* New message dot */}
              {/* If authUser is buyer */}
              {(authUser.userId==chat.buyer._id.toString() && chat.buyerHasUnreadMessage==true) ? <span className="h-2.5 w-2.5 rounded-full bg-[#DC143C] shrink-0" /> : null}
              {/* If authUser is seller */}
              {(authUser.userId==chat.seller._id.toString() && chat.sellerHasUnreadMessage==true) ? <span className="h-2.5 w-2.5 rounded-full bg-[#DC143C] shrink-0" /> : null}
            </div>

          </div>
        </button>
      ))}
      </div>

    </div>
  );
}
