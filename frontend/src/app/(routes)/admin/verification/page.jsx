"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";

const FILTERS = ["Pending", "Verified", "Rejected", "All students"];

const SAMPLE_STUDENTS = [
  {id: "student-1", name: "Priya Sharma", email: "priya@gmail.com", enrollmentId: "23CSE132", department: "Computer Science & Engineering", graduationYear: 2028, phoneNumber: "1234567894", submittedAt: "7 Sept 2026", status: "Pending", rejectionReason: ""},
  {id: "student-2", name: "Ankit Sharma", email: "ankit@gmail.com", enrollmentId: "23CSE121", department: "Mechanical Engineering", graduationYear: 2028, phoneNumber: "7894571230", submittedAt: "7 Sept 2026", status: "Pending", rejectionReason: ""},
  {id: "student-3", name: "Nayan Das", email: "nayan@gmail.com", enrollmentId: "23CSE117", department: "Information Technology", graduationYear: 2024, phoneNumber: "7845123265", submittedAt: "7 Sept 2026", status: "Pending", rejectionReason: ""},
  {id: "student-4", name: "Rohit Sharma", email: "rohit67@gmail.com", enrollmentId: "49", department: "Civil Engineering", graduationYear: 2025, phoneNumber: "7845123245", submittedAt: "6 Sept 2026", status: "Verified", rejectionReason: ""},
  {id: "student-5", name: "Rohan Tamuli", email: "rohantamuli27@gmail.com", enrollmentId: "50", department: "Computer Science & Engineering", graduationYear: 2027, phoneNumber: "8753978414", submittedAt: "28 Aug 2026", status: "Verified", rejectionReason: ""},
  {id: "student-6", name: "Gaurav Saikia", email: "gaurav67@gmail.com", enrollmentId: "52", department: "Computer Science & Engineering", graduationYear: 2027, phoneNumber: "8753978415", submittedAt: "23 Aug 2026", status: "Verified", rejectionReason: ""},
  {id: "student-7", name: "Meera Bora", email: "meera.bora@gmail.com", enrollmentId: "23ECE088", department: "Electronics & Communication", graduationYear: 2026, phoneNumber: "9864123456", submittedAt: "20 Aug 2026", status: "Rejected", rejectionReason: "Please upload a clearer enrollment document."},
];

function StatusBadge({status}) {
  const styles = {
    Pending: "bg-amber-100 text-amber-800",
    Verified: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${styles[status]}`}>{status}</span>;
}

export default function AdminVerificationPage() {
  const {authUser} = useAuthStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All students");
  const [students, setStudents] = useState(SAMPLE_STUDENTS);
  const [studentToReject, setStudentToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if(!authUser) router.replace("/login");
    else if(authUser.role !== "admin") router.replace("/");
  }, [authUser, router]);

  const visibleStudents = useMemo(() => {
    if(activeFilter === "All students") return students;
    return students.filter((student) => student.status === activeFilter);
  }, [activeFilter, students]);

  if(!authUser || authUser.role !== "admin") return null;

  function updateStudentStatus(studentId, status, reason = "") {
    setStudents((currentStudents) => currentStudents.map((student) =>
      student.id === studentId ? {...student, status, rejectionReason: reason} : student
    ));
    setStudentToReject(null);
    setRejectionReason("");
    toast.success(status === "Verified" ? "Student approved" : "Student rejected");
  }

  return (
    <main className="h-full overflow-y-auto bg-slate-50 px-5 py-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Filter students" className="sticky top-0 z-20 mb-7 flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors sm:px-6 ${activeFilter === filter ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
            >
              {filter}
            </button>
          ))}
        </nav>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
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
                  <tr key={student.id} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/70"} align-top`}>
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
                    <td className="px-5 py-5 text-slate-700">{student.submittedAt}</td>
                    <td className="px-5 py-5">
                      <StatusBadge status={student.status} />
                      {student.status === "Rejected" && student.rejectionReason ? <p className="mt-2 max-w-48 text-xs text-slate-500">{student.rejectionReason}</p> : null}
                    </td>
                    <td className="px-5 py-5">
                      {student.status === "Pending" ? (
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => updateStudentStatus(student.id, "Verified")} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">Approve</button>
                          <button type="button" onClick={() => {setStudentToReject(student); setRejectionReason("");}} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50">Reject</button>
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

      {studentToReject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => {if(event.target === event.currentTarget) setStudentToReject(null);}}>
          <form className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onSubmit={(event) => {event.preventDefault(); updateStudentStatus(studentToReject.id, "Rejected", rejectionReason.trim());}}>
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
