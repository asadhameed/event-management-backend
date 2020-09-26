const User = require('../models/User')
module.exports={
    async store(req, res){
        try {
             const registerUser = req.body;
             const creatUser= await User.create(registerUser);
            return res.json(registerUser)
        } catch (error) {
            throw new Error(`The user is not register because of this error ${error}`)
        }
    }
}