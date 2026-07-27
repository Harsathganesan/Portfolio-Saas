import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { Globe, ExternalLink, QrCode, FileDown, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import QRCodeModal from '../components/QRCodeModal';
import html2pdf from 'html2pdf.js';

const DashboardLayout = () => {
  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();
  const [qrOpen, setQrOpen] = useState(false);

  const isPublished = portfolio?.isPublished ?? true;

  const handlePublishToggle = async () => {
    try {
      await updatePortfolio({ isPublished: !isPublished });
      toast(`Portfolio is now ${!isPublished ? 'Live & Published' : 'Private'}!`, !isPublished ? 'success' : 'info');
    } catch (err) {
      toast('Failed to update publish state', 'error');
    }
  };

  const handlePDFExport = () => {
    const publicUrl = `/${portfolio?.username}`;
    toast('Preparing PDF export layout...', 'info');
    window.open(publicUrl, '_blank');
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 overflow-hidden">
      {/* Dashboard Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-950/80 border-b border-slate-800/80 px-6 flex items-center justify-between backdrop-blur-md z-20">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-400">Public Slug:</span>
            <span className="text-xs font-mono bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-indigo-400">
              portfolio-app.com/{portfolio?.username || 'username'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Publish Toggle Button */}
            <button
              onClick={handlePublishToggle}
              disabled={saving}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                isPublished
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              {isPublished ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{isPublished ? 'Published' : 'Private'}</span>
            </button>

            {/* QR Code Trigger */}
            <button
              onClick={() => setQrOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              title="Share & QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* View Live Portfolio */}
            {portfolio?.username && (
              <Link
                to={`/${portfolio.username}`}
                target="_blank"
                rel="noreferrer"
                className="gradient-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-indigo-500/20"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>View Live</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
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
