const express = require('express')
const path = require('path')
const multer = require('multer')

const registerController = require('../controllers/registerController')
const event= require('../controllers/event')
const eventDashBoard= require('../controllers/eventDashBoard')
const error=require('../middleware/error');
const idValidation= require('../middleware/objectIdvalidation')

const uploadConfig=require('../middleware/upload');
const upload = multer(uploadConfig)
module.exports = (app) => {
    app.use(express.json())
  
    app.post('/user/registration', registerController.createUser)
    app.get('/user/:id',idValidation, registerController.getUser)

    app.get('/event/:id',idValidation, eventDashBoard.getEventById)
    app.get('/events', eventDashBoard.getAllEvents)
    app.get('/events/:eventType' , eventDashBoard.getAllEvents)

    app.post('/event',upload.single('thumbnail'),event.createEven)
    app.delete('/event/:id',idValidation, event.deletedEvent)

    app.use('/static', express.static(path.resolve(__dirname,'..','images')))
    app.use(error)
}