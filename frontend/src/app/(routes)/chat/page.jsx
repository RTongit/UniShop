"use client"

import NoChatInterface from "@/app/components/NoChatInterface"
import SideBar from "@/app/components/Sidebar.js"
import Spinner from "@/app/components/Spinner.js"
import { useAuthStore } from "@/app/store/authStore.js"
import { useChatStore } from "@/app/store/chatStore.js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ChatPage() {
    const {authUser} = useAuthStore()
    const {myChats,isChatsLoading,getChats,selectedChat,setSelectedChat} = useChatStore()
    const router = useRouter()
    useEffect(()=>{
        if(!authUser) router.replace("/login")
        getChats();
    },
    [router,authUser,getChats])
    
    if(!authUser) return null
    if(isChatsLoading) return <Spinner/>
    return (
        <>
        {
            myChats.length>0 ? 

            <div className="flex md:flex-row flex-col h-[calc(100vh-122px)] lg:h-[calc(100vh-78px)] bg-stone-100 p-3 gap-x-3">
                
                {/* Side bar containing chats */}
                <div className="gap-y-3 min-w-[280px] rounded-md h-full md:flex md:flex-col overflow-y-auto">
                    <SideBar/>
                </div>

                {/* Default Conversational Panel */}
                <div className="w-full h-full md:block hidden">
                    <img src="/emptyChat2.png" alt="emptyChat" className="object-cover h-full w-full"/>
                </div>

            </div> 
            : 
            <NoChatInterface/>
        }
        </>

    )
}