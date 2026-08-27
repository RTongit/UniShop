"use client"
import ItemCard from "@/app/components/ItemCard";
import Spinner from "@/app/components/Spinner";
import { useAuthStore } from "@/app/store/authStore"
import { useItemStore } from "@/app/store/itemStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Search() {
    const {authUser} = useAuthStore();
    const router = useRouter()
    const {items,searchItems,isSearching,hasSearched} = useItemStore();
    const searchParams = useSearchParams()
    const title = searchParams.get("title");

    useEffect(()=>{
        if(!authUser) router.replace('/login')
        if(title) {searchItems(title)}
    },
    [router,authUser,title,searchItems])

    if(!authUser) return null;
    if(isSearching) return <Spinner/>
    if(!hasSearched && items.length==0) return null;
    if(hasSearched && items.length==0) return <div>No items found</div>;
    
    return (
        <div className="px-6 py-6">
            {/* Result count  */}
            <div className="p-3">
                <span>{items.length} items found for {title} </span>
            </div>

            {/*Display Grid for items*/}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => (
                 <ItemCard key={item._id} item={item} />
               ))}
            </div>

            {/* Todo : Need to add click the card to see detail feature */}

        </div>
    )
}
