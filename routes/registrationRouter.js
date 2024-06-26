const express = require("express")
const router = express.Router()
const Registration = require('../model/registrations');
const User = require("../model/userModel")
const eventController = require("../controller/eventController")

router.route("/getList").get(eventController.fetchList);

router.post('/registration', async (req, res) => {
    const users = await User.find({ _id: req.body.userId });
    const eventName = req.body.eventName
    const package = req.body.packageName

    if (users.length != 1) {
        return res.json({ status: "error", message: "User not found in records" })
    }
    // Already registered left !
    const events = await Registration.find({
        userId: req.body.userId, "eventName.name": eventName, "eventName.register": true
    })
    console.log(events)
    if (events.length >= 1) {
        return res.json({
            status: "error",
            message: "You have already registered !"
        })
    }
    console.log(req.body.InstituteId,)
    try {
        if (package === "Envision") {
            await (new Registration({
                userId: req.body.userId, teamName: req.body.teamName, members: req.body.members, InstituteId: req.body.InstituteId,
                eventName: {
                    name: req.body.eventName,
                    register: req.body.register,
                    transaction: req.body.utrId,
                    college: req.body.college
                },
                phone: req.body.phone,
                teamLeader: req.body.teamLeader,
                Envision: {
                    transaction: req.body.utrId,
                    day: req.body.day,
                    register: true
                }

            })).save()
        }
        else if (package === "Optica") {
            await (new Registration({
                userId: req.body.userId, teamName: req.body.teamName, members: req.body.members, InstituteId: req.body.InstituteId,
                eventName: {
                    name: req.body.eventName,
                    register: req.body.register,
                    transaction: req.body.utrId,
                    college: req.body.college
                },
                phone: req.body.phone,
                teamLeader: req.body.teamLeader,
                Optica: {
                    transaction: req.body.utrId,
                    day: req.body.day,
                    register: true
                }

            })).save()
        }
        else if (package === "Mirage") {
            await (new Registration({
                userId: req.body.userId, teamName: req.body.teamName, members: req.body.members, InstituteId: req.body.InstituteId,
                eventName: {
                    name: req.body.eventName,
                    register: req.body.register,
                    transaction: req.body.utrId,
                    college: req.body.college
                },
                phone: req.body.phone,
                teamLeader: req.body.teamLeader,
                Mirage: {
                    transaction: req.body.utrId,
                    register: true
                }

            })).save()
        }
        else {
            await (new Registration({
                userId: req.body.userId, teamName: req.body.teamName, members: req.body.members, InstituteId: req.body.InstituteId,
                eventName: {
                    name: req.body.eventName,
                    register: req.body.register,
                    transaction: req.body.utrId,
                    college: req.body.college
                },
                phone: req.body.phone,
                teamLeader: req.body.teamLeader,
            })).save()
        }

        return res.json({ status: "success" });
    }
    catch (err) {
        return res.json({ status: "error", message: "Error in registration . Please try again after some time" })
    }
})


module.exports = router