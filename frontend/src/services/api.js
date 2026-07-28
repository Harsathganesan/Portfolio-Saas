import axios from 'axios';

const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '127.0.0.1';
  return `http://${host}:5002/api`;
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
      }
    }
    return Promise.reject(error);
  }
);

export default API;
