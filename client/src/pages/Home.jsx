import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';
import toast from 'react-hot-toast';

const EXAMPLE_PROMPTS = [
    'A luxury e-commerce sneaker and streetwear store with shopping cart and checkout',
    'An artisanal Italian restaurant website with menu, dietary tags, and table reservation',
    'A high-performance athletics gym with weekly class schedule booking and trainer profiles',
    'Luxury real estate estate showcase with property specs, mortgage calculator, and VIP tour',
    'Personal portfolio for a full-stack engineer with interactive case studies and demo modals',
    'Modern telemetry SaaS platform with live analytics dashboard and API sandbox'
];

const FEATURES = [
    {
        icon: '⚡',
        title: 'Generate in Seconds',
        desc: 'Describe your vision and watch a complete, production-ready website appear — HTML, CSS, and JavaScript all structured and styled.'
    },
    {
        icon: '🎯',
        title: 'Targeted AI Edits',
        desc: 'Ask for changes conversationally. The AI modifies only the relevant files — your untouched content stays exactly as it is.'
    },
    {
        icon: '🔒',
        title: 'Version History',
        desc: 'Every AI generation automatically creates a snapshot. Restore any previous version in one click, no data ever lost.'
    },
    {
        icon: '🖊️',
        title: 'Full Code Control',
        desc: 'Edit generated files directly in the built-in code editor. Your code, your rules — no lock-in to proprietary formats.'
    },
    {
        icon: '📱',
        title: 'Responsive by Default',
        desc: 'Every generated website works beautifully across desktop, tablet, and mobile with no extra prompting required.'
    },
    {
        icon: '🚀',
        title: 'Deploy-Ready Output',
        desc: 'Clean, standards-compliant code you can host anywhere. Export your project and deploy to any hosting platform.'
    }
];

const HOW_IT_WORKS = [
    { step: '01', title: 'Describe your website', desc: 'Tell the AI what you need in plain English. Be as specific or as brief as you like.' },
    { step: '02', title: 'AI generates the project', desc: 'Gemini builds a complete multi-file website with real content, styling, and interactivity.' },
    { step: '03', title: 'Refine conversationally', desc: 'Ask for changes, additions, or adjustments. The AI edits surgically without breaking your work.' },
    { step: '04', title: 'Download or deploy', desc: 'Export clean code ready for any hosting platform, or use the built-in deployment when available.' }
];

const PLANS = [
    {
        name: 'Free',
        price: '₹0',
        period: 'forever',
        desc: 'Perfect for trying out the platform',
        features: ['10 AI generations/month', '3 active projects', 'All templates', 'Code editor', 'Version history'],
        cta: 'Get Started Free',
        highlighted: false
    },
    {
        name: 'Pro',
        price: '₹799',
        period: '/month',
        desc: 'For professionals and freelancers',
        features: ['100 AI generations/month', 'Unlimited projects', 'Priority AI queue', 'Advanced templates', 'Export to ZIP', 'Email support'],
        cta: 'Start Pro',
        highlighted: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        desc: 'For teams and agencies',
        features: ['Unlimited generations', 'Team workspaces', 'Custom templates', 'API access', 'Dedicated support', 'SLA guarantee'],
        cta: 'Contact Us',
        highlighted: false
    }
];

const FAQS = [
    { q: 'Does the AI generate real, working code?', a: 'Yes. Every generation produces actual HTML, CSS, and JavaScript files with real content, not placeholder text or skeleton code.' },
    { q: 'Can I edit the generated code myself?', a: 'Absolutely. The built-in code editor gives you full access to every file. You own your code completely.' },
    { q: 'What happens if an AI edit breaks something?', a: 'Nothing is ever lost. Every AI action creates a version snapshot automatically. Restore any previous state in one click.' },
    { q: 'Which AI model powers the generation?', a: 'We use Google\'s Gemini model with structured output schemas, ensuring reliable, well-formed code output rather than fragile string parsing.' },
    { q: 'Do I need coding knowledge to use this?', a: 'No. Natural language descriptions are enough to build full websites. Coding knowledge is optional for deeper customization.' },
    { q: 'Can I use the generated websites commercially?', a: 'Yes. Generated code is yours to use however you wish, including commercial projects.' }
];

