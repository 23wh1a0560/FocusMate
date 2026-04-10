const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // [cite: 168, 174]
  password: { type: String, required: true }, // To be hashed [cite: 169, 234]
  profilePicture: { type: String, default: "" }, // [cite: 62]
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' } // [cite: 39, 53]
}, { timestamps: true }); // [cite: 171, 172]

module.exports = mongoose.model('User', userSchema);