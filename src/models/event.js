const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    eventType: String,
    date: { type: Date, default: Date.now },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: {
        virtuals: true
    }
})
eventSchema.virtual('thumbnail_url').get(function () {
    return 'https://sport-event-api.herokuapp.com/static/' + this.thumbnail;
})
const Event = mongoose.model('Event', eventSchema)
module.exports = Event;
