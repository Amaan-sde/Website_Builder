const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    filesChanged: [{
        path: String,
        operation: {
            type: String,
            enum: ['create', 'update', 'delete']
        }
    }],
    error: {
        type: String,
        default: null
    },
    tokenUsage: {
        input: Number,
        output: Number
    }
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [messageSchema]
}, { timestamps: true });

conversationSchema.index({ project: 1, owner: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
