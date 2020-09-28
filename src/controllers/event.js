const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Event = require('../models/event');
const User = require("../models/User");
module.exports = {
    async createEven(req, res) {
        await check('title')
            .trim()
            .isLength({ min: 4, max: 30 })
            .withMessage('Title should be 4 till 30 characters').run(req);
        await check('description')
            .notEmpty()
            .withMessage('Please give the description')
            .run(req);
        await check('price')
            .isNumeric()
            .isInt({ min: 1 })
            .withMessage('Price should greater then zero').run(req);
        await check('user_id').custom(async (id) => {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new Error('User id is not valid');
            // const user = await Event.find({user:value})
            const user = await User.findById(id)
            if (!user)
                throw new Error('User is not exist')
            return true;
        }).run(req)
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors);
        const { title, description, price } = req.body;
        const user = req.headers.user_id;
        const thumbnail=req.file.filename;
        let event = new Event({
            title,
            description,
            price,
            user,
            thumbnail
        })
        event = await event.save();
        res.send(event)
    },
   async getEventById(req, res){
       const id =req.params.id;
       if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid event id")
        const event = await Event.findById(id)
        if(!event) return res.status(404).send('not found')
       res.send(event)
   }
}