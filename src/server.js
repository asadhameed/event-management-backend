const express = require('express');
const app = express();
require('./app_config/defineEnv')()
require('./app_config/db')()
require('./app_config/mainRouter')(app);

const port = process.env.PORT || 8000


app.listen(port, () => console.log(`Listening on ${port}`))