"use client";
import { LayoutDashboard, ShieldCheck, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminSidePanel = () => {
  const pathName = usePathname()
  const section = pathName.split("/").filter(Boolean)[1]
  const [activeSection, setActiveSection] = useState(section)
  const router = useRouter();
  return (
    <div className="w-full h-full flex flex-col">

      {/* Dashboard */}
      <Link href="/admin/dashboard" 
        className={`flex gap-x-2 ${activeSection==="dashboard" ? "bg-black text-white" : "bg-white text-black"}  px-3 py-5 font-medium`}
        onClick={()=>{setActiveSection("dashboard")}}
        >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </Link>
      
      {/* Verification */}
      <Link href="/admin/verification" 
         className={`flex gap-x-2 ${activeSection==="verification" ? "bg-black text-white" : "bg-white text-black"}  px-3 py-5 font-medium`}
        onClick={()=>{setActiveSection("verification")}}
        >
        <ShieldCheck size={20} />
        <span>Verification</span>
      </Link>

      {/* Students */}
      <Link href="/admin/students" 
         className={`flex gap-x-2 ${activeSection==="students" ? "bg-black text-white" : "bg-white text-black"}  px-3 py-5 font-medium`}
         onClick={()=>{setActiveSection("students")}}
        >
        <Users size={20} />
        <span>Students</span>
      </Link>

      {/* Listings */}
      <Link href="/admin/listings" 
         className={`flex gap-x-2 ${activeSection==="listings" ? "bg-black text-white" : "bg-white text-black"}  px-3 py-5 font-medium`}
         onClick={()=>{setActiveSection("Listings")}}
        >
        <ShoppingBag size={20} />
        <span>Listings</span>
      </Link>

    </div>
  );
};

export default AdminSidePanel;
