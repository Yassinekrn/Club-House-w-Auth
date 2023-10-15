const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    full_name: { type: String, required: true},
    username: { type: String, required: true, maxLength: 100 ,unique : true },
    password: { type: String, required: true, maxLength: 100 },
    membership_status: { type: String, required: true, enum: ["Member", "Non-Member"], default: "Non-Member" },
    admin: { type: Boolean, required: true, default: false }
});


// Virtual for user's URL
userSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
    return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", userSchema);
