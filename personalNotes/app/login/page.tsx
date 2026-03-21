"use client"
import { useState} from 'react'
import { loginUser } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


const LoginPage=()=>{
    const router = useRouter()
    const [key,setEmail]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [error,setError]=useState<string>("")
    const [loading, setLoading]=useState<boolean>(false);
    
    const handleLogin=async()=>{
        setLoading(true)
        
        try{
            const res= await loginUser({key,password})    
            console.log("User Loggedin: ",res);
            localStorage.setItem("token", res.access_token)
            router.replace("/dashbord")
        }catch(err: any){
            setError("Invalid credentials")
        }finally{
            setLoading(false)
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

                    <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

                {error && (<p className="text-red-500 text-2xl font-bold mb-3 ">{error}</p>)}

                <input className="w-full border p-3 mb-4 rounded" type="text" placeholder="email / userid" value={key} onChange={(e) => setEmail(e.target.value)}/>

                <input className="w-full border p-3 mb-4 rounded" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <button className="w-full bg-black text-white p-3 rounded hover:opacity-80" onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="mt-4 text-sm">New here? <Link href="/register">Register Now!</Link></p>
            </div>
        </div>

    </div>
    )
}

export default LoginPage