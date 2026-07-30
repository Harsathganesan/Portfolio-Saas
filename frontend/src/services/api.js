import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return `http://${window.location.hostname}:5002/api`;
  }
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!clean.includes('localhost')) {
      return clean.endsWith('/api') ? clean : `${clean}/api`;
    }
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/api`;
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer JWT Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handler & Token Expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 Unauthorized
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('portfolio_token');
        localStorage.removeItem('portfolio_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
