const Project = require('../models/project.model.js');
const ProjectFile = require('../models/projectFile.model.js');
const ProjectVersion = require('../models/projectVersion.model.js');
const Conversation = require('../models/conversation.model.js');
const Template = require('../models/template.model.js');
const { githubSyncTotal } = require('../config/metrics.js');

const detectLanguage = (path) => {
    const ext = path.split('.').pop().toLowerCase();
    const map = { html: 'html', css: 'css', js: 'javascript', jsx: 'javascript', ts: 'typescript', json: 'json', md: 'markdown' };
    return map[ext] || 'plaintext';
};

exports.listProjects = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 12);
        const skip = (page - 1) * limit;
        const search = req.query.search ? { $regex: req.query.search, $options: 'i' } : undefined;

        const query = { owner: req.user._id };
        if (search) query.name = search;

        const [projects, total] = await Promise.all([
            Project.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
            Project.countDocuments(query)
        ]);

        return res.json({ projects, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load projects' });
    }
};

exports.getProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id }).lean();
        if (!project) return res.status(404).json({ message: 'Project not found' });
        return res.json(project);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load project' });
    }
};

exports.createProject = async (req, res) => {
    try {
        const { name, description, framework, templateId } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Project name is required' });
        }

        const project = await Project.create({
            owner: req.user._id,
            name: name.trim().slice(0, 100),
            description: (description || '').slice(0, 500),
            framework: framework || 'html'
        });

        if (templateId) {
            const template = await Template.findById(templateId).lean();
            if (template && template.files && template.files.length > 0) {
                const fileOps = template.files.map(f => ({
                    insertOne: {
                        document: {
                            project: project._id,
                            path: f.path,
                            content: f.content || '',
                            language: f.language || detectLanguage(f.path),
                            sizeBytes: Buffer.byteLength(f.content || '', 'utf8')
                        }
                    }
                }));
                await ProjectFile.bulkWrite(fileOps, { ordered: false });
                project.templateId = templateId;
                await project.save();

                await ProjectVersion.create({
                    project: project._id,
                    label: 'Initial from template',
                    snapshot: template.files.map(f => ({ path: f.path, content: f.content || '', language: f.language || detectLanguage(f.path) })),
                    triggeredBy: 'user'
                });
            }
        } else {
            const isReact = (framework || 'react') === 'react';
            const defaultFiles = isReact ? [
                {
                    path: 'index.html',
                    language: 'html',
                    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name.trim()}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
                },
                {
                    path: 'src/App.jsx',
                    language: 'javascript',
                    content: `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6">
        <span>⚛️ React 18 + Tailwind CSS</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
        ${name.trim()}
      </h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm md:text-base">
        Welcome to your new React project. Start chatting with AI or edit the code directly to craft your application.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-cyan-500/25"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  );
}`
                },
                {
                    path: 'src/main.jsx',
                    language: 'javascript',
                    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
                },
                {
                    path: 'src/index.css',
                    language: 'css',
                    content: `@tailwind base;
@tailwind components;
@tailwind utilities;`
                },
                {
                    path: 'package.json',
                    language: 'json',
                    content: JSON.stringify({
                        name: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                        private: true,
                        version: '1.0.0',
                        type: 'module',
                        scripts: {
                            dev: 'vite',
                            build: 'vite build',
                            preview: 'vite preview'
                        },
                        dependencies: {
                            react: '^18.3.1',
                            'react-dom': '^18.3.1',
                            'lucide-react': '^0.344.0'
                        },
                        devDependencies: {
                            '@vitejs/plugin-react': '^4.3.1',
                            autoprefixer: '^10.4.19',
                            postcss: '^8.4.38',
                            tailwindcss: '^3.4.4',
                            vite: '^5.3.4'
                        }
                    }, null, 2)
                },
                {
                    path: 'vite.config.js',
                    language: 'javascript',
                    content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`
                }
            ] : [
                {
                    path: 'index.html',
                    language: 'html',
                    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name.trim()}</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container" style="text-align:center;max-width:600px;margin:100px auto;padding:2rem;">
    <div style="display:inline-block;padding:4px 12px;border-radius:9999px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;font-size:12px;font-weight:600;margin-bottom:1.5rem;">🌐 HTML5 & CSS</div>
    <h1 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem;color:#f8fafc;">${name.trim()}</h1>
    <p style="color:#94a3b8;margin-bottom:2rem;line-height:1.6;">Welcome to your blank project. Start writing code or ask AI to design something incredible.</p>
    <button id="btn" style="padding:10px 24px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Click me</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`
                },
                {
                    path: 'styles.css',
                    language: 'css',
                    content: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background: #080810;
  color: #e2e8f0;
  min-height: 100vh;
}`
                },
                {
                    path: 'script.js',
                    language: 'javascript',
                    content: `document.getElementById('btn')?.addEventListener('click', () => {
  alert('Hello from your new website!');
});`
                }
            ];

            const fileOps = defaultFiles.map(f => ({
                insertOne: {
                    document: {
                        project: project._id,
                        path: f.path,
                        content: f.content,
                        language: f.language,
                        sizeBytes: Buffer.byteLength(f.content, 'utf8')
                    }
                }
            }));
            await ProjectFile.bulkWrite(fileOps, { ordered: false });

            await ProjectVersion.create({
                project: project._id,
                label: 'Initial blank project',
                snapshot: defaultFiles.map(f => ({ path: f.path, content: f.content, language: f.language })),
                triggeredBy: 'user'
            });
        }

        return res.status(201).json(project);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create project' });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name.trim().slice(0, 100);
        if (description !== undefined) updates.description = description.slice(0, 500);
        if (status !== undefined) updates.status = status;
        updates.lastEditedAt = new Date();

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            updates,
            { new: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        return res.json(project);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to update project' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await Promise.all([
            ProjectFile.deleteMany({ project: project._id }),
            ProjectVersion.deleteMany({ project: project._id }),
            Conversation.deleteMany({ project: project._id })
        ]);

        return res.json({ message: 'Project deleted' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete project' });
    }
};

exports.listFiles = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id }).lean();
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const files = await ProjectFile.find({ project: project._id })
            .select('path language sizeBytes updatedAt')
            .sort({ path: 1 })
            .lean();
        return res.json(files);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load files' });
    }
};

exports.getFile = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id }).lean();
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const filePath = req.query.path;
        if (!filePath) return res.status(400).json({ message: 'File path required' });

        const safePath = validateFilePath(filePath);
        if (!safePath) return res.status(400).json({ message: 'Invalid file path' });

        const file = await ProjectFile.findOne({ project: project._id, path: safePath }).lean();
        if (!file) return res.status(404).json({ message: 'File not found' });

        return res.json(file);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load file' });
    }
};

exports.saveFile = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const { path: filePath, content } = req.body;
        if (!filePath) return res.status(400).json({ message: 'File path required' });

        const safePath = validateFilePath(filePath);
        if (!safePath) return res.status(400).json({ message: 'Invalid file path' });

        const contentStr = typeof content === 'string' ? content : '';
        if (Buffer.byteLength(contentStr, 'utf8') > 500 * 1024) {
            return res.status(400).json({ message: 'File exceeds 500KB limit' });
        }

        const file = await ProjectFile.findOneAndUpdate(
            { project: project._id, path: safePath },
            { content: contentStr, language: detectLanguage(safePath), sizeBytes: Buffer.byteLength(contentStr, 'utf8') },
            { upsert: true, new: true }
        );

        project.lastEditedAt = new Date();
        await project.save();

        return res.json(file);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to save file' });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id }).lean();
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const filePath = req.query.path;
        if (!filePath) return res.status(400).json({ message: 'File path required' });

        const safePath = validateFilePath(filePath);
        if (!safePath) return res.status(400).json({ message: 'Invalid file path' });

        await ProjectFile.findOneAndDelete({ project: project._id, path: safePath });
        return res.json({ message: 'File deleted' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete file' });
    }
};

exports.listVersions = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id }).lean();
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const versions = await ProjectVersion.find({ project: project._id })
            .select('-snapshot')
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        return res.json(versions);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load versions' });
    }
};

exports.restoreVersion = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const version = await ProjectVersion.findOne({ _id: req.params.versionId, project: project._id });
        if (!version) return res.status(404).json({ message: 'Version not found' });

        const currentFiles = await ProjectFile.find({ project: project._id }).lean();
        await ProjectVersion.create({
            project: project._id,
            label: 'Before restore',
            snapshot: currentFiles.map(f => ({ path: f.path, content: f.content, language: f.language })),
            triggeredBy: 'user'
        });

        await ProjectFile.deleteMany({ project: project._id });

        if (version.snapshot.length > 0) {
            const fileOps = version.snapshot.map(f => ({
                insertOne: {
                    document: {
                        project: project._id,
                        path: f.path,
                        content: f.content || '',
                        language: f.language || detectLanguage(f.path),
                        sizeBytes: Buffer.byteLength(f.content || '', 'utf8')
                    }
                }
            }));
            await ProjectFile.bulkWrite(fileOps, { ordered: false });
        }

        project.lastEditedAt = new Date();
        await project.save();

        return res.json({ message: 'Version restored successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to restore version' });
    }
};

const validateFilePath = (filePath) => {
    if (!filePath || typeof filePath !== 'string') return null;
    const normalized = filePath.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\//, '');
    if (normalized.includes('..') || normalized.startsWith('/') || normalized.length > 200) return null;
    if (!/^[a-zA-Z0-9_\-./]+$/.test(normalized)) return null;
    return normalized;
};

exports.pushToGitHub = async (req, res) => {
    try {
        const { token, repoName, branch = 'main', commitMessage } = req.body;

        if (!token || !token.trim()) {
            return res.status(400).json({ message: 'GitHub Personal Access Token is required' });
        }
        if (!repoName || !repoName.trim()) {
            return res.status(400).json({ message: 'Repository name is required' });
        }

        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const cleanToken = token.trim();
        const cleanRepo = repoName.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').split('/').pop();
        const targetBranch = (branch || 'main').trim();

        const ghHeaders = {
            'Authorization': `Bearer ${cleanToken}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'GenWeb-AI-Website-Builder',
            'X-GitHub-Api-Version': '2022-11-28'
        };

        // 1. Verify GitHub user
        const userRes = await fetch('https://api.github.com/user', { headers: ghHeaders });
        if (!userRes.ok) {
            const err = await userRes.json().catch(() => ({}));
            githubSyncTotal.inc({ action: 'push', status: 'auth_failed' });
            return res.status(userRes.status).json({ message: err.message || 'Invalid GitHub Token' });
        }
        const ghUser = await userRes.json();
        const owner = ghUser.login;

        // 2. Check if repository exists, or create it
        let repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers: ghHeaders });
        if (repoRes.status === 404) {
            const createRes = await fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: ghHeaders,
                body: JSON.stringify({
                    name: cleanRepo,
                    description: `${project.name} - Synthesized with GenWeb AI`,
                    private: false,
                    auto_init: true
                })
            });
            if (!createRes.ok) {
                const err = await createRes.json().catch(() => ({}));
                githubSyncTotal.inc({ action: 'push', status: 'create_repo_failed' });
                return res.status(createRes.status).json({ message: `Failed to create repo: ${err.message || 'Unknown error'}` });
            }
            await new Promise(r => setTimeout(r, 1200));
            repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers: ghHeaders });
        }

        if (!repoRes.ok) {
            const err = await repoRes.json().catch(() => ({}));
            githubSyncTotal.inc({ action: 'push', status: 'error' });
            return res.status(repoRes.status).json({ message: err.message || 'Could not access repository' });
        }
        const repoData = await repoRes.json();
        const defaultBranch = repoData.default_branch || 'main';

        // 3. Load all project files
        const projectFiles = await ProjectFile.find({ project: project._id }).lean();
        if (!projectFiles || projectFiles.length === 0) {
            return res.status(400).json({ message: 'Project has no files to commit' });
        }

        const filesMap = {};
        projectFiles.forEach(f => {
            filesMap[f.path] = f.content || '';
        });

        if (!filesMap['README.md']) {
            filesMap['README.md'] = `# ${project.name}\n\n${project.description || 'Full-stack responsive web application'}\n\nBuilt and deployed using [GenWeb AI](http://3.110.221.10:5173).`;
        }

        const isReact = project.framework === 'react' || Object.keys(filesMap).some(p => p.endsWith('.jsx'));
        if (isReact && !filesMap['package.json']) {
            filesMap['package.json'] = JSON.stringify({
                name: project.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                private: true,
                version: '1.0.0',
                type: 'module',
                scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
                dependencies: {
                    react: '^18.3.1',
                    'react-dom': '^18.3.1',
                    'lucide-react': '^0.460.0'
                },
                devDependencies: {
                    '@vitejs/plugin-react': '^4.3.1',
                    vite: '^5.4.0',
                    tailwindcss: '^3.4.0',
                    autoprefixer: '^10.4.0',
                    postcss: '^8.4.0'
                }
            }, null, 2);
        }

        // 4. Get target branch ref or fallback to default branch
        let branchRefRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/ref/heads/${targetBranch}`, { headers: ghHeaders });
        let baseCommitSha = null;
        let baseTreeSha = null;

        if (branchRefRes.ok) {
            const refData = await branchRefRes.json();
            baseCommitSha = refData.object.sha;
        } else {
            const defaultRefRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/ref/heads/${defaultBranch}`, { headers: ghHeaders });
            if (defaultRefRes.ok) {
                const defData = await defaultRefRes.json();
                baseCommitSha = defData.object.sha;
            }
        }

        if (baseCommitSha) {
            const commitRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/commits/${baseCommitSha}`, { headers: ghHeaders });
            if (commitRes.ok) {
                const cData = await commitRes.json();
                baseTreeSha = cData.tree?.sha;
            }
        }

        // 5. Create Blobs
        const treeItems = [];
        for (const [filePath, content] of Object.entries(filesMap)) {
            const blobRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/blobs`, {
                method: 'POST',
                headers: ghHeaders,
                body: JSON.stringify({ content, encoding: 'utf-8' })
            });
            if (blobRes.ok) {
                const bData = await blobRes.json();
                treeItems.push({
                    path: filePath,
                    mode: '100644',
                    type: 'blob',
                    sha: bData.sha
                });
            }
        }

        if (treeItems.length === 0) {
            return res.status(500).json({ message: 'Failed to upload file blobs to GitHub' });
        }

        // 6. Create Git Tree
        const treeBody = { tree: treeItems };
        if (baseTreeSha) treeBody.base_tree = baseTreeSha;

        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/trees`, {
            method: 'POST',
            headers: ghHeaders,
            body: JSON.stringify(treeBody)
        });
        if (!treeRes.ok) {
            const err = await treeRes.json().catch(() => ({}));
            return res.status(500).json({ message: `Failed to create Git tree: ${err.message || 'Unknown'}` });
        }
        const newTree = await treeRes.json();

        // 7. Create Commit
        const commitPayload = {
            message: commitMessage || `Update ${project.name} source files via GenWeb AI`,
            tree: newTree.sha,
            parents: baseCommitSha ? [baseCommitSha] : []
        };
        const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/commits`, {
            method: 'POST',
            headers: ghHeaders,
            body: JSON.stringify(commitPayload)
        });
        if (!newCommitRes.ok) {
            const err = await newCommitRes.json().catch(() => ({}));
            return res.status(500).json({ message: `Failed to create commit: ${err.message || 'Unknown'}` });
        }
        const newCommit = await newCommitRes.json();

        // 8. Update or create branch ref
        if (branchRefRes.ok) {
            await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/refs/heads/${targetBranch}`, {
                method: 'PATCH',
                headers: ghHeaders,
                body: JSON.stringify({ sha: newCommit.sha, force: true })
            });
        } else {
            await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/refs`, {
                method: 'POST',
                headers: ghHeaders,
                body: JSON.stringify({ ref: `refs/heads/${targetBranch}`, sha: newCommit.sha })
            });
        }

        githubSyncTotal.inc({ action: 'push', status: 'success' });

        return res.json({
            success: true,
            repoUrl: `https://github.com/${owner}/${cleanRepo}`,
            commitSha: newCommit.sha,
            branch: targetBranch,
            message: `Successfully pushed ${treeItems.length} files to ${owner}/${cleanRepo} (${targetBranch})`
        });
    } catch (err) {
        githubSyncTotal.inc({ action: 'push', status: 'error' });
        return res.status(500).json({ message: err.message || 'GitHub push failed' });
    }
};

