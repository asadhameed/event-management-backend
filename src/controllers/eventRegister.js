const { check, validationResult } = require('express-validator');
const Event = require('../models/event')
const User = require('../models/User')
const EventRegister=require('../models/eventRegister');
const { get } = require('mongoose');
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
            user:user_id,
            event:eventId,
            date
        })

        eventRegister = await eventRegister.save();
        res.send(eventRegister)
    },

    async get(req, res){
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
        const event= await EventRegister.find().populate('event').populate('user'); 

         console.log(event)
         res.send(event)
    }
}