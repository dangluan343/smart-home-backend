const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  gmail: {
    type: String,
  },
  adaUsername: {
    type: String,
    required: true,
  },
  adaPassword: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("users", UserSchema);
