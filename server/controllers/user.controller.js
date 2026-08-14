const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

exports.googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        if (!email) {
            res.status(400).json({
                message: "Email is required"
            })
        }
        const user = await User.findOne({ emial });
        if (!user) {
            user = await User.create({
                name,
                email,
                avatar
            })
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            samesite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user, {
            message: "user loggedIn successfully"
        })



    }
    catch (err) {
        return res.status(500).json({
            message: `google auth error ${err}`
        })
    }
}

exports.logout = async (req, res) => {
    try {
        return res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            samesite: "strict",
        })
    }
    catch (err) {
        return res.status(500).json({
            message: `user logout error ${err}`
        })
    }
}