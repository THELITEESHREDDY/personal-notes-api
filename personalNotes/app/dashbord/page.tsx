"use client"
import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const Dashbord=()=> {
    const router = useRouter()
    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(!token){
            router.replace("/login")
        }
    },[])
  return (
    <div>
      <h1>Dashbord</h1>
    </div>
  )
}

export default Dashbord
