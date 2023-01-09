const mongoose = require("mongoose")

const registrationSchema = new mongoose.Schema({
    userId: String,
    teamName: String,
    members: Number,
    phone: String,
    InstituteId: String,
    teamLeader: {
        type: Boolean,
        default: false
    },
    eventName: {
        name: String,
        register: {
            type: Boolean,
            default: false,
        },
        transaction: String,
        college: {
            type: Boolean,
            default: false,
        },
        verifiedPayment: {
            type: Boolean,
            default: false
        }
    },
    Envision: {
        day: String,
        transaction: String,
        verifiedPayment: {
            type: Boolean,
            default: false
        }
    },
    Optica: {
        day: String,
        transaction: String,
        verifiedPayment: {
            type: Boolean,
            default: false
        }
    },
    Mirage: {
        transaction: String,
        verifiedPayment: {
            type: Boolean,
            default: false
        }
    }
})

const Registration = mongoose.model('Registration', registrationSchema)
module.exports = Registration 
