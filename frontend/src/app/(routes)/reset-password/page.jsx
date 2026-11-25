"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ButtonSpinner from "@/app/components/ButtonSpinner";
import PasswordSideImage from "@/app/components/PasswordSideImage";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!token) {
      toast.error("This reset link does not contain a token.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Your password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("The passwords do not match.");
      return;
    }
    const data = {token : token, newPassword : newPassword};

    // fetch the backend :
    async function resetPassword(data) {
      setIsResetting(true)
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          cache: "no-store",
          credentials: "include",
        });
        const response = await res.json();
        if (!res.ok) throw new Error(response.message);
        toast.success(response.message, { duration: 6000 });
        setTimeout(() => router.replace("/login"), 2000);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsResetting(false)
      }
    }

    resetPassword(data);
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-slate-50 px-4 pb-10 pt-8 sm:items-center sm:py-10">
      <div className="w-full max-w-md lg:grid lg:max-w-5xl lg:grid-cols-2 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none lg:p-12">
        <Link href="/" aria-label="UniShop home" className="inline-flex">
          <img src="/favicon.ico" alt="UniShop" className="size-8 object-contain" />
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter and confirm a new password for your account.
        </p>

        {!token && (
          <p
            role="status"
            className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
          >
            No reset token was found in this link. Open the reset link from your
            email.
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your new password"
              required
              minLength={6}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter it again"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={!token || isResetting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isResetting ? (
              <>
                <ButtonSpinner />
                Resetting password...
              </>
            ) : "Reset password"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="whitespace-nowrap font-semibold text-blue-600 hover:underline"
          >
            Back to login
          </Link>
        </p>
      </section>
      <PasswordSideImage />
      </div>
    </main>
  );
}
