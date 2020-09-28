const mongoose= require('mongoose')
const eventSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    thumbnail:String,
    date:{type:Date, default:Date.now},
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }
})
const Event= mongoose.model('Events',eventSchema)
module.exports =Event;