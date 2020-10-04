const Event = require('../models/event');
module.exports={
    async getEventById(req, res) {
        const id = req.params.id;
       // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid event id")
        const event = await Event.findById(id)
        if (!event) return res.status(404).send('not found')
        res.send(event)
    },
    async getAllEvents(req, res) {
       
       // const {eventType} = req.params;
       // const query = eventType ? { eventType } : {}
       const query = req.params
        const events = await Event.find(query);
        res.send(events)
    },

    async getEventsByUserID(req, res){
        const user_id = req.headers.user_id;
        console.log('=======================>' ,user_id)
        const query = {user:user_id}
        console.log('---------------------->',query)
        const events = await Event.find(query);
        console.log('---------------------->',events)
        res.send(events)
    }
}