"use client";
import ItemCard from "@/app/components/ItemCard";
import NoItem from "@/app/components/NoItem";
import Spinner from "@/app/components/Spinner";
import { useAuthStore } from "@/app/store/authStore";
import { useItemStore } from "@/app/store/itemStore";
import { ChevronDown } from "lucide-react";
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

  useEffect(() => {
    if (!authUser) router.replace("/login");
    if (title) {
      async function fetchItems() {
        const result = await searchItems(title);
        if (result == null) return;
        setDummyItems(result);
      }
      fetchItems();
    }
  }, [router, authUser, title, searchItems]);

  function handleChange(e) {
    setSort(e.target.value);

    // If newest to oldest filter applied ,then :
    if (e.target.value == "newest") {
      setDummyItems((prev) => {
        const temp = [...prev];
        temp.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return temp;
      });
    }

    // If oldest to newest filter applied ,then :
    else if (e.target.value == "oldest") {
      setDummyItems((prev) => {
        const temp = [...prev];
        temp.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        return temp;
      });
    }

    // For price low to high :
    else if (e.target.value == "cheap") {
      setDummyItems((prev) => {
        const temp = [...prev];
        temp.sort((a, b) => {
          if (a.price < b.price) return -1;
          else if (a.price > b.price) return 1;
          return 0;
        });
        return temp;
      });
    }

    // For price high to low :
    else if (e.target.value == "expensive") {
      setDummyItems((prev) => {
        const temp = [...prev];
        temp.sort((a, b) => {
          if (a.price > b.price) return -1;
          else if (a.price < b.price) return 1;
          return 0;
        });
        return temp;
      });
    }
  }

  if (!authUser) return null;
  if (isSearching) return <Spinner />;
  if (!hasSearched && items.length == 0) return null;
  if (hasSearched && items.length == 0) return <NoItem />;

  return (
    <div className="px-6 py-6">
      {/* Container of filter and item list */}
      <div className="flex md:flex-row flex-col md:gap-x-2 gap-y-2">

        {/* Filter section */}
        <section className="flex md:items-start gap-x-3 relative ">
          <select
            id="sort"
            value={sort}
            onChange={(e) => {
              handleChange(e);
            }}
            className="appearance-none border-2 border-gray-400 rounded-md min-w-[176px] w-full
               bg-white outline-none px-3 py-2 text-md font-medium text-slate-700  transition"
          >
            <option value="" disabled>
              Sort By
            </option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="cheap">Price: Low to High</option>
            <option value="expensive">Price: High to Low</option>
          </select>

          {/* Custom arrow down */}
          <ChevronDown
            size={17}
            className="absolute right-2 top-3 pointer-events-none"
          />
        </section>

        {/*list of items*/}
        <div className="flex flex-col gap-y-5">
          {dummyItems?.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
