const express = require('express')
const error=require('../middleware/error');
const registerController = require('../controllers/registerController')
const event= require('../controllers/event')
module.exports = (app) => {
    app.use(express.json())
  
    app.post('/user/registration', registerController.createUser)
    app.get('/user/:userId', registerController.getUser)

    app.post('/event',event.createEven)
    app.use(error)
}