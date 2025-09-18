const express= require("express");
const User= require("../models/user");
const jwt=require("jsonwebtoken");


const AuthMiddleware=async(req,res,next)=>{
    try {
        const token= req.cookies?.token || req.headers.authrozation?.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.user=user;
        next();
        
    } catch (error) {
        res.status(401).json({message:"Unauthorized",error});
    }
}
module.exports=AuthMiddleware;