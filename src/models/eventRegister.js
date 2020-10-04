const mongoose = require('mongoose');

const eventRegisterSchema = new mongoose.Schema({
    date: String,
    approved: Boolean,
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