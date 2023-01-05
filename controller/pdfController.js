const path=require('path');
exports.rulebook = async (req, res, next) => {
    return res.sendFile(path.join(__dirname,`../pdfs/rulebook/${req.params.eventname}.pdf`))
}