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
    </div>
  );
}
