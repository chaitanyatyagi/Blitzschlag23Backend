const express = require("express")
const router = express.Router()
const eventController = require("../controller/eventController")

router.route("/getUser").get(eventController.userList)

module.exports = router
