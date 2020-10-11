const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
const connectUsers = {}

io.on('connection', socket => {

    if (socket.handshake.query.token !== 'null') {
        const { token } = socket.handshake.query;
        try {
            const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            connectUsers[decode._id] = socket.id;

        } catch (error) {
            console.log(' error', error)
        }
    }

})

app.use((req, res, next) => {
    req.io = io;
    req.connectUsers = connectUsers;
    next()
})


require('./app_config/defineEnv')();
require('./app_config/mainRouter')(app);
require('./app_config/db')();

const port = process.env.PORT || 8000

const exportServer = server.listen(port, () => console.log(`Listening on ${port}`))
module.exports = exportServer;