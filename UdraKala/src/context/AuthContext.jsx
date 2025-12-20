import { createContext, useContext, useEffect, useState } from 'react';
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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Validate token on mount and periodically
    useEffect(() => {
        const validateSession = () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                // Check if token is expired
                if (isTokenExpired(token)) {
                    console.warn('Token expired, logging out');
                    localStorage.clear();
                    setUser(null);
                } else {
                    const parsedUser = JSON.parse(savedUser);

                    // Check if user is blocked
                    if (parsedUser.isBlocked) {
                        console.warn('User is blocked, logging out');
                        localStorage.clear();
                        setUser(null);
                    } else {
                        // Normalize isApproved from storage if needed
                        if (parsedUser.isApproved === undefined && parsedUser.approved !== undefined) {
                            parsedUser.isApproved = parsedUser.approved;
                            // Optionally update localStorage to be clean for next time
                            localStorage.setItem('user', JSON.stringify(parsedUser));
                        }
                        setUser(parsedUser);
                    }
                }
            }
            setLoading(false);
        };

        validateSession();

        // Check token expiration every minute
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                console.warn('Token expired during session, logging out');
                localStorage.clear();
                setUser(null);
                window.location.href = '/login';
            }
        }, 60000); // Check every minute

        // Global 401 Listener
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
    }, []);

    const login = async (identifier, password) => {
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
    };

    const register = async (userData) => {
        const res = await API.post('/auth/signup', userData);
        return res.data;
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    const refreshUser = async () => {
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
    };

    return (
        <AuthContext.Provider value={{ user, authenticated: !!user, login, register, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
