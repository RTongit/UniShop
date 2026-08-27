"use client";
import Link from "next/link";
import { useChatStore } from "../store/chatStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";

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
          className={`${(selectedChat && (selectedChat._id == chat._id)) ? "bg-gray-200 rounded-xl" : "bg-white"} py-3 px-2`}
          href={`/chat/${chat._id}`}
        >
          <div className="flex justify-between">
            {/* Profile pic and toChatUser info */}
            <div className="flex gap-x-3">
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

              <div className="flex flex-col gap-y-2">
                <span className="font-medium">
                  {authUser.userId === chat.buyer._id.toString()
                    ? chat.seller.name + " (Seller)"
                    : chat.buyer.name + " (Buyer)"
                  }
                  {/* {console.log(`AuthUserId =  ${authUser.userId }`)}
                  {console.log(`BuyerId =  ${chat.buyer._id }`)}
                  {console.log(`SellerId =  ${chat.seller._id }`)} */}
                </span>
                <span className="text-sm">{chat.item.title}</span>
              </div>

            </div>
            {/* Time of  */}
          </div>
        </Link>
      ))}

    </div>
  );
}
