"use client"

import { useRouter } from "next/navigation";
import { useEffect} from "react";
import { useAuthStore } from "./store/authStore";
import { useItemStore } from "./store/itemStore";
import Spinner from "./components/Spinner";

export default function HomePage() {
  const router = useRouter();
  const {authUser} = useAuthStore();
  const {isSearching} = useItemStore();

  useEffect(()=>{
    if(!authUser) router.replace('/login');
  },
  [authUser,router])

  // No authentication here : 
  if(!authUser) {
    return null;
  }
  if(isSearching) return <Spinner/>
  // if we are authenticated then below 
  return (
    <div>
      This is HomePage
    </div>
  );
}
