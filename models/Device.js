const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ["light", "fan", "door", "humidity", "temperature"],
  },
});

module.exports = mongoose.model("devices", DeviceSchema);
