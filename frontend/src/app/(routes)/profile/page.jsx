"use client"

import { useAuthStore } from "@/app/store/authStore"

export default function ProfilePage() {
    const {authUser} = useAuthStore()
    return(
        <div>This is Profile Page</div>
    )
}