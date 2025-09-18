const TodoController=require("../controllers/TodoControllers");
const express=require("express");
const router=express.Router();
const AuthMiddleware=require("../middlewares/Auth");

router.post("/",AuthMiddleware,TodoController.createtodo);
router.get("/",AuthMiddleware,TodoController.getalltodos);
router.put("/:id",AuthMiddleware,TodoController.updatetodo);
router.delete("/:id",AuthMiddleware,TodoController.deletetodo);

module.exports=router;