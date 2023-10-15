const Message = require("../models/message");
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddlewares");


const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

exports.redirect_messages = asyncHandler(async (req, res, next) => {
    res.redirect("/messages");
});

exports.messages_menu_get = [ 
    asyncHandler(async (req, res, next) => {
        let messages = [];
        if (req.user) {
            if (req.user.admin || req.user.membership_status === "Member") {
                // Admin can view all message details and delete any message
                messages = await Message.find({}).populate("creator", "full_name").exec();
            } 
            else {
                // Non-logged-in users or non-members can only see limited message details
                messages = await Message.find().select("title content");
            }
        } else {
            // Non-logged-in users can only see limited message details
            messages = await Message.find().select("title content");
        }

        res.render("message_menu", { user: req.user, messages: messages });
    })];

exports.message_create_get = [ 
    authMiddleware.ensureAuthenticated,
    authMiddleware.isMember,
    asyncHandler(async (req, res, next) => {
        res.render("message_create", { user: req.user });
    })
];

exports.message_create_post = [
    authMiddleware.ensureAuthenticated,
    authMiddleware.isMember,
    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("content", "Content must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
    
            
            res.render("message_create", {
                user: req.user,
                errors: errors.array(),
            });
        }
        else {
            // Data from form is valid. Create a Message object with escaped and trimmed data.
            const message = new Message({
                title: req.body.title,
                content: req.body.content,
                creator: req.user._id,
                timestamp: Date.now(),
            });
            await message.save();
            res.redirect("/messages");
        }
    })
];

exports.message_to_edit_get = [
    authMiddleware.ensureAuthenticated,
    authMiddleware.isAdmin,
    asyncHandler(async (req, res, next) => {
        const message = await Message.findById(req.params.id);
        res.render("message_create", { user: req.user, message: message });
    })
];

exports.message_to_edit_post = [
    authMiddleware.ensureAuthenticated,
    authMiddleware.isAdmin,
    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("content", "Content must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
    
            
            res.render("message_create", {
                user: req.user,
                errors: errors.array(),
            });
        }
        else {
            // Data from form is valid. Create a Message object with escaped and trimmed data.
            const message = new Message({
                title: req.body.title,
                content: req.body.content,
                creator: req.user._id,
                timestamp: Date.now(),
                _id: req.params.id,
            });
            await Message.findByIdAndUpdate(req.params.id, message);
            res.redirect("/messages");
        }
    })
];

exports.message_to_delete_get = [
    authMiddleware.ensureAuthenticated,
    authMiddleware.isAdmin,
    asyncHandler(async (req, res, next) => {
        const message = await Message.findById(req.params.id);
        res.render("message_delete", { user: req.user, message: message });
    })
];

exports.message_to_delete_post = [
    authMiddleware.ensureAuthenticated,
    authMiddleware.isAdmin,
    asyncHandler(async (req, res, next) => {
        const message = await Message.findByIdAndDelete(req.params.id);
        res.redirect("/messages");
    })
];


