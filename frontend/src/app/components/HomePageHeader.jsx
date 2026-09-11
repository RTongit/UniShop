"use client";

import { ArrowRight, BookOpen, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

const HomePageHeader = () => {
  return (
    <section className="w-full ">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center overflow-hidden lg:grid-cols-2">

        {/* Left Content */}
        <div className="px-6 py-12 sm:px-10 lg:px-12 lg:py-16">

          {/* Heading */}
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Buy & Sell
            <br />
            Within{" "}
            <span className="text-blue-600">Your Campus</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            Find affordable items from students around you — or list
            something you no longer need.
          </p>


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