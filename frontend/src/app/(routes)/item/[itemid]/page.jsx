"use client";
import Spinner from "@/app/components/Spinner";
import { useItemStore } from "@/app/store/itemStore";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, MoveLeft, Share } from "lucide-react";
import formatDate from "@/app/constant/formatDate";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { useChatStore } from "@/app/store/chatStore";

// Mock data — replace with your Zustand store / API call
const item = {
  seller: {
    avatar: "https://i.pravatar.cc/150?img=12",
  },
};

export default function ItemPage({ params }) {
  const { getSingleItem, singleItem, isLoadingItem} =useItemStore();
  const {authUser} = useAuthStore()
  const {postChat,selectedChat,setSelectedChat} = useChatStore()
  const { itemid } = use(params);
  const router = useRouter();
  // Will figure out this after
  const [activePhoto, setActivePhoto] = useState(0);
  const [saved, setSaved] = useState(false);

  const formatPrice = (p) => "₹" + p.toLocaleString("en-IN");

  useEffect(() => {
    if(!authUser) router.replace("/login")
    getSingleItem(itemid);
  }, [getSingleItem, itemid,authUser,router]);

  if(!authUser) return null
  if (isLoadingItem) return <Spinner />;
  if (!singleItem) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-gray-200 font-sans p-2">

      {/* Whole content */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="flex flex-col gap-6">

          <div className="">
            {/* Main image */}
            <div className="relative overflow-hidden border border-gray-200 bg-black flex justify-center md:h-162 h-100">
              <img
                src={singleItem.photos[activePhoto]}
                alt={singleItem.title}
                className="aspect-4/3 object-cover"
              /> 
                  {/* Heart  */}
                  <button onClick={() => setSaved((s) => !s)}
                      className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded-lg"
                    >
                  <Heart
                    className={` ${saved ? " fill-white" : " fill-black"} text-white hover:text-gray-500`}
                  />
                </button>

                {/* Share */}
                <button 
                   className="text-white hover:text-gray-500 absolute top-4 right-15">
                  <Share />
                </button>


              {/*Left Arrow button */}
              <button
                onClick={() => setActivePhoto((p) => Math.max(0, p - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black rounded-full w-8 h-8 flex items-center justify-center shadow text-gray-700 text-sm"
              >
                <ChevronLeft className="size-12 text-white"/>
              </button>
              {/*Right Arrow button */}
              <button
                onClick={() =>
                  setActivePhoto((p) => Math.min(singleItem.photos.length - 1, p + 1))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black rounded-full w-8 h-8 flex items-center justify-center shadow text-gray-700 text-sm"
              >
                <ChevronRight className="size-12 text-white"/>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3">
              {singleItem.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    activePhoto === i
                      ? "border-indigo-600"
                      : "border-transparent"
                  }`}
                >
                  <img src={photo} alt="" className="w-16 h-12 object-cover" />
                  {/* +2 overlay on last thumb if more photos */}
                  {i === 3 && singleItem.photos.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                      +{singleItem.photos.length - 4}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-5 flex flex-col justify-between">
            <div>
              {/*Wistlist and share actions */}
              <div className="flex items-center justify-end mb-3 gap-3">
                {/* Todo need to make it functional */}

              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-gray-900 leading-snug mb-2">
                {singleItem.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(singleItem.price)}
                </span>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-y-2 mb-4">
                {[
                  { label: "Brand", value: (singleItem.brand && singleItem.brand!="") ?singleItem.brand : "None"  },
                  { label: "Category", value: singleItem.category },
                  { label: "Posted", value: formatDate(singleItem.createdAt) },
                ].map((row) => (
                  <div key={row.label} className="flex gap-2 ">
                    <span className="text-gray-400 w-20">{row.label}</span>
                    <span className="text-gray-700 font-medium">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* CTA Buttons */}
              {singleItem.isSold ? (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-400 rounded-xl py-3 text-sm font-semibold cursor-not-allowed mb-3"
                >
                  Item Already Sold
                </button>
              ) : (
                <>
                  {/* <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-sm font-semibold mb-3 transition-colors">
                  💬 Contact Seller
                </button> */}
                  <Button 
                        onClick={()=>{

                          async function fetchChat() {
                            // Here response this the populated chat document
                            const response = await postChat({
                               seller : singleItem.sellerInfo.sellerId,
                               item : singleItem.id
                            });
                            if(response!=null) {
                              setSelectedChat(response)
                              router.push(`/chat/${response._id}`);
                            }
                          }
                          fetchChat()

                        }}
                        className=" bg-black hover:bg-gray-700 text-white rounded-sm py-5 text-lg font-semibold mb-3 transition-colors mt-3">
                    Contact Seller
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION + SELLER — two columns below */}
        <div className="flex md:flex-row flex-col gap-6 mt-6">

          {/* DESCRIPTION */}
          <div className="bg-white border border-gray-200 p-5 w-[65%]">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {singleItem.description}
            </p>
          </div>

          {/* SELLER (todo : need to add features)*/}
          <div className="bg-white border border-gray-200 p-5 w-[35%]">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Seller Information
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={item.seller.avatar}
                alt={singleItem.sellerInfo.sellerName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {singleItem.sellerInfo.sellerName}
                  </span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {singleItem.sellerInfo.verificationStatus} 
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {singleItem.sellerInfo.department} • {singleItem.sellerInfo.graduationYear}
                </p>
                {/* <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                  <span>⭐ {item.seller.rating}</span>
                  <span className="text-gray-300">|</span>
                  <span>({item.seller.reviews} reviews)</span>
                  <span className="text-gray-300">|</span>
                  <span>{item.seller.sales} Successful Sales</span>
                </div> */}
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
              <span> Joined : {formatDate(singleItem.sellerInfo.joinedAt)}</span>
              <span>🎓 Nondu </span>
            </div>

            <Link href={`/search`} className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl py-2.5 transition-colors">
              View All Listings
            </Link>
          </div>
        </div>

        {/* todo : MORE FROM SELLER (Need to add actual data from db)*/} 

      </div>
    </div>
  );
}
