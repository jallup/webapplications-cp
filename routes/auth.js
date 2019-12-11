var express = require('express');
var router = express.Router();

// Require controllers
var user_controller = require('../controllers/userController');

// GET post listing page
//router.get('/', user_controller.index);

// POST request for creating a new post
router.post('/create', user_controller.create);

//router.post('/login', user_controller.loginfunc);

module.exports = router;
