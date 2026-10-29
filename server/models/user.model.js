const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    },
    avatar: {
        type: String,
        default: ''
    },
    firebaseUid: {
        type: String,
        sparse: true,
        index: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    credits: {
        type: Number,
        default: 100,
        min: 0
    },
    monthlyGenerations: {
        type: Number,
        default: 0
    },
    generationResetAt: {
        type: Date,
        default: () => new Date()
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;