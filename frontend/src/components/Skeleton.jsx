import React from 'react';
import { Sparkles } from 'lucide-react';

export const SkeletonCard = () => (
  <div className="flex flex-col items-center justify-center min-h-[350px] w-full space-y-4 py-12">
    <div className="relative flex items-center justify-center">
      {/* Centered Circular Loading Ring */}
      <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 border-r-indigo-600 animate-spin shadow-md shadow-indigo-500/10" />
      {/* Center Sparkle Icon */}
      <Sparkles className="w-5 h-5 text-indigo-600 absolute animate-pulse" />
    </div>
    <p className="text-xs font-bold text-slate-500 tracking-wide animate-pulse">Loading...</p>
  </div>
);

export const SkeletonText = () => (
  <div className="flex flex-col items-center justify-center py-6 space-y-3">
    <div className="w-10 h-10 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin" />
    <p className="text-xs font-bold text-slate-400 animate-pulse">Loading content...</p>
  </div>
);
