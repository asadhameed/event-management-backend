const mongoose = require('mongoose');

const eventRegisterSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    approved: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userCreateEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }
})

module.exports = mongoose.model('EventRegister', eventRegisterSchema)