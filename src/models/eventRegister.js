const mongoose = require('mongoose');

const eventRegisterSchema = new mongoose.Schema({
    date: String,
    approved: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }
})

module.exports = mongoose.model('EventRegister', eventRegisterSchema)