"use client"
import { useState, useRef, useEffect } from "react"
import { User, MessageCircle, Package, Settings, LogOut, Heart } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "../store/authStore"
import { useRouter } from "next/navigation"

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const {authUser,logout} = useAuthStore()
  const router = useRouter()
  // Note : dropdownRef.current = div with className prop relative
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const menuItems = [
    { icon: <User size={18} />, label: "Profile", href: "/profile" },
    { icon: <MessageCircle size={18} />, label: "Messages", href: "/chat" },
    { icon: <Package size={18} />, label: "My Listings", href: "/my-listings" },
    { icon: <Settings size={18} />, label: "Settings", href: "/settings" },
    { icon: <Heart size={18} />, label: "Wishlist", href: "/wishlist" },
  ]

  return (
    <div className="relative" ref={dropdownRef} >

      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full focus:outline-none"
      >
        {authUser?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white">
            {authUser?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute md:right-40 right-15 mt-3 w-64 bg-[#1a1a1a] rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/10">

          {/* Menu items */}
          <div className="p-2 space-y-0.5">
            {menuItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-xl transition-colors
                  ${i === 0
                    ? "bg-[#2a2a2a] text-white"         
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
              >
                <span className="text-gray-400">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mx-2" />

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={() => {
                logout();
                setOpen(false)
                router.push("/login");
              }}
              className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-medium text-red-400 hover:bg-[#2a2a2a] hover:text-red-300 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      )}
    </div>
  )
}