const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    blitzId: {
        type: String,
    },
    college: {
        type: Boolean,
        default: false
    },
    otp: Number,
    otpExpires: Date,
})

const User = mongoose.model('User', userSchema)
module.exports = User
