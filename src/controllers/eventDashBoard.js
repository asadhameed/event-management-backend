const Event = require('../models/event');
module.exports={
    async getEventById(req, res) {
        const id = req.params.id;
        const event = await Event.findById(id)
        if (!event) return res.status(404).send('not found')
        res.send(event)
    },
    async getAllEvents(req, res) {
       const query = req.params
        const events = await Event.find(query);
        res.send(events)
    },

    async getEventsByUserID(req, res){
        const user_id = req.headers.user_id;
        const query = {user:user_id}
        const events = await Event.find(query);
        res.send(events)
    }
}