import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-600 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home Button */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3 group justify-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Portfolia</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 pt-1">Welcome Back</h2>
          <p className="text-xs text-slate-500 font-medium">Log in to manage and edit your SaaS portfolio</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Email Address or Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="harsath or name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-2 shadow-md shadow-indigo-500/20 transition"
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
        </div>

        <p className="text-center text-xs text-slate-600 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Create Portfolio
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
