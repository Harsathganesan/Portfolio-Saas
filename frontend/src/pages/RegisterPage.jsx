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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-600 selection:text-white py-12">
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
          <h2 className="text-2xl font-extrabold text-slate-900 pt-1">Create Your Account</h2>
          <p className="text-xs text-slate-500 font-medium">Claim your unique portfolio URL in seconds</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Username (Your Public Slug)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 font-mono text-xs font-bold">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="alexdev"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition font-mono font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Your portfolio live link: portfolio-app.com/{username || 'username'}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
