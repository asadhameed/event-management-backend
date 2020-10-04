const jwt = require('jsonwebtoken');
const mongoose =require('mongoose')
require('dotenv').config();

function userAuth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('Access Denied')
    try {
        const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        
        req.user = decode;
        next();
    } catch (error) {
        return res.status(400).send('Invalid token')
    }
}

function isLogin(req, res, next) {
    if (!req.user.isLogin) return res.status(401).send('Access Denied')
    next();
}

function headerID(req, res, next) {
    
    if (!mongoose.Types.ObjectId.isValid(req.user._id))
       return  res.status(400).send('Invalid id')
    next()
}
module.exports.userAuth = userAuth;
module.exports.isLogin = isLogin;
module.exports.headerID=headerID;