"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  {
    title: "Books & Notes",
    image: "/books.svg",
  },
  {
    title: "Laptops & Computers",
    image: "/computer.svg",
  },
  {
    title: "Mobile & Tablets",
    image: "/mobile.svg",
  },
  {
    title: "Cycles & Scooters",
    image: "/cycle.svg",
  },
  {
    title: "Lab Equipment",
    image: "/lab.svg",
  },
  {
    title: "Scientific Calculator",
    image: "/calculator.svg",
  },
  {
    title: "Sports Equipment",
    image: "/sports.png",
  },
  {
    title: "Hostel Essentials",
    image: "/hostel.png",
  },
  {
    title: "Electronics & Gadgets",
    image: "/electronics.png",
  },
  {
    title: "Clothing & Accessories",
    image: "/clothing.svg",
  },
  {
    title: "Previous Year Question Papers",
    image: "/paper.svg",
  },
];

export default function BrowseCategory() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full md:px-6 md:py-8 py-5 px-3 flex flex-col items-center">
      {/* Top categories and more categories container */}
      <div className="flex justify-between mb-5 min-w-[335px] max-w-[1506px] w-[98%]">
        {/* Heading */}
        <h2 className=" md:text-xl text-lg font-bold text-slate-900">
          Top Categories
        </h2>

        {/* More categories button */}
        <button
          onClick={() => {
            router.push("/categories");
          }}
          className="bg-black text-white px-4 md:py-2 py-1 rounded-full text-sm hover:cursor-pointer hover:bg-gray-700"
        >
          More Categories
        </button>
      </div>

      {/* Category Row */}
      <div className="flex max-w-full items-center gap-2 md:gap-4">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white"
        >
          <ChevronLeft size={17} />
        </button>

        {/* Categories */}
        <div
          ref={scrollRef}
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
        >
          {categories.map((category) => (
            <button
              key={category.title}
              onClick={() =>
                router.push(
                  `/search?title=${encodeURIComponent(category.title)}`,
                )
              }
              className="group h-[110px] w-[85px] shrink-0 overflow-hidden rounded-lg bg-white md:h-[125px] md:w-[110px]"
            >
              {/* Image */}
              <div className="h-[75px] w-full bg-stone-300 p-1 md:h-[90px] md:p-2">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>

              {/* Category Name */}
              <div className="flex h-[35px] items-center justify-center px-1">
                <span className="text-center text-[10px] font-medium md:text-[11px]">
                  {category.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white"
        >
          <ChevronRight size={17} />
        </button>
      </div>

    </section>
  );
}
