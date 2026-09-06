"use client";
import { LayoutDashboard, ShieldCheck, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminSidePanel = () => {
  const [activeSection, setActiveSection] = useState("Dashboard")
  const router = useRouter();
  return (
    <div className="w-full h-full flex flex-col">
      <Link href="/admin/dashboard" 
        className={`flex gap-x-2 ${activeSection==="Dashboard" ? "bg-black text-white" : "bg-white text-black"}  px-3 py-5 font-medium`}
        onClick={()=>{setActiveSection("Dashboard")}}
        >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </Link>

      <Link href="/admin/verification" 
         className={`flex gap-x-2 ${activeSection==="Verification" ? "bg-black text-white" : "bg-white text-black"}  px-3 py-5 font-medium`}
        onClick={()=>{setActiveSection("Verification")}}
        >
        <ShieldCheck size={20} />
        <span>Verification</span>
      </Link>

      <Link href="/admin/students" 
         className={`flex gap-x-2 ${activeSection==="Students" ? "bg-black text-white" : "bg-white text-black"}  px-3 py-5 font-medium`}
         onClick={()=>{setActiveSection("Students")}}
        >
        <Users size={20} />
        <span>Students</span>
      </Link>

      <Link href="/admin/listings" 
         className={`flex gap-x-2 ${activeSection==="Listings" ? "bg-black text-white" : "bg-white text-black"}  px-3 py-5 font-medium`}
         onClick={()=>{setActiveSection("Listings")}}
        >
        <ShoppingBag size={20} />
        <span>Listings</span>
      </Link>
    </div>
  );
};

export default AdminSidePanel;
