import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Settings() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('billing');
    const [usage, setUsage] = useState(null);
    const [plans, setPlans] = useState([]);
    const [annual, setAnnual] = useState(false);
    const [customApiKey, setCustomApiKey] = useState('');
    const [upgrading, setUpgrading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const storedKey = localStorage.getItem('genweb_gemini_key') || '';
        setCustomApiKey(storedKey);

        const fetchData = async () => {
            try {
                const [usageRes, plansRes] = await Promise.all([
                    api.get('/api/billing/usage'),
                    api.get('/api/billing/plans')
                ]);
                setUsage(usageRes.data);
                setPlans(plansRes.data?.plans || []);
            } catch {
                toast.error('Failed to load billing metrics');
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveApiKey = (e) => {
        e.preventDefault();
        const trimmed = customApiKey.trim();
        if (trimmed) {
            localStorage.setItem('genweb_gemini_key', trimmed);
            toast.success('Custom Gemini API key saved');
        } else {
            localStorage.removeItem('genweb_gemini_key');
            toast.success('Custom API key cleared (using platform credits)');
        }
    };

    const handleUpgradePlan = async (planId) => {
        try {
            setUpgrading(true);
            const orderRes = await api.post('/api/billing/create-order', {
                planId,
                billingCycle: annual ? 'annual' : 'monthly'
            });

            const verifyRes = await api.post('/api/billing/verify', {
                orderId: orderRes.data.orderId,
                planId
            });

            toast.success(verifyRes.data.message || `Upgraded to ${planId.toUpperCase()}!`);
            if (updateUser && verifyRes.data.user) {
                updateUser(verifyRes.data.user);
            }

            const { data: updatedUsage } = await api.get('/api/billing/usage');
            setUsage(updatedUsage);
        } catch {
            toast.error('Failed to complete upgrade');
        } finally {
            setUpgrading(false);
        }
    };

    const creditsPercentage = usage ? Math.min(100, Math.round((usage.creditsRemaining / (usage.totalCredits || 100)) * 100)) : 100;

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
            <Navbar />
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-24 pb-16">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Settings & Workspace</h1>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Manage your account profile, subscriptions, AI generation quota, and developer integrations.
                    </p>
                </div>

                <div className="flex items-center gap-2 mb-8 border-b pb-1" style={{ borderColor: 'var(--border)' }}>
                    {[
                        { id: 'billing', label: '💳 Plan & Billing' },
                        { id: 'ai', label: '⚡ AI & Engine API' },
                        { id: 'profile', label: '👤 Account Profile' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="px-4 py-2.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                                background: activeTab === tab.id ? 'var(--bg-overlay)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loadingData ? (
                    <div className="py-20 text-center">
                        <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading settings...</p>
                    </div>
                ) : (
                    <div>
                        {activeTab === 'billing' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="card p-5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Current Plan</span>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {usage?.planName || 'Starter'}
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold mb-1 capitalize">
                                            {usage?.plan || 'Free'} Tier
                                        </div>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            Active subscription renewals apply automatically.
                                        </p>
                                    </div>

                                    <div className="card p-5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>AI Generation Credits</span>
                                            <span className="text-xs font-semibold text-indigo-400">
                                                {usage?.creditsRemaining ?? 10} / {usage?.totalCredits ?? 100}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden mb-3 border border-white/5">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${creditsPercentage}%`,
                                                    background: 'linear-gradient(90deg, #6366f1, #a855f7)'
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            {usage?.totalGenerations || 0} total AI generations generated to date.
                                        </p>
                                    </div>

                                    <div className="card p-5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Active Projects</span>
                                            <span className="text-xs font-bold text-emerald-400">
                                                {usage?.projectCount ?? 1} / {usage?.maxProjects ?? 3}
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold mb-1">
                                            {usage?.projectCount ?? 1} Projects
                                        </div>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            Includes Monaco workspaces and live edge hosting.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-lg font-bold">Subscription Tiers</h2>
                                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                Scale your workspace with unlimited generations, edge hosting, and team access.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-[#121220] p-1.5 rounded-xl border border-white/5">
                                            <button
                                                onClick={() => setAnnual(false)}
                                                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                                                style={{
                                                    background: !annual ? 'var(--accent)' : 'transparent',
                                                    color: !annual ? '#fff' : 'var(--text-muted)'
                                                }}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                onClick={() => setAnnual(true)}
                                                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                                                style={{
                                                    background: annual ? 'var(--accent)' : 'transparent',
                                                    color: annual ? '#fff' : 'var(--text-muted)'
                                                }}
                                            >
                                                Annual (Save 20%)
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {plans.map(p => {
                                            const isCurrent = (usage?.plan || 'free') === p.id;
                                            const price = annual ? p.priceAnnual : p.priceMonthly;
                                            return (
                                                <div
                                                    key={p.id}
                                                    className="card p-6 rounded-2xl flex flex-col justify-between relative transition-all"
                                                    style={{
                                                        background: 'var(--bg-surface)',
                                                        borderColor: p.id === 'pro' ? 'var(--accent)' : 'var(--border)',
                                                        boxShadow: p.id === 'pro' ? '0 10px 30px rgba(99,102,241,0.15)' : 'none'
                                                    }}
                                                >
                                                    {p.id === 'pro' && (
                                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg">
                                                            Recommended
                                                        </span>
                                                    )}
                                                    <div>
                                                        <h3 className="text-base font-bold mb-1">{p.name}</h3>
                                                        <div className="flex items-baseline gap-1 my-3">
                                                            <span className="text-3xl font-extrabold">${price}</span>
                                                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ month</span>
                                                        </div>
                                                        <ul className="space-y-2.5 my-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                            {p.features?.map((feat, idx) => (
                                                                <li key={idx} className="flex items-center gap-2">
                                                                    <span className="text-emerald-400 font-bold">✓</span>
                                                                    <span>{feat}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        {isCurrent ? (
                                                            <button
                                                                disabled
                                                                className="w-full py-2.5 rounded-xl text-xs font-semibold border text-center"
                                                                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                                                            >
                                                                Current Plan
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpgradePlan(p.id)}
                                                                disabled={upgrading}
                                                                className="w-full btn-primary py-2.5 rounded-xl text-xs font-semibold"
                                                            >
                                                                {upgrading ? 'Processing...' : `Upgrade to ${p.name}`}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="max-w-2xl space-y-6">
                                <div className="card p-6 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                                    <h3 className="text-base font-bold mb-2">Bring Your Own Google Gemini API Key</h3>
                                    <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                                        By default, GenWeb uses platform credits. If you prefer to use your own Google Cloud / AI Studio quota, provide your API key below.
                                    </p>
                                    <form onSubmit={handleSaveApiKey} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                                Gemini API Key
                                            </label>
                                            <input
                                                type="password"
                                                value={customApiKey}
                                                onChange={e => setCustomApiKey(e.target.value)}
                                                placeholder="AIzaSy..."
                                                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-black/40 border outline-none transition-colors"
                                                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button type="submit" className="btn-primary text-xs" style={{ padding: '8px 18px' }}>
                                                Save API Key
                                            </button>
                                            {customApiKey && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCustomApiKey('');
                                                        localStorage.removeItem('genweb_gemini_key');
                                                        toast.success('Cleared API key');
                                                    }}
                                                    className="btn-ghost text-xs"
                                                    style={{ padding: '8px 14px' }}
                                                >
                                                    Clear Key
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="card p-6 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                                    <h3 className="text-base font-bold mb-2">Configured Generation Models</h3>
                                    <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border" style={{ borderColor: 'var(--border)' }}>
                                            <div>
                                                <p className="font-semibold text-white">Google Gemini 3.8 Flash</p>
                                                <p className="text-gray-400">High-speed code synthesis, delta surgeries, and multi-file generation</p>
                                            </div>
                                            <span className="text-emerald-400 font-semibold">Active Engine</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="max-w-2xl space-y-6">
                                <div className="card p-6 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                                    <h3 className="text-base font-bold mb-4">User Profile</h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.userName} className="w-16 h-16 rounded-full border border-white/10" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-indigo-600 text-white">
                                                {user?.userName?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-white">{user?.userName}</p>
                                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                                            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                Plan: {user?.plan || 'Free'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            Authentication is secured via Firebase Google Sign-in with server-validated JWT session cookies.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
