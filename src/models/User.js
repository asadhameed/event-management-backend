const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const UsrSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type:String, unique:true},
    password: String
})
UsrSchema.methods.generateAuthToken = function () {
    return jwtToken.sign({ _id: this._id, email: this.email, isLogin: true }, process.env.JWT_PRIVATE_KEY);
}
UsrSchema.statics.createPassword = (password) => {
    return bcrypt.hash(password, 10);
}
UsrSchema.statics.passwordCompare = (plainPassword, hashPassword) => {
    return bcrypt.compare(plainPassword, hashPassword);
}
module.exports = mongoose.model('User', UsrSchema)