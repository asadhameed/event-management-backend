const express = require('express')
const error=require('../middleware/error');
const registerController = require('../controllers/registerController')
const event= require('../controllers/event')
const multer = require('multer')
const uploadConfig=require('../middleware/upload');
const path = require('path')
const upload = multer(uploadConfig)
module.exports = (app) => {
    app.use(express.json())
  
    app.post('/user/registration', registerController.createUser)
    app.get('/user/:id', registerController.getUser)

    app.post('/event',upload.single('thumbnail'),event.createEven)
    app.get('/event/:id', event.getEventById)
    app.get('/events/', event.getAllEvents)
    app.get('/events/:eventType' , event.getEventsType)
    app.delete('/event/:id', event.deletedEvent)

    app.use('/static', express.static(path.resolve(__dirname,'..','images')))
    app.use(error)
}