const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: "devices",
    required: true,
  },
  keyFeed: {
    type: String,
    required: true,
  },
  onValue: {
    type: Number,
  },
  offValue: {
    type: Number,
  },

  roomId: {
    type: Schema.Types.ObjectId,
    ref: "rooms",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("activities", ActivitySchema);
