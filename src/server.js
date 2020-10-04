const express = require('express');
const app = express();
require('./app_config/defineEnv')()
require('./app_config/mainRouter')(app);
require('./app_config/db')()

const port = process.env.PORT || 8000

const server = app.listen(port, () => console.log(`Listening on ${port}`))
module.exports = server;