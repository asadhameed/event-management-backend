const mongoose=require('mongoose');

module.exports= ()=>{
    const db=process.env.MONGO_DB_CONNECTION;
    mongoose.connect(db,{useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=>console.log(`connect with ${db}`))
}