const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profileImage: String,
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true, // Ensures email is unique
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: { type: String, required: true },
}, {
  timestamps: true,
});

// Create a User model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
