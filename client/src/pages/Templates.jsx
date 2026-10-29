import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const CATEGORIES = ['all', 'portfolio', 'saas', 'agency', 'business', 'ecommerce', 'restaurant', 'realestate', 'blog', 'startup', 'docs'];

const CATEGORY_ICONS = {
    all: '🌐', portfolio: '🎨', saas: '🚀', agency: '🏢', business: '💼',
    ecommerce: '🛍', restaurant: '🍽', realestate: '🏠', blog: '📝', startup: '⚡', docs: '📚'
};

export default function Templates() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [frameworkFilter, setFrameworkFilter] = useState('all');
    const [search, setSearch] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/templates', { params: { category: category !== 'all' ? category : undefined, search: search || undefined } });
                setTemplates(data);
            } catch {
                toast.error('Failed to load templates');
            } finally {
                setLoading(false);
            }
        };
        const t = setTimeout(load, search ? 300 : 0);
        return () => clearTimeout(t);
    }, [category, search]);

    const handleUseTemplate = async (template) => {
        if (!user) {
            toast.error('Please sign in to use templates');
            return;
        }
        try {
            const { data } = await api.post('/api/projects', {
                name: `${template.name} — My Site`,
                description: template.description,
                framework: template.framework || 'html',
                templateId: template._id
            });
            toast.success('Project created from template');
            navigate(`/workspace/${data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to use template');
        }
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl font-bold mb-3">Template Gallery</h1>
                    <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                        Start from a professionally designed template and customize it with AI
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                                style={{
                                    background: category === cat ? 'var(--accent)' : 'var(--bg-elevated)',
                                    color: category === cat ? 'white' : 'var(--text-secondary)',
                                    border: '1px solid',
                                    borderColor: category === cat ? 'var(--accent)' : 'var(--border)',
                                    cursor: 'pointer'
                                }}
                            >
                                {CATEGORY_ICONS[cat]} {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative md:ml-auto">
                        <input
                            type="text"
                            className="input pl-9"
                            style={{ width: '220px' }}
                            placeholder="Search templates..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-8">
                    {[
                        { id: 'all', label: `All (${templates.length})` },
                        { id: 'react', label: `⚛️ React (${templates.filter(t => t.framework === 'react').length})` },
                        { id: 'html', label: `🌐 HTML (${templates.filter(t => (t.framework || 'html') !== 'react').length})` }
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
                            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="skeleton" style={{ height: '180px', borderRadius: 0 }} />
                                <div className="p-4 space-y-2">
                                    <div className="skeleton" style={{ height: '14px', width: '55%' }} />
                                    <div className="skeleton" style={{ height: '12px', width: '75%' }} />
                                    <div className="skeleton" style={{ height: '32px', width: '100%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : templates.filter(t => frameworkFilter === 'all' || (t.framework || 'html') === frameworkFilter).length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-5xl mb-4">🎨</div>
                        <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {search ? 'Try different keywords' : 'Templates will appear here once seeded'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {templates.filter(t => frameworkFilter === 'all' || (t.framework || 'html') === frameworkFilter).map((template, i) => (
                            <motion.div
                                key={template._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="card group"
                                style={{ padding: 0, overflow: 'hidden' }}
                            >
                                <div
                                    className="relative h-44 flex items-center justify-center overflow-hidden"
                                    style={{
                                        background: `linear-gradient(135deg, ${getCategoryGradient(template.category)})`,
                                        borderBottom: '1px solid var(--border)'
                                    }}
                                >
                                    {template.thumbnail ? (
                                        <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl opacity-40">{CATEGORY_ICONS[template.category]}</span>
                                    )}
                                    {template.featured && (
                                        <div className="absolute top-3 left-3">
                                            <span className="badge badge-indigo">Featured</span>
                                        </div>
                                    )}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        style={{ background: 'rgba(0,0,0,0.6)' }}
                                    >
                                        <button
                                            onClick={() => handleUseTemplate(template)}
                                            className="btn-primary text-sm"
                                        >
                                            Use Template
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="text-sm font-semibold">{template.name}</h3>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`badge ${template.framework === 'react' ? 'badge-cyan' : 'badge-indigo'} text-[11px]`}>
                                                {template.framework === 'react' ? '⚛️ React' : '🌐 HTML'}
                                            </span>
                                            <span className="badge badge-indigo text-xs capitalize">{template.category}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {template.description}
                                    </p>
                                    <button
                                        onClick={() => handleUseTemplate(template)}
                                        className="btn-primary w-full justify-center text-xs"
                                        style={{ padding: '8px' }}
                                    >
                                        Use Template
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function getCategoryGradient(category) {
    const gradients = {
        portfolio: '#1a1a3e, #2d1b69',
        saas: '#0f2027, #203a43, #2c5364',
        agency: '#1a1a2e, #16213e',
        business: '#0a0a1a, #1a2744',
        ecommerce: '#1a0a2e, #2d1b4e',
        restaurant: '#1a0a00, #2d1500',
        realestate: '#0a1a0a, #1a3a1a',
        blog: '#1a1a1a, #2a2a3e',
        startup: '#0a001a, #1a0a2e',
        docs: '#001a1a, #0a2a2a',
    };
    return gradients[category] || '#1a1a2e, #2d1b69';
}
