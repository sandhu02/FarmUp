const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fcmTokens: { type: [String], default: [] }
});

const User = mongoose.model('users', userSchema);

module.exports = User