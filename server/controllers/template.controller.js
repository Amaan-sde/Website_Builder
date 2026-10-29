const Template = require('../models/template.model.js');

exports.listTemplates = async (req, res) => {
    try {
        const { category, search } = req.query;
        const query = {};
        if (category && category !== 'all') query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const templates = await Template.find(query)
            .select('-files')
            .sort({ featured: -1, createdAt: -1 })
            .lean();

        return res.json(templates);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load templates' });
    }
};

exports.getTemplate = async (req, res) => {
    try {
        const template = await Template.findOne({
            $or: [{ _id: req.params.id }, { slug: req.params.id }]
        }).lean();

        if (!template) return res.status(404).json({ message: 'Template not found' });
        return res.json(template);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load template' });
    }
};
