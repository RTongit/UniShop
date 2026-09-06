"use client"
import { useAuthStore } from '@/app/store/authStore'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import Spinner from '@/app/components/Spinner';

const AdminPage = () => {
    const {authUser} = useAuthStore()
    const router = useRouter()
    useEffect(()=>{
        if(!authUser) {
            router.replace("/login")
            return
        }
    },
    [authUser,router])

  if(!authUser) return null
  return (
    <div>
        Welcome back {authUser.name}
    </div>
  )
}

export default AdminPage
