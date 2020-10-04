const { check, validationResult } = require('express-validator');

const User = require('../models/User')

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

}
module.exports = {
    async createUser(req, res) {
        try {
            await validationInput(req);
            const errors = validationResult(req)

            if (!errors.isEmpty()) return res.status(400).send(errors)
            let registerUser = req.body;
            registerUser.password = await User.createPassword(registerUser.password)
            registerUser = await User.create(registerUser)
            return res.send({
                firstName: registerUser.firstName,
                lastName: registerUser.lastName,
                id: registerUser._id,
                email: registerUser.email
            })
        } catch (error) {
            res.status(400).send(`The user is not register because of this error ${error}`)
        }
    },
    async getUser(req, res) {
        try {

            const id = req.params.id;
            const user = await User.findById(id)
            if (!user) return res.status(404).send('Not exist');
            res.send(user)
        } catch (error) {
            res.status(400).send(`The user is not register because of this error ${error}`)
        }
    }
}