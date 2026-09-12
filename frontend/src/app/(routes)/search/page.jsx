"use client";
import ItemCard from "@/app/components/ItemCard";
import NoItem from "@/app/components/NoItem";
import Spinner from "@/app/components/Spinner";
import { useAuthStore } from "@/app/store/authStore";
import { useItemStore } from "@/app/store/itemStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search() {
  const { authUser } = useAuthStore();
  const router = useRouter();
  const { items, searchItems, isSearching, hasSearched } = useItemStore();
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const [sort, setSort] = useState("");
  const [dummyItems, setDummyItems] = useState();
  console.log(sort)

  useEffect(() => {
    if (!authUser) router.replace("/login");
    if (title) {
        async function fetchItems() {
            const result = await searchItems(title);
            if(result==null) return
            setDummyItems(result);
        }
        fetchItems();
    }
  }, [router, authUser, title, searchItems]);

  function handleChange(e) {
    setSort(e.target.value);

    // If newest to oldest filter applied ,then : 
    if(e.target.value=="newest") {
        setDummyItems((prev)=>{
            const temp = [...prev]
            temp.sort((a,b)=>b.createdAt.localeCompare(a.createdAt) )
            return temp
        })
    }

    // If oldest to newest filter applied ,then : 
    else if(e.target.value=="oldest") {
        setDummyItems((prev)=>{
            const temp = [...prev]
            temp.sort((a,b)=>a.createdAt.localeCompare(b.createdAt))
            return temp
        })
    }

    // For price low to high : 
    else if(e.target.value=="cheap") {
        setDummyItems((prev)=>{
            const temp = [...prev]
            temp.sort((a,b)=>{
                if(a.price<b.price) return -1;
                else if(a.price>b.price) return 1;
                return 0;
            })
            return temp
        })
    }

    // For price high to low : 
    else if(e.target.value=="expensive") {
        setDummyItems((prev)=>{
            const temp = [...prev]
            temp.sort((a,b)=>{
                if(a.price>b.price) return -1;
                else if(a.price<b.price) return 1;
                return 0;
            })
            return temp
        })
    }
  }

  if (!authUser) return null;
  if (isSearching) return <Spinner />;
  if (!hasSearched && items.length == 0) return null;
  if (hasSearched && items.length == 0) return <NoItem />;

  return (
    <div className="px-6 py-6">

      {/* Container of filter and item list */}
      <div className="flex gap-x-2">

        {/* Filter section */}
        <section className="flex flex-col gap-y-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Browse Items
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Find items that match your preference.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="sort"
              className="text-sm font-medium text-slate-600"
            >
              Sort by
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(e)=>{handleChange(e)}}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>Select options</option> 
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="cheap">Price: Low to High</option>
              <option value="expensive">Price: High to Low</option>
            </select>
          </div>
        </section>

        {/*list of items*/}
        <div className="flex flex-col gap-y-2">
          {dummyItems?.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
