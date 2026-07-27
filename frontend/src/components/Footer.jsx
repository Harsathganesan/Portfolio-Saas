import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">Portfolia</span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed">
            The modern AI-powered Portfolio Builder SaaS. Craft high-converting developer & designer portfolios in minutes without code.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="/#templates" className="hover:text-white transition">Portfolio Templates</a></li>
            <li><Link to="/explore" className="hover:text-white transition">Portfolio Search</Link></li>
            <li><a href="/#features" className="hover:text-white transition">AI Bio Generator</a></li>
            <li><a href="/#pricing" className="hover:text-white transition">Pricing Plans</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#faq" className="hover:text-white transition">Documentation & FAQ</a></li>
            <li><a href="#testimonials" className="hover:text-white transition">User Wall of Love</a></li>
            <li><Link to="/login" className="hover:text-white transition">Dashboard Login</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Register Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Legal & Security</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition">Security & Encryption</a></li>
            <li><a href="#" className="hover:text-white transition">GDPR Compliance</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Portfolia SaaS. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-4 sm:mt-0">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Developers & Creators worldwide.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
