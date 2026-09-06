"use client"

import { useRouter } from "next/navigation";
import { useEffect} from "react";
import { useAuthStore } from "./store/authStore";
import { useItemStore } from "./store/itemStore";
import Spinner from "./components/Spinner";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const {authUser} = useAuthStore();
  const {isSearching,searchItems} = useItemStore();

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
    <div className="flex flex-col">
      <div className=""> Welcome  To HomePage</div>
      {authUser.role==="admin" ? <Link href="/admin">Go to Admin</Link> : null}

      {/* Fresh new recommendations :  */}
      {/* <div className="lg:grid-cols-4">

      </div> */}
    </div>
  );
}
