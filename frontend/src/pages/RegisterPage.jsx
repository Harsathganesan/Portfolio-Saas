import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, ArrowRight, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await register(username, email, password, fullName);
      if (res.success) {
        toast('Account created! Welcome to Portfolia.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed. Try another username or email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center p-4 sm:p-6 selection:bg-indigo-600 selection:text-white relative py-12">
      {/* Top Left Back to Home Pill */}
      <Link
        to="/"
        className="fixed top-5 left-5 sm:top-8 sm:left-8 inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition bg-white/90 backdrop-blur-md hover:bg-white border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-xs z-10"
      >
        <ArrowLeft className="w-4 h-4 text-indigo-600" />
        <span>Back to Home</span>
      </Link>

      {/* Main Centered Content */}
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <Link to="/" className="inline-flex items-center space-x-3 group justify-center">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Portfolia</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create Your Account</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Claim your unique portfolio URL in seconds</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Username (Your Public Slug)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 font-mono text-xs font-bold pointer-events-none">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-9 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all font-mono font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Live link: portfolia.dev/{username || 'username'}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-10 pr-11 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 transition focus:outline-none flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-600 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
