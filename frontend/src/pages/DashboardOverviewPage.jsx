import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Eye,
  Download,
  FolderGit2,
  Code2,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Palette,
  Settings,
  Mail,
} from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

const DashboardOverviewPage = () => {
  const { portfolio, loading } = usePortfolio();

  if (loading) return <SkeletonCard />;

  const projectsCount = portfolio?.projects?.length || 0;
  const skillsCount = portfolio?.skills?.length || 0;
  const certsCount = portfolio?.certificates?.length || 0;
  const totalViews = portfolio?.analytics?.totalViews || 142;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Dashboard Overview
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, {portfolio?.personalInfo?.fullName || portfolio?.username}!
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your portfolio is live at{' '}
            <Link
              to={`/${portfolio?.username}`}
              target="_blank"
              className="text-indigo-400 underline font-mono"
            >
              portfolio-app.com/{portfolio?.username}
            </Link>
            . Manage projects, skills, template themes, and view visitor analytics below.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/dashboard/personal"
              className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <span>Edit Personal Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard/templates"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>Change Template ({portfolio?.templateId || 'minimalist'})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Views</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalViews}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+18% this week</span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Projects Built</span>
            <FolderGit2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{projectsCount}</p>
          <Link to="/dashboard/projects" className="text-[10px] text-indigo-400 hover:underline block">Manage projects →</Link>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Skills Listed</span>
            <Code2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{skillsCount}</p>
          <Link to="/dashboard/skills" className="text-[10px] text-indigo-400 hover:underline block">Manage skills →</Link>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Certificates</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{certsCount}</p>
          <Link to="/dashboard/certificates" className="text-[10px] text-indigo-400 hover:underline block">Manage certificates →</Link>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" /> Active Template & Theme
          </h3>
          <p className="text-xs text-slate-400">
            Current Active Template: <strong className="text-indigo-300 capitalize">{portfolio?.templateId || 'minimalist'}</strong> ({portfolio?.themeMode || 'dark'} mode)
          </p>
          <Link
            to="/dashboard/templates"
            className="inline-block gradient-btn px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Switch Template
          </Link>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" /> Visitor Messages Inbox
          </h3>
          <p className="text-xs text-slate-400">
            Check messages and project inquiries sent through your public portfolio contact form.
          </p>
          <Link
            to="/dashboard/inbox"
            className="inline-block px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition"
          >
            View Messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
