const User = require('../models/User')
const { check, validationResult } = require('express-validator');
const mongoose= require('mongoose');
const validationInput = async (req) => {

    await check('firstName')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('First Name should be 3 to 20 characters').run(req);
    await check('lastName')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Last Name should be 3 to 20 characters').run(req);
    await check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage("Email is not valid")
        .custom(async email => {
            const registerUser = await User.findOne({ email });
            if (registerUser) throw new Error('User is already register');
        })
        .run(req);
    await check('password')
        .trim()
        .isLength({ min: 6, max: 20 })
        .withMessage('Password should be 6 to 20 characters').run(req)
    await check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password)
                throw new Error('Password confirmation does not match password');
            return true;
        }).run(req)

    // return validationResult(req);
}
module.exports = {
    async createUser(req, res) {
        try {
            await validationInput(req);
            const errors = validationResult(req)

            if (!errors.isEmpty()) return res.status(400).send(errors)
            let registerUser = req.body;
            registerUser = await User.create(registerUser)
            //registerUser.json();
            return res.send(registerUser)
        } catch (error) {
            res.status(400).send(`The user is not register because of this error ${error}`)
          //  throw new Error(`The user is not register because of this error ${error}`)
        }
    },
    async getUser(req, res){
        try {
            
            const id = req.params.userId;
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Not valid id');
            const user = await User.findById(id)
            if(!user) return  res.status(404).send('Not exist');
            res.send(user)
        } catch (error) {
            res.status(400).send(`The user is not register because of this error ${error}`)
        }
    }
}