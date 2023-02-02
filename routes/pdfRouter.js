const express = require("express")
const router = express.Router()
const pdfController = require("../controller/pdfController")



router.route("/pdf/:eventname").get(pdfController.rulebook)

router.route("/create-registeration-slip/:file").post(pdfController.registrationSlip)

router.route("/download-registeration-slip/:file").get(pdfController.downloadRegistrationSlip)

module.exports = router