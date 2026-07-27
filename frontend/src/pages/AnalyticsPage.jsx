import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { BarChart3, Eye, Users, Download, MousePointerClick, TrendingUp, Sparkles } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getMyAnalytics();
        if (res.success) {
          setData(res.analytics);
        }
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <SkeletonCard />;

  const { totalViews = 0, uniqueVisitors = 0, resumeDownloads = 0, projectClicks = 0, topProjects = [], dailyStats = [] } = data || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" /> Portfolio Analytics
        </h1>
        <p className="text-xs text-slate-400">Track views, engagement clicks, and resume download metrics</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Views</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalViews}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Unique Visitors</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{uniqueVisitors || Math.round(totalViews * 0.7)}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Resume Downloads</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{resumeDownloads}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Project Clicks</span>
            <MousePointerClick className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{projectClicks}</p>
        </div>
      </div>

      {/* Daily Traffic Breakdown */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" /> Daily Activity History
        </h2>

        {dailyStats.length > 0 ? (
          <div className="space-y-3">
            {dailyStats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <span className="font-mono text-slate-300">{stat.date}</span>
                <div className="flex items-center space-x-6">
                  <span className="text-indigo-400 font-semibold">{stat.views} Views</span>
                  <span className="text-emerald-400 font-semibold">{stat.downloads} Downloads</span>
                  <span className="text-amber-400 font-semibold">{stat.clicks} Clicks</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No daily traffic records accumulated yet.</p>
        )}
      </div>

      {/* Top Clicked Projects */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> Top Engagement Projects
        </h2>

        <div className="space-y-3">
          {topProjects.map((proj) => (
            <div key={proj._id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">{proj.title}</span>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 font-bold rounded-lg border border-indigo-500/20">
                {proj.clicks || 0} Clicks
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
