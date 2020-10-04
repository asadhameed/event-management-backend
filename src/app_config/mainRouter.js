const express = require('express')
const path = require('path')
const multer = require('multer')
const cors=require('cors')

const registerController = require('../controllers/registerController')
const event= require('../controllers/event')
const eventDashBoard= require('../controllers/eventDashBoard')
const error=require('../middleware/error');
const {paramsId,headerUserId}= require('../middleware/objectIdvalidation')
const {userAuth,isLogin,headerID}= require('../../src/middleware/auth')
const login = require('../controllers/login')
const eventRegister= require('../controllers/eventRegister')

const uploadConfig=require('../middleware/upload');
const upload = multer(uploadConfig)
module.exports = (app) => {
   app.use(cors());
    app.use(express.json())
    app.post('/user/login', login.userLogin)
    app.post('/user/registration', registerController.createUser)
    app.get('/user/:id',paramsId, registerController.getUser)
    

    app.get('/events', eventDashBoard.getAllEvents)
    app.get('/events/:eventType' , eventDashBoard.getAllEvents)
    app.get('/event/byuser/',[userAuth, isLogin,headerID]  , eventDashBoard.getEventsByUserID )

    app.post('/event',upload.single('thumbnail'),event.createEvent)
    app.delete('/event/:id',[userAuth, isLogin,headerID,paramsId], event.deletedEvent)

    //app.post('/eventRegister/:id',[paramsId,headerUserId],eventRegister.create)
    app.post('/eventRegister/:id',[userAuth, isLogin,headerID,paramsId],eventRegister.create)
    app.get('/eventRegister/:id',paramsId,eventRegister.getEventRegister)
    app.post('/eventRegister/approval/:id', paramsId, eventRegister.approval)

    
    app.use('/static', express.static(path.resolve(__dirname,'..','images')))
    app.use(error)
}