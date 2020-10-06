const mongoose = require('mongoose');

module.exports = function () {
    const db = process.env.MONGO_DB_CONNECTION;
    mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex:true})
        .then(() => console.log(`connect with ${db}`))
        .catch((err) => console.log('Database error ----------------', err))
}

