const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                userName: name || email.split('@')[0],
                email,
                avatar: avatar || ''
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            user,
            message: "user loggedIn successfully"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `google auth error ${err.message || err}`
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `user logout error ${err.message || err}`
        });
    }
};