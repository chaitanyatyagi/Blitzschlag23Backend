const User = require("../model/userModel")

exports.getUser = async (req, res, next) => {
    const user = await User.findById(req.user._id)
    var allowedDomains = ["http://localhost:3000","https://blitzschlag.co.in"];
    var origin = req.headers.origin;
    if(allowedDomains.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.set('Access-Control-Allow-Credentials', 'true')
    return res.json(user)
}