import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import {
  Eye,
  FolderGit2,
  Code2,
  Mail,
  ExternalLink,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  Send,
  Award,
  Sparkles,
} from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

const DashboardOverviewPage = () => {
  const { portfolio, loading } = usePortfolio();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (loading) return <SkeletonCard />;

  const firstName = portfolio?.personalInfo?.fullName?.split(' ')[0] || portfolio?.username || 'Harsath';
  const fullName = portfolio?.personalInfo?.fullName || 'Harsath G';
  const username = portfolio?.username || 'harsath';
  const avatar = portfolio?.personalInfo?.avatar;
  const bio = portfolio?.personalInfo?.bio || '';

  const projectsCount = portfolio?.projects?.length || 8;
  const skillsCount = portfolio?.skills?.length || 12;
  const totalViews = portfolio?.analytics?.totalViews || 542;
  const unreadMessages = portfolio?.messages?.filter((m) => !m.read)?.length || 3;

  const publicUrl = `https://portfolia.dev/${username}`;

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const checklistItems = [
    { label: 'Profile Photo', isDone: Boolean(avatar) },
    { label: 'Personal Info', isDone: Boolean(portfolio?.personalInfo?.email) },
    { label: 'About', isDone: Boolean(bio && bio.length > 20) },
    { label: 'Experience', isDone: Boolean(portfolio?.experience?.length > 0) },
    { label: 'Skills', isDone: skillsCount > 0 },
    { label: 'Projects', isDone: projectsCount > 0 },
  ];

  const completedCount = checklistItems.filter((c) => c.isDone).length;
  const completionPercentage = Math.round((completedCount / checklistItems.length) * 100);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast('Live portfolio URL copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans text-slate-900">
      {/* 1. Header Greeting Section */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span>{getGreeting()}, {firstName}!</span>
          <span>👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* 2. Top Row: Profile Completion & Live Link Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Profile Completion (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-3 flex-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Profile Completion
              </h3>
              <div className="text-3xl font-extrabold text-blue-600">
                {completionPercentage}%
              </div>

              {/* Blue Progress Bar */}
              <div className="w-full sm:w-72 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 font-medium pt-1">
                Complete <Link to="/dashboard/about" className="text-blue-600 font-bold hover:underline">about</Link> section to reach 100%
              </p>
            </div>

            {/* Checklist Column */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  <span className={item.isDone ? 'text-slate-700 font-semibold' : 'text-slate-500'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Your portfolio is live! Card (1/3 width) */}
        <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900">Your portfolio is live!</h3>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline truncate block"
              >
                <span className="truncate">{publicUrl}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last updated: 2 mins ago</span>
          </div>
        </div>
      </div>

      {/* 3. Four Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Views */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">Total Views</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalViews}</p>
          </div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span>↑ 18% this week</span>
          </p>
        </div>

        {/* Metric 2: Projects */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FolderGit2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">Projects</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{projectsCount}</p>
          </div>
          <Link to="/dashboard/projects" className="text-xs text-blue-600 font-bold hover:underline block">
            Manage Projects →
          </Link>
        </div>

        {/* Metric 3: Skills */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Code2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">Skills</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{skillsCount}</p>
          </div>
          <Link to="/dashboard/skills" className="text-xs text-blue-600 font-bold hover:underline block">
            Manage Skills →
          </Link>
        </div>

        {/* Metric 4: Messages */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">Messages</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{unreadMessages}</p>
          </div>
          <Link to="/dashboard/inbox" className="text-xs text-blue-600 font-bold hover:underline block">
            View Messages →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;


