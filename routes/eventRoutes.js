const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")
const eventController = require("../controller/eventController")

router.route("/event-register").post(authController.protect, eventController.eventRegisteration);
