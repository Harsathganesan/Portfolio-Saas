import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, LayoutDashboard, LogOut, Sun, Moon, Search, Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
            Portfolia<span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider ml-1 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">SaaS</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link to="/explore" className="hover:text-white transition flex items-center gap-1.5">
            <Search className="w-4 h-4 text-indigo-400" />
            <span>Explore Portfolios</span>
          </Link>
          <a href="/#templates" className="hover:text-white transition">Templates</a>
          <a href="/#features" className="hover:text-white transition">Features</a>
          <a href="/#pricing" className="hover:text-white transition">Pricing</a>
        </nav>

        {/* Actions & Profile */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <Link
                to="/dashboard"
                className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-slate-400 hover:text-rose-400 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold shadow-indigo-500/20"
              >
                Create Portfolio
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-6 space-y-4">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white text-base font-medium"
          >
            Explore Portfolios
          </Link>
          <a
            href="/#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white text-base font-medium"
          >
            Templates
          </a>
          <a
            href="/#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white text-base font-medium"
          >
            Pricing
          </a>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="gradient-btn py-2.5 rounded-xl text-center font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-slate-300 font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gradient-btn py-2.5 rounded-xl text-center font-semibold"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
