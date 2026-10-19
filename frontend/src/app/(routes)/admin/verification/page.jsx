"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X,Check } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";
import Spinner from "@/app/components/Spinner";
import formatDate from "@/app/constant/formatDate";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const FILTERS = ["pending", "verified", "rejected", "All students"];


//Small reusable component that styles a student's status
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-stone-50 text-amber-800",
    verified: "bg-stone-50 text-emerald-700",
    rejected: "bg-stone-50 text-rose-700",
  };

  const Icon =
    status === "verified" ? Check :
    status === "rejected" ? X :
    null;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${styles[status]}`}>
      {Icon && <Icon size={14} strokeWidth={2.5} aria-hidden="true" />}
      {status}
    </span>
  );
}

export default function AdminVerificationPage() {
  const {authUser} = useAuthStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All students");
  const [students, setStudents] = useState([]);
  const [studentToReject, setStudentToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isFetchingData, setIsFetchingData] = useState(true);

  useEffect(() => {
    if(!authUser) {router.replace("/login"); return;}
    if(authUser.role !== "admin") router.replace("/");
    async function getVerificationRequests() {
      setIsFetchingData(true)
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/admin/verification-requests`,{credentials : "include",cache : "no-store"}
        )
        const response = await res.json()
        if(!res.ok) throw new Error(response.message)
        setStudents(response)
      }

      catch(error) {
        toast.error(error.message)
      }

      finally {
        setIsFetchingData(false)
      }
    }
    getVerificationRequests()
  }, [authUser, router]);

  const visibleStudents = useMemo(() => {
    if(activeFilter === "All students") return students;
    return students.filter((student) => student.verificationStatus === activeFilter);
  }, [activeFilter, students]);

  // Update a student's status in local React state
  async function updateStudentStatus(studentId, verificationStatus, rejectionReason = "") {

    if (verificationStatus === "rejected" && rejectionReason?.trim()=="") {
      toast.error("A rejection reason is required");
    }

    try {
       const res = await fetch(`${BACKEND_URL}/api/admin/verification-requests/${studentId}`,
         {
           method: "PATCH",
           headers: { "Content-Type": "application/json" },
           credentials: "include",
           body: JSON.stringify({ verificationStatus, rejectionReason }),
         }
       )
       const response = await res.json()
       if(!res.ok) throw new Error(response.message)

       // Only update the student state if it returned good response from backend  
       setStudents((prev)=> prev.map((student)=> student._id === response._id ? response : student))
       setStudentToReject(null);
       setRejectionReason("");
       toast.success(verificationStatus === "verified" ? "Student approved" : "Student rejected");
    }
    catch(error) {
        toast.error(error.message)
    }
  }

  if(!authUser || authUser.role !== "admin") return null;
  if(isFetchingData) return <Spinner/>

  return (
    <main className="h-full overflow-y-auto bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 sm:mb-7">
          <label htmlFor="student-status-filter" className="sr-only">Filter students by status</label>
          <select
            id="student-status-filter"
            value={activeFilter}
            onChange={(event) => setActiveFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 sm:hidden"
          >
            {FILTERS.map((filter) => (
              <option key={filter} value={filter}>{filter === "All students" ? filter : filter[0].toUpperCase() + filter.slice(1)}</option>
            ))}
          </select>

          <nav aria-label="Filter students" className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:flex">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-colors sm:px-6 ${activeFilter === filter ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
              >
                {filter.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>

        {/* Compact student cards for screens where the full table would be clipped. */}
        <section className="space-y-3 2xl:hidden" aria-label="Student verification requests">
          {visibleStudents.map((student) => (
            <article key={student._id} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-slate-950">{student.name}</h2>
                  <p className="mt-1 break-all text-sm text-slate-600">{student.email}</p>
                  <p className="mt-1 break-words text-sm text-slate-400">{student.phoneNumber}</p>
                </div>
                <div className="shrink-0"><StatusBadge status={student.verificationStatus} /></div>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-100 pt-5 text-sm sm:gap-x-6">
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Enrollment</dt>
                  <dd className="mt-1 break-words font-medium text-slate-800">{student.enrollmentId || "—"}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Submitted</dt>
                  <dd className="mt-1 text-slate-700">{formatDate(student.createdAt)}</dd>
                </div>
                <div className="col-span-2 min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Academic details</dt>
                  <dd className="mt-1 break-words text-slate-700">{student.department || "—"}</dd>
                  <dd className="mt-1 text-slate-400">Graduation {student.graduationYear || "—"}</dd>
                </div>
              </dl>

              {student.verificationStatus === "rejected" && student.rejectionReason ? (
                <p className="mt-3 break-words border-t border-slate-100 pt-3 text-sm leading-5 text-slate-500 [overflow-wrap:anywhere]">
                  <span className="font-medium text-slate-700">Rejection reason: </span>{student.rejectionReason}
                </p>
              ) : null}

              <div className="mt-5 border-t border-slate-100 pt-5">
                {student.verificationStatus === "pending" ? (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button type="button" onClick={() => updateStudentStatus(student._id, "verified")} className="min-w-0 rounded-xl bg-emerald-600 px-2 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:px-4">Approve</button>
                    <button type="button" onClick={() => {setStudentToReject(student); setRejectionReason("");}} className="min-w-0 rounded-xl bg-rose-600 px-2 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 sm:px-4">Reject</button>
                  </div>
                ) : <span className="text-sm text-slate-400">Reviewed</span>}
              </div>
            </article>
          ))}
          {visibleStudents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500 shadow-sm">No students in this category.</div>
          ) : null}
        </section>

        {/* Full table for very wide screens */}
        <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm 2xl:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700">
                <tr>
                  <th className="w-[22%] px-6 py-5">Student</th>
                  <th className="w-[12%] px-5 py-5">Enrollment</th>
                  <th className="w-[27%] px-5 py-5">Academic details</th>
                  <th className="w-[12%] px-5 py-5">Submitted</th>
                  <th className="w-[10%] px-5 py-5">Status</th>
                  <th className="w-[17%] px-5 py-5">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleStudents.map((student, index) => (
                  <tr key={student._id} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/70"} align-top`}>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-950">{student.name}</p>
                      <p className="mt-1 text-slate-600">{student.email}</p>
                      <p className="mt-1 text-sm text-slate-400">{student.phoneNumber}</p>
                    </td>
                    <td className="px-5 py-5 font-medium text-slate-900">{student.enrollmentId}</td>
                    <td className="px-5 py-5 text-slate-700">
                      <p>{student.department}</p>
                      <p className="mt-1 text-sm text-slate-400">Graduation {student.graduationYear}</p>
                    </td>
                    <td className="px-5 py-5 text-slate-700">{formatDate(student.createdAt)}</td>
                    <td className="px-5 py-5">
                      <StatusBadge status={student.verificationStatus} />
                      {student.verificationStatus === "rejected" && student.rejectionReason ? (
                        <p
                          title={student.rejectionReason}
                          className="mt-2 w-full max-w-40 text-xs leading-5 text-slate-500 [overflow-wrap:anywhere]"
                        >
                          {student.rejectionReason}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-5">
                      {student.verificationStatus === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => updateStudentStatus(student._id, "verified")} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">Approve</button>
                          <button type="button" onClick={() => {setStudentToReject(student); setRejectionReason("");}} className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-rose-600 transition-colors hover:bg-rose-700 text-amber-50">Reject</button>
                        </div>
                      ) : <span className="text-slate-400">Reviewed</span>}
                    </td>
                  </tr>
                ))}
                {visibleStudents.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-500">No students in this category.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Rejection form  */}
      {studentToReject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => {if(event.target === event.currentTarget) setStudentToReject(null);}}>
          <form className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onSubmit={(event) => {event.preventDefault(); updateStudentStatus(studentToReject._id, "rejected", rejectionReason.trim());}}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-rose-600">Reject verification</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{studentToReject.name}</h2>
              </div>
              <button type="button" aria-label="Close" onClick={() => setStudentToReject(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={19} /></button>
            </div>
            <label htmlFor="mock-rejection-reason" className="mt-5 block text-sm font-medium text-slate-700">Reason for rejection</label>
            <textarea id="mock-rejection-reason" required maxLength={500} value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Enter a reason for rejection..." className="mt-2 min-h-32 w-full resize-y rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setStudentToReject(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={!rejectionReason.trim()} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50">Confirm rejection</button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
