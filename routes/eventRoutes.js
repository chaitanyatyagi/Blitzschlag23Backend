const express = require("express")
const router = express.Router()
const eventController = require("../controller/eventController")

router.route("/getUser").get(eventController.userList)
router.route("/getUserCollegeFalse").get(eventController.collegeList)
router.route("/getRegisteredStudents").get(eventController.allEventsList)

module.exports = router
