"use client"
import { loginUser,registerUser } from "@/lib/api";
import LoginPage from "./login/page";
import RegisterPage from "./register/page";

export default function Home() {
  const handleTestLogin= async ()=>{
    try{
      const res= await loginUser({
        key:"reddy@email.com",
        password:"reddy123",
      })
      console.log("Success: ",res)
    }catch(err){
      
      console.log("Error: ",err)
    }
  }
  const handleTestRegister =async()=>{
    try{
      const res= await registerUser({
        name:"Reddy",
        email: "reddy@email.com",
        userid:"reddy",
        password:"reddy123"
      })
      console.log("success: ",res)
    }catch(error){
      console.log("error: ",error)
    }
  }
  return (
    <div>
      {/* <div>
        <h1>API TEST</h1>
        <button onClick={handleTestLogin}>Test Login API</button>
      </div> */}
      {/* <LoginPage/> */}
      <RegisterPage/>
      {/* <div>
        <h1>Register API</h1>
        <button onClick={handleTestRegister}>Test Register API</button>
      </div> */}
    </div>
    
  );
}
