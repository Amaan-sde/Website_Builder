const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    avatar: {
        type: String,
        default: ''
    },
    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free"
    },
    credits: {
        type: Number,
        default: 100,
        min: 0
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;