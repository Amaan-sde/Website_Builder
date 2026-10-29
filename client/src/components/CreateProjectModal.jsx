import { useState } from 'react';
import { motion } from 'motion/react';

const TEMPLATES_QUICK = [
    { label: '🛍️ E-Commerce Store', prompt: 'A luxury e-commerce sneaker and apparel store with shopping cart drawer, category filters, wishlist, promo codes, and checkout modal' },
    { label: '🍽️ Artisanal Dining', prompt: 'An elegant restaurant and wine cellar with categorized menu, dietary tags, dish modal, and interactive table reservation booking' },
    { label: '⚡ High-Performance Gym', prompt: 'An athletics gym with weekly interactive class schedule booking, trainer showcase, and membership tier calculator' },
    { label: '🏛️ Luxury Real Estate', prompt: 'A luxury architectural property showcase with property filters, mortgage calculator, and private VIP tour booking' },
    { label: '💼 Creative Portfolio', prompt: 'A creative technologist portfolio with filterable case studies, interactive demo modals, and technical skills matrix' },
    { label: '🚀 Observability Cloud', prompt: 'A next-gen cloud telemetry platform with live interactive metric graphs, time range filters, and API key generator' }
];

export default function CreateProjectModal({ initialPrompt = '', onClose, onCreateBlank, onCreateWithAI, generating }) {
    const [tab, setTab] = useState('ai');
    const [prompt, setPrompt] = useState(initialPrompt);
    const [projectName, setProjectName] = useState('');
    const [framework, setFramework] = useState('react');

    const handleAI = (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        onCreateWithAI(prompt.trim(), projectName.trim() || undefined, framework);
    };

    const handleBlank = (e) => {
        e.preventDefault();
        if (!projectName.trim()) return;
        onCreateBlank(projectName.trim(), framework);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-lg rounded-2xl"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold">New Project</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                        {[{ id: 'ai', label: '✨ Generate with AI' }, { id: 'blank', label: '📄 Blank Project' }].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className="flex-1 py-2 text-xs font-medium rounded-md transition-all"
                                style={{
                                    background: tab === t.id ? 'var(--bg-overlay)' : 'transparent',
                                    color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {tab === 'ai' ? (
                        <form onSubmit={handleAI} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    Describe your website
                                </label>
                                <textarea
                                    id="create-prompt"
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    rows={4}
                                    maxLength={2000}
                                    className="input resize-none"
                                    placeholder="A modern portfolio for a photographer with gallery, about, and contact sections..."
                                    required
                                />
                                <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{prompt.length}/2000</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    Project name <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="My Awesome Website"
                                    value={projectName}
                                    onChange={e => setProjectName(e.target.value)}
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    Framework Mode
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFramework('react')}
                                        className="p-3 rounded-xl text-left transition-all"
                                        style={{
                                            border: framework === 'react' ? '1px solid #38bdf8' : '1px solid var(--border)',
                                            background: framework === 'react' ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-elevated)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                                                <span>⚛️</span> React 18
                                            </span>
                                            {framework === 'react' && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                            )}
                                        </div>
                                        <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                                            Components, Hooks & Tailwind CSS
                                        </p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFramework('html')}
                                        className="p-3 rounded-xl text-left transition-all"
                                        style={{
                                            border: framework === 'html' ? '1px solid #818cf8' : '1px solid var(--border)',
                                            background: framework === 'html' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-elevated)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                                                <span>🌐</span> HTML5
                                            </span>
                                            {framework === 'html' && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                            )}
                                        </div>
                                        <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                                            Classic HTML, CSS & Vanilla JS
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Quick templates</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {TEMPLATES_QUICK.map(t => (
                                        <button
                                            key={t.label}
                                            type="button"
                                            onClick={() => setPrompt(t.prompt)}
                                            className="text-left px-3 py-2 rounded-lg text-xs transition-all"
                                            style={{
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-secondary)',
                                                background: 'transparent'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = 'var(--border-hover)';
                                                e.currentTarget.style.color = 'var(--text-primary)';
                                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.color = 'var(--text-secondary)';
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                id="generate-website-btn"
                                type="submit"
                                disabled={!prompt.trim() || generating}
                                className="btn-primary w-full justify-center"
                            >
                                {generating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Generating...
                                    </>
                                ) : '✨ Generate Website'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleBlank} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    Project name
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="My Website"
                                    value={projectName}
                                    onChange={e => setProjectName(e.target.value)}
                                    maxLength={100}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Framework</label>
                                <select
                                    value={framework}
                                    onChange={e => setFramework(e.target.value)}
                                    className="input"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="react">⚛️ React 18 (Vite + Tailwind CSS)</option>
                                    <option value="html">🌐 HTML5 / CSS / Vanilla JS</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={!projectName.trim()}
                                className="btn-primary w-full justify-center"
                            >
                                Create Project
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
