import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Load - check for authentication via cookie
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_URL}/api/auth/me`, {
                    credentials: 'include' // Important: sends cookie
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setToken(true); // Token exists in httpOnly cookie
                }
            } catch (error) {
                // Not authenticated, silent fail
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const getCsrfToken = async () => {
        try {
            const res = await fetch(`${API_URL}/api/csrf-token`, { credentials: 'include' });
            return (await res.json()).csrfToken;
        } catch (e) {
            return null;
        }
    };

    const login = async (phone, password) => {
        try {
            const csrfToken = await getCsrfToken();
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ phone, password })
            });

            if (!res.ok) throw new Error('Login failed');

            const data = await res.json();
            setUser(data.user);
            setToken(true);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const register = async (name, phone, password, role = 'farmer') => {
        try {
            const csrfToken = await getCsrfToken();
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ name, phone, password, role })
            });

            if (!res.ok) throw new Error('Registration failed');

            const data = await res.json();
            setUser(data.user);
            setToken(true);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    // Legacy wrappers for existing UI compatibility
    const loginFarmer = async (phone) => {
        // For now, if UI only sends phone, we assume a default password or this is a "quick login" 
        // that needs to be updated in UI.
        // Let's assume password is '123456' for legacy testing if not provided, 
        // BUT better is to update UI. 
        return await login(phone, '123456');
    };

    const loginDeveloper = async (id, password) => {
        // Map developer Login to standard backend authentication
        // Assuming id is phone for backend consistency
        return await login(id, password);
    };

    const logout = async () => {
        try {
            // Call backend to clear cookie
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            // Silent fail on logout
        } finally {
            setUser(null);
            setToken(null);
        }
    };

    const loginDemo = () => {
        const demoUser = {
            id: 'demo-123',
            name: 'Demo Farmer',
            phone: '9999999999',
            role: 'farmer'
        };
        setUser(demoUser);
        setToken('demo-token');
        localStorage.setItem('farmcon_demo_mode', 'true');
        return true;
    };

    const isDeveloper = () => user?.role === 'developer';
    const isFarmer = () => user?.role === 'farmer' || user?.id === 'demo-123';

    return (
        <AuthContext.Provider value={{ 
            user, token, loading, login, register, loginDeveloper, loginDemo, logout, isDeveloper, isFarmer 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
