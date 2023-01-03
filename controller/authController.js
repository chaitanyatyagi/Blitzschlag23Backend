const User = require("../model/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { promisify } = require("util")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

exports.register = async (req, res, next) => {
    console.log(req.body);
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    if (!password || !name || !email) {
        return res.json({
            status: "error",
            message: "Please fill all details!"
        })
    }
    const user = await User.find({ email })
    const numberOfUsers = await User.find().count()
    if (user.length >= 1) {
        return res.json({
            status: "error",
            message: "You are already registered !"
        })
    }
    if (password.length < 8) {
        return res.json({
            status: "error",
            message: "Password should contain more than 8 characters !"
        })
    }

    let blitzID = "Blitzschlag23" + req.body.name + numberOfUsers
    blitzID = blitzID.split(" ").join("")
    const url = `${process.env.BASE_URL}users/Blitzschlag23/BlitzId`

    try {
        await sendEmail(email, `<p><b>Malaviya National Institute of Technology Jaipur welcomes you for being a part of Blitzschlag 2023.</b></p><br></br><p>This is your 
    blitzschlag 2023 ID - <b>${blitzID}</b></p>`, "Your Blitzschlag 2023 ID")

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            blitzId: blitzID
        })

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.cookie('jwt', token)
        return res.status(200).json({
            status: "success",
            token,
            newUser
        })
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const pswd = req.body.password;
    if (!pswd || !email) {
        return res.json({
            status: "error",
            message: "Please fill all details!"
        })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({
            status: "error",
            message: "Entered email is wrong !"
        })
    }
    if (pswd !== user.password) {
        return res.json({
            status: "error",
            message: "Entered password is wrong !"
        })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    res.cookie('jwt', token)
    return res.status(200).json({
        status: "success",
        token,
        user
    })
}

exports.protect = async (req, res, next) => {
    let token
    if (req.cookies.jwt) {
        token = req.cookies.jwt
    }
    if (!token) {
        return res.status(400).json({
            status: "error",
            message: "You are not logged in. Please register if you are not registered yet, else directly login."
        })
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return res.status(401).json({
            status: "error",
            message: "This user doesn't exist !"
        })
    }
    req.user = freshUser
    next()
}

exports.forgotPassword = async (req, res, next) => {
    const user = await User.find({ email: req.body.email })
    if (!user) {
        return res.status(400).json({
            status: "error",
            message: "No such user has registered yet."
        })
    }
    const resetURL = "http://localhost:3000/resetpassword";
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    const email = req.body.email
    try {
        await User.updateOne({ email: req.body.email },
            {
                $set: { otp: otp },
                otpExpires: Date.now() + 60 * 10 * 1000
            })

        await sendEmail(email, `<p>OTP - ${otp}</p><p>Reset your password at this given link - ${resetURL}</p>`, "Reset you password")
        return res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
        });
    }
    catch (err) {
        return res.status(500).json({
            status: "error",
            message: err
        })
    }
}

exports.resetPassword = async (req, res, next) => {
    const passOriginal = req.body.newpassword
    const passConfirm = req.body.confirmpassword
    const otp = req.body.otp

    const user = await User.findOne({
        otp: otp,
        otpExpires: { $gt: Date.now() }
    })
    if (passConfirm != passOriginal) {
        return res.status(200).json({
            status: "error",
            message: "Password does not matches !"
        })
    }

    if (!user) {
        return res.status(200).json({
            status: "error",
            message: "Entered otp is either wrong or expired !"
        })
    }

    const updatedUser = await User.updateOne({
        otp: otp
    },
        {
            $set: { password: passOriginal },
            otp: undefined,
            otpExpires: undefined
        })

    return res.status(200).json({
        status: "success",
        message: "Your password has been updated !",
    })
}

exports.logout = (req, res, next) => {
    res.clearCookie('jwt')
    return res.status(200).json({
        status: "success",
        message: "You are successfully logged out !"
    })
}