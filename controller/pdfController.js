const path = require('path');
const htmlPDF = require("html-pdf")
const pdfTemplate = require("../documents/index")
const Registration = require("../model/registrations")

exports.rulebook = async (req, res, next) => {
    return res.sendFile(path.join(__dirname, `../pdfs/rulebook/${req.params.eventname}.pdf`))
}

exports.registrationSlip = async (req, res, next) => {
    console.log(req.body.blitzId)
    htmlPDF.create(pdfTemplate(req.body.name, req.body.blitzId, req.body.eventName), {}).toFile(path.join(__dirname, `../pdfs/registrationslips/${req.params.file}.pdf`), (error) => {
        console.log(error)
    })
    next()
}

exports.downloadRegistrationSlip = async (req, res, next) => {
    return res.sendFile(path.join(__dirname, `../pdfs/registrationslips/${req.params.file}.pdf`))
}