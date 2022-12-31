const Events = require("../model/userModel")
const User = require("../model/userModel")

exports.eventDetails = async (req, res, next) => {
    const newEvent = await Events.create({
        price: req.body.price,
        eventName: req.body.eventName
    })
    return res.status(200).json({
        status: "success",
        newEvent
    })
}

exports.eventRegisteration = async (req, res, next) => {
    const event = await Events.find({ eventName: req.body.eventName })
    const updatedUser = await User.updateOne({
        _id: req.user._id
    },
        {
            $push: { registeredEvents: event._id },
            $set: { pronites: true }
        },
        {
            new: true,
            runValidators: true,
        })

    res.download("uploads/Resume.pdf")
    return res.status(200).json({
        status: "success",
        updatedUser
    })
}

// exports.proniteRegistration