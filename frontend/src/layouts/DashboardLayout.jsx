import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { QrCode, Eye, Edit3, Loader2, Radio, WifiOff } from 'lucide-react';
import QRCodeModal from '../components/QRCodeModal';

const DashboardLayout = () => {
  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();
  const [qrOpen, setQrOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const isPublished = portfolio?.isPublished ?? false;
  const userName = portfolio?.personalInfo?.fullName?.split(' ')[0] || portfolio?.username || 'User';

  const handlePublishToggle = async () => {
    setPublishing(true);
    try {
      await updatePortfolio({ isPublished: !isPublished });
      if (!isPublished) {
        toast('🎉 Portfolio is now LIVE & Published!', 'success');
      } else {
        toast('Portfolio set to Private / Unpublished.', 'info');
      }
    } catch (err) {
      toast('Failed to update publish state', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 sm:px-8 flex items-center justify-between z-20 text-slate-900 select-none shadow-2xs">

          {/* Left: Welcome Greeting */}
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Welcome, {userName}!</span>
              <span>👋</span>
            </h2>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center space-x-2.5">

            {/* QR Code */}
            <button
              onClick={() => setQrOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              title="Share QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Preview Portfolio */}
            {portfolio?.username && (
              <Link
                to={`/${portfolio.username}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
              >
                <Eye className="w-4 h-4 text-slate-600" />
                <span>Preview</span>
              </Link>
            )}

            {/* ─── PUBLISH TOGGLE ─── */}
            {isPublished ? (
              /* Portfolio is LIVE — show pulsing green "Live" pill + Unpublish */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-700">Live</span>
                </div>
                <button
                  onClick={handlePublishToggle}
                  disabled={publishing || saving}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <WifiOff className="w-3.5 h-3.5" />}
                  Unpublish
                </button>
              </div>
            ) : (
              /* Portfolio is PRIVATE — show glowing green Publish button */
              <button
                onClick={handlePublishToggle}
                disabled={publishing || saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Radio className="w-3.5 h-3.5" />
                )}
                {publishing ? 'Publishing...' : 'Publish Portfolio'}
              </button>
            )}

            {/* Edit Portfolio */}
            <Link
              to="/dashboard/personal"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Portfolio</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        username={portfolio?.username || 'username'}
      />
    </div>
  );
};

export default DashboardLayout;
