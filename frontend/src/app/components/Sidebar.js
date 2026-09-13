"use client";
import Link from "next/link";
import { useChatStore } from "../store/chatStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";
import formatDate from "../constant/formatDate.js";

export default function SideBar() {
  const { myChats, selectedChat, setSelectedChat } = useChatStore();
  const { authUser} = useAuthStore();

  return (
    <div className="flex flex-col px-2 gap-y-3 w-full h-full bg-white py-2">
      {myChats.map((chat, i) => (
        <Link
          key={i}
          onClick={() => {
            setSelectedChat(chat);
          }}
          className={`${(selectedChat && (selectedChat._id == chat._id)) ? "bg-stone-200 rounded-xl" : "bg-white"} py-3 px-2 hover:bg-stone-200 hover:rounded-xl`}
          href={`/chat/${chat._id}`}
        >
          <div className="flex justify-between">

            {/*Left Section*/}
            <div className="flex gap-x-3">
              {/* Profile Pic */}
              <div className="size-10 bg-amber-800 rounded-full overflow-hidden">
                <img
                  src={`${authUser.userId === chat.buyer._id.toString() ?   
                  chat.seller.profilePic || "/defaultProfilePic.jpg"
                  : 
                  chat.buyer.profilePic || "/defaultProfilePic.jpg"
                }`
                }
                  alt="/profilePic"
                  className="size-full object-cover"
                />
              </div>

              {/* User info */}
              <div className="flex flex-col gap-y-2">
                <span className="font-medium">
                  {authUser.userId === chat.buyer._id.toString()
                    ? 
                    (<div className="flex flex-col gap-y-1">
                      <span>{chat.seller.name}</span>
                      <span className="text-sm text-gray-500">Seller</span>
                    </div>)
                    : 
                    (<div className="flex flex-col gap-y-1">
                      <span>{chat.buyer.name}</span>
                      <span className="text-sm text-gray-500">Buyer</span>
                    </div>)
                  }
                </span>
                <span className="text-sm">{chat.item.title}</span>
              </div>

            </div>

            {/*Right section*/}
            <div className="flex flex-col gap-y-1">

              {/* Time of last chat*/}
              {chat && chat.newMessageTime!="" ? 
              (<span>{formatDate(chat.newMessageTime)}</span>)
              : null}

              <span>.</span>
            </div>

          </div>
        </Link>
      ))}

    </div>
  );
}
