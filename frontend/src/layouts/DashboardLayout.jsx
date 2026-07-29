import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { Globe, QrCode, CheckCircle2, XCircle, Eye, Edit3, Bell } from 'lucide-react';
import QRCodeModal from '../components/QRCodeModal';

const DashboardLayout = () => {
  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();
  const [qrOpen, setQrOpen] = useState(false);

  const isPublished = portfolio?.isPublished ?? true;
  const userName = portfolio?.personalInfo?.fullName?.split(' ')[0] || portfolio?.username || 'User';

  const handlePublishToggle = async () => {
    try {
      await updatePortfolio({ isPublished: !isPublished });
      toast(`Portfolio is now ${!isPublished ? 'Live & Published' : 'Private'}!`, !isPublished ? 'success' : 'info');
    } catch (err) {
      toast('Failed to update publish state', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sleek Top Header matching Screenshot */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 sm:px-8 flex items-center justify-between z-20 text-slate-900 select-none shadow-2xs">
          {/* Welcome User Greeting in Header */}
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Welcome, {userName}!</span>
              <span>👋</span>
            </h2>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Share QR Code Button */}
            <button
              onClick={() => setQrOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              title="Share QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Preview Portfolio Button */}
            {portfolio?.username && (
              <Link
                to={`/${portfolio.username}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
              >
                <Eye className="w-4 h-4 text-slate-600" />
                <span>Preview Portfolio</span>
              </Link>
            )}

            {/* Edit Portfolio Button */}
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


