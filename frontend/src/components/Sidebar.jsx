import React, { useState, useEffect } from 'react';
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
  Settings,
  Mail,
  Sparkles,
  LogOut,
  SlidersHorizontal,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';

const menuItems = [
  // Always Visible Core Sidebar Items
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard', core: true, category: 'Overview' },

  
  // Customizable Sections
  { id: 'personal', label: 'Profile Info', icon: User, path: '/dashboard/personal', customizable: true, category: 'Personal' },
  { id: 'about', label: 'About Me Description', icon: FileText, path: '/dashboard/about', customizable: true, category: 'Personal' },
  { id: 'resume', label: 'Upload Resume PDF', icon: FileText, path: '/dashboard/resume', core: true, category: 'Personal' },
  { id: 'education', label: 'Education', icon: GraduationCap, path: '/dashboard/education', customizable: true, category: 'Background' },

  { id: 'experience', label: 'Experience', icon: Briefcase, path: '/dashboard/experience', customizable: true, category: 'Background' },
  { id: 'skills', label: 'Skills', icon: Code2, path: '/dashboard/skills', customizable: true, category: 'Showcase' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, path: '/dashboard/projects', customizable: true, category: 'Showcase' },
  { id: 'certificates', label: 'Certifications & Awards', icon: Award, path: '/dashboard/certificates', customizable: true, category: 'Showcase' },
  { id: 'inbox', label: 'Contact Info & Messages', icon: Mail, path: '/dashboard/inbox', customizable: true, category: 'Inbox' },


  // Default Always Visible System Tools
  { id: 'templates', label: 'Templates', icon: Palette, path: '/dashboard/templates', core: true, category: 'Settings' },
  { id: 'settings', label: 'Settings & SEO', icon: Settings, path: '/dashboard/settings', core: true, category: 'Settings' },
];

const defaultSections = {
  personal: true,
  about: true,
  education: true,
  experience: true,
  skills: true,
  projects: true,
  certificates: true,
  inbox: true,
};

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { portfolio, updatePortfolio } = usePortfolio();
  const [showConfigModal, setShowConfigModal] = useState(false);

  const [localSections, setLocalSections] = useState(() => ({
    ...defaultSections,
    ...(portfolio?.sectionsEnabled || {}),
  }));

  useEffect(() => {
    if (portfolio?.sectionsEnabled) {
      setLocalSections({
        ...defaultSections,
        ...portfolio.sectionsEnabled,
      });
    }
  }, [portfolio?.sectionsEnabled]);

  const handleToggleSection = (sectionId) => {
    const nextVal = !localSections[sectionId];
    const updated = {
      ...localSections,
      [sectionId]: nextVal,
    };

    setLocalSections(updated);

    if (updatePortfolio) {
      updatePortfolio({ sectionsEnabled: updated }).catch((err) => {
        console.error('Failed to update sections:', err);
      });
    }
  };

  const visibleMenuItems = menuItems.filter(
    (item) => item.core || localSections[item.id] === true
  );

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-30 text-slate-900 select-none font-sans">
        {/* Brand Header: Code Icon + Portfolia */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="text-blue-600 font-black text-lg">
              &lt;/&gt;
            </div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">Portfolia</span>
          </Link>

          <button
            onClick={() => setShowConfigModal(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Customize Sidebar Menu"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>


        {/* Smooth Scrollable Navigation List */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto custom-scrollbar">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 mr-3 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="truncate tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>


        {/* Footer / User Badge & Logout matching Screenshot */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {portfolio?.personalInfo?.fullName && (
            <div className="px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
              <div className="flex items-center gap-3 min-w-0">
                {portfolio?.personalInfo?.avatar ? (
                  <img src={portfolio.personalInfo.avatar} alt="User" className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-xs font-bold">
                    {portfolio.personalInfo.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{portfolio.personalInfo.fullName}</p>
                  <p className="text-[11px] text-slate-400 font-medium truncate">@{portfolio?.username || 'user'}.dev</p>
                </div>
              </div>
              <span className="text-slate-400 text-xs font-bold">⋮</span>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2.5 text-slate-400 group-hover:text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Modal: Customize Sidebar Sections */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[99999] top-0 left-0 w-screen h-screen bg-slate-900/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 text-slate-900">


            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Customize Dashboard Menu</h3>
                  <p className="text-xs text-slate-500 font-medium">Toggle content sections on or off</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section Toggles */}
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
              {menuItems
                .filter((item) => item.customizable)
                .map((item) => {
                  const Icon = item.icon;
                  const isEnabled = localSections[item.id] === true;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleSection(item.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none ${
                        isEnabled
                          ? 'bg-blue-50/70 border-blue-200 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center ${
                            isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      </div>

                      <div
                        className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-all duration-200 ${
                          isEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow flex items-center justify-center">
                          {isEnabled && <Check className="w-2.5 h-2.5 text-blue-600 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-700">
                {Object.keys(defaultSections).filter((key) => localSections[key] === true).length} of 7 enabled
              </span>
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
