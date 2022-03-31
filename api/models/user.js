var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  shortid = require("shortid");

var userSchema = new Schema(
  {
    username: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

var User = mongoose.model("User", userSchema);

module.exports = User;
