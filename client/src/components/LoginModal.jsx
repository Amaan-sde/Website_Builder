import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LoginModal({ onClose }) {
    const [loading, setLoading] = useState(false);
    const { loginWithGoogle, loginAsDemo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleGoogleAuth = async () => {
        try {
            setLoading(true);
            await loginWithGoogle();
            toast.success('Welcome to GenWeb.ai!');
            onClose?.();
            navigate('/dashboard');
        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user') return;
            const msg = err.response?.data?.message || err.message || 'Authentication failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoAuth = async () => {
        try {
            setLoading(true);
            await loginAsDemo();
            toast.success('Signed in as Demo User');
            onClose?.();
            navigate('/dashboard');
        } catch {
            toast.error('Demo sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-md rounded-2xl p-8 text-white"
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
                }}
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-5 right-5 p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-base" style={{ background: 'var(--accent)' }}>G</div>
                    <h2 className="text-xl font-bold mb-1">Welcome to GenWeb.ai</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Sign in to start building AI-powered websites
                    </p>
                </div>

                <button
                    id="google-signin-btn"
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all"
                    style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={e => !loading && (e.currentTarget.style.borderColor = 'var(--border-hover)')}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                    )}
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Or</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                <button
                    id="demo-signin-btn"
                    type="button"
                    onClick={handleDemoAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white transition-all shadow-md"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                    <span>⚡</span>
                    <span>Explore Demo Account (Instant Access)</span>
                </button>

                <p className="text-xs text-center mt-6" style={{ color: 'var(--text-muted)' }}>
                    By continuing, you agree to our{' '}
                    <a href="#" className="underline" style={{ color: 'var(--text-secondary)' }}>Terms</a>
                    {' '}and{' '}
                    <a href="#" className="underline" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</a>
                </p>
            </motion.div>
        </motion.div>
    );
}