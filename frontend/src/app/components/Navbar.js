"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import ProfileDropDown from "./ProfileDropDown";
import { MessageCircle, Plus, Search } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import ErrorToast from "./ErrorToast";
import { toast } from "sonner";

function handleUnverifiedAccess(message) {
  toast.custom(() => (
    <ErrorToast
      message= {message}
    />
  ), { duration: 5500, position: "top-center" });
}

export default function Navbar() {
  let [item, setItem] = useState("");
  const router = useRouter();
  const { authUser,logout,socket } = useAuthStore();
  const {getGlobalNotificationStatus,unreadChatCount,setUnreadChatCount} = useChatStore()


  useEffect(()=>{
    async function fetchData() {
      await getGlobalNotificationStatus()
    }
    fetchData();
  },
  [getGlobalNotificationStatus])

  // It listens for global notification event named = newGlobalNotification
  useEffect(
    ()=>{
      if(!socket) return
      const handleGlobalNotification = (message) => {
        console.log("🔥 RECEIVED:", message);
        setUnreadChatCount(message.unreadChatCount);
      };
      socket.on("newGlobalNotification", handleGlobalNotification);

      // Handle cleanup of previous listener
      return () =>{ 
        socket.off("newGlobalNotification", handleGlobalNotification);
      }
    },
    [socket,setUnreadChatCount]
  )

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/search?title=${encodeURIComponent(item)}`);
  }
  
  return (
    <div className="sticky top-0 z-10 flex items-center border-b border-gray-200 bg-white px-3 py-2 sm:py-3 md:px-6 md:py-4">
      <div className="flex w-full flex-col items-center justify-between gap-2 sm:gap-4 lg:flex-row">

        {/* Left section Unishop logo and search */}
        <div className="flex w-full flex-col gap-x-6 gap-y-1.5 lg:flex-row lg:gap-y-0">

          <div className="text-lg font-bold whitespace-nowrap flex justify-between">
            {/*UniShop Logo */}
            <div>
              <Link href="/">
                <span className="text-blue-600">Uni</span>
                <span className="text-gray-900">Shop</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              {authUser ? (
              <ProfileDropDown
                user={authUser}
              />
              ) : (null)}

              {authUser ? 
              (<button
                onClick={()=>{
                  if (authUser.verificationStatus !== "verified") {handleUnverifiedAccess("Your account must be verified to post an item.")}
                  else router.push("/post" )
                }} 
                className="flex items-center gap-2 rounded-xl border-2 p-1.5 hover:border-pink-100 hover:ring-2 hover:ring-pink-100">
                  <Plus size={20} /> <span className="hidden lg:block">Sell</span>
              </button>) 
              : null
              }

              {authUser ? (
                <button
                onClick={()=>{
                  if (authUser.verificationStatus !== "verified") {handleUnverifiedAccess("Your account must be verified to access chat section.")}
                  else router.push("/chat")
                }} 
                className="relative flex items-center gap-2 rounded-xl border-2 p-1.5 hover:border-pink-100 hover:ring-2 hover:ring-pink-100"
                 >
                 <MessageCircle size={20} />

                  {unreadChatCount>0 ? 
                    (<span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-[#DC143C]" />)
                     : 
                    null
                  }
                </button>
              ) : null}

            </div>

          </div>

          {/* Search bar and search button*/}
          {authUser &&           
          <form
            onSubmit={handleSubmit}
            className="flex min-w-0 w-full items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-sm transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/70 sm:p-1.5"
          >
            <input
              type="text"
              value={item}
              placeholder="Search laptops, books, cycles..."
              aria-label="Search marketplace"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:py-2.5"
              onChange={(e) => setItem(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Search"
              title="Search"
              disabled={!item.trim()}
              className={`inline-flex shrink-0 items-center justify-center rounded-xl px-3 py-2.5 transition-colors sm:py-2.5 ${item.trim() ? "bg-blue-100 text-slate-900 hover:bg-blue-200" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}
            >
              <Search size={20} strokeWidth={2.25} aria-hidden="true" />
            </button>
          </form>}

        </div>

        {/* Right section Login ,sell, chat wishlist options */}
        <div className="hidden lg:block min-w-[220px]">
          <div className="flex gap-5 w-full items-center lg:justify-end">
            {authUser ? (
              <ProfileDropDown
                onLogout={() => {
                  logout();
                  router.push("/login");
                }}
              />
            ) : (null)}

            {authUser ? 
              (<button 
                onClick={()=>{
                  if (authUser.verificationStatus !== "verified") {handleUnverifiedAccess("Your account must be verified to post an item.")}
                  else router.push("/post" )
                }} 
                className="flex gap-2 items-center border-2 p-2 rounded-2xl hover:ring-2 hover:ring-pink-100 hover:border-pink-100">
                  <Plus /> <span className="hidden lg:block">Sell</span>
              </button>) : null
            }

            {authUser ? 
            (<button 
              onClick={()=>{
                 if (authUser.verificationStatus !== "verified") {handleUnverifiedAccess("Your account must be verified to access chat section.");}
                 else router.push("/chat")
              }}
              className="flex gap-2 relative items-center border-2 p-2 rounded-2xl hover:ring-2 hover:ring-pink-100 hover:border-pink-100"
              >
              <MessageCircle />
              {unreadChatCount>0 ? 
               (<span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-[#DC143C]" />)
                : 
               null
              }
             </button>) 
             : null}

          </div>
        </div>
        
      </div>
    </div>
  );
}
