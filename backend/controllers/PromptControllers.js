const mongoose=require("mongoose");

const Prompt=require("../models/history");

//create prompt

exports.createPrompt=async(req,res)=>{
    try {
        const{chat}=req.body;
        if(!chat){
            return res.status(402).json({message:"prompt not found"})
        }
        const newPrompt=new Prompt({
            chat
        })
        await newPrompt.save();
        res.status(200).json({message:"Chat created!!"})
        
    } catch (error) {
        res.status(500).json({message:"prompt created failed"})
    }
}
