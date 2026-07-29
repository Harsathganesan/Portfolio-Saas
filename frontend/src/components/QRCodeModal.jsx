import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

const QRCodeModal = ({ isOpen, onClose, username }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const portfolioUrl = `${window.location.origin}/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast('Portfolio link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById('portfolio-qr-code');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${username}-portfolio-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast('QR Code downloaded successfully!', 'success');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-[99999] top-0 left-0 w-screen h-screen bg-slate-900/50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-slate-900">


        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Share Portfolio</h3>
          <p className="text-xs text-slate-500">Scan QR Code or copy link to share @{username}'s portfolio</p>
        </div>

        {/* QR SVG */}
        <div className="bg-slate-50 p-4 rounded-2xl flex justify-center items-center my-4 border border-slate-200">
          <QRCodeSVG
            id="portfolio-qr-code"
            value={portfolioUrl}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1.5 mb-4">
          <input
            type="text"
            readOnly
            value={portfolioUrl}
            className="bg-transparent text-xs text-indigo-700 font-semibold px-3 w-full outline-none font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 flex-shrink-0 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <button
          onClick={downloadQR}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Download QR Image</span>
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
