import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import toast from 'react-hot-toast';

export default function Navbar({ minimal = false }) {
    const [showLogin, setShowLogin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            toast.success('Signed out');
        } catch {
            toast.error('Logout failed');
        }
        setShowMenu(false);
    };

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b"
                style={{ background: 'rgba(8,8,16,0.9)', borderColor: 'var(--border)', height: '56px' }}
            >
                <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
                    <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 text-white no-underline">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)' }}>G</div>
                        <span className="text-sm font-semibold">GenWeb<span style={{ color: 'var(--accent)' }}>.ai</span></span>
                    </Link>

                    {!minimal && (
                        <div className="flex items-center gap-2">
                            {user ? (
                                <div className="flex items-center gap-2.5">
                                    <Link
                                        to="/settings"
                                        className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold no-underline transition-all"
                                        style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)' }}
                                    >
                                        <span>✨</span>
                                        <span>{user.credits ?? 10} credits</span>
                                    </Link>
                                    <div className="relative">
                                        <button
                                            id="user-menu-btn"
                                            onClick={() => setShowMenu(o => !o)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
                                            style={{ border: '1px solid var(--border)' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                        >
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.userName} className="w-6 h-6 rounded-full" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)' }}>
                                                    {user.userName?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <span className="text-xs hidden md:block" style={{ color: 'var(--text-secondary)' }}>{user.userName?.split(' ')[0]}</span>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </button>
                                        {showMenu && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                                <div
                                                    className="absolute right-0 top-full mt-2 w-48 rounded-xl py-1 z-50"
                                                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
                                                >
                                                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                                                        <p className="text-xs font-medium truncate">{user.userName}</p>
                                                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                                                    </div>
                                                    <Link
                                                        to="/dashboard"
                                                        onClick={() => setShowMenu(false)}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs transition-colors no-underline"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/templates"
                                                        onClick={() => setShowMenu(false)}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs transition-colors no-underline"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        Templates
                                                    </Link>
                                                    <Link
                                                        to="/settings"
                                                        onClick={() => setShowMenu(false)}
                                                        className="flex items-center gap-2 px-3 py-2 text-xs transition-colors no-underline"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        Settings & Plans
                                                    </Link>
                                                    <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left"
                                                        style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        Sign out
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setShowLogin(true)} className="btn-primary text-xs" style={{ padding: '7px 16px' }}>
                                    Sign In
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <AnimatePresence>
                {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
            </AnimatePresence>
        </>
    );
}
