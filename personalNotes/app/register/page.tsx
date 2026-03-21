"use client"
import { useState } from "react";
import { registerUser } from "@/lib/api";
import { RegisterPayload } from "../types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterPage=()=>{
    const [user,setUser]=useState<RegisterPayload>({
        name: "",
        email:"",
        password:"",
        userid:""
    })
    const [error,setError]=useState<string>("")
    const [loading, setLoading]=useState<boolean>(false)
    const [success,setSuccess]=useState<boolean>(false)
    const router=useRouter()

    const handleRegister=async()=>{
        setLoading(true);

        try{
            const res=await registerUser(user);
            if(res.ok){
                setSuccess(true)
                console.log("Successfully registered: ",res)
            }
            router.replace("/dashbord")
        }catch(error:any){
            
            setError(error.message|| "something went wrong")
        }finally{
            setLoading(false);
        }
    }

    return(

            <div className="flex flex-col md:flex-row min-h-screen">

            {/* LEFT SIDE */}
                <div className="hidden md:flex md:w-1/2  bg-black  text-white p-8 flex-col items-center justify-center">
                
                    <h2 className="text-4xl lg:text-6xl font-bold text-center">Welcome</h2>
                
                </div>

            {/* RIGHT SIDE */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8">

                <div className="w-full max-w-sm flex flex-col justify-center items-center">

                    <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>

                {error && (<p className="text-red-500 text-2xl font-bold mb-3 ">{error}</p>)}
                {success && (<p className="text-green-500 text-2xl font-bold mb-3 ">{success}</p>)}

                <input
                type="text"
                value={user.name}
                placeholder="Full Name"
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                type="text"
                value={user.userid}
                placeholder="User ID"
                onChange={(e) => setUser({ ...user, userid: e.target.value })}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                type="email"
                value={user.email}
                placeholder="Email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                type="password"
                value={user.password}
                placeholder="Password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />

                <button
                disabled={loading}
                onClick={handleRegister}
                className="w-full bg-black text-white py-3 mb-4 rounded-lg font-semibold hover:bg-gray-500 transition disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Register"}
                </button>
                     <p className="mt-4 text-sm">Already have an account? <Link href="/login">Login Now!</Link></p>
            </div>
        </div>

    </div>
    )
}

export default RegisterPage