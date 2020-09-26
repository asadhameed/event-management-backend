const express = require('express')
const error=require('../middleware/error');
const registerController = require('../controllers/registerController')
module.exports = (app) => {
    app.use(express.json())
  
    app.post('/', registerController.store)
    app.use(error)
}