const mongoose = require('mongoose');

const eventRegisterSchema = new mongoose.Schema({
    date: String,
    approved: { type: Boolean, default: false },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    }
})

module.exports = mongoose.model('EventRegister', eventRegisterSchema)