const express = require("express")
const router = express.Router()
const pdfController = require("../controller/pdfController")



router.route("/pdf/:eventname").get(pdfController.rulebook)

module.exports = router