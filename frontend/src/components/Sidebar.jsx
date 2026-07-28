import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Code2,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Palette,
  BarChart3,
  Settings,
  Mail,
  ExternalLink,
  Sparkles,
  LogOut,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'personal', label: 'My Portfolio', icon: User, path: '/dashboard/personal' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, path: '/dashboard/projects' },
  { id: 'skills', label: 'Skills', icon: Code2, path: '/dashboard/skills' },
  { id: 'education', label: 'Education', icon: GraduationCap, path: '/dashboard/education' },
  { id: 'experience', label: 'Experience', icon: Briefcase, path: '/dashboard/experience' },
  { id: 'certificates', label: 'Certificates', icon: Award, path: '/dashboard/certificates' },
  { id: 'resume', label: 'Resume', icon: FileText, path: '/dashboard/resume' },
  { id: 'templates', label: 'Templates', icon: Palette, path: '/dashboard/templates' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { id: 'generate', label: 'Export & Download ZIP', icon: Download, path: '/dashboard/generate' },
  { id: 'inbox', label: 'Messages', icon: Mail, path: '/dashboard/inbox' },
  { id: 'settings', label: 'Settings & SEO', icon: Settings, path: '/dashboard/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { portfolio } = usePortfolio();

  const publicUrl = portfolio?.username ? `/u/${portfolio.username}` : '#';

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Portfolia</span>
        </Link>
      </div>

      {/* User Quick Info */}
      <div className="px-4 py-3 bg-slate-900/50 mx-3 my-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs uppercase">
            {user?.username?.charAt(0) || 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-100 truncate">{user?.fullName || user?.username}</p>
            <p className="text-[10px] text-indigo-400 truncate">@{user?.username}</p>
          </div>
        </div>
        {portfolio?.username && (
          <Link
            to={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
            title="View Public Portfolio"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