export default function Home() {
    const [openLogin, setOpenLogin] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromptIdx(i => (i + 1) % EXAMPLE_PROMPTS.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const handleGenerate = () => {
        if (!user) {
            setOpenLogin(true);
            return;
        }
        if (!prompt.trim()) {
            toast.error('Please describe the website you want to build');
            return;
        }
        navigate('/dashboard', { state: { initialPrompt: prompt.trim() } });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate();
    };

    return (
        <div className="relative min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <div
                className="pointer-events-none fixed inset-0 overflow-hidden"
                aria-hidden="true"
            >
                <div
                    className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.07]"
                    style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)', filter: 'blur(60px)' }}
                />
                <div
                    className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                    style={{ background: 'radial-gradient(ellipse, #8b5cf6 0%, transparent 70%)', filter: 'blur(60px)' }}
                />
            </div>

            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
                style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'var(--border)' }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'var(--accent)' }}>G</div>
                        <span className="text-base font-semibold tracking-tight">GenWeb<span style={{ color: 'var(--accent)' }}>.ai</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'How it Works', 'Templates', 'Pricing'].map(item => (
                            <a
                                key={item}
                                href={item === 'Templates' ? '/templates' : `#${item.toLowerCase().replace(' ', '-')}`}
                                className="text-sm transition-colors"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                    {user ? (
                        <button
                            id="nav-dashboard"
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary text-sm flex items-center gap-1.5"
                            style={{ padding: '8px 18px' }}
                        >
                            <span>Dashboard</span>
                            <span aria-hidden="true">→</span>
                        </button>
                    ) : (
                        <button
                            id="nav-get-started"
                            onClick={() => setOpenLogin(true)}
                            className="btn-primary text-sm"
                            style={{ padding: '8px 18px' }}
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </motion.nav>

            <section className="relative pt-36 pb-28 px-6 text-center" id="hero">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="badge badge-indigo mx-auto mb-6" style={{ width: 'fit-content' }}>
                        Powered by Gemini AI
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
                        Build stunning websites<br />
                        <span className="gradient-text">with a single sentence</span>
                    </h1>
                    <p className="text-lg max-w-xl mx-auto mb-12" style={{ color: 'var(--text-secondary)' }}>
                        Describe your idea. GenWeb.ai generates a complete, responsive, production-ready website instantly — then lets you edit it conversationally.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="max-w-2xl mx-auto"
                >
                    <div
                        className="relative rounded-xl p-1"
                        style={{
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2), rgba(59,130,246,0.2))',
                        }}
                    >
                        <div
                            className="rounded-[10px] overflow-hidden"
                            style={{ background: 'var(--bg-elevated)' }}
                        >
                            <textarea
                                id="hero-prompt"
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={3}
                                maxLength={2000}
                                className="w-full px-5 pt-4 pb-2 resize-none bg-transparent border-none outline-none text-sm"
                                style={{ color: 'var(--text-primary)' }}
                                placeholder={EXAMPLE_PROMPTS[currentPromptIdx]}
                            />
                            <div className="flex items-center justify-between px-4 pb-3">
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    {prompt.length}/2000 · ⌘↵ to generate
                                </span>
                                <button
                                    id="hero-generate"
                                    onClick={handleGenerate}
                                    className="btn-primary text-sm"
                                    style={{ padding: '8px 20px' }}
                                >
                                    Generate →
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {EXAMPLE_PROMPTS.slice(0, 3).map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setPrompt(p)}
                                className="text-xs px-3 py-1.5 rounded-full border transition-all"
                                style={{
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-secondary)',
                                    background: 'var(--bg-surface)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                {p.slice(0, 40)}…
                            </button>
                        ))}
                    </div>
                </motion.div>
            </section>

            <section className="py-24 px-6 max-w-7xl mx-auto" id="features">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship</h2>
                    <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Not just a code generator. A complete website creation and management platform.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="card"
                        >
                            <div className="text-2xl mb-4">{f.icon}</div>
                            <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6" id="how-it-works" style={{ background: 'var(--bg-surface)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
                        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>From idea to live website in minutes</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {HOW_IT_WORKS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="text-center"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-sm font-bold"
                                    style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.25)' }}
                                >
                                    {s.step}
                                </div>
                                <h3 className="text-sm font-semibold mb-2">{s.title}</h3>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 max-w-5xl mx-auto" id="pricing">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                    <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Start free. Scale when you're ready.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className={`card relative ${plan.highlighted ? 'gradient-border' : ''}`}
                            style={plan.highlighted ? { background: 'var(--bg-elevated)' } : {}}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="badge badge-indigo text-xs">Most Popular</span>
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-base font-semibold mb-1">{plan.name}</h3>
                                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{plan.desc}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">{plan.price}</span>
                                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feat, fi) => (
                                    <li key={fi} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <span style={{ color: 'var(--success)' }}>✓</span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setOpenLogin(true)}
                                className={plan.highlighted ? 'btn-primary w-full justify-center' : 'btn-ghost w-full justify-center'}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-24 px-6" id="faq" style={{ background: 'var(--bg-surface)' }}>
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
                    </div>
                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <FaqItem key={i} faq={faq} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to build something?</h2>
                    <p className="text-base mb-10" style={{ color: 'var(--text-secondary)' }}>
                        Join thousands of designers and developers who build with GenWeb.ai. Free to start, no card required.
                    </p>
                    <button
                        id="cta-bottom"
                        onClick={() => setOpenLogin(true)}
                        className="btn-primary text-base"
                        style={{ padding: '14px 36px' }}
                    >
                        Start Building Free
                    </button>
                </div>
            </section>

            <footer className="border-t px-6 py-10" style={{ borderColor: 'var(--border)' }}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)' }}>G</div>
                        <span className="text-sm font-medium">GenWeb.ai</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        © {new Date().getFullYear()} GenWeb.ai. Built with Gemini AI.
                    </p>
                    <div className="flex gap-6">
                        {['Privacy', 'Terms', 'Contact'].map(l => (
                            <a key={l} href="#" className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}>{l}</a>
                        ))}
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {openLogin && <LoginModal onClose={() => setOpenLogin(false)} />}
            </AnimatePresence>
        </div>
    );
}

function FaqItem({ faq }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="card cursor-pointer"
            style={{ padding: '16px 20px' }}
            onClick={() => setOpen(o => !o)}
        >
            <div className="flex justify-between items-center gap-4">
                <h3 className="text-sm font-medium">{faq.q}</h3>
                <span
                    className="text-lg transition-transform shrink-0"
                    style={{ color: 'var(--text-muted)', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}
                >
                    +
                </span>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm mt-3 overflow-hidden"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {faq.a}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}