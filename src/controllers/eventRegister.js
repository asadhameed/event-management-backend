const { check, validationResult } = require('express-validator');
const Event = require('../models/event')
const User = require('../models/User')
const EventRegister=require('../models/eventRegister');
module.exports = {
    async create(req, res) {
        await check('eventDate')
            .trim()
            .isDate()
            .withMessage('Must be a valid date').run(req);
        const errors= validationResult(req);
        if(!errors.isEmpty()) return res.status(400).send(errors)
        const eventId = req.params.id;
        const user_id = req.headers.user_id;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event is not found')
        const user = await User.findById(user_id);
        if (!user) return res.status(404).send('User is not register')
        const date = req.body.eventDate;
        let eventRegister = new EventRegister({
            User:user_id,
            Event:eventId,
            date
        })

        eventRegister = await eventRegister.save();
        res.send(eventRegister)
    }
}