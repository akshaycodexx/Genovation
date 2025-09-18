const Todo=require("../models/todo");
require("dotenv").config();

// Create a new todo
exports.createtodo=async(req,res)=>{
    try {
        const {text}=req.body;
        const userId=req.user._id;
        const newtodo=new Todo({
            text,
            user:userId
        });
        await newtodo.save();
        res.status(200).json({message:"Todo created successfully",todo:newtodo});
        console.log("Todo created successfully");
        
    } catch (error) {
        res.status(500).json({message:"Failed to create todo",error});
        console.log("Failed to create todo",error);
    }
}
// Get all todos for a user
exports.getalltodos=async(req,res)=>{
    try {
        const userId=req.user._id;
        const todos=await Todo.find({user:userId});
        res.status(200).json({message:"Todos fetched successfully",todos});
        console.log("Todos fetched successfully");
        
    } catch (error) {
        res.status(500).json({message:"Failed to fetch todos",error});
        console.log("Failed to fetch todos",error);
    }
}
// Delete a todo by ID
exports.deletetodo=async(req,res)=>{
    try {
        const todoID=req.params.id;
        const userId=req.user._id;
        const todo=await Todo.findOneAndDelete({ _id:todoID,user:userId});
        if(!todo){
            return res.status(404).json({message:"Todo not found"});
        }
        res.status(200).json({message:"Todo deleted successfully",todo});
        console.log("Todo deleted successfully");
        
    } catch (error) {
        res.status(500).json({message:"Failed to delete todo",error});
        console.log("Failed to delete todo",error);
        
    }
}

//update the existing todo
exports.updatetodo=async(req,res)=>{
    try {
        const todoId= req.params.id;
        const userId= req.user._id;
        const {text}=req.body;
        const todo=await Todo.findByIdAndUpdate({_id:todoId,user:userId},{text},{new:true});
        if(!todo){
            return res.status(404).json({message:"Todo not found"});
        }
        res.status(200).json({message:"Todo updated successfully",todo});
        console.log("Todo updated successfully");
        
    } catch (error) {
        res.status(500).json({message:"Failed to update todo",error});
        console.log("Failed to update todo",error);
    }
}