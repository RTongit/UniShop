"use client"
import { useAuthStore } from '@/app/store/authStore'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import Spinner from '@/app/components/Spinner';

const AdminStudentsPage = () => {
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
    <div>
        This is Admin Students Page
        Welcome back {authUser.name}
    </div>
  )
}

export default AdminStudentsPage
