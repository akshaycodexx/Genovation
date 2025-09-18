const authController=require("../controllers/userController");
const express=require("express");
const router=express.Router();
const AuthMiddleware=require("../middlewares/Auth");
const multer = require("multer");
const upload = multer();

router.post("/register",upload.none(),authController.Signup);
router.post("/login",upload.none(),authController.login);
router.get("/me",AuthMiddleware,authController.profile);
router.post("/logout",AuthMiddleware,authController.logout);

module.exports=router;