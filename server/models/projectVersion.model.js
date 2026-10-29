const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    label: {
        type: String,
        default: ''
    },
    snapshot: [{
        path: { type: String, required: true },
        content: { type: String, default: '' },
        language: { type: String, default: 'html' }
    }],
    triggeredBy: {
        type: String,
        enum: ['user', 'ai', 'auto'],
        default: 'auto'
    },
    prompt: {
        type: String,
        default: null
    }
}, { timestamps: true });

versionSchema.index({ project: 1, createdAt: -1 });

const ProjectVersion = mongoose.model('ProjectVersion', versionSchema);

module.exports = ProjectVersion;
