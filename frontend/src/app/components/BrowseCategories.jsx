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
    <section className="mx-auto w-full max-w-7xl px-3 py-10 sm:px-10 sm:py-14 lg:px-12">
      {/* Top categories and more categories container */}
      <div className="mb-6 flex w-full items-end justify-between gap-4">
        {/* Heading */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#78816e]">Take a look around</p>
          <h2 className="font-serif text-3xl tracking-tight text-[#24392c] sm:text-4xl">Find your next useful thing.</h2>
        </div>

        {/* More categories button */}
        <button
          onClick={() => {
            router.push("/categories");
          }}
          className="shrink-0 rounded-full border border-[#52654f]/30 px-4 py-2 text-xs font-semibold text-[#294332] transition hover:bg-[#e9eddf] sm:px-5 sm:text-sm"
        >
          More Categories
        </button>
      </div>

      {/* Category Row */}
      <div className="flex max-w-full items-center gap-2 sm:gap-4">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#52654f]/20 bg-[#f6f4eb] text-[#294332] transition hover:bg-[#e9eddf]"
        >
          <ChevronLeft size={17} />
        </button>

        {/* Categories */}
        <div
          ref={scrollRef}
          className="flex min-w-0 flex-1 gap-3 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >
          {categories.map((category) => (
            <button
              key={category.title}
              onClick={() =>
                router.push(
                  `/search?title=${encodeURIComponent(category.title)}`,
                )
              }
              className="group w-[130px] shrink-0 overflow-hidden rounded-2xl border border-[#e4e5da] bg-[#f8f7f0] text-left shadow-[0_3px_12px_rgba(49,66,48,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(49,66,48,0.10)] sm:w-[150px]"
            >
              {/* Image */}
              <div className="h-[96px] w-full bg-[#e9eddf] p-4 sm:h-[112px] sm:p-5">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-110"
                />
              </div>

              {/* Category Name */}
              <div className="flex min-h-[52px] items-center px-3 py-2">
                <span className="text-left text-xs font-medium leading-4 text-[#354638] sm:text-sm">
                  {category.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#52654f]/20 bg-[#f6f4eb] text-[#294332] transition hover:bg-[#e9eddf]"
        >
          <ChevronRight size={17} />
        </button>
      </div>

    </section>
  );
}
