const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")
const userController = require("../controller/userController")
router.route('/register').post(authController.register)
router.route('/login').post(authController.login)
router.route('/logout').get(authController.protect, authController.logout)
router.route('/forgotpassword').post(authController.forgotPassword)
router.route('/resetpassword').post(authController.resetPassword)
router.route('/verifyOtp').post(authController.emailVerification)
router.route('/getuser').post(authController.protect, userController.getUser)
router.route('/otp-handling').get(authController.OtpHandling)


module.exports = router