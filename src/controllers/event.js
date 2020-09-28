const { check, validationResult } = require("express-validator")

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
            .isInt({min:1})
            .withMessage('Price should greater then zero').run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send(errors);

        res.send('Create event')
    }
}