import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="text-2xl font-bold text-white">Portfolia</span>
          </Link>
          <h2 className="text-xl font-bold text-white">Create Your Account</h2>
          <p className="text-xs text-slate-400">Claim your unique portfolio URL in seconds</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Username (Your Public Slug)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono text-xs">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="alexdev"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Your portfolio will be at portfolio-app.com/{username || 'username'}</p>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 mt-2"
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

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
