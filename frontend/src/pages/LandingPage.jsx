import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Bot,
  Layout,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Globe,
  QrCode,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-28 md:pt-36 md:pb-40 overflow-hidden flex-1 flex flex-col justify-center bg-gradient-to-b from-indigo-50/50 via-slate-50 to-white">
        {/* Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold uppercase tracking-wider shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI-Powered Portfolio Builder SaaS 2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15] text-slate-900"
          >
            Build Your Dream Portfolio in Minutes.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
              No Coding Required.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Claim your custom <code className="text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg font-mono text-sm font-bold">portfolio-app.com/username</code> URL.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center pt-4"
          >
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-9 py-4 rounded-2xl text-base font-extrabold shadow-xl shadow-indigo-500/25 flex items-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SIMPLE CORE FEATURES SECTION */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Everything You Need to Build Your Portfolio</h2>
            <p className="text-slate-500 text-xs font-medium">Simple, fast, and responsive portfolio management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl space-y-4 border border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">AI Content Generator</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Generate professional bios and project details effortlessly using AI.
              </p>
            </div>

            <div className="p-7 rounded-3xl space-y-4 border border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Responsive Layouts</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Clean and modern template layout designed for all screen sizes.
              </p>
            </div>

            <div className="p-7 rounded-3xl space-y-4 border border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:shadow-lg transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Instant Sharing</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Share your live URL or instant QR Code directly with recruiters and clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
