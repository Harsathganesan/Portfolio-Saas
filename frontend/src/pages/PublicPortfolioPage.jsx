import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import TemplateRenderer from '../templates/TemplateRenderer';
import { SkeletonCard } from '../components/Skeleton';
import { AlertTriangle, Sparkles } from 'lucide-react';

const PublicPortfolioPage = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        try {
          res = await portfolioService.getUserPublicPortfolio(username);
        } catch (e) {
          res = await portfolioService.getPublicPortfolio(username);
        }

        if (res.success) {
          const p = res.portfolio;
          setData(p);

          // Dynamic SEO Meta Tags Update
          const metaTitle = p.seo?.metaTitle || `${p.personalInfo?.fullName || username} | ${p.personalInfo?.title || 'Portfolio'}`;
          const metaDesc = p.seo?.metaDescription || p.personalInfo?.bio || 'Professional Developer Portfolio';

          document.title = metaTitle;

          // Update Meta Tags dynamically
          let descEl = document.querySelector("meta[name='description']");
          if (!descEl) {
            descEl = document.createElement('meta');
            descEl.setAttribute('name', 'description');
            document.head.appendChild(descEl);
          }
          descEl.setAttribute('content', metaDesc);

          // OpenGraph Title & Image
          let ogTitle = document.querySelector("meta[property='og:title']");
          if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
          }
          ogTitle.setAttribute('content', metaTitle);

          let ogImg = document.querySelector("meta[property='og:image']");
          if (!ogImg) {
            ogImg = document.createElement('meta');
            ogImg.setAttribute('property', 'og:image');
            document.head.appendChild(ogImg);
          }
          ogImg.setAttribute('content', p.seo?.ogImage || p.personalInfo?.avatar || '');
        }
      } catch (err) {
        setError(err.response?.data?.message || '404 Portfolio Not Found');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPublicData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Portfolio Unavailable</h1>
        <p className="text-xs text-slate-400 max-w-sm">{error || 'The requested portfolio does not exist or has been made private by its owner.'}</p>
        <Link to="/" className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <TemplateRenderer data={data} />
    </div>
  );
};

export default PublicPortfolioPage;
