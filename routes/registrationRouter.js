const express = require("express")
const router = express.Router()
const Registration = require('../model/registrations');
const User = require("../model/userModel")

router.post('/registration', async (req, res) => {
    const users = await User.find({ blitzId: req.body.blitzID });
    const eventName = req.body.eventName

    if (users.length != 1) {
        return res.json({ status: "error", message: "User not found in records" })
    }
    const events = await Registration.find({ userId: req.body.blitzId, eventName })
    if (events.length > 1) {
        return res.json({
            status: "error",
            message: "You have already registered !"
        })
    }

    try {
        await (new Registration({ userId: users[0].blitzId, eventName: req.body.eventName, teamName: req.body.teamName, members: req.body.Nmembers, registrationTime: Date.now() })).save()
        return res.json({ status: "success" });
    }
    catch (err) {
        console.log(err);
        return res.json({ status: "error", message: "Error in registration . Please try again after some time" })
    }
})

// router.post('/registeration-check', async (req, res) => {
//     const events = req.body.events
//     const
// })

module.exports = router