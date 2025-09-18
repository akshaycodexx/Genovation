const mongoose=require("mongoose")
require("dotenv").config();



const connectDB=async()=>{
    try {
        const res=await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected Successfully!!");

        
    } catch (error) {
        console.log("Database connection failed !!",error)
    }
}

module.exports=connectDB;