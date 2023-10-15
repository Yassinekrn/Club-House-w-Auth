const Message = require("../models/message");
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddlewares");


require("../passport-config");
require('dotenv').config();

const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

exports.user_profile_get = [ authMiddleware.ensureAuthenticated, 
    asyncHandler(async (req, res, next) => {
    //handle where user already logged in
    res.render("user_profile", { user: req.user });
})];

exports.become_member_get = [ 
    authMiddleware.ensureAuthenticated,
    authMiddleware.notMember,
    asyncHandler(async (req, res, next) => {
        res.render("become_member", { user: req.user });
    })];

exports.become_member_post = [
    authMiddleware.ensureAuthenticated,
    authMiddleware.notMember,
    // Validate and sanitize fields.
    body("secret_code", "Secret Code must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render("become_member", { user: req.user, errors: errors });
        } else {
            if (req.body.secret_code === process.env.SECRET) {
                const user = new User({
                    membership_status: "Member",
                    _id: req.user._id,
                });
                await User.findByIdAndUpdate(req.user._id, user);
                res.redirect("/user");
            }
        }
    })
];