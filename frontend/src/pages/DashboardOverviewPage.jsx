import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import {
  ExternalLink,
  CheckCircle2,
  Circle,
  Clock,
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

      {/* 2. Top Row: Profile Completion */}
      <div className="w-full">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-3 flex-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Profile Completion
              </h3>
              <div className="text-3xl font-extrabold text-blue-600">
                {completionPercentage}%
              </div>

              {/* Blue Progress Bar */}
              <div className="w-full sm:w-80 h-2 bg-slate-100 rounded-full overflow-hidden">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 text-xs font-medium border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-8">
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
      </div>
    </div>
  );
};

export default DashboardOverviewPage;


