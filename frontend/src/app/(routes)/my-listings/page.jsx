"use client"
import Sold from "@/app/components/Sold"
import { useAuthStore } from "@/app/store/authStore"
import { CircleCheckBig, Dot, Edit2,Filter,FilterIcon,RotateCcw,Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import formatPrice from "@/app/constant/formatPrice"
import { useItemStore } from "@/app/store/itemStore"
import Spinner from "@/app/components/Spinner"
import formatDate from "@/app/constant/formatDate"
import Link from "next/link"
import NoPostingUI from "@/app/components/NoPostingUI"

// const myItem2 = []

export default function ListingPage() {
    const {authUser} = useAuthStore()
    const {myItems,isMyItemsLoading,getMyItems,deleteItem,editItem} = useItemStore()
    const router = useRouter()

    const [items,setItems] = useState(myItems)
    const [selectedFilter,setSelectedFilter] = useState([])
    const [edit,setEdit] = useState(0)
    const [sortVal,setSortVal] = useState(null)

    useEffect(()=>{

      if(!authUser) router.replace("/login")
      async function fetchItems() {
          const response = await getMyItems()
          if(!response) return;
          setItems(response)
      }
      fetchItems();
    }
    ,[authUser,router,getMyItems])


    if(!authUser) return null;
    if(isMyItemsLoading) return <Spinner/>

    function handleFilter(selectedFilter) {
      if(selectedFilter && selectedFilter.length==0) { return;}
      let tempArr = [];

      for(let i = 0;i<selectedFilter.length;i++) {
        if(selectedFilter[i]=="Sold") {
          let FilteredArr = myItems.filter((item)=>{
            if(item.isSold) return true
            return false;
          })
          tempArr = [...tempArr,...FilteredArr]
        }

        else if(selectedFilter[i]=="Available") {
          let FilteredArr = myItems.filter((item)=>{
            if(item.isSold) return false
            return true;
          })
          tempArr = [...tempArr,...FilteredArr]
        }
      }
      setItems(tempArr);
    }

    function handleInputChange(e) {
       console.log(selectedFilter)
       const { value, checked } = e.target;
       if(checked) {setSelectedFilter((selectedFilter)=>[...selectedFilter,value])}
       else {
          setSelectedFilter((selectedFilter)=>selectedFilter.filter((elem) => elem !== value));
      }
    }
    function handleReset() {
      setItems((items)=>myItems)
      setSelectedFilter([])
    }

    function handleSort(e) {
      const val = e.target.value
      if(val==="Cheap") setSortVal("Cheap")
      else if(val==="Expensive") setSortVal("Expensive")
      // This creates a new array not the refernce to items
      let obj = [...items]
      if(val==="Cheap") {
        obj = obj.sort((a,b)=> a.price-b.price)
      }
      else if(val==="Expensive") {
        obj = obj.sort((a,b)=> b.price-a.price)
      }
      setItems(obj)
    }

    return (
    (myItems.length==0) ? 
    <NoPostingUI/>
        : 
    <div className="p-3 bg-stone-200 min-h-screen flex md:flex-row flex-col gap-x-4 md:gap-y-0 gap-y-4 md:items-start">

        {/* Left section */}
        <div className="flex bg-white flex-col  gap-y-2 md:sticky md:top-20 md:z-10 md:gap-y-7 px-3 py-5">

            {/* My listing title */}
            <div className="p-2 ">
              <h1 className="md:text-2xl text-md font-bold text-gray-900">My Listings</h1>
              <p className="md:text-sm text-[12px] text-gray-500">
                Manage and track all your listed items.
              </p>
            </div>
          

            {/* Filter title and icon */}
            <div className="flex gap-x-2">
              <Filter className="size-5 fill-black"/>
              <span>Filter</span>
            </div>

            <div className="flex flex-col gap-3">
                <label className="flex gap-x-3 hover:cursor-pointer">
                  <input className="size-5 hover:cursor-pointer" type="checkbox" name="" id="" value="Sold" checked = {selectedFilter.includes("Sold")}
                  onChange={(e)=>{handleInputChange(e)}}/>
                  <span>Sold</span>
                </label>

                <label className="flex gap-x-3 hover:cursor-pointer">
                  <input className="size-5 hover:cursor-pointer" type="checkbox" name="" id="" value="Available" checked = {selectedFilter.includes("Available")}
                    onChange={(e)=>{handleInputChange(e)}}/>
                  <span>Available</span>
                </label>
            </div>


            <div className="flex justify-between w-full gap-x-6">
              <button className="px-5 py-2 border rounded-sm shadow-[0px_0px_10px_2px_rgba(245,158,11,0.5)] hover:cursor-pointer" onClick={()=>{handleFilter(selectedFilter)}}>Apply</button>
              <button className="px-5 py-2 border rounded-sm shadow-[0px_0px_10px_2px_rgba(245,158,11,0.5)] hover:cursor-pointer" onClick={handleReset}>Reset</button>
            </div>

        </div>

        {/* Right section(contains items listed ) */}
        <div className="bg-stone-200 w-full min-h-screen md:p-3 p-2 flex flex-col gap-y-7">
            <div className="flex p-3 gap-6 bg-white">
              <span>Sort by :</span>
              <button value="Cheap" onClick={(e)=>handleSort(e)} 
              className={`${(sortVal && sortVal==="Cheap") ? "font-medium text-black":"font-normal text-gray-600"}`}>
                Cheap
              </button>

              <button value="Expensive" onClick={(e)=>handleSort(e)} 
                className={`${(sortVal && sortVal==="Expensive") ? "font-medium text-black":"font-normal text-gray-600"}`}>
                Expensive
              </button>
            </div>
            <div className="grid  xl:grid-cols-4 lg:grid-cols-3  md:grid-cols-2 grid-cols-1 gap-6 xl:gap-8">
            {items.map((item,index)=>(
                <div key={index} className="overflow-hidden shadow-[0px_0px_10px_2px_rgba(245,158,11,0.5)]  bg-white flex flex-col justify-between">

                    <div className="relative aspect-4/3">
                        {/* Image */}
                        <img src={item.photos[0]} alt="item" className="absolute h-full w-full object-cover"/>

                        {/* Availabilty  Badge */}
                        {item.isSold ? <Sold/> : null} 

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
                           <span><Dot/></span>
                           {/* Date Posted */}
                           <div className="flex items-center gap-2 text-sm text-gray-500">
                               {formatDate(item.createdAt)}
                           </div>
                        </div>
                    </div>

                    {/* Divider */}
                    {/* <div className="border-t border-gray-700"></div> */}

                    <div className="p-1.5 flex flex-row gap-x-3 justify-center border-2 rounded-xl mx-auto my-2 ">
                        <Link href={`/my-listings/edit/${item._id}`} className="hover:cursor-pointer   flex justify-center items-center rounded-full text-black p-2">
                            <Edit2 className="size-5"></Edit2> 
                        </Link>
                        {/* Edit button */}
                        <button className="hover:cursor-pointer"
                                onClick={(e)=>{
                                  async function fetchItems() {
                                     const response = await editItem(item._id,{isSold : !item.isSold})
                                     if(response) setItems(response);
                                     
                                  }
                                  fetchItems()
                                }
                              }
                        >
                          {item.isSold ? 
                             <div className=" flex flex-row gap-x-2  p-2 text-black rounded-xl"><RotateCcw /> <span>Mark In Stock</span></div>:
                             <div className=" flex flex-row gap-x-2  p-2 text-black  rounded-xl"><CircleCheckBig/><span>Mark Sold</span></div>}
                        </button>
                        <button className="hover:cursor-pointer  flex justify-center items-center rounded-full  text-bkack p-2"
                            onClick={
                              ()=>{
                                async function fetchDeleteItem() {
                                  const success = await deleteItem(item._id);
                                  if(success!=null) {setItems(success)};
                                }
                              fetchDeleteItem();
                              }
                          }
                        >
                            <Trash2 className="size-5"></Trash2> 
                        </button>
                    </div>
                   
                </div>
            )
          )}
          </div>
        </div>

        
    </div>
    )
}
