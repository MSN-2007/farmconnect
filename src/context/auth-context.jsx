import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Load checks for token
    useEffect(() => {
        const storedToken = localStorage.getItem('farmcon_token');
        const storedUser = localStorage.getItem('farmcon_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (phone, password) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });

            if (!res.ok) throw new Error('Login failed');

            const data = await res.json();
            setUser(data.user);
            setToken(data.token);

            localStorage.setItem('farmcon_token', data.token);
            localStorage.setItem('farmcon_user', JSON.stringify(data.user));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const register = async (name, phone, password, role = 'farmer') => {
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, password, role })
            });

            if (!res.ok) throw new Error('Registration failed');

            const data = await res.json();
            setUser(data.user);
            setToken(data.token);

            localStorage.setItem('farmcon_token', data.token);
            localStorage.setItem('farmcon_user', JSON.stringify(data.user));
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

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('farmcon_user');
        localStorage.removeItem('farmcon_token');
    };

    const isDeveloper = () => user?.role === 'developer';
    const isFarmer = () => user?.role === 'farmer';

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, loginDeveloper, logout, isDeveloper, isFarmer }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
