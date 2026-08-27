"use client";

import RightSectionUI from "@/app/components/RightSectionUI";
import { useAuthStore } from "@/app/store/authStore";
import {
  Eye,
  EyeClosed,
  GraduationCap,
  IdCard,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const { signup, isSigningUp, authUser } = useAuthStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [graduationYear, setGraduationYear] = useState(2000);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email,setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [currPage, setCurrPage] = useState("page1");

  const values = ["page1", "page2"];
  // This is needed for dotButtons ui
  const [isActive, setIsActive] = useState([true, false]);

  const DEPARTMENTS = [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Information Technology",
    "Other",
  ];

  useEffect(() => {
    if (authUser) router.replace("/");
  }, [router, authUser]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || name.trim() === "") {
      toast.error("Please enter a name");
      return;
    }

    if (!enrollmentId || enrollmentId.trim() === "") {
      toast.error("Please enter an enrollmentId");
      return;
    }

    if (!password || password.trim() === "") {
      toast.error("Please enter password");
      return;
    }

    if (!department || department.trim() === "") {
      toast.error("Please enter a Department");
      return;
    }

    if (!graduationYear) {
      toast.error("Please enter graduation Year");
      return;
    }

    if (!phoneNumber || phoneNumber.trim() === "") {
      toast.error("Please enter a phone Number");
      return;
    }
    if(phoneNumber.length!=10) {
      toast.error("Phone number must be 10 digits long")
      return;
    }
    let data = {
      name,
      enrollmentId,
      password,
      department,
      graduationYear,
      phoneNumber,
    }
    if(email && email.trim()!="") data.email = email
    signup(data);
    
  }

  if (authUser) return null;
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left section */}
      <div>
        {currPage == "page1" ? (
          // Page 1
          <div className="flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-6">
              {/* LOGO , Heading and Form */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  {/* Icon container*/}
                  <div
                    className="size-12 rounded-xl bg-amber-400 flex items-center justify-center 
                          group-hover:bg-amber-500 transition-colors"
                  >
                    {/* Message Icon */}
                    <MessageSquare className="size-6" />
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-bold mt-2">Create Account</h1>

                  {/* Subtitle */}
                  <p className="text-gray-500/60">
                    Get started with your free account
                  </p>
                </div>
              </div>

              {/* Form */}
              <form
                className="space-y-6"
              > 
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-gray-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="size-5 text-gray-400" />
                    </div>

                    <input
                      type="text"
                      placeholder="Suraj Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 
                  pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-600/20"
                    />
                  </div>
                </div>

                {/* Enrollment id */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-gray-700">
                    Enrollment ID
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <IdCard className="size-5 text-gray-400" />
                    </div>

                    <input
                      type="text"
                      placeholder="CBI12134"
                      value={enrollmentId}
                      onChange={(e) => setEnrollmentId(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 
                  pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-600/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-gray-700">
                    Password
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="size-5 text-gray-400" />
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder=". . . . . . . . . ."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 
                  pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-600/20"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                    >
                      {!showPassword ? (
                        <Eye className="size-5" />
                      ) : (
                        <EyeClosed />
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        ) : (

          // Page 2
          <div className="flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-6"> 
              <form onSubmit={(e)=>handleSubmit(e)} className="space-y-6">

                {/* Department */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-gray-700">
                    Department
                  </label>

                  <div className="relative">
                    <select name="Department"
                     value={department}
                     onChange={(e)=>{setDepartment(e.target.value)}}
                     className="w-full rounded-lg border px-3 py-2.5 border-gray-300 focus:ring-pink-100 focus:border-pink-100 outline-none focus:ring-2 "
                    >
                      <option className="flex justify-end" value="" disabled>Select a Department</option>
                      {DEPARTMENTS.map((elem,i)=>(
                        <option key={i} value={elem}>{elem}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* graduationYear */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-gray-700">
                    Graduation Year
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <GraduationCap className="size-5 text-gray-400" />
                    </div>

                    <input
                      type="number"
                      placeholder="2027"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="w-full rounded-lg border bg-white py-2.5 pl-10 
                  pr-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors
                   border-gray-300 focus:ring-pink-100 focus:border-pink-100 outline-none focus:ring-2"
                    />
                  </div>
                </div>
                

                {/* phoneNumber */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-gray-700">
                    Phone Number
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="size-5 text-gray-400" />
                    </div>

                    <input
                      type="text"
                      placeholder="Please enter your number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-lg border bg-white py-2.5 pl-10 
                  pr-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors
                   border-gray-300 focus:ring-pink-100 focus:border-pink-100 outline-none focus:ring-2"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-gray-700">
                    Email (Optional)
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="size-5 text-gray-400" />
                    </div>

                    <input
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border bg-white py-2.5 pl-10 
                  pr-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors
                   border-gray-300 focus:ring-pink-100 focus:border-pink-100 outline-none focus:ring-2"
                    />
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Conditional section above */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 -my-9">
          <div className="w-full max-w-md space-y-5">
            <button
              type={`${currPage == "page2" ? "submit" : "button"}`}
              className="w-full inline-flex items-center justify-center rounded-sm bg-black px-4 py-2 text-sm font-medium text-white transition-colors
              hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isSigningUp}
              onClick={(e)=>{

                if(currPage=="page1") {
                  setCurrPage("page2")
                  setIsActive((prev)=>prev.map((_,i)=>i==1))
                }
                else if(currPage=="page2") handleSubmit(e);

              }}

            >
              {isSigningUp ? (
                <>
                  {" "}
                  <Loader2 className="size-5 animate-spin" /> SigningUp...
                </>
              ) : (
                (currPage=="page1") ? "Next": "Submit"
              )}
            </button>

            <div className="text-center">
              <p>
                Already have an account ?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>

            {/*Dot buttons section*/}
            <div className="flex gap-x-3 justify-center">
              {values.map((elem, i) => (
                <button
                  key={i}
                  value={elem}
                  onClick={(e) => {
                    setIsActive((prev) => prev.map((_, index) => index === i));
                    setCurrPage(e.target.value);
                  }}
                  className={`${isActive[i] == false ? "size-3 bg-gray-200 rounded-full" : "w-8 h-3 bg-black rounded-sm"}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div className="md:block hidden w-full">
          <RightSectionUI/>
      </div>

    </div>
  );
}
