const { check, validationResult } = require('express-validator');

const Event = require('../models/event')
const User = require('../models/User')
const EventRegister = require('../models/eventRegister');

module.exports = {
    async create(req, res) {
        await check('eventDate')
        //     .trim()
        //     .isDate()
        //     .withMessage('Must be a valid date').run(req);
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) return res.status(400).send(errors)
        const eventId = req.params.id;
        const user_id = req.user._id;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event is not found')
        const user = await User.findById(user_id);
        if (!user) return res.status(404).send('User is not register')
    
        let eventRegister = new EventRegister({
            user: user_id,
            event: eventId
        })

        eventRegister = await eventRegister.save();
        res.send(eventRegister)
    },

    async getEventRegister(req, res) {
        const id = req.params.id;
        /*******************************************
         * EventRegister (ref, 'Event' , ref 'User')
         * The following  comment cod will be work if the EventRegister have ref of event and user then it
         * will be working and get user information as well
         * // const event= await EventRegister.find().populate('event').populate('user'); 
         * 
         * EventRegister (ref 'Event' ) Event (ref 'user')
         *  IF EventRegister has ref of event and event have user ref then the Upper code will not working
         * then need the fellowing code
         *          const event = await EventRegister.find().populate({
                       path:'event',
                       model:'Event',
                       populate:{
                       path:'user',
                       model:'User'
                       }
                   })
         * 
         * 
         *******************************************/
        const event = await EventRegister.findById(id).populate('event', 'title').populate('user', 'firstName lastName email');
        if (!event) return res.status(404).send('Record is not found')
        res.send(event)
    },
    async approval(req, res) {
        // await check('approved').isBoolean()
        //     .custom((value) => {
        //         if (!value) throw new Error("Bad parameter")
        //         return true;
        //     }).run(req);
        await check('approved').isBoolean().withMessage('Wrong approved status').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors)

        const id = req.params.id;
        let event = await EventRegister.findById(id);
        if (!event) return res.status(404).send('Record is not found')

        event.approved = req.body.approved;
        event = await event.save();
        res.send(event)
    },
    // async rejected(req, res) {
    //     await check('approved').isBoolean()
    //         .custom((value) => {
    //             if (value) throw new Error("Bad parameter")
    //             return true;
    //         }).run(req);
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) return res.status(400).send(errors)

    //     const id = req.params.id;
    //     let event = await EventRegister.findById(id);
    //     if (!event) return res.status(404).send('Record is not found')

    //     event.approved = req.body.approved;
    //     event = await event.save();
    //     res.send(event)
    // }
}