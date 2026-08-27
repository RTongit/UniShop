"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import ProfileDropDown from "./ProfileDropDown";
import { MessageCircle, ShoppingBag } from "lucide-react";

export default function Navbar() {
  let [item, setItem] = useState("");
  const router = useRouter();
  const { authUser,logout } = useAuthStore();

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/search?title=${encodeURIComponent(item)}`);
  }
  return (
    <div className="bg-white border-b border-gray-200 md:px-6 py-4 px-3 flex items-center sticky top-0 z-10">
      <div className="flex md:flex-row flex-col justify-between items-center w-full gap-4 ">

        {/* Left section Unishop logo and search */}
        <div className="flex md:flex-row flex-col gap-x-6 md:gap-y-0 gap-y-2 w-full">

          {/*UniShop Logo */}
          <div className="text-lg font-bold whitespace-nowrap flex justify-between">
            <div>
              <Link href="/">
                <span className="text-blue-600">Uni</span>
                <span className="text-gray-900">Shop</span>
              </Link>
            </div>

            <div className=" flex gap-5 items-center md:hidden">
             {authUser ? (
              <ProfileDropDown
                user={authUser}
              />
            ) : (null)}

            {authUser ? (<Link href="/post" className="flex gap-2 items-center border-2 p-2 rounded-2xl hover:ring-2 hover:ring-pink-100 hover:border-pink-100">
              <ShoppingBag /> <span className="hidden md:block">Sell</span>
            </Link>) : null}

            {authUser ? (<Link href="/chat" className="flex gap-2 items-center border-2 p-2 rounded-2xl hover:ring-2 hover:ring-pink-100 hover:border-pink-100">
               <MessageCircle />
            </Link>) : null}

            </div>

          </div>

          {/* Search bar and search button*/}
          {authUser &&           
          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              type="text"
              placeholder="Search for laptops, books, cycles..."
              className="w-full border border-r-0 border-gray-200 rounded-l-lg px-4 py-2 text-sm outline-none focus:border-blue-500 text-gray-900"
              onChange={(e) => {
                setItem(e.target.value);
              }}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 rounded-r-lg disabled:bg-blue-300"
              disabled={!item.trim()}
            >
              Search
            </button>
          </form>}

        </div>

        {/* Right section Login ,sell, chat wishlist options */}
        <div className="hidden md:block w-full">
          <div className="flex gap-5 w-full items-center md:justify-end">
            {authUser ? (
              <ProfileDropDown
                onLogout={() => {
                  logout();
                  router.push("/login");
                }}
              />
            ) : (null)}

            {authUser ? (<Link href="/post" className="flex gap-2 items-center border-2 p-2 rounded-2xl hover:ring-2 hover:ring-pink-100 hover:border-pink-100">
              <ShoppingBag /> <span className="hidden md:block">Sell</span>
            </Link>) : null}

            {authUser ? (<Link href="/chat" className="flex gap-2 items-center border-2 p-2 rounded-2xl hover:ring-2 hover:ring-pink-100 hover:border-pink-100">
              <MessageCircle />
            </Link>) : null}

          </div>
        </div>
      </div>
    </div>
  );
}
