const User = require("../model/userModel")

exports.getUser = async (req, res, next) => {
    const user = await User.findById(req.user._id)
    // return res.status(200).json({
    //     status: "success",
    //     user
    // })
    return res.json(user)
}