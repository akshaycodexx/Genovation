const mongoose=require("mongoose");

const PromptSchema=new mongoose.Schema({
    chat:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})
module.exports=mongoose.model("prompt",PromptSchema);