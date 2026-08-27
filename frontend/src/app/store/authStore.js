"use client"
import { io } from "socket.io-client";
import { toast } from "sonner";
import { create } from "zustand"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useAuthStore = create((set,get)=>({
    authUser : null,
    socket : null,

    isCheckingAuth : true,

    authCheck : async ()=>{
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/auth/check`, 
                {credentials: "include", cache : "no-store"}
            );
            const responseData = await res.json();
            if(!res.ok) {
                set({authUser : null})
                throw new Error(responseData.message); 
                
            }
            set({authUser : responseData})
            return responseData
        }

        catch(error) {
            console.log(`Error in authentication frontend : ${error.message}`);
            set({authUser : null});
            return null
        }
        finally {set({isCheckingAuth :false})}

    },

    connectSocket : ()=> {
        const existingSocket = get().socket;
        if (existingSocket?.connected) return;
        
        const socket = io(`${BACKEND_URL}`);
        set({socket : socket})
    },

    disconnectSocket : ()=>{
        const socket = get().socket;
        if(socket) {
            // Backend receives:
            // socket.on("disconnect", ...)
            socket.disconnect()
            set({socket: null})
        }
    },

    isSigningUp : false,
    signup : async (data)=>{
        set({isSigningUp : true})
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/signup`,{
                method : "POST",
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify(data),
                cache : "no-store",
                credentials : "include",
            })
            const response = await res.json();
            if(!res.ok) {
                set({authUser : null}); 
                throw new Error(response.message);
            }
            set({authUser : response});
            get().connectSocket();
            
        }
        catch(error) {
            toast.error(error.message);
            set({authUser : null});
        }
        finally {set({isSigningUp : false})}
    },
    
    isLogging : false,
    login : async (data)=>{

        set({isLogging : true})
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/login`,{
                method : "POST",
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify(data),
                cache : "no-store",
                credentials : "include",
            })
            const response = await res.json();
            if(!res.ok) {
                set({authUser : null}); 
                throw new Error(response.message);
            }
            set({authUser : response});
            get().connectSocket();
            
        }
        catch(error) {
            toast.error(error.message)
            set({authUser : null});
        }
        finally {
            set({isLogging:false})
        }
    },

    logout : async ()=> {
        try {
            const res =  await fetch(`${BACKEND_URL}/api/auth/logout`,
                {
                    method : "POST",
                    credentials : "include",
                    cache : "no-store"
                })
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message || "logout Failed")
            }
            set({authUser : null})
            get().disconnectSocket()
            toast.success(response.message)

        }

        catch(error) {
            console.log(`Error in logout : ${error.message}`);
        }
    }

}));
