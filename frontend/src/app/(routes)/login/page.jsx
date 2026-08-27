"use client";

import RightSectionUI from "@/app/components/RightSectionUI";
import { useAuthStore } from "@/app/store/authStore";
import { Eye, EyeClosed, IdCard, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, authUser,isLogging} = useAuthStore();
  const router = useRouter();

  const [enrollmentId,setEnrollmentId] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent,setStudent] = useState(true)

  useEffect(() => {
    if (authUser) router.replace("/");
  }, [router, authUser]);

  function handleSubmit(e) {
    e.preventDefault();
    // For student
    if(isStudent) {
       if (!enrollmentId || enrollmentId.trim() === "") {
         toast.error("Please enter an enrollmentId");
         return;
       }
    }
    // For admin 
    else {
        if(!email || email.trim() === "") {
            toast.error("Please enter email")
            return;
        }
    }
    if(!password || password.trim()==="") {
        toast.error("Please enter password")
        return
    }

    login(
        { 
            enrollmentId: enrollmentId.trim(), 
            password: password.trim(),
            email : email.trim()
        }
    );

  }
  if (authUser) return null;
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

        {/* Left section */}
        <div className="flex flex-col  items-center p-6 sm:p-12 bg-gray-100 h-screen">
          <div className="w-full max-w-md space-y-10">

            {/*Heading */}
            <div className="flex flex-col items-center gap-2 group">
              {/* Title */}
              <h1 className="text-2xl font-bold mt-2">Welcome Back ! </h1>

              <p className="text-center text-gray-600">
                  Dont have an account ?{" "}
                  <Link href="/signup" className="text-black font-medium hover:underline">
                    Create Account
                  </Link>
              </p>

              <div className="text-center justify-center flex gap-x-3">
                <span className="text-gray-500">Login as</span>
                {isStudent ? 
                   (
                    <button 
                        className="text-black font-medium hover:underline hover:cursor-pointer"
                        onClick={()=>{setStudent((prev)=>!prev)}}
                        >
                          Admin
                    </button>
                   )
                   : 
                   (
                    <button 
                        className="text-black font-medium hover:underline hover:cursor-pointer"
                        onClick={()=>{setStudent((prev)=>!prev)}}
                        >
                          Student
                    </button>
                   )
                
                }

              </div>
            </div>

            {(isStudent==true) ? 

            /*Student Form */
            (<form className="space-y-6">

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
                    {!showPassword ? <Eye className="size-5" /> : <EyeClosed />}
                  </button>
                </div>
              </div>
            </form>
            ) : 
            ( 
              // Admin Form 
              <form className="space-y-6">

              {/* email */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="size-5 text-gray-400" />
                  </div>

                  <input
                    type="text"
                    placeholder="CBI12134"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    {!showPassword ? <Eye className="size-5" /> : <EyeClosed />}
                  </button>
                </div>
              </div>
            </form>
            )}

            <button 
                onClick={(e)=>{handleSubmit(e)}}
                className="w-full text-white flex justify-center bg-black px-4 py-2 font-medium hover:bg-gray-700 transition-colors"
            >
                {isLogging ? <Loader2 className="text-center animate-spin"/> : "Login"}
            </button>

          </div>

        </div>

        {/* Right section */}
        <div className="md:block hidden w-full">
            <RightSectionUI/>
        </div>
       


    </div>
  );
}
