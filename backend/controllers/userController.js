const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const Signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({ message: "User already exists" });
        }

        const salting = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salting);

        const newuser = new User({
            username,
            email,
            password: hashedpassword
        })
        await newuser.save();

        const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User Register Succeffully!!",
            user: {
                id: newuser._id,
                username: newuser.username,
                email: newuser.email
            }
        });
        console.log("User Register Successfully!!");
    } catch (error) {
        console.log("user faile to signup - may be your controller someissue", error);
        res.status(500).json({ message: "Signup failed", error });
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const match = bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "password not matched" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "User login Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
        console.log("User login Successfully!!");
    } catch (error) {
        console.log("User Login Failed!!");
        res.status(500).json({ message: "User login failed", error });
    }
}
const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
        });
        res.status(200).json({ message: "logout Successfull!!" });
        console.log("logout Successfull");

    } catch (error) {
        res.status(500).json({ error: "Logout failed", error });
        console.log("logout failed", error)
    }
}

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not Found!!" });
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ error: "Error fetching profile", error });
        console.log("Error fetching profile", error);
    }
}
module.exports = { Signup, login, profile, logout };