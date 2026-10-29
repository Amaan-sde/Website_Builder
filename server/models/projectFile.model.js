const mongoose = require('mongoose');

const projectFileSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: 'html'
    },
    sizeBytes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

projectFileSchema.index({ project: 1, path: 1 }, { unique: true });

const ProjectFile = mongoose.model('ProjectFile', projectFileSchema);

module.exports = ProjectFile;
