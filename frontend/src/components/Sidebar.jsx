import React, { useState } from 'react';
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
  SlidersHorizontal,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', core: true },
  { id: 'personal', label: 'My Portfolio', icon: User, path: '/dashboard/personal', core: true },
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
  { id: 'settings', label: 'Settings & SEO', icon: Settings, path: '/dashboard/settings', core: true },
];

const defaultSections = {
  projects: true,
  skills: true,
  education: true,
  experience: true,
  certificates: true,
  resume: true,
  templates: true,
  analytics: true,
  generate: true,
  inbox: true,
};

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { portfolio, updatePortfolio } = usePortfolio();
  const [showConfigModal, setShowConfigModal] = useState(false);

  const activeSections = { ...defaultSections, ...(portfolio?.sectionsEnabled || {}) };

  const handleToggleSection = async (sectionId) => {
    const updated = {
      ...activeSections,
      [sectionId]: !activeSections[sectionId],
    };
    await updatePortfolio({ sectionsEnabled: updated });
  };

  const publicUrl = portfolio?.username ? `/${portfolio.username}` : '#';

  // Filter items based on user preferences
  const visibleMenuItems = menuItems.filter(
    (item) => item.core || activeSections[item.id] !== false
  );

  return (
    <>
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

        {/* Sidebar Customizer Header */}
        <div className="px-4 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-medium tracking-wider uppercase">
          <span>Navigation</span>
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition text-[11px] lowercase hover:underline"
            title="Customize Sidebar Options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {visibleMenuItems.map((item) => {
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

      {/* Modal: Customize Sidebar Sections */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Customize Sidebar Sections</h3>
                  <p className="text-xs text-slate-400">Enable or disable dashboard sections to suit your portfolio</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {menuItems
                .filter((item) => !item.core)
                .map((item) => {
                  const Icon = item.icon;
                  const isEnabled = activeSections[item.id] !== false;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleSection(item.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isEnabled
                          ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isEnabled ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </div>
                      <div
                        className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${
                          isEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                          {isEnabled ? <Check className="w-2.5 h-2.5 text-indigo-600" /> : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition"
              >
                Done & Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
