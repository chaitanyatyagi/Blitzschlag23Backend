const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    blitzId: {
        type: String,
    },
    registeredEvents: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Events'
        }
    ],
    pronites: {
        type: Boolean,
        default: false
    },
    otp: Number,
    otpExpires: Date,
})

const User = mongoose.model('User', userSchema)
module.exports = User
