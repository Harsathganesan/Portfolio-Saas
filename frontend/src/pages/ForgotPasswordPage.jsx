import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../components/Toast';

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        setSent(true);
        toast('Instructions sent to your email', 'success');
      }
    } catch (err) {
      toast('Failed to process request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
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
          <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
          <p className="text-xs text-slate-400">Enter your email to receive recovery instructions</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-5">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Check Your Email</h3>
              <p className="text-xs text-slate-400">We sent password recovery instructions to <span className="text-indigo-300 font-semibold">{email}</span></p>
              <Link to="/login" className="inline-block gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold">
                Return to Login
              </Link>
            </div>
          ) : (
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Instructions</span>}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-xs text-slate-400 hover:text-white gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
