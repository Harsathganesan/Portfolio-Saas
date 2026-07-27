import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="h-6 bg-slate-800 rounded w-1/3"></div>
    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
    <div className="h-20 bg-slate-800 rounded"></div>
    <div className="flex space-x-2 pt-2">
      <div className="h-8 w-16 bg-slate-800 rounded-lg"></div>
      <div className="h-8 w-16 bg-slate-800 rounded-lg"></div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-slate-800 rounded ${i === lines - 1 ? 'w-1/2' : 'w-full'}`}
      ></div>
    ))}
  </div>
);