exports.importFromGitHub = async (req, res) => {
    try {
        const { repoUrl, branch = 'main', token } = req.body;
        if (!repoUrl || !repoUrl.trim()) {
            return res.status(400).json({ message: 'GitHub repository URL or owner/repo is required' });
        }

        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        let clean = repoUrl.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/$/, '');
        const parts = clean.split('/');
        if (parts.length < 2) {
            return res.status(400).json({ message: 'Invalid repository format. Please use "owner/repo" or full GitHub URL.' });
        }
        const owner = parts[0];
        const repo = parts[1];

        const ghHeaders = {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'GenWeb-AI-Website-Builder',
            'X-GitHub-Api-Version': '2022-11-28'
        };
        if (token && token.trim()) {
            ghHeaders['Authorization'] = `Bearer ${token.trim()}`;
        }

        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: ghHeaders });
        if (!repoRes.ok) {
            const err = await repoRes.json().catch(() => ({}));
            githubSyncTotal.inc({ action: 'import', status: 'repo_not_found' });
            return res.status(repoRes.status).json({ message: err.message || 'GitHub repository not found or access denied.' });
        }
        const repoData = await repoRes.json();
        const targetBranch = (branch || repoData.default_branch || 'main').trim();

        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${targetBranch}?recursive=1`, { headers: ghHeaders });
        if (!treeRes.ok) {
            const err = await treeRes.json().catch(() => ({}));
            return res.status(treeRes.status).json({ message: `Branch "${targetBranch}" not found: ${err.message || ''}` });
        }
        const treeData = await treeRes.json();
        if (!treeData.tree || treeData.tree.length === 0) {
            return res.status(400).json({ message: 'Repository appears to be empty' });
        }

        const eligibleExtensions = ['.jsx', '.js', '.tsx', '.ts', '.html', '.css', '.json', '.svg', '.md', '.txt'];
        const ignoredPatterns = ['node_modules/', 'dist/', '.git/', '.github/', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', '.DS_Store'];

        const filesToFetch = treeData.tree.filter(item => {
            if (item.type !== 'blob') return false;
            if (ignoredPatterns.some(p => item.path.includes(p))) return false;
            return eligibleExtensions.some(ext => item.path.toLowerCase().endsWith(ext));
        }).slice(0, 50);

        if (filesToFetch.length === 0) {
            return res.status(400).json({ message: 'No suitable web source files (HTML/JSX/CSS/JS) found in this repository.' });
        }

        const currentFiles = await ProjectFile.find({ project: project._id }).lean();
        if (currentFiles.length > 0) {
            await ProjectVersion.create({
                project: project._id,
                label: `Before GitHub import (${owner}/${repo})`,
                snapshot: currentFiles.map(f => ({ path: f.path, content: f.content, language: f.language })),
                triggeredBy: 'github_import'
            });
        }

        const importedDocs = [];
        let hasJsx = false;
        let hasPackageJsonWithReact = false;

        for (const item of filesToFetch) {
            try {
                const blobRes = await fetch(item.url, { headers: ghHeaders });
                if (blobRes.ok) {
                    const blobData = await blobRes.json();
                    let content = '';
                    if (blobData.encoding === 'base64') {
                        content = Buffer.from(blobData.content, 'base64').toString('utf8');
                    } else {
                        content = blobData.content || '';
                    }

                    if (item.path.endsWith('.jsx')) hasJsx = true;
                    if (item.path === 'package.json' && content.includes('"react"')) hasPackageJsonWithReact = true;

                    importedDocs.push({
                        project: project._id,
                        path: item.path,
                        content,
                        language: detectLanguage(item.path),
                        sizeBytes: Buffer.byteLength(content, 'utf8')
                    });
                }
            } catch (blobErr) {
                console.error(`Failed to fetch blob for ${item.path}:`, blobErr);
            }
        }

        if (importedDocs.length === 0) {
            return res.status(500).json({ message: 'Failed to retrieve file contents from GitHub' });
        }

        await ProjectFile.deleteMany({ project: project._id });
        const fileOps = importedDocs.map(doc => ({
            insertOne: { document: doc }
        }));
        await ProjectFile.bulkWrite(fileOps, { ordered: false });

        project.framework = (hasJsx || hasPackageJsonWithReact) ? 'react' : 'html';
        project.lastEditedAt = new Date();
        await project.save();

        githubSyncTotal.inc({ action: 'import', status: 'success' });

        return res.json({
            success: true,
            repo: `${owner}/${repo}`,
            branch: targetBranch,
            framework: project.framework,
            importedFilesCount: importedDocs.length,
            files: importedDocs.map(d => ({ path: d.path, language: d.language }))
        });
    } catch (err) {
        githubSyncTotal.inc({ action: 'import', status: 'error' });
        return res.status(500).json({ message: err.message || 'GitHub import failed' });
    }
};
