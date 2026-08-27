// Main purpose of this component is that it check if authUser is valid or not 
"use client"
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore"
import Spinner from "./Spinner";

export default function  AuthCheckComponent({children})  {
    const {authCheck,isCheckingAuth,connectSocket} = useAuthStore();
    useEffect(()=>{
        async function fetchCheck() {
            const success = await authCheck();
            if(success) {connectSocket()}
        }
        fetchCheck();
    },
    [authCheck,connectSocket])

    // if it is fetching authUser info,then show loading icon : 
    if(isCheckingAuth) return <Spinner/>;

    return (<div>{children}</div>)
}


