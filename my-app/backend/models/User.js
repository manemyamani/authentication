// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, required: true },
    password: { type: String, required: true },
    otp:{ type: String },
    otpExpires: {type: String}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
