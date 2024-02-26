const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/user/signup' , userController.postSignup );
router.get('/user/login' , userController.getLogin );
router.post('/user/login' , userController.postLogin );

module.exports = router;