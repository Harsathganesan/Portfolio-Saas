import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast('Logged in successfully!', 'success');
        navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="text-2xl font-bold text-white">Portfolia</span>
          </Link>
          <h2 className="text-xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to manage and edit your SaaS portfolio</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-indigo-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500 transition"
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
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 space-y-1">
            <p className="font-semibold">Quick Demo Login:</p>
            <p>Email: <code className="text-white">alex@example.com</code> | Password: <code className="text-white">password123</code></p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Create Portfolio
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
