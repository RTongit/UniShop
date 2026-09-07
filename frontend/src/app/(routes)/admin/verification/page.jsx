"use client";
import { useAuthStore } from "@/app/store/authStore";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {  X } from "lucide-react";
import Spinner from "@/app/components/Spinner";

// const verificationRequests = [
//   {
//     id: "ver_001",
//     name: "Rohan Tamuli",
//     email: "rohan@gmail.com",
//     studentId: "23CSE104",
//     submittedAt: "Sep 7, 2026",
//     status: "verified",
//   },
//   {
//     id: "ver_002",
//     name: "Nayan Das",
//     email: "nayan@gmail.com",
//     studentId: "23CSE117",
//     submittedAt: "Sep 7, 2026",
//     status: "pending",
//   },
//   {
//     id: "ver_003",
//     name: "Ankit Sharma",
//     email: "ankit@gmail.com",
//     studentId: "23CSE121",
//     submittedAt: "Sep 6, 2026",
//     status: "pending",
//   },
//   {
//     id: "ver_004",
//     name: "Priya Sharma",
//     email: "priya@gmail.com",
//     studentId: "23CSE132",
//     submittedAt: "Sep 6, 2026",
//     status: "pending",
//   },
//   {
//     id: "ver_005",
//     name: "Arjun Das",
//     email: "arjun@gmail.com",
//     studentId: "23CSE145",
//     submittedAt: "Sep 5, 2026",
//     status: "pending",
//   },
// ];

const AdminVerificationPage = () => {
  const { authUser } = useAuthStore();
  const router = useRouter();
  const [reject, setReject] = useState(false);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loadingVerificationRequests, setloadingVerificationRequests] = useState(true);

  useEffect(() => {
    if (!authUser) {
      router.replace("/login");
      return;
    }
    if (authUser.role !== "admin") router.replace("/");

    // call to backend 
    if(loadingVerificationRequests == true) {
        async function fetchData() {
            try {
                
            }

            catch(error) {

            }

            finally {
                setloadingVerificationRequests(false)
            }
        }
        fetchData()
    }
  }, [authUser, router,loadingVerificationRequests]);

  if (!authUser) return null;
  if (loadingVerificationRequests) return <Spinner/>

  return (
    <div className="flex flex-col relative h-full overflow-y-scroll">
      <div className="grid px-4 py-2 bg-gray-300 grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_1.5fr]">
        <div> Name</div>
        <div>Email</div>
        <div> Enrollment No</div>
        <div>Submitted At </div>
        <div> Status</div>
        <div> Action</div>
      </div>

      {verificationRequests.map((request, i) => (
        <div
          key={i}
          className="px-4 py-2 grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_1.5fr]"
        >
          <div>{request.name}</div>
          <div> {request.email}</div>
          <div> {request.studentId}</div>
          <div> {request.submittedAt}</div>
          <div> {request.status}</div>
          {request.status == "pending" ? (
            <div className="flex gap-x-4">
              <button className="text-start">Approve</button>
              <button
                className="text-start"
                onClick={() => {
                  setReject(true);
                }}
              >
                Reject
              </button>
            </div>
          ) : (
            <div>-----</div>
          )}
        </div>
      ))}

      {/* Reject form */}
      {reject == true ? (
        <div className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black/20 z-50 ">
          <form className="absolute top-60 right-130 w-[450px] h-[300px] flex flex-col gap-y-4 border p-3 bg-white">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Rejection Reason</h1>
              <button
                type="button"
                onClick={() => {
                  setReject(false);
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p>Please provide a reason for rejection.</p>
            <textarea
              name=""
              id=""
              placeholder="Enter rejection reason... "
              className="border p-2 min-h-20"
            ></textarea>
            <div className="flex justify-end">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setReject(false);
                  }}
                >
                  Cancel
                </button>
                <button>Submit</button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default AdminVerificationPage;
