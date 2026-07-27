import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <PortfolioProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </PortfolioProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
