import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import API from '../api/api';

const AuthContext = createContext(null);

// Helper function to decode JWT and check expiration
const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expirationTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    // 1. Lazy Initialize User from LocalStorage
    // This ensures that on refresh, the state is hydrated immediately before the first render
    const [user, setUser] = useState(() => {
        try {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                if (isTokenExpired(token)) {
                    localStorage.clear();
                    return null;
                }
                return JSON.parse(savedUser);
            }
        } catch (error) {
            console.error("Failed to parse user from storage", error);
            localStorage.clear();
        }
        return null;
    });

    const [loading, setLoading] = useState(false); // No need for true initial loading with lazy init

    const logout = useCallback(async () => {
        try {
            // Attempt backend logout (stateless, but good practice)
            await API.post('/auth/logout');
        } catch (error) {
            console.warn("Backend logout failed (non-critical):", error);
        } finally {
            // Always clear client state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            // Use replace to prevent back-button navigation to protected pages
            window.location.replace('/login');
        }
    }, []);

    // 2. Periodic Token Check
    useEffect(() => {
        // Initial check is done in lazy init, so we just set up the interval here
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                console.warn('Token expired during session, logging out');
                logout();
                window.location.href = '/login';
            }
        }, 60000); // Check every minute

        const handleUnauthorized = () => {
            console.warn('Received global 401/403 event. Logging out.');
            logout();
            window.location.href = '/login';
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            clearInterval(interval);
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [logout]);

    const login = useCallback(async (identifier, password) => {
        const res = await API.post('/auth/login', { identifier, password });

        const token = res.data?.token;
        if (!token) throw new Error('Token not returned');

        // Check if user is blocked
        if (res.data?.isBlocked) {
            throw new Error('Your account has been blocked. Please contact support.');
        }

        const roles =
            res.data?.roles ||
            res.data?.user?.roles ||
            res.data?.authorities ||
            [];

        if (!Array.isArray(roles) || roles.length === 0) {
            throw new Error('Roles not found');
        }

        const normalizedRoles = roles.map(r =>
            r.startsWith('ROLE_') ? r : `ROLE_${r}`
        );

        const userData = {
            ...res.data,
            identifier,
            roles: normalizedRoles,
            // Normalize isApproved (backend might send 'approved' or 'isApproved')
            isApproved: res.data.isApproved !== undefined ? res.data.isApproved : res.data.approved
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return userData;
    }, []);

    const register = useCallback(async (userData) => {
        // API instance will now automatically handle Content-Type:
        // - application/json for objects
        // - multipart/form-data; boundary=... for FormData
        const res = await API.post('/auth/signup', userData);
        return res.data;
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (token && !isTokenExpired(token)) {
                const res = await API.get('/auth/me');
                if (res.data) {
                    const userData = {
                        ...res.data,
                        token: token, // Keep existing token
                        roles: res.data.roles.map(r => r.startsWith('ROLE_') ? r : `ROLE_${r}`),
                        // Normalize isApproved
                        isApproved: res.data.isApproved !== undefined ? res.data.isApproved : res.data.approved
                    };

                    // Check if newly blocked
                    if (res.data.isBlocked) {
                        logout();
                        return null;
                    }

                    // Only update state if data actually changed to verify strict equality downstream
                    // But for now, stable function reference is the key.
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    return userData;
                }
            }
        } catch (error) {
            console.error("Failed to refresh user session", error);
            // If checking /me fails with 401, usually means token invalid
            if (error.response?.status === 401) {
                logout();
            }
        }
        return null;
    }, [logout]);

    // 3. Refresh user on mount
    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authenticated: !!user, login, register, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
