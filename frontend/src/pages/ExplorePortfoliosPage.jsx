import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Sparkles, Star, ExternalLink, Code2, FolderGit2 } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

const ExplorePortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchExplore();
  }, [query, featuredOnly]);

  const fetchExplore = async () => {
    setLoading(true);
    try {
      const res = await portfolioService.explorePortfolios({ query, isFeatured: featuredOnly });
      if (res.success) {
        setPortfolios(res.portfolios);
      }
    } catch (err) {
      console.error('Explore fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 w-full">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Discover Talent
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Explore Public Portfolios</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Browse portfolios built by developers, engineers, and creators on Portfolia.</p>

          {/* Search Inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder=""
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white outline-none focus:border-indigo-500 shadow-xl"
              />
            </div>
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-4 py-3 rounded-2xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                featuredOnly
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Featured Only</span>
            </button>
          </div>
        </div>

        {/* Portfolio Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((p) => (
              <div key={p._id} className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition duration-300 space-y-4 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {p.personalInfo?.avatar ? (
                        <img src={p.personalInfo.avatar} alt={p.username} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-sm flex items-center justify-center">
                          {p.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition">{p.personalInfo?.fullName || p.username}</h3>
                        <p className="text-[11px] text-indigo-400 font-mono">@{p.username}</p>
                      </div>
                    </div>

                    {p.isFeatured && (
                      <span className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400" title="Featured Portfolio">
                        <Star className="w-4 h-4 fill-amber-400" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-semibold">{p.personalInfo?.title || 'Software Developer'}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.personalInfo?.bio}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Template: {p.templateId || 'minimalist'}</span>
                  <Link
                    to={`/${p.username}`}
                    target="_blank"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ExplorePortfoliosPage;
