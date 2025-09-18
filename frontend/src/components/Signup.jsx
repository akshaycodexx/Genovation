import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const Navigate=useNavigate();
    const [fromdata,setFormdata]=useState({
        username:"",
        email:"",
        password:""
    });
    
    const handlechange=(e)=>{
        const {name,value}=e.target;
        setFormdata(prev=>({
            ...prev,[name]:value
        }))
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const data=new FormData();
            data.append("username",fromdata.username);
            data.append("email",fromdata.email);
            data.append("password",fromdata.password);
            await axios.post("http://localhost:5000/api/auth/register",data,{
                withCredentials:true,
                headers: {'Content-Type': 'multipart/form-data'}
            });
            alert("Registration Successful!!");
            toast.success("Registration Successful!!");
            setFormdata({
                username:"",
                email:"",
                password:""
            });
            Navigate("/login");
        } catch (error) {
            toast.error("Registration Failed!!");
            console.log("Registration Failed",error);
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input className="w-full px-3 py-2 border rounded" type="text" id="username" name="username" value={fromdata.username} onChange={handlechange} placeholder="Enter your username" />
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input className="w-full px-3 py-2 border rounded" type="email" id="email" placeholder="Enter your email" name="email"  value={fromdata.email} onChange={handlechange} />
            </div>
            <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input className="w-full px-3 py-2 border rounded" type="password" id="password" placeholder="Enter your password" name="password" value={fromdata.password} onChange={handlechange} />
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default Signup
