"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import PasswordSideImage from "@/app/components/PasswordSideImage";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    async function requestPasswordReset(data) {
      setSending(true)
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
          method : "POST",                
          headers : {'Content-Type': 'application/json'},
          body : JSON.stringify({email : data}),
          cache : "no-store",
          credentials : "include",
        })
        const response = await res.json();
        if(!res.ok) throw new Error(response.message);
        toast.success(response.message)
      }
      catch(error) {
        toast.error(error.message);
      }
      finally {
        setSending(false)
      }
    }
    requestPasswordReset(email)
  }
  

  return (
    <main className="flex min-h-screen items-start justify-center bg-slate-50 px-4 pb-10 pt-8">
      <div className="w-full max-w-md lg:grid lg:max-w-5xl lg:grid-cols-2 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none lg:p-12">
        <Link href="/" aria-label="UniShop home" className="inline-flex">
          <img src="/favicon.ico" alt="UniShop" className="size-8 object-contain" />
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter the email address linked to your account to request a reset link.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="reset-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {sending==false ? "Send reset link" : "Sending..."}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </section>
      <PasswordSideImage />
      </div>
    </main>
  );
}
