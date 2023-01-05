
exports.rulebook = async (req, res, next) => {
    return res.status(200).download(`../pdfs/rulebook/${req.params.eventname}`)
}