export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-600">UniShop</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This is a temporary page preview. The password reset form is not
          connected to the backend yet.
        </p>

        <form className="mt-6 space-y-4">
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
              disabled
              className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400"
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
              disabled
              className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            disabled
            className="w-full rounded-lg bg-slate-400 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Reset password (not connected yet)
          </button>
        </form>
      </section>
    </main>
  );
}
