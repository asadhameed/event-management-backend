const mongoose= require('mongoose');
const bcrypt = require('bcrypt')
const UsrSchema= new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String
})
UsrSchema.statics.createPassword=(password)=>{
    return bcrypt.hash(password, 10);
}
UsrSchema.statics.passwordCompare=(plainPassword, hashPassword)=>{
    return bcrypt.compare(plainPassword, hashPassword);
}
module.exports=mongoose.model('User',UsrSchema)