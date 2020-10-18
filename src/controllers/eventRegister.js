const Event = require('../models/event')
const User = require('../models/User')
const EventRegister = require('../models/eventRegister');


module.exports = {
    async create(req, res) {
        const eventId = req.params.id;
        const user_id = req.user._id;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event is not found')
        const user = await User.findById(user_id);
        if (!user) return res.status(404).send('User is not register')

        let eventRegister = new EventRegister({
            user: user_id,
            owner: event.user,
            event: eventId
        })

        eventRegister = await eventRegister.save();
        await eventRegister.populate('event').populate('user', 'firstName lastName email').execPopulate();
        const ownerOfEvent = req.connectUsers[eventRegister.event.user];

        if (ownerOfEvent) {
            req.io.to(ownerOfEvent).emit('eventRegistration_request', eventRegister)
        }
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
        const path = req.route.path;
        const status = path.includes('approved') ? true : false;

        const id = req.params.id;
        let event = await EventRegister.findById(id);
        if (!event) return res.status(404).send('Record is not found')

        event.approved = status;
        event = await event.save();
        res.send(event)
    },

    async getAllEventsRegister(req, res) {
        const user_id = req.user._id;
        const eventRegister = await EventRegister.find({ owner: user_id })
            .populate('event', 'title date eventType price -_id')
            .populate('user', 'firstName lastName email ')
        res.send(eventRegister)
    }, 
    async getAllSubscribedEvents(req, res){
        const user_id = req.user._id;
        const eventRegister = await EventRegister.find({ user: user_id })
            .populate('event', 'title date eventType price')
            .populate('user', 'firstName lastName email ')
        res.send(eventRegister)
    }
}