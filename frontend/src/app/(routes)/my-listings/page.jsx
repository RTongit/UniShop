"use client";
import Sold from "@/app/components/Sold";
import Reserved from "@/app/components/Reserved";
import MarkSoldCodeModal from "@/app/components/MarkSoldCodeModal";
import ReleaseReservationModal from "@/app/components/ReleaseReservationModal";
import { useAuthStore } from "@/app/store/authStore";
import {
  ArrowDown,
  ArrowUpDown,
  ChevronDown,
  CircleCheckBig,
  Dot,
  Edit2,
  Filter,
  FilterIcon,
  Hamburger,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import formatPrice from "@/app/constant/formatPrice";
import { useItemStore } from "@/app/store/itemStore";
import Spinner from "@/app/components/Spinner";
import formatDate from "@/app/constant/formatDate";
import Link from "next/link";
import NoPostingUI from "@/app/components/NoPostingUI";
import ErrorToast from "@/app/components/ErrorToast";
import { toast } from "sonner";

// const myItem2 = []

function handleUnverifiedAccess() {
  toast.custom(() => (
    <ErrorToast
      message="Your account must be verified to access listings."
    />
  ), { duration: 5500, position: "top-center" });
}

export default function ListingPage() {
  const { authUser } = useAuthStore();
  const { myItems, isMyItemsLoading, getMyItems, deleteItem } =
    useItemStore();
  const router = useRouter();

  const [items, setItems] = useState(myItems);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [edit, setEdit] = useState(0);
  const [sortVal, setSortVal] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [itemToMarkSold, setItemToMarkSold] = useState(null);
  const [itemToRelease, setItemToRelease] = useState(null);

  useEffect(() => {
    if(!authUser) {router.replace("/login"); return;}
    if (authUser.verificationStatus !== "verified") {
      // custom error toast : 
      handleUnverifiedAccess()
      router.replace("/"); 
      return;
    }
    
    async function fetchItems() {
      const response = await getMyItems();
      if (!response) return;
      setItems(response);
    }
    fetchItems();
  }, [authUser, router, getMyItems]);


  function handleFilter(selectedFilter) {
    if (selectedFilter && selectedFilter.length == 0) {
      return;
    }
    let tempArr = [];

    for (let i = 0; i < selectedFilter.length; i++) {
      if (selectedFilter[i] == "Sold") {
        let FilteredArr = myItems.filter((item) => item.status === "sold");
        tempArr = [...tempArr, ...FilteredArr];
      } else if (selectedFilter[i] == "Available") {
        let FilteredArr = myItems.filter((item) => item.status === "available");
        tempArr = [...tempArr, ...FilteredArr];
      } else if (selectedFilter[i] == "Reserved") {
        let FilteredArr = myItems.filter((item) => item.status === "reserved");
        tempArr = [...tempArr, ...FilteredArr];
      }
    }
    setItems(tempArr);
  }

  function handleInputChange(e) {
    console.log(selectedFilter);
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFilter((selectedFilter) => [...selectedFilter, value]);
    } else {
      setSelectedFilter((selectedFilter) =>
        selectedFilter.filter((elem) => elem !== value),
      );
    }
  }

  function handleReset() {
    setItems((items) => myItems);
    setSelectedFilter([]);
  }

  function handleReservationReleased(itemId) {
    setItems((currentItems) => {
      if (selectedFilter.length > 0 && !selectedFilter.includes("Available")) {
        return currentItems.filter((item) => item._id.toString() !== itemId.toString());
      }

      return currentItems.map((item) =>
        item._id.toString() === itemId.toString()
          ? { ...item, status: "available" }
          : item
      );
    });
  }

  function handleItemMarkedSold(itemId) {
    setItems((currentItems) => {
      if (selectedFilter.length > 0 && !selectedFilter.includes("Sold")) {
        return currentItems.filter((item) => item._id.toString() !== itemId.toString());
      }
      // todo need to add the newly sold item to the sold filtered list 
      return currentItems.map((item) =>
        item._id.toString() === itemId.toString()
          ? { ...item, status: "sold" }
          : item
      );
    });
  }

  function handleSort(e) {
    const val = e.target.value;
    if (val === "Cheap") setSortVal("Cheap");
    else if (val === "Expensive") setSortVal("Expensive");
    // This creates a new array not the refernce to items
    let obj = [...items];
    if (val === "Cheap") {
      obj = obj.sort((a, b) => a.price - b.price);
    } else if (val === "Expensive") {
      obj = obj.sort((a, b) => b.price - a.price);
    }
    setItems(obj);
  }

  if (!authUser) return null;
  if (authUser.verificationStatus !== "verified") return null;
  if (isMyItemsLoading) return <Spinner />;

  return myItems.length == 0 ? (
    <NoPostingUI />
  ) : (
    <div className="p-3 bg-stone-200 min-h-screen flex md:flex-row flex-col gap-x-4 md:gap-y-0 gap-y-3 md:items-start">
      {/* Left section */}
      <div className="flex flex-col  gap-y-2 md:sticky md:top-20 md:z-10 md:gap-y-4 px-2">
        {/* My listing title */}
        <div className="px-4 py-2 bg-white">
          <h1 className="md:text-2xl text-md font-bold text-gray-900">
            My Listings
          </h1>
          <p className="md:text-sm text-[12px] text-gray-500">
            Manage and track all your listed items.
          </p>
        </div>

        {/* Filter title, icon and hamburger*/}
        <div className="flex justify-between bg-white px-4 py-2">
          <div className="flex gap-x-3 items-center">
            <SlidersHorizontal className="size-5" />
            <span>Filters</span>
          </div>
          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => {
              setIsFilterOpen((prev) => !prev);
            }}
          >
            <ChevronDown />
          </button>
        </div>

        {/* Container of  Sold, Available,Apply, Reset button*/}
        <div className={`bg-white ${isFilterOpen ? "block" : "hidden"} md:block py-2`}>
          {/* Listing status filters */}
          <div className="flex  md:flex-col flex-row gap-3 bg-white px-4 py-2">
              <label className="flex gap-x-3 hover:cursor-pointer">
                <input
                  className="size-5 hover:cursor-pointer"
                  type="checkbox"
                  name=""
                  id=""
                  value="Sold"
                  checked={selectedFilter.includes("Sold")}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
                <span>Sold</span>
              </label>

              <label className="flex gap-x-3 hover:cursor-pointer">
                <input
                  className="size-5 hover:cursor-pointer"
                  type="checkbox"
                  name=""
                  id=""
                  value="Available"
                  checked={selectedFilter.includes("Available")}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
                <span>Available</span>
              </label>
              <label className="flex gap-x-3 hover:cursor-pointer">
                <input
                  className="size-5 hover:cursor-pointer"
                  type="checkbox"
                  value="Reserved"
                  checked={selectedFilter.includes("Reserved")}
                  onChange={handleInputChange}
                />
                <span>Reserved</span>
              </label>
          </div>

          {/* Apply, Reset button */}
          <div className="flex w-full gap-x-4 px-4 py-2">
              <button
                className="px-5 py-2 border rounded-sm shadow-[0px_0px_10px_2px_rgba(245,158,11,0.5)] hover:cursor-pointer"
                onClick={() => {
                  handleFilter(selectedFilter);
                }}
              >
                Apply
              </button>
              <button
                className="px-5 py-2 border rounded-sm shadow-[0px_0px_10px_2px_rgba(245,158,11,0.5)] hover:cursor-pointer"
                onClick={handleReset}
              >
                Reset
              </button>
          </div>
        </div>

      </div>

      {/* Right section(contains items listed ) */}
      <div className="bg-stone-200 w-full min-h-screen md:px-3 px-2 flex flex-col gap-y-7">
        <div className="flex justify-between md:justify-start p-3 md:gap-x-6 gap-x-2 bg-white">
          <div className="flex gap-x-2 md:gap-x-4 items-center">
            <ArrowUpDown className="size-5" /> 
            <span>Sort by : </span>
          </div>
          <button
            value="Cheap"
            onClick={(e) => handleSort(e)}
            className={`${sortVal && sortVal === "Cheap" ? "font-medium text-black bg-gray-200" : "font-normal text-gray-600"} px-3 rounded-3xl`}
          >
            Cheap
          </button>

          <button
            value="Expensive"
            onClick={(e) => handleSort(e)}
            className={`${sortVal && sortVal === "Expensive" ? "font-medium text-black bg-gray-200" : "font-normal text-gray-600"} px-3 rounded-3xl`}
          >
            Expensive
          </button>
        </div>
        <div className="grid  xl:grid-cols-4 lg:grid-cols-3  md:grid-cols-2 grid-cols-1 gap-6 xl:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden shadow-[0px_0px_10px_2px_rgba(245,158,11,0.5)]  bg-white flex flex-col justify-between"
            >
              <div className="relative aspect-4/3">
                {/* Image */}
                <img
                  src={item.photos[0]}
                  alt="item"
                  className="absolute h-full w-full object-cover"
                />

                {/* Availabilty  Badge */}
                {item.status === "sold" ? <Sold /> : item.status === "reserved" ? <Reserved /> : null}
              </div>

              {/* Information section */}
              <div className="p-3">
                {/* Title */}
                <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>

                {/* Price */}
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(item.price)}
                </p>
                <div className="flex flex-row">
                  {/* Pickup */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {item.pickupLocation}
                  </div>
                  <span>
                    <Dot />
                  </span>
                  {/* Date Posted */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>

              {/* Divider */}
              {/* <div className="border-t border-gray-700"></div> */}

              <div className="mx-2 my-2 flex min-h-12 flex-row items-center justify-center gap-x-1 rounded-md border border-stone-200 p-1.5 md:h-12">
                <Link
                  href={`/my-listings/edit/${item._id}`}
                  aria-label="Edit listing"
                  title="Edit listing"
                  className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg p-2 text-black transition hover:bg-stone-100"
                >
                  <Edit2 className="size-5"></Edit2>
                </Link>

                {item.status === "reserved" && (
                  <>
                    <button
                      type="button"
                      aria-label="Mark item as sold"
                      title="Mark item as sold"
                      className="flex min-h-10 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg text-black transition hover:bg-stone-100 md:size-9 md:flex-none md:flex-row md:p-2"
                      onClick={() => setItemToMarkSold(item)}
                    >
                      <CircleCheckBig className="size-5" />
                      <span className="text-[10px] font-medium leading-none md:hidden">Mark sold</span>
                    </button>
                    
                    {/* Release button */}
                    <button
                      type="button"
                      aria-label="Release reservation"
                      title="Release reservation"
                      className="flex min-h-10 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg text-black transition hover:bg-stone-100 md:size-9 md:flex-none md:flex-row md:p-2"
                      onClick={() => setItemToRelease(item)}
                    >
                      <RotateCcw className="size-5" />
                      <span className="text-[10px] font-medium leading-none md:hidden">Release</span>
                    </button>
                  </>
                )}

                {item.status !== "reserved" && (
                  <button
                    type="button"
                    aria-label="Delete listing"
                    title="Delete listing"
                    className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg p-2 text-black transition hover:bg-stone-100"
                    onClick={() => {
                      async function fetchDeleteItem() {
                        const success = await deleteItem(item._id);
                        if (success != null) {
                          setItems(success);
                        }
                      }
                      fetchDeleteItem();
                    }}
                  >
                    <Trash2 className="size-5"></Trash2>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MarkSoldCodeModal
        item={itemToMarkSold}
        onClose={() => setItemToMarkSold(null)}
        onSold={handleItemMarkedSold}
      />
      <ReleaseReservationModal
        item={itemToRelease}
        onClose={() => setItemToRelease(null)}
        onReleased={handleReservationReleased}
      />
    </div>
  );
}
