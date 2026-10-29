const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        default: '',
        maxlength: 500
    },
    framework: {
        type: String,
        enum: ['html', 'react', 'vue', 'nextjs'],
        default: 'html'
    },
    status: {
        type: String,
        enum: ['draft', 'validating', 'building', 'deploying', 'published', 'failed'],
        default: 'draft'
    },
    deploymentUrl: {
        type: String,
        default: null
    },
    deploymentProvider: {
        type: String,
        default: null
    },
    thumbnail: {
        type: String,
        default: null
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        default: null
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    lastEditedAt: {
        type: Date,
        default: () => new Date()
    }
}, { timestamps: true });

projectSchema.index({ owner: 1, updatedAt: -1 });
projectSchema.index({ owner: 1, name: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
