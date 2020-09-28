const mongoose= require('mongoose');
const eventSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    thumbnail:String,
    date:{type:Date, default:now.Date()},
    user:{
        type:mongoose.Types.ObjectId,
        ref:User
    }
})