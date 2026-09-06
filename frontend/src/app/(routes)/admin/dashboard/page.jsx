"use client"
import { useAuthStore } from '@/app/store/authStore'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

const AdminDashBoardPage = () => {
    const {authUser} = useAuthStore()
    const router = useRouter()
    useEffect(()=>{
        if(!authUser) {
            router.replace("/login")
            return
        }
        if(authUser.role!=="admin") router.replace("/");
    },
    [authUser,router])

  if(!authUser) return null
  return (
    <div className='flex bg-amber-400'>
        This is Dashboard
        Welcome back {authUser.name}

    </div>
  )
}

export default AdminDashBoardPage
