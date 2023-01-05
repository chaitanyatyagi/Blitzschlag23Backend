const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")
const userController = require("../controller/userController")

router.route('/register').post(authController.register)
router.route('/login').post(authController.login)
router.route('/logout').get(authController.protect, authController.logout)
router.route('/forgotpassword').post(authController.forgotPassword)
router.route('/resetpassword').post(authController.resetPassword)
router.route('/getuser').get(authController.protect, userController.getUser)

module.exports = router