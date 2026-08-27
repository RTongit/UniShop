"use client"

import MessageContainer from "@/app/components/MessageContainer.js"
import SideBar from "@/app/components/Sidebar.js"
import Spinner from "@/app/components/Spinner.js"
import { useAuthStore } from "@/app/store/authStore.js"
import { useChatStore } from "@/app/store/chatStore.js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useEffect } from "react"

export default function MessagePage({params}) {
    const {authUser,socket} = useAuthStore()
    const {myChats,isChatsLoading,getChats,isPostingChat,isMessagesLoading,getChatMessages,selectedChat} = useChatStore()
    const {chatId} = use(params)
    const router = useRouter()

    useEffect(()=>{
        if(!authUser) router.replace("/login")
        if(isPostingChat==false) getChats();
    },
    [router,authUser,getChats,isPostingChat])

    useEffect(()=>{
       getChatMessages(chatId);
       },
      [getChatMessages,chatId]
    )

    useEffect(()=>{
        if(!socket || !chatId) return

        socket.emit("JoinChat",chatId)

        // Need to make the return function : 
          return ()=>{
            socket.emit("LeaveChat",chatId) 
          }
        },
        [chatId,socket]
    )

    if(!authUser) return null
    if(isChatsLoading) return <Spinner/>
    if(isPostingChat) return <Spinner/>
    if(isMessagesLoading) return <Spinner/>
    return (
        <>
        {
            myChats.length>0 ? 

            <div className="flex w-full h-[89vh] bg-stone-200 p-3 gap-x-3 relative overflow-hidden">

                {/* Side bar containing chats */}
                <div className="flex flex-col gap-y-3 md:w-[25%] w-[30%] rounded-md min-h-0">
                    <SideBar/>
                </div>

                {/* Message container containing messages :  */}

                <div className="h-full md:w-[75%] w-[70%]">
                    {selectedChat ? <MessageContainer chatId={chatId}/> : 
                    (<img src="/emptyChat2.png" alt="emptyChat" className="object-cover h-full w-full"/>)}
                </div>

            </div> 
            : 
            <div>Messages will appear here</div>
        }
        </>

    )
}