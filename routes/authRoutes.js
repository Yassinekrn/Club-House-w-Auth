var express = require('express');
var router = express.Router();

const auth_controller = require("../controllers/authController");


router.get('/', auth_controller.redirect_login);

router.get('/login', auth_controller.login_get);

router.get('/signup', auth_controller.signup_get);

router.get('/logout', auth_controller.logout_get);

router.post('/login', auth_controller.login_post);

router.post('/signup', auth_controller.signup_post);



module.exports = router;
