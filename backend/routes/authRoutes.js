const authController = require("../controllers/userController");
const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/Auth");

router.post("/register", authController.Signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/profile", AuthMiddleware, authController.profile);

module.exports = router;