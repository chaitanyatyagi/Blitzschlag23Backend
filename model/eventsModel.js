const mongoose = require("mongoose")

const eventsSchema = new mongoose.Schema({
    price: Number,
    eventName: String
})

const Events = mongoose.model('Events', eventsSchema)
module.exports = Events
