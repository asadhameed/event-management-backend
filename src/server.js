const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.Server(app);
const io = socketIo(server);

/******************************
 * Read more about Reddis 
 * the following is not good it just for concept.
 * keep the incoming user data in database or reddis
 * but now i keep in the memory
 */

const connectUser = {}

io.on('connection', socket => {

    if (socket.handshake.query.token !== 'null') {
        console.log(socket.handshake.query)
        console.log('User connecting with ', socket.id);
        const { token } = socket.handshake.query;
        connectUser[token] = socket.id;
    }

})

app.use((req, res, next)=>{
    req.io=io;
    req.connectUser=connectUser;
    next()
})

require('./app_config/defineEnv')();
require('./app_config/mainRouter')(app);
require('./app_config/db')();

const port = process.env.PORT || 8000

const exportServer = server.listen(port, () => console.log(`Listening on ${port}`))
module.exports = exportServer;