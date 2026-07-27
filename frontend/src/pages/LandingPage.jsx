import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Layout,
  BarChart3,
  Bot,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Star,
  Layers,
  Globe,
  QrCode,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [pricingCycle, setPricingCycle] = useState('monthly');

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden">
        {/* Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI-Powered Portfolio Builder SaaS 2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]"
          >
            Build Your Dream Portfolio in Minutes.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              No Coding Required.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Claim your custom <code className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono text-sm">portfolio-app.com/username</code> URL. Choose from 5 premium templates with real-time analytics, AI content assistance, and PDF exports.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/register"
              className="gradient-btn px-8 py-4 rounded-2xl text-base font-semibold shadow-2xl shadow-indigo-500/40 flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 text-base font-semibold transition"
            >
              Explore Example Portfolios
            </Link>
          </motion.div>

          {/* Social Proof */}
          <div className="pt-10 flex flex-col items-center space-y-3">
            <div className="flex -space-x-2">
              <img className="w-9 h-9 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="User" />
              <img className="w-9 h-9 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="User" />
              <img className="w-9 h-9 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="User" />
              <img className="w-9 h-9 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="User" />
            </div>
            <div className="flex items-center space-x-1 text-amber-400 text-xs font-semibold">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 ml-2">Loved by 10,000+ Engineers & Designers</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Everything You Need to Stand Out</h2>
            <p className="text-slate-400 text-sm">Designed specifically for developers, creators, and professionals seeking career acceleration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Bio & Project Writing</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Stuck on your About Me or project descriptions? Let our AI assistant generate persuasive copy tailored to your target tech stack.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">5 Premium Responsive Templates</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Switch themes instantly with a single click. Every template supports Dark/Light mode, animations, and high performance.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Real-Time Visitor Analytics</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Track portfolio views, unique visitors, resume downloads, and top clicked projects right from your dashboard.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">QR Code & PDF Export</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Share your portfolio via instant dynamic QR Code or export your entire portfolio layout directly as a PDF document.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Custom Domain & SEO Ready</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect your custom domain and configure OpenGraph title tags, meta descriptions, and social share previews effortlessly.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Visitor Contact Inbox</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Recruiters and clients can send inquiries straight to your dashboard inbox with zero spam exposure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES PREVIEW */}
      <section id="templates" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Explore Premium Templates</h2>
          <p className="text-slate-400 text-sm">Crafted for every specialty: Developers, Designers, Executives, and Cyber Specialists.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { id: 'minimalist', name: 'Minimalist Developer', tag: 'Clean & High Contrast', desc: 'High typography contrast with timeline view.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80' },
            { id: 'creative', name: 'Creative Dark Studio', tag: 'Vibrant Glassmorphism', desc: 'Glowing glass cards with neon aesthetic accents.', img: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80' },
            { id: 'corporate', name: 'Executive Corporate', tag: 'Structured & Professional', desc: 'Executive metric cards with sidebar navigation.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
            { id: 'cyber', name: 'Cyber Grid', tag: 'Cyberpunk Matrix', desc: 'Terminal matrix inspired design for security & DevOps.', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' },
            { id: 'sleek', name: 'Sleek Modern', tag: 'Soft Shadows & Dual Mode', desc: 'Clean masonry project layout and soft shadow cards.', img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80' },
          ].map((t) => (
            <div key={t.id} className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition duration-300 border border-slate-800">
              <div className="h-48 overflow-hidden relative">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 right-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                  {t.tag}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-lg text-white">{t.name}</h3>
                <p className="text-xs text-slate-400">{t.desc}</p>
                <Link to="/register" className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2 gap-1">
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 text-sm">Start for free. Upgrade as your career expands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Starter Free</h3>
                <div className="flex items-baseline text-4xl font-extrabold text-white">
                  $0 <span className="text-xs font-normal text-slate-400 ml-2">/ forever</span>
                </div>
                <p className="text-xs text-slate-400">Perfect for students and developers launching their first portfolio.</p>
                <ul className="space-y-3 pt-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Published Portfolio</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Access to 5 Templates</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> QR Code Generator & PDF Export</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Basic Analytics</li>
                </ul>
              </div>
              <Link to="/register" className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-center font-semibold text-xs text-white transition">
                Create Free Portfolio
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="glass-card p-8 rounded-3xl border border-indigo-500/50 relative space-y-6 flex flex-col justify-between shadow-2xl shadow-indigo-500/10">
              <span className="absolute -top-3.5 right-8 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                Most Popular
              </span>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Pro SaaS Architect</h3>
                <div className="flex items-baseline text-4xl font-extrabold text-white">
                  $9 <span className="text-xs font-normal text-slate-400 ml-2">/ month</span>
                </div>
                <p className="text-xs text-slate-400">For engineers and creators who demand unlimited AI assistance and custom domains.</p>
                <ul className="space-y-3 pt-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Everything in Starter</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited AI Bio & Project Generators</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Domain Support</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Featured Portfolio Badge</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Priority Support</li>
                </ul>
              </div>
              <Link to="/register" className="w-full gradient-btn py-3 rounded-xl text-center font-semibold text-xs text-white">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Have questions? We have answers.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: 'Can I edit my portfolio anytime after publishing?', a: 'Yes! All changes saved in your dashboard instantly update your live public portfolio URL.' },
            { q: 'What public URL format will I get?', a: 'You get a unique slug like https://portfolio-app.com/yourusername which you can share on resumes and LinkedIn.' },
            { q: 'How does the AI Assistant work?', a: 'Our AI engine analyzes your job title and technical skills to write professional bios and project bullet points.' },
            { q: 'Can visitors contact me through my portfolio?', a: 'Yes! Every template features a contact form that sends messages directly to your dashboard inbox without exposing your email.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex justify-between items-center text-sm font-semibold text-slate-200 hover:text-white"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 transition duration-200 ${activeFaq === idx ? 'rotate-180 text-indigo-400' : 'text-slate-400'}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-12 rounded-3xl border border-indigo-500/30 text-center space-y-6 relative overflow-hidden bg-gradient-to-tr from-indigo-950/40 via-slate-900 to-purple-950/40">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white max-w-2xl mx-auto">Ready to Launch Your Professional Portfolio?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Join thousands of developers creating stand-out portfolios in minutes.</p>
          <Link to="/register" className="gradient-btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base shadow-2xl">
            <span>Build Your Portfolio Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
