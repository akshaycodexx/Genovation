import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function Login() {
   const Navigate=useNavigate();
    const [formdata,setFormdata]=useState({
        email:"",
        password:""
    })
    const handleChange=(e)=>{
        const{name,value}=e.target;
        setFormdata(prev=>({
            ...prev,[name]:value
        }))
    }
const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
        const data=new FormData();
        data.append("email",formdata.email);
        data.append("password",formdata.password);
        await axios.post("http://localhost:5000/api/auth/login",data,{
            withCredentials:true,
            headers: {'Content-Type': 'multipart/form-data'}
        });
        alert("Login Successful!!");
        toast.success("Login Successful!!");
        
        setFormdata({
            email:"",
            password:""
        });
        Navigate("/chat")
        
    } catch (error) {
        console.log("Login Failed",error);
        alert("Login Failed!!");
        toast.error("Login Failed!!");
        
    }
}




  return (
  
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" name='email' value={formdata.email} onChange={handleChange} placeholder="Enter your email" />
            </div>
            <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" name='password' value={formdata.password} onChange={handleChange} placeholder="Enter your password" />
            </div>
            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
