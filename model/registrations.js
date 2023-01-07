const mongoose = require("mongoose")

const registrationSchema = new mongoose.Schema({
    eventName: String,
    userId: String,
    teamName: String,
    members: Number,
    registrationTime: Date,
    payment: {
        paid: {
            type: Boolean,
            default: false,
        },
        transaction: String,
        timeStamp: Date,
    }
})

const Registration = mongoose.model('Registration', registrationSchema)
module.exports = Registration 
