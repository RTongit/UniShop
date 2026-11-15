"use client";

import { useAuthStore } from "@/app/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const AdminDashBoardPage = () => {
  const { authUser } = useAuthStore();
  const router = useRouter();
  const [studentCounts, setStudentCounts] = useState(null);
  const [countLoadFailed, setCountLoadFailed] = useState(false);

  useEffect(() => {
    if (!authUser) {
      router.replace("/login");
      return;
    }
    if (authUser.role !== "admin") {
      router.replace("/");
      return;
    }

    async function loadStudentCounts() {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/admin/verification-requests`,
          { credentials: "include", cache: "no-store" }
        );
        const students = await response.json();
        if (!response.ok) throw new Error(students.message || "Could not load verification requests.");

        setStudentCounts({
          pending: students.filter((student) => student.verificationStatus === "pending").length,
          verified: students.filter((student) => student.verificationStatus === "verified").length,
          rejected: students.filter((student) => student.verificationStatus === "rejected").length,
        });
      } catch (error) {
        toast.error(error.message || "Could not load verification requests.");
        setCountLoadFailed(true);
      }
    }

    loadStudentCounts();
  }, [authUser, router]);

  if (!authUser || authUser.role !== "admin") return null;

  return (
    <main className="min-h-full overflow-y-auto bg-slate-50 px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-slate-500">Admin dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {authUser.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Review student verification requests for UniShop.
          </p>
        </header>

        <section aria-labelledby="verification-summary-title" className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 id="verification-summary-title" className="font-semibold text-slate-900">Student verification</h2>
            <p className="mt-1 text-sm text-slate-500">Current account review status</p>
          </div>
          <div className="grid sm:grid-cols-3">
            <div className="border-b border-slate-200 px-5 py-5 sm:border-b-0 sm:px-6">
              <p className="text-sm font-medium text-amber-800">Pending</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900" aria-live="polite">
                {countLoadFailed || studentCounts === null ? "—" : studentCounts.pending}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {countLoadFailed
                  ? "Could not load counts."
                  : studentCounts?.pending === 0
                  ? "No requests need review."
                  : "Waiting for review."}
              </p>
              <Link
                href="/admin/verification"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto sm:justify-start sm:px-4"
              >
                Review requests
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="border-b border-slate-200 px-5 py-5 sm:border-b-0 sm:border-l sm:px-6">
              <p className="text-sm font-medium text-emerald-700">Verified</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900" aria-live="polite">
                {countLoadFailed || studentCounts === null ? "—" : studentCounts.verified}
              </p>
              <p className="mt-1 text-sm text-slate-500">Approved student accounts.</p>
            </div>

            <div className="px-5 py-5 sm:border-l sm:border-slate-200 sm:px-6">
              <p className="text-sm font-medium text-rose-700">Rejected</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900" aria-live="polite">
                {countLoadFailed || studentCounts === null ? "—" : studentCounts.rejected}
              </p>
              <p className="mt-1 text-sm text-slate-500">Applications not approved.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashBoardPage;
