import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const { data } = await api.get('/api/user/me');
            setUser(data?._id ? data : null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        const handle = () => { setUser(null); };
        window.addEventListener('auth:unauthorized', handle);
        return () => window.removeEventListener('auth:unauthorized', handle);
    }, []);

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
        const { data } = await api.post('/api/auth/google', { idToken });
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        setUser(data.user);
        return data.user;
    };

    const loginAsDemo = async () => {
        const { data } = await api.post('/api/auth/demo');
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        localStorage.removeItem('token');
        await api.get('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginAsDemo, logout, refetch: fetchCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
