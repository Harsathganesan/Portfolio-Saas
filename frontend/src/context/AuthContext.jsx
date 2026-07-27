import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('portfolio_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('portfolio_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('portfolio_token', res.token);
      localStorage.setItem('portfolio_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (username, email, password, fullName) => {
    const res = await authService.register({ username, email, password, fullName });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('portfolio_token', res.token);
      localStorage.setItem('portfolio_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
