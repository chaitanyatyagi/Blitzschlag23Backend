const express = require("express")
const router = express.Router()
const Registration = require('../model/registrations');
const User = require("../model/userModel")

router.post('/registration', async (req, res) => {
    const users = await User.find({ _id: req.body.userId });
    const eventName = req.body.eventName

    if (users.length != 1) {
        return res.json({ status: "error", message: "User not found in records" })
    }
    console.log(req.body.userId)
    const events = await Registration.find({ userId: req.body.userId, eventName })
    if (events.length >= 1) {
        return res.json({
            status: "error",
            message: "You have already registered !"
        })
    }

    try {
        await (new Registration({
            userId: req.body.userId, eventName: req.body.eventName, teamName: req.body.teamName, members: req.body.members, registrationTime: Date.now(), payment: {
                transaction: req.body.utrId, paid: req.body.college
            },
            phone: req.body.phone,
            teamLeader: req.body.teamLeader
        })).save()
        return res.json({ status: "success" });
    }
    catch (err) {
        console.log(err);
        return res.json({ status: "error", message: "Error in registration . Please try again after some time" })
    }
})

module.exports = router