import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-12 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">Portfolia</span>
          </Link>
          <p className="text-slate-500 text-xs leading-relaxed font-medium">
            The modern AI-powered Portfolio Builder SaaS. Craft high-converting developer & designer portfolios in minutes without code.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition">
              <Github className="w-4.5 h-4.5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition">
              <Linkedin className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 text-sm">Product</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="/#templates" className="hover:text-indigo-600 transition">Portfolio Templates</a></li>
            <li><Link to="/explore" className="hover:text-indigo-600 transition">Portfolio Search</Link></li>
            <li><a href="/#features" className="hover:text-indigo-600 transition">AI Bio Generator</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 text-sm">Resources</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="#faq" className="hover:text-indigo-600 transition">Documentation & FAQ</a></li>
            <li><Link to="/login" className="hover:text-indigo-600 transition">Dashboard Login</Link></li>
            <li><Link to="/register" className="hover:text-indigo-600 transition">Register Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold mb-4 text-sm">Legal & Security</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Security & Encryption</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} Portfolia SaaS. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-4 sm:mt-0">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Developers & Creators worldwide.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
