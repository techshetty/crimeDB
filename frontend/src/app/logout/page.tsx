"use client"
import React, { useState ,useEffect} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
const Logout=()=>{
    const router=useRouter()
    useEffect(()=>{
        const lout=async()=>{
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/logout`,{
            credentials: 'include'
        })
        toast.success("Logged out SuccessFully")
        router.push('/')
        }
        catch(error){
            toast.error("Logout Failed")
        }    
    }
        lout();
    },[])
}
export default Logout;