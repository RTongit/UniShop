"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

const categories = [
  { title: "Books & Notes", image: "/books.svg", note: "For the next class, or the next chapter." },
  { title: "Laptops & Computers", image: "/computer.svg", note: "Study setups and everyday tech." },
  { title: "Mobile & Tablets", image: "/mobile.svg", note: "Devices that keep you connected." },
  { title: "Cycles & Scooters", image: "/cycle.svg", note: "A quicker way across campus." },
  { title: "Lab Equipment", image: "/lab.svg", note: "Tools for practical work." },
  { title: "Scientific Calculator", image: "/calculator.svg", note: "Ready for the next problem set." },
  { title: "Sports Equipment", image: "/sports.png", note: "For a game after lectures." },
  { title: "Hostel Essentials", image: "/hostel.png", note: "Useful things for your room." },
  { title: "Electronics & Gadgets", image: "/electronics.png", note: "Small upgrades for student life." },
  { title: "Clothing & Accessories", image: "/clothing.svg", note: "Everyday wear and extras." },
  { title: "Previous Year Question Papers", image: "/paper.svg", note: "Past papers for a little more practice." },
];

export default function CategoriesPage() {
  const { authUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) router.replace("/login");
  }, [router, authUser]);

  if (!authUser) return null;

  return (
    <main className="min-h-screen bg-[#f7f6ef] px-4 pb-16 pt-5 text-[#263b2d] sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1380px]">
        <section id="category-shelves" className="scroll-mt-28 py-8 sm:py-12">
          <div className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#78816e]">Take a look around</p>
              <h1 className="font-serif text-3xl tracking-tight text-[#24392c] sm:text-4xl">A shelf for every part of student life.</h1>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link key={category.title} href={`/search?title=${encodeURIComponent(category.title)}`} className="group flex min-h-[142px] items-center gap-4 rounded-2xl border border-[#e5e4d9] bg-[#fbfaf5] p-4 transition-colors hover:border-[#aeb9a3] hover:bg-white sm:p-5">
                <span className="grid size-[76px] shrink-0 place-items-center rounded-2xl bg-[#e9eddf] p-3 sm:size-[88px]">
                  <img src={category.image} alt="" className="size-full object-contain transition-transform duration-200 group-hover:scale-105" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg leading-5 text-[#294332] sm:text-xl">{category.title}</span>
                  <span className="mt-2 block text-xs leading-5 text-[#747b6e]">{category.note}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid overflow-hidden rounded-[2rem] bg-[#e9eddf] lg:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col items-start justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#71806a]">Explore UniShop</p>
            <h1 className="max-w-2xl font-serif text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]">
              Find your next useful thing.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-7 text-[#5f6a5b] sm:text-lg">
              Browse books, gear and everyday essentials students around your campus are ready to pass on.
            </p>
            <Link href="/post" className="mt-8 inline-flex items-center rounded-full bg-[#294332] px-5 py-3.5 text-sm font-semibold text-[#f7f6ef] transition hover:bg-[#1e3024]">
              List an item
            </Link>
          </div>
          <div className="relative min-h-[260px] bg-[#bed8c7] sm:min-h-[340px] lg:min-h-[470px]">
            <img src="/HeaderImage.png" alt="Students sharing useful items on campus" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/70 bg-[#f7f6ef]/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a826f]">A little closer to home</p>
                <p className="mt-1 font-serif text-xl text-[#294332] sm:text-2xl">Good finds, close by.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e4d9] bg-[#eeefe6] px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#78816e]">Have something to pass on?</p>
            <p className="mt-2 font-serif text-2xl text-[#294332]">Give it a good next home.</p>
          </div>
          <Link href="/post" className="inline-flex items-center justify-center self-start rounded-full border border-[#52654f]/30 px-5 py-3 text-sm font-semibold text-[#294332] transition hover:bg-white sm:self-auto">
            List an item
          </Link>
        </section>
      </div>
    </main>
  );
}
