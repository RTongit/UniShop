"use client"
import { toast } from "sonner";
import { create } from "zustand"
import { useAuthStore } from "./authStore";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useChatStore = create((set,get)=>({
    selectedChat : null,
    setSelectedChat : function(data) {
        set({selectedChat : data})
    },

    unreadChatCount : 0,
    setUnreadChatCount : function (val) { set({unreadChatCount : val})},

    myChats : [],
    setMyChats : function (targetId,isBuyer) {
        set((state)=>(
            {
                // always remember map returns a new array not reference to already existing array 
                myChats : state.myChats.map((chat)=>{
                    if(chat._id.toString()!=targetId.toString()) return {...chat}
                    if (isBuyer) return {...chat, buyerHasUnreadMessage: true}
                    return {...chat,sellerHasUnreadMessage: true}
                }),
            }
        ))
    },
    unsetMyChats : function (targetId,isBuyer) { 
        set((state)=>(
            {
                // always remember map returns a new array not reference to already existing array 
                myChats : state.myChats.map((chat)=>{
                    if(chat._id!=targetId) return {...chat}
                    if (isBuyer) return {...chat, buyerHasUnreadMessage: false}
                    return {...chat,sellerHasUnreadMessage: false}
                }),
            }
        ))
    },
    isChatsLoading : true,
    getChats : async function() {
        set({myChats : []});
        set({isChatsLoading : true});
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/chat/chats`,
                {
                    credentials : "include",
                    cache : "no-store"
                }
            )
            const response = await res.json()
            if(!res.ok) {
                throw new Error(response.message)
            }
            set({myChats : response})
        }
        catch(error) {
            toast.error(error.message)
            return
        }
        finally {
            set({isChatsLoading : false});
        }
    },

    isPostingChat : false,
    postChat : async function(data) {
        set({isPostingChat : true})
        try {
            const res = await fetch(`${BACKEND_URL}/api/chat/`,
                {
                    method : "POST",
                    headers : {'Content-Type': 'application/json'},
                    credentials : "include",
                    body : JSON.stringify(data)
                }
            )
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message);
            }
            return response
        }
        catch(error) {
            toast.error(error.message);
            return null
        }
        finally {
            set({isPostingChat : false})
        }
    },

    myMessages : [],
    isMessagesLoading : true,
    isPostingChatMessage : false,

    postChatMessage : async function(data) {
        set({isPostingChatMessage : true});
        try {
            const res = await fetch(`${BACKEND_URL}/api/chat/message`,
                {
                    method : "POST",
                    headers : {'Content-Type': 'application/json'},
                    credentials : "include",
                    body : JSON.stringify(data)
                }
            )
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message);
            }
            // If everything is ok(add new message to existing messages ) : 
            // set({myMessages : [...get().myMessages,response]})

        }
        catch(error) {
            toast.error(error.message);
        }
        finally {
            set({isPostingChatMessage : false});
        }
    },

    getChatMessages : async function(data) {
        set({isMessagesLoading : true});
        set({myMessages : []})
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/chat/${data}/messages`,
                {
                    credentials : "include",
                    cache : "no-store"
                }
            )
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message)
            }
            set({myMessages : response})
        }
        catch(error) {
            toast.error(error.message);
        }
        finally {
            set({isMessagesLoading : false})
        }
    },

    subscribeToMessage : () => {
        const socket = useAuthStore.getState().socket
        if(socket) {
            // mtMessages is an individual chat messages
            socket.on("newMessage",(newChatMessage)=>{
                set({myMessages : [...get().myMessages,newChatMessage]})
            })
        }
    },
    
    unsubscribeFromMessage : ()=>{
        const socket = useAuthStore.getState().socket
        if(!socket) return 
        socket.off("newMessage");
    },

    getGlobalNotificationStatus : async function() {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/chat/users/global-notification-status`,
                {
                    credentials : "include",
                    cache : "no-store"
                }
            )
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message)
            }
            set({unreadChatCount : response.unreadChatCount})
            return response
        }

        catch(error) {
            toast.error(error.message)
            console.log("Problem here")
            return null
        }
    },

    markChatAsRead : async function(chatId) {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/chat/users/update-chat-notification-status/${chatId}`,
                {
                    method : "PATCH",
                    headers : {'Content-Type': 'application/json'},
                    credentials : "include",
                    cache : "no-store",
                }
            )
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message)
            }
            set({unreadChatCount : response.unreadChatCount})
        }

        catch(error) {
            toast.error(error.message)
        }
    },
    
}))