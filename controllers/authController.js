const Message = require("../models/message");
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddlewares");
require("../passport-config");

const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const asyncHandler = require("express-async-handler");





exports.redirect_login = [ authMiddleware.redirectIfAuthenticated, 
    asyncHandler(async (req, res, next) => {
    res.redirect("/auth/login");
})];


exports.login_get = [ authMiddleware.redirectIfAuthenticated, 
    asyncHandler(async (req, res, next) => {
    //handle where user already logged in
    res.render("login_form");
})];


exports.signup_get = [ authMiddleware.redirectIfAuthenticated, 
    asyncHandler(async (req, res, next) => {
    //handle where user already logged in
    res.render("signup_form");
})];


exports.login_post = [
    // Validate and sanitize fields.
    body("username", "Username must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "Password must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        console.log(req.body);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
    
            
            res.render("login_form", {
                user: user,
                errors: errors.array(),
            });
        }
        // Invoke passport.authenticate with the request, response, and next middleware
    passport.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err); // Handle error, e.g., database query error
        }
        if (!user) {
          // Authentication failed, redirect to login page with a message
            return res.redirect("/auth/login");
        }

        // Successful authentication, log in the user
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Redirect to the desired page upon successful login
            return res.redirect("/");
        });
    })(req, res, next);
    }),
];

exports.logout_get = [ authMiddleware.ensureAuthenticated, asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
})];

exports.signup_post = [
    // Validate and sanitize fields.
    body("full_name", "Full name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("username", "Username must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "Password must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("confirm_password", "The password confirmation must not be empty").trim().isLength({ min: 1 }).escape(),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return value === req.body.password;
    }),
    body("username").custom(async (value, {req}) => {
        const userWithSameUserName = await User.findOne({username: value}).exec();
        if(userWithSameUserName) {
            throw new Error("Username already exists");
        }
        return !userWithSameUserName;
    }),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
        const errors = validationResult(req);

      // Create a Book object with escaped and trimmed data.
        let user = new User({
        full_name: req.body.full_name,
        username: req.body.username,
        password: req.body.password,
        membership_status: "Non-Member",
        admin: false,
    });

    // if(req.body.password !== req.body.confirm_password) {
    //     errors.push({msg: "Passwords do not match"});
    // }

    // const userWithSameUserName = await User.findOne({username: req.body.username}).exec();
    // if(userWithSameUserName) {
    //     errors.push({msg: "Username already exists"});
    // }

        if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.

        
        res.render("signup_form", {
            user: user,
            errors: errors.array(),
        });
    } else {
        // Data from form is valid. Save User.
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) 
                return next(err);
            // otherwise, store hashedPassword in DB
            user.password = hashedPassword;
            await user.save();
        });
        res.redirect("/auth/login");
    }
    }),
];