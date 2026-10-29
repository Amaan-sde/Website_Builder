const mongoose = require('mongoose');

const templateFileSchema = new mongoose.Schema({
    path: { type: String, required: true },
    content: { type: String, default: '' },
    language: { type: String, default: 'html' }
}, { _id: false });

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['portfolio', 'saas', 'agency', 'business', 'ecommerce', 'restaurant', 'realestate', 'blog', 'startup', 'docs'],
        required: true
    },
    framework: {
        type: String,
        enum: ['html', 'react', 'vue', 'nextjs'],
        default: 'html'
    },
    thumbnail: {
        type: String,
        default: null
    },
    previewUrl: {
        type: String,
        default: null
    },
    tags: [{ type: String }],
    featured: {
        type: Boolean,
        default: false
    },
    files: [templateFileSchema]
}, { timestamps: true });

templateSchema.index({ category: 1, featured: -1 });
const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
