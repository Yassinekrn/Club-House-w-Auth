var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

/* GET users listing. */
router.get('/', user_controller.user_profile_get);

router.get('/member', user_controller.become_member_get);

router.post('/member', user_controller.become_member_post);

module.exports = router;
