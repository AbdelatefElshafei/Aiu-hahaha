import React, { createContext, useState, useEffect, useCallback } from 'react';
import api, { getLoggedInUser } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
        error: null,
    });

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                api.defaults.headers.common['x-auth-token'] = token;
                const res = await getLoggedInUser();
                setAuthState({
                    token: token,
                    isAuthenticated: true,
                    loading: false,
                    user: res.data,
                    error: null,
                });
            } catch (err) {
                localStorage.removeItem('token');
                delete api.defaults.headers.common['x-auth-token'];
                setAuthState({
                    token: null,
                    isAuthenticated: false,
                    loading: false,
                    user: null,
                    error: err.response ? err.response.data.msg : 'Server error',
                });
            }
        } else {
            setAuthState({
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: null,
            });
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (username, password) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            api.defaults.headers.common['x-auth-token'] = res.data.token; 
            setAuthState({
                ...authState,
                token: res.data.token,
                isAuthenticated: true,
                loading: false,
                user: res.data.user,
                error: null,
            });
            await loadUser(); 
            return true; 
        } catch (err) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['x-auth-token'];
            setAuthState({
                ...authState,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: err.response ? err.response.data.msg : 'Login failed',
            });
            return false; 
        }
    };

    const register = async (username, password) => {
        try {
            const res = await api.post('/auth/register', { username, password });
            localStorage.setItem('token', res.data.token);
            api.defaults.headers.common['x-auth-token'] = res.data.token;
            setAuthState({
                ...authState,
                token: res.data.token,
                isAuthenticated: true,
                loading: false,
                user: res.data.user, 
                error: null,
            });
            await loadUser(); 
            return true;
        } catch (err) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['x-auth-token'];
            setAuthState({
                ...authState,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: err.response ? err.response.data.msg : 'Registration failed',
            });
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['x-auth-token'];
        setAuthState({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
            error: null,
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, register, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};