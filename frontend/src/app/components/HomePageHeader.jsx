"use client";

import { ArrowRight, BookOpen, Plus, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomePageHeader = () => {
  const router = useRouter();
  return (
    <section className="w-full">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
        {/* Left Content */}
        <div className="px-3 py-7 sm:px-10 md:py-20 lg:px-12 lg:py-30">
          {/* Heading */}
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Buy & Sell
            <br />
            Within <span className="text-blue-600">Your Campus</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            Find affordable items from students around you — or list something
            you no longer need.
          </p>

          {/* Sell icon and browse icon container*/}
          <div className="flex md:gap-x-12 gap-x-6 mt-10 items-center">
            {/* Post button */}
            <button
              onClick={() => {
                router.push("/post");
              }}
              className="flex gap-x-2 bg-blue-600 text-white px-4 py-2 hover:cursor-pointer hover:bg-blue-400 rounded-md"
            >
              <Plus className="size-6"/>
              <span>Post Item</span>
            </button>

            <button
              onClick={() => {
                router.push("/categories");
              }}
              className="bg-black text-white px-4 py-2 hover:cursor-pointer hover:bg-gray-700 rounded-md"
            >
              Browse Items
            </button>
          </div>

          {/*Todo Will add Stats */}
        </div>

        {/* Right Illustration */}
        <div className="relative hidden h-full lg:block">
          <img
            src="/HeaderImage.png"
            alt="Students buying and selling items on campus"
            className="object-contain h-full w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default HomePageHeader;
