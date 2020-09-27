const User = require('../models/User')
const { check, validationResult } = require('express-validator')
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
    async store(req, res) {
        try {
            await validationInput(req);
            const errors = validationResult(req)

            if (!errors.isEmpty()) return res.status(400).send(errors)
            let registerUser = req.body;
            registerUser = User.create(registerUser)
            return res.json(registerUser)
        } catch (error) {
            throw new Error(`The user is not register because of this error ${error}`)
        }
    }
}