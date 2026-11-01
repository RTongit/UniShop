"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Check, LoaderCircle, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ProfilePage() {
  const { authUser, isCheckingAuth } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isCheckingAuth) return;
    if (!authUser) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    async function loadProfile() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/profile`, { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not load profile");
        if (!cancelled) {
          setProfile(data);
        }
      } catch (error) {
        if (!cancelled) toast.error(error.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [authUser, isCheckingAuth, router]);

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Choose a PNG, JPG, or WebP image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photos must be smaller than 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSelectedPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  async function saveProfilePhoto() {
    if (!selectedPhoto) {
      toast.error("Choose a profile photo first");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ profilePic: selectedPhoto }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update profile");
      setProfile(data);
      setSelectedPhoto("");
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isCheckingAuth || !authUser || isLoading) {
    return <div className="grid min-h-[60vh] place-items-center"><LoaderCircle className="animate-spin text-slate-500" /></div>;
  }
  if (!profile) return <main className="mx-auto max-w-3xl px-5 py-12 text-center text-slate-600">Could not load your profile. Please refresh and try again.</main>;

  const verified = profile.verificationStatus === "verified";
  const profileFields = [
    ["Phone number", profile.phoneNumber],
    ["Department", profile.department],
    ["Graduation year", profile.graduationYear],
    ["Email address", profile.email],
    ["Enrollment ID", profile.enrollmentId],
  ];

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f7f8fa] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-6 inline-flex text-sm font-medium text-slate-600 hover:text-black hover:underline">Back to marketplace</Link>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-[#e9eddf] sm:h-36" />
          <div className="px-5 pb-7 sm:px-9 sm:pb-9">
            <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative size-20 shrink-0 sm:size-24">
                  <img src={selectedPhoto || profile.profilePic || "/defaultProfilePic.jpg"} alt="Profile" className="size-full rounded-2xl border-4 border-white bg-[#e9eddf] object-cover" />
                  <label className="absolute -bottom-1 -right-1 grid size-9 cursor-pointer place-items-center rounded-full border-2 border-white bg-black text-white transition hover:bg-gray-800" title="Change profile photo">
                    <Camera size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>
                <div className="translate-y-1"><h1 className="text-2xl font-semibold tracking-tight text-slate-900">{profile.name}</h1><p className="mt-1 text-sm capitalize text-slate-500">{profile.role}</p></div>
              </div>
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${verified ? "bg-black text-white" : "bg-amber-50 text-amber-800"}`}><Check size={15} />{verified ? "Verified" : profile.verificationStatus}</span>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div><h2 className="text-lg font-semibold text-slate-900">Profile details</h2><p className="mt-1 text-sm text-slate-500">Your account information is shown below.</p></div>
              </div>
              <p className="mb-4 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole size={13} /> Other account details are read-only.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Full name</p><p className="mt-1 break-words text-sm font-medium text-slate-800">{profile.name}</p></div>
                {profileFields.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-medium text-slate-800">{value || "—"}</p></div>)}
              </div>
              {selectedPhoto && <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={isSaving} onClick={() => setSelectedPhoto("")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" disabled={isSaving} onClick={saveProfilePhoto} className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60">{isSaving ? "Saving…" : "Save photo"}</button></div>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
