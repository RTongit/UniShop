"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get("token");
    setToken(queryToken || "");
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSuccess(false);

    if (!token) {
      setFormMessage("This reset link does not contain a token.");
      return;
    }
    if (newPassword.length < 6) {
      setFormMessage("Your password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormMessage("The passwords do not match.");
      return;
    }

    setFormMessage("Demo only: the form is valid, but your password has not been changed because this page isn’t connected to the backend yet.");
    setIsSuccess(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-600">UniShop</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter and confirm a new password for your account.
        </p>

        {!token && (
          <p role="status" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            No reset token was found in this link. Open the reset link from your email.
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
            disabled={!token}
            className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Reset password
          </button>
        </form>

        {formMessage && (
          <p role="status" className={`mt-4 rounded-lg p-3 text-sm leading-5 ${isSuccess ? "bg-blue-50 text-blue-800" : "bg-rose-50 text-rose-700"}`}>
            {formMessage}
          </p>
        )}

        <p className="mt-5 text-center text-sm text-slate-600">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
