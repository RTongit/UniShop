"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const HomePageHeader = () => {
  const router = useRouter();
  return (
    <section className="w-full">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
        <div className="px-3 py-7 sm:px-10 md:py-20 lg:px-12 lg:py-30">
          <h1 className="max-w-xl font-serif text-4xl font-medium leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Buy &amp; Sell
            <br />
            Within <span className="text-blue-600">Your Campus</span>
          </h1>
          <p className="mt-5 max-w-lg font-sans text-base leading-7 text-slate-600 sm:text-lg">
            Find affordable items from students around you — or list something
            you no longer need.
          </p>
          <div className="mt-10 flex items-center gap-x-6 md:gap-x-12">
            <button
              onClick={() => router.push("/post")}
              className="flex gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:cursor-pointer hover:bg-blue-400"
            >
              <Plus className="size-6" />
              <span>Post Item</span>
            </button>
            <button
              onClick={() => router.push("/categories")}
              className="rounded-md bg-black px-4 py-2 text-white hover:cursor-pointer hover:bg-gray-700"
            >
              Browse Items
            </button>
          </div>
        </div>
        <div className="relative hidden h-full lg:block">
          <img
            src="/HeaderImage.png"
            alt="Students buying and selling items on campus"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HomePageHeader;
