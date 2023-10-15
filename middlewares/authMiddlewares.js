const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");



// Require the Passport configuration
require("../passport-config");


function redirectIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      // User is already authenticated, redirect them to another page (e.g., profile)
        return res.redirect("/profile");
    }
    // User is not authenticated, continue to the login page
    return next();
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, allow access to the profile
    }
    // User is not authenticated, redirect to the login page
    res.redirect("/auth/login");
}

function isMember(req, res, next) {
    if (req.user.membership_status === "Member" || req.user.admin) {
        return next();
    }
    res.redirect("/user");
}

function isAdmin(req, res, next) {
    if (req.user.admin) {
        return next();
    }
    res.redirect("/user");
}

function notMember(req, res, next) {
    if (req.user.membership_status === "Non-Member") {
        return next();
    }
    res.redirect("/user");
}

// Export the middleware function
module.exports = {
    redirectIfAuthenticated,
    ensureAuthenticated,
    isMember,
    isAdmin,
    notMember,
};