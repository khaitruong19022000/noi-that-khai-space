const express = require('express')
const router = express.Router()

const AuthenController = require(`${__path_controllers}backend/authen_controller`)
 
router
    .route('/signup')
    .post(AuthenController.saveSignup) 
    
router
    .route('/login')
    .post(AuthenController.checkLogin)    

module.exports = router;