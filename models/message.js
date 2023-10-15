const mongoose = require("mongoose");
const { DateTime } = require("luxon"); //for date handling

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title: { type: String, required: true, maxLength: 100},
    timestamp: { type: Date, required: true, default: Date.now },
    content: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true}
});


// Virtual for message's URL
// messageSchema.virtual("url").get(function () {
//   // We don't use an arrow function as we'll need the this object
//     return `/message/${this._id}`;
// });

// Virtual for date of death formatted
messageSchema.virtual("timestamp_formatted").get(function () {
    return this.timestamp? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED): "";
});

// Export model
module.exports = mongoose.model("Message", messageSchema);
