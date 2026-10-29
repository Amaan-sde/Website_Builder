import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import CreateProjectModal from '../components/CreateProjectModal';

const STATUS_BADGE = {
    draft: 'badge-indigo',
    published: 'badge-green',
    failed: 'badge-red',
    building: 'badge-amber',
    deploying: 'badge-amber'
};

const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
};

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [frameworkFilter, setFrameworkFilter] = useState('all');
    const [showCreate, setShowCreate] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [initPrompt, setInitPrompt] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/projects', { params: { search: search || undefined } });
            setProjects(data.projects || []);
        } catch {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(fetchProjects, search ? 300 : 0);
        return () => clearTimeout(timer);
    }, [fetchProjects, search]);

    useEffect(() => {
        if (location.state?.initialPrompt) {
            setInitPrompt(location.state.initialPrompt);
            setShowCreate(true);
            window.history.replaceState({}, '');
        }
    }, [location.state]);

    const handleCreateWithAI = async (prompt, name, framework = 'react') => {
        setShowCreate(false);
        const toastId = toast.loading('Initializing workspace studio...');

        try {
            const { data } = await api.post('/api/projects', {
                name: name || 'AI Website',
                framework: framework || 'react'
            });
            toast.dismiss(toastId);
            navigate(`/workspace/${data._id}`, {
                state: {
                    autoGenerate: true,
                    prompt: prompt.trim(),
                    framework: framework || 'react'
                }
            });
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failed to initialize project', { id: toastId });
        }
    };

    const handleCreateBlank = async (name, framework) => {
        setShowCreate(false);
        try {
            const { data } = await api.post('/api/projects', { name, framework });
            toast.success('Project created');
            navigate(`/workspace/${data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create project');
        }
    };

    const handleDeleteProject = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Delete this project? This cannot be undone.')) return;
        try {
            await api.delete(`/api/projects/${id}`);
            setProjects(p => p.filter(pr => pr._id !== id));
            toast.success('Project deleted');
        } catch {
            toast.error('Failed to delete project');
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesFramework = frameworkFilter === 'all' || (p.framework || 'html') === frameworkFilter;
        return matchesSearch && matchesFramework;
    });

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
                >
                    <div>
                        <h1 className="text-2xl font-bold mb-1">
                            {user?.userName ? `Welcome back, ${user.userName.split(' ')[0]}` : 'Dashboard'}
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {projects.length} project{projects.length !== 1 ? 's' : ''}
                            {user?.plan && (
                                <span className="ml-2 badge badge-indigo">{user.plan}</span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                className="input pl-9"
                                style={{ width: '220px' }}
                                placeholder="Search projects..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <button
                            id="create-project-btn"
                            onClick={() => setShowCreate(true)}
                            disabled={generating}
                            className="btn-primary"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Project
                        </button>
                    </div>
                </motion.div>

                <div className="flex items-center gap-2 mb-8">
                    {[
                        { id: 'all', label: `All (${projects.length})` },
                        { id: 'react', label: `⚛️ React (${projects.filter(p => p.framework === 'react').length})` },
                        { id: 'html', label: `🌐 HTML (${projects.filter(p => (p.framework || 'html') !== 'react').length})` }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFrameworkFilter(tab.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{
                                background: frameworkFilter === tab.id ? 'var(--bg-elevated)' : 'transparent',
                                color: frameworkFilter === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                border: frameworkFilter === tab.id ? '1px solid var(--border-hover)' : '1px solid transparent',
                                cursor: 'pointer'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div className="skeleton" style={{ height: '140px', borderRadius: '0' }} />
                                <div className="p-4 space-y-2">
                                    <div className="skeleton" style={{ height: '16px', width: '60%' }} />
                                    <div className="skeleton" style={{ height: '12px', width: '40%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32"
                    >
                        <div className="text-5xl mb-4">🌐</div>
                        <h3 className="text-lg font-semibold mb-2">
                            {search ? 'No projects found' : 'No projects yet'}
                        </h3>
                        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                            {search ? 'Try a different search term' : 'Create your first AI-powered website to get started'}
                        </p>
                        {!search && (
                            <button onClick={() => setShowCreate(true)} className="btn-primary">
                                Create your first project
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredProjects.map((project, i) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => navigate(`/workspace/${project._id}`)}
                                className="card cursor-pointer group"
                                style={{ padding: 0, overflow: 'hidden' }}
                            >
                                <div
                                    className="relative h-36 flex items-center justify-center transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-overlay))',
                                        borderBottom: '1px solid var(--border)'
                                    }}
                                >
                                    {project.thumbnail ? (
                                        <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-4xl opacity-30">🌐</div>
                                    )}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                                        style={{ background: 'rgba(0,0,0,0.6)' }}
                                    >
                                        <span className="btn-primary text-xs" style={{ padding: '6px 14px' }}>Open Editor</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="text-sm font-semibold truncate">{project.name}</h3>
                                        <button
                                            onClick={e => handleDeleteProject(e, project._id)}
                                            className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                            aria-label="Delete project"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            {timeAgo(project.updatedAt)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className={`badge ${project.framework === 'react' ? 'badge-cyan' : 'badge-indigo'} text-[11px]`}>
                                                {project.framework === 'react' ? '⚛️ React' : '🌐 HTML'}
                                            </span>
                                            {project.status === 'published' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
                                                        window.open(`${serverUrl}/site/${project._id}`, '_blank');
                                                    }}
                                                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                                                    title="Open live published website"
                                                >
                                                    <span>Live</span>
                                                    <span>↗</span>
                                                </button>
                                            )}
                                            <span className={`badge ${STATUS_BADGE[project.status] || 'badge-indigo'} text-xs`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCreate && (
                    <CreateProjectModal
                        initialPrompt={initPrompt}
                        onClose={() => { setShowCreate(false); setInitPrompt(''); }}
                        onCreateBlank={handleCreateBlank}
                        onCreateWithAI={handleCreateWithAI}
                        generating={generating}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

class EventSourceWithPost {
    constructor(url, body) {
        this.listeners = {};
        this.closed = false;
        this._connect(url, body);
    }

    async _connect(url, body) {
        try {
            const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
            const res = await fetch(`${serverUrl}/api/generate/website`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: 'Generation failed' }));
                this._emit('error', { message: err.message });
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (!this.closed) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop();

                for (const part of parts) {
                    const lines = part.split('\n');
                    let event = 'message';
                    let data = '';
                    for (const line of lines) {
                        if (line.startsWith('event: ')) event = line.slice(7);
                        if (line.startsWith('data: ')) data = line.slice(6);
                    }
                    if (data) {
                        try {
                            this._emit(event, JSON.parse(data));
                        } catch (_) {}
                    }
                }
            }
        } catch (err) {
            this._emit('error', { message: err.message || 'Connection failed' });
        }
    }

    _emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }

    onmessage(event, fn) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
    }

    onerror(fn) {
        this.onmessage('error', fn);
    }

    close() {
        this.closed = true;
    }
}
