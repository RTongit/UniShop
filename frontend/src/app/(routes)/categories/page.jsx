"use client"
import React from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

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

const CategoriesPage = () => {
  const { authUser } = useAuthStore();
  const router = useRouter()
  
  useEffect(() => {
    if (!authUser) router.replace("/login");
  }, [router, authUser]);

  if (!authUser) return null;
  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-10 text-center sm:text-left">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Explore UniShop
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            All Categories
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Browse items listed by students across your campus.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={`/search?title=${encodeURIComponent(category.title)}`}
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-5"
            >
              {/* Image */}
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-stone-200">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-[75%] w-[75%] object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>

              {/* Title */}
              <h2 className="mt-4 text-center text-sm font-semibold leading-5 text-slate-900 sm:text-base">
                {category.title}
              </h2>

              <p className="mt-2 text-center text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 sm:text-sm">
                Browse items 
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategoriesPage;