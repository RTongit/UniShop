"use client"
import { toast } from "sonner";
import { create } from "zustand"
import { useAuthStore } from "./authStore";

export const useChatStore = create((set,get)=>({
    selectedChat : null,
    setSelectedChat : function(data) {
        set({selectedChat : data})
    },

    myChats : [],
    isChatsLoading : true,
    getChats : async function() {
        set({chat : []});
        set({isChatsLoading : true});
        try {
            const res = await fetch(
                `http://localhost:6767/api/chat/chats`,
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
            const res = await fetch(`http://localhost:6767/api/chat/`,
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
            const res = await fetch(`http://localhost:6767/api/chat/message`,
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
                `http://localhost:6767/api/chat/${data}/messages`,
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
            socket.on("newMessage",(newChatMessage)=>{
                set({myMessages : [...get().myMessages,newChatMessage]})
            })
        }
    },
    unsubscribeFromMessage : ()=>{
        const socket = useAuthStore.getState().socket
        if(!socket) return 
        socket.off("newMessage");
    }
    

}))