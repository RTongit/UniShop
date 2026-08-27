"use client"

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

            <div className="flex w-full h-screen bg-stone-200 p-3 gap-x-3">
                
                {/* Side bar containing chats */}
                <div className="md:w-[25%] w-[30%] h-full">
                    <SideBar/>
                </div>

                {/* Default Conversational Panel */}
                <div className="h-full md:w-[75%] w-[70%] md:block hidden">
                    <img src="/emptyChat2.png" alt="emptyChat" className="object-cover h-full w-full"/>
                </div>

            </div> 
            : 
            <div>Messages will appear here</div>
        }
        </>

    )
}