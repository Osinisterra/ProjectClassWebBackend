const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;