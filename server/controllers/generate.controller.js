const { generateWebsite, editWebsite } = require('../services/gemini.service.js');
const { synthesizeWebsite, synthesizeReactWebsite, synthesizeEdit } = require('../services/syntheticGenerator.js');
const Project = require('../models/project.model.js');
const ProjectFile = require('../models/projectFile.model.js');
const ProjectVersion = require('../models/projectVersion.model.js');
const Conversation = require('../models/conversation.model.js');

const PLAN_LIMITS = {
    free: 10,
    pro: 100,
    enterprise: Infinity
};

const detectLanguage = (path) => {
    const ext = path.split('.').pop().toLowerCase();
    const map = { html: 'html', css: 'css', js: 'javascript', jsx: 'javascript', ts: 'typescript', json: 'json', md: 'markdown' };
    return map[ext] || 'plaintext';
};

const checkUsageLimit = async (user) => {
    const now = new Date();
    const reset = new Date(user.generationResetAt);
    const monthDiff = (now.getFullYear() - reset.getFullYear()) * 12 + (now.getMonth() - reset.getMonth());

    if (monthDiff >= 1) {
        user.monthlyGenerations = 0;
        user.generationResetAt = now;
        await user.save();
    }

    const limit = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
    if (user.monthlyGenerations >= limit) {
        throw new Error(`Monthly generation limit (${limit}) reached. Please upgrade your plan.`);
    }
};

exports.generate = async (req, res) => {
    try {
        const { prompt, projectId, framework } = req.body;
        let selectedFramework = framework === 'html' ? 'html' : 'react';

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
            return res.status(400).json({ message: 'Please provide a detailed description (at least 10 characters)' });
        }
        if (prompt.length > 2000) {
            return res.status(400).json({ message: 'Prompt too long (max 2000 characters)' });
        }

        const user = req.user;
        await checkUsageLimit(user);

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });

        const sendEvent = (event, data) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        let project;
        if (projectId) {
            project = await Project.findOne({ _id: projectId, owner: user._id });
            if (!project) {
                sendEvent('error', { message: 'Project not found' });
                return res.end();
            }
            if (project.framework) {
                selectedFramework = project.framework;
            }
        }

        sendEvent('status', { message: 'Analyzing prompt & domain architecture requirements...', step: 1 });

        let generationResult;
        try {
            sendEvent('status', { message: 'Synthesizing bespoke design system & state machines...', step: 2 });
            generationResult = await generateWebsite(prompt.trim(), selectedFramework);
        } catch (aiErr) {
            console.warn('[GenerateController] generateWebsite failed, using synthetic fallback:', aiErr.message);
            generationResult = selectedFramework === 'react'
                ? synthesizeReactWebsite(prompt.trim())
                : synthesizeWebsite(prompt.trim());
        }

        // Guaranteed fallback if generationResult is missing or empty
        if (!generationResult || !Array.isArray(generationResult.files) || generationResult.files.length === 0) {
            console.warn('[GenerateController] AI returned empty files, using synthetic fallback');
            generationResult = selectedFramework === 'react'
                ? synthesizeReactWebsite(prompt.trim())
                : synthesizeWebsite(prompt.trim());
        }

        sendEvent('status', { message: 'Engineering source files & compiling React tree...', step: 3 });

        if (!project) {
            project = await Project.create({
                owner: user._id,
                name: generationResult.projectName || 'My Project',
                description: generationResult.description || prompt.trim().slice(0, 100),
                framework: generationResult.framework || selectedFramework
            });
        }

        const currentFiles = await ProjectFile.find({ project: project._id }).lean();
        if (currentFiles.length > 0) {
            await ProjectVersion.create({
                project: project._id,
                label: 'Before AI generation',
                snapshot: currentFiles.map(f => ({ path: f.path, content: f.content, language: f.language })),
                triggeredBy: 'ai',
                prompt: prompt.trim().slice(0, 500)
            });
        }

        let validFiles = (generationResult.files || []).map(f => ({
            ...f,
            operation: f.operation || 'create',
            path: (f.path || '').trim().replace(/^[./\\]+/, ''),
            content: f.content || f.code || f.file_content || ''
        })).filter(f => {
            const safePath = validateFilePath(f.path);
            return safePath && typeof f.content === 'string' && f.content.trim().length > 0 && Buffer.byteLength(f.content, 'utf8') < 500 * 1024;
        });

        if (validFiles.length === 0) {
            console.warn('[GenerateController] Zero valid files after filtering, applying synthetic React/HTML suite');
            const fallback = selectedFramework === 'react'
                ? synthesizeReactWebsite(prompt.trim())
                : synthesizeWebsite(prompt.trim());
            generationResult = fallback;
            validFiles = fallback.files.filter(f => {
                const safePath = validateFilePath(f.path);
                return safePath && f.content;
            });
        }

        // Stream each valid file event so frontend sees code streaming immediately
        for (const file of validFiles) {
            const safePath = validateFilePath(file.path);
            sendEvent('file', {
                path: safePath,
                language: file.language || detectLanguage(safePath),
                content: file.content,
                sizeBytes: Buffer.byteLength(file.content, 'utf8'),
                operation: file.operation || 'create'
            });
        }

        const fileOps = validFiles.map(f => ({
            updateOne: {
                filter: { project: project._id, path: validateFilePath(f.path) },
                update: {
                    $set: {
                        content: f.content,
                        language: f.language || detectLanguage(f.path),
                        sizeBytes: Buffer.byteLength(f.content, 'utf8')
                    }
                },
                upsert: true
            }
        }));
        await ProjectFile.bulkWrite(fileOps, { ordered: false });

        project.lastEditedAt = new Date();
        await project.save();

        user.monthlyGenerations += 1;
        if (generationResult.usage) {
            user.credits = Math.max(0, user.credits - Math.ceil((generationResult.usage.totalTokenCount || 0) / 1000));
        }
        await user.save();

        const formattedSummary = generationResult.summary && generationResult.summary.length > 50
            ? generationResult.summary
            : `Synthesized custom ${generationResult.projectName || 'React'} web application with modular component architecture, bespoke styling, and responsive layout.`;

        let conversation = await Conversation.findOne({ project: project._id, owner: user._id });
        if (!conversation) {
            conversation = await Conversation.create({ project: project._id, owner: user._id, messages: [] });
        }
        conversation.messages.push(
            { role: 'user', content: prompt.trim() },
            {
                role: 'assistant',
                content: formattedSummary,
                filesChanged: validFiles.map(f => ({ path: f.path, operation: 'create' }))
            }
        );
        await conversation.save();

        sendEvent('status', { message: 'Live preview compiled & ready!', step: 4 });

        sendEvent('complete', {
            projectId: project._id,
            projectName: project.name,
            framework: project.framework || selectedFramework,
            summary: generationResult.summary,
            filesCreated: validFiles.length,
            files: validFiles.map(f => ({
                path: f.path,
                language: f.language || detectLanguage(f.path),
                content: f.content,
                sizeBytes: Buffer.byteLength(f.content, 'utf8')
            }))
        });
        res.end();
    } catch (err) {
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message || 'Generation failed' });
        }
        try {
            res.write(`event: error\ndata: ${JSON.stringify({ message: err.message || 'Generation failed' })}\n\n`);
            res.end();
        } catch (_) {}
    }
};

exports.chat = async (req, res) => {
    try {
        const { prompt, projectId } = req.body;

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
            return res.status(400).json({ message: 'Please provide a message' });
        }
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID required' });
        }

        const user = req.user;
        await checkUsageLimit(user);

        const project = await Project.findOne({ _id: projectId, owner: user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const [existingFiles, conversation] = await Promise.all([
            ProjectFile.find({ project: project._id }).lean(),
            Conversation.findOne({ project: project._id, owner: user._id })
        ]);

        const history = conversation ? conversation.messages.slice(-10).map(m => ({ role: m.role, content: m.content })) : [];

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });

        const sendEvent = (event, data) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        sendEvent('status', { message: 'Analyzing changes needed...' });

        let editResult;
        try {
            editResult = await editWebsite(prompt.trim(), existingFiles, history);
        } catch (aiErr) {
            console.warn('[GenerateController] editWebsite failed, using syntheticEdit fallback:', aiErr.message);
            editResult = synthesizeEdit(prompt.trim(), existingFiles);
        }

        if (!editResult || !Array.isArray(editResult.files) || editResult.files.length === 0) {
            console.info('[GenerateController] editResult had empty files, applying synthesizeEdit fallback');
            editResult = synthesizeEdit(prompt.trim(), existingFiles);
        }

        if (!editResult.files || editResult.files.length === 0) {
            sendEvent('complete', {
                summary: editResult.summary || 'No changes needed.',
                filesChanged: []
            });
            return res.end();
        }

        if (existingFiles.length > 0) {
            await ProjectVersion.create({
                project: project._id,
                label: `Before: ${prompt.trim().slice(0, 60)}`,
                snapshot: existingFiles.map(f => ({ path: f.path, content: f.content, language: f.language })),
                triggeredBy: 'ai',
                prompt: prompt.trim().slice(0, 500)
            });
        }

        const changedFiles = [];
        for (const op of editResult.files) {
            const safePath = validateFilePath(op.path);
            if (!safePath) continue;

            if (op.operation === 'delete') {
                await ProjectFile.findOneAndDelete({ project: project._id, path: safePath });
                changedFiles.push({ path: safePath, operation: 'delete' });
                sendEvent('file', { path: safePath, operation: 'delete' });
            } else {
                const content = op.content || '';
                if (Buffer.byteLength(content, 'utf8') > 500 * 1024) continue;

                await ProjectFile.findOneAndUpdate(
                    { project: project._id, path: safePath },
                    { content, language: op.language || detectLanguage(safePath), sizeBytes: Buffer.byteLength(content, 'utf8') },
                    { upsert: true }
                );
                changedFiles.push({
                    path: safePath,
                    operation: op.operation || 'update',
                    language: op.language || detectLanguage(safePath),
                    content,
                    sizeBytes: Buffer.byteLength(content, 'utf8')
                });
                sendEvent('file', {
                    path: safePath,
                    operation: op.operation || 'update',
                    language: op.language || detectLanguage(safePath),
                    content,
                    sizeBytes: Buffer.byteLength(content, 'utf8')
                });
            }
        }

        project.lastEditedAt = new Date();
        await project.save();

        user.monthlyGenerations += 1;
        await user.save();

        const conv = conversation || await Conversation.create({ project: project._id, owner: user._id, messages: [] });
        conv.messages.push(
            { role: 'user', content: prompt.trim() },
            { role: 'assistant', content: editResult.summary, filesChanged: changedFiles }
        );
        await conv.save();

        sendEvent('complete', {
            summary: editResult.summary,
            filesChanged: changedFiles,
            files: changedFiles
        });
        res.end();
    } catch (err) {
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message || 'Edit failed' });
        }
        try {
            res.write(`event: error\ndata: ${JSON.stringify({ message: err.message || 'Edit failed' })}\n\n`);
            res.end();
        } catch (_) {}
    }
};

exports.getConversation = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id }).lean();
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const conversation = await Conversation.findOne({ project: project._id, owner: req.user._id }).lean();
        return res.json(conversation || { messages: [] });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load conversation' });
    }
};

const validateFilePath = (filePath) => {
    if (!filePath || typeof filePath !== 'string') return null;
    let normalized = filePath.trim().replace(/\\/g, '/').replace(/\/+/g, '/');
    normalized = normalized.replace(/^(\.\/|\/)+/, '');
    if (normalized.includes('..') || normalized.startsWith('/') || normalized.length > 200) return null;
    if (!/^[a-zA-Z0-9_\-./]+$/.test(normalized)) return null;
    return normalized;
};

