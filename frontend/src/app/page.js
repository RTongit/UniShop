"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { useItemStore } from "./store/itemStore";
import Spinner from "./components/Spinner";
import Link from "next/link";
import HomePageHeader from "./components/HomePageHeader";
import BrowseCategories from "./components/BrowseCategories";

export default function HomePage() {
  const router = useRouter();
  const { authUser } = useAuthStore();
  const { isSearching } = useItemStore();

  useEffect(() => {
    if (!authUser) router.replace("/login");
  }, [authUser, router]);

  if (!authUser) return null;
  if (isSearching) return <Spinner />;

  return (
    <div className="flex flex-col gap-y-5 p-2">
      <HomePageHeader />
      <BrowseCategories />
      {authUser.role === "admin" ? <Link href="/admin/dashboard">Go to Admin</Link> : null}
      <footer className="-mx-2 -mb-2 mt-12">
        <div className="bg-[#05051b] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_auto_auto] md:gap-20">
            <div className="max-w-md">
              <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">Find good things<br className="hidden sm:block" /> around your campus.</h2>
              <Link href="/categories" className="mt-7 inline-flex items-center gap-3 rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-white">
                Explore the marketplace <span aria-hidden="true">→</span>
              </Link>
            </div>
            <nav aria-label="Marketplace links" className="flex flex-col items-start gap-3 text-sm text-slate-200">
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">Marketplace</h3>
              <Link className="hover:text-white hover:underline" href="/">Home</Link>
              <Link className="hover:text-white hover:underline" href="/categories">Browse categories</Link>
              <Link className="hover:text-white hover:underline" href="/post">Post an item</Link>
            </nav>
            <nav aria-label="Account links" className="flex flex-col items-start gap-3 text-sm text-slate-200">
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">Your account</h3>
              <Link className="hover:text-white hover:underline" href="/my-listings">My listings</Link>
            </nav>
          </div>
          <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-5 text-xs text-indigo-200 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} UniShop. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
