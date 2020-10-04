const mongoose = require('mongoose');

const validationID = (id) => {
    return !mongoose.Types.ObjectId.isValid(id)
}
module.exports = {
    paramsId(req, res, next) {
        if (validationID(req.params.id))
            return res.status(400).send('Invalid Id')
        next();
    },
    headerUserId(req, res, next) {
        const user_id = req.user._id;
        if (validationID(user_id))
            return res.status(400).send('Invalid Id')
        next();
    }
}