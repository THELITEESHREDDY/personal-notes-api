import { stringify } from "querystring";

const BASE_URL="http://127.0.0.1:8000";


export const loginUser= async (data: {key:string, password:string})=>{
    const response=await fetch(`${BASE_URL}/login`,{
        method:"POST",
        headers:{
            "content-type":"application/json",
        },
        body:JSON.stringify(data),

    })

    const responseData= await response.json();
    if(!response.ok){
        if (typeof responseData.detail === "string") {
            throw new Error(responseData.detail)
        }

        if (Array.isArray(responseData.detail)) {
            throw new Error(responseData.detail[0].msg)
        }

        throw new Error("Something went wrong")
    }
   
    return responseData

}

export const registerUser= async(data:{name:string,email:string,userid:string,password:string})=>{
    const response = await fetch(`${BASE_URL}/register`,{
        method:"POST",
        headers:{
            "content-type":"application/json",
        },
        body:JSON.stringify(data)
    })
    const responseData= await response.json();
    if(!response.ok){
        if (typeof responseData.detail === "string") {
            throw new Error(responseData.detail)
        }

        if (Array.isArray(responseData.detail)) {
            throw new Error(responseData.detail[0].msg)
        }

        throw new Error("Something went wrong")
    }
    return responseData
}   

// export const getNotes = async () => {}
// export const createNote = async (data) => {}
// export const deleteNote = async (id) => {}