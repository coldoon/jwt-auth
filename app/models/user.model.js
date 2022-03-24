const { times } = require("lodash");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  timestamps: {
    type: Date,
    default: Date.now,
    immutable: true,
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);
