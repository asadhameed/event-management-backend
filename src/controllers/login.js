const { check, validationResult } = require("express-validator");
const User = require("../models/User");

module.exports = {
    async userLogin(req, res) {
        await check('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('The email is not proper')
            .run(req);
        await check('password')
            .notEmpty()
            .withMessage('password is not provide')
            .run(req)

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors);
        const { email, password} =req.body;
        const user = await User.findOne({email})
        if(!user) return res.status(401).send('Invalid email or password')
        const isAuthUser = await User.passwordCompare(password, user.password)
        if(!isAuthUser) return res.status(401).send('Invalid email or password')
        res.send({user:user._id})
    }
}