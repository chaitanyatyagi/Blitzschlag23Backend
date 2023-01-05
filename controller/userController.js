const User = require("../model/userModel")

exports.getUser = async (req, res, next) => {
    const user = await User.find({ _id: req.user._id })
    return res.status(200).json({
        status: "success",
        user
    })
}