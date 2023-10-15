var express = require('express');
var router = express.Router();

const message_controller = require("../controllers/messageController");

router.get('/', message_controller.messages_menu_get);

router.get('/create', message_controller.message_create_get); //is auth and member [done]

router.post('/create', message_controller.message_create_post); //is auth and member [done]

//router.get('/:id/edit', message_controller.message_to_edit_get); //is auth and is admin

//router.post('/:id/edit', message_controller.message_to_edit_post); //is auth and is admin

router.get('/:id/delete', message_controller.message_to_delete_get); //is auth and is admin

router.post('/:id/delete', message_controller.message_to_delete_post); //is auth and is admin


module.exports = router;
