import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { Settings, Globe, QrCode, FileDown, Save, Loader2, Share2, Copy } from 'lucide-react';
import QRCodeModal from '../components/QRCodeModal';

const SettingsPage = () => {
  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');

  const [qrOpen, setQrOpen] = useState(false);

  const [publishing, setPublishing] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    if (portfolio) {
      setUsername(portfolio.username || '');
      setCustomDomain(portfolio.customDomain || '');
      setMetaTitle(portfolio.seo?.metaTitle || '');
      setMetaDescription(portfolio.seo?.metaDescription || '');
      setKeywords(portfolio.seo?.keywords || '');
      setOgImage(portfolio.seo?.ogImage || '');
    }
  }, [portfolio]);

  const handleCheckUsername = async (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(clean);
    if (!clean) return;
    setCheckingUsername(true);
    try {
      const res = await portfolioService.checkUsername(clean);
      setUsernameAvailable(res.available);
    } catch (err) {
      setUsernameAvailable(true);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handlePublishToggle = async () => {
    setPublishing(true);
    try {
      if (portfolio?.published || portfolio?.isPublished) {
        const res = await portfolioService.unpublishPortfolio();
        if (res.success) {
          updatePortfolio({ published: false, isPublished: false });
          toast('Portfolio unpublished. It is now private.', 'info');
        }
      } else {
        const res = await portfolioService.publishPortfolio({ username });
        if (res.success) {
          updatePortfolio({ published: true, isPublished: true, publishedAt: res.portfolio.publishedAt });
          toast('Portfolio published successfully! URL is live.', 'success');
        }
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Publish operation failed', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameAvailable) {
      toast('Username is already taken by another user.', 'error');
      return;
    }
    try {
      await updatePortfolio({
        username,
        customDomain,
        seo: {
          metaTitle,
          metaDescription,
          keywords,
          ogImage,
        },
      });
      toast('Portfolio settings & SEO updated!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update settings', 'error');
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/u/${portfolio?.username || username}`;
    navigator.clipboard.writeText(link);
    toast('Public URL copied to clipboard!', 'success');
  };

  const isPublished = portfolio?.published || portfolio?.isPublished;
  const publicUrlPath = `/u/${portfolio?.username || username}`;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" /> Settings, Publish & SEO
          </h1>
          <p className="text-xs text-slate-400">Control public visibility, custom slug, and search engine metadata</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQrOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>QR Code</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="gradient-btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Public URL</span>
          </button>
        </div>
      </div>

      {/* Publish Control Card */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {isPublished ? '● Published & Live' : '○ Draft / Private'}
              </span>
              {portfolio?.updatedAt && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Last Updated: {new Date(portfolio.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Public URL: <a href={publicUrlPath} target="_blank" rel="noreferrer" className="text-indigo-400 font-mono underline">{window.location.origin}{publicUrlPath}</a>
            </p>
          </div>

          <button
            onClick={handlePublishToggle}
            disabled={publishing || (!isPublished && !usernameAvailable)}
            className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition shadow-lg ${
              isPublished
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            <span>{isPublished ? 'Unpublish Portfolio' : 'Publish Portfolio'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Custom Slug & Domain */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Public Username & Custom Domain
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-400 font-medium">Username Slug</label>
                {!usernameAvailable && (
                  <span className="text-[11px] font-bold text-rose-400">Username already taken</span>
                )}
                {usernameAvailable && username && (
                  <span className="text-[11px] font-bold text-emerald-400">Username Available ✓</span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => handleCheckUsername(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-xl pl-8 pr-4 py-2.5 text-slate-200 outline-none font-mono ${
                    !usernameAvailable ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Custom Domain (Pro Feature)</label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder=""
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SEO Meta Tags & Open Graph */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">Search Engine Optimization (SEO) & Social Previews</h2>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder=""
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Meta Description</label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder=""
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Keywords (comma separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder=""
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">OpenGraph Social Share Image URL</label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder=""
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Social Share Preview Box */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 mt-4">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Social Share Card Preview</span>
            <div className="border border-slate-800 rounded-xl p-3 bg-slate-900 space-y-1">
              <p className="font-bold text-slate-100 text-xs truncate">{metaTitle || portfolio?.personalInfo?.fullName || 'Portfolio Title'}</p>
              <p className="text-[11px] text-slate-400 truncate">{metaDescription || 'Portfolio description preview on Twitter / LinkedIn...'}</p>
              <p className="text-[10px] text-indigo-400 font-mono">portfolio-app.com/{username}</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="gradient-btn px-6 py-3 rounded-2xl font-semibold text-xs flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings & SEO</span>
        </button>
      </form>

      <QRCodeModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        username={username || 'username'}
      />
    </div>
  );
};

export default SettingsPage;
