import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { uploadService } from '../services/uploadService';
import { useToast } from '../components/Toast';
import { FileText, Upload, Download, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

const ResumeUploadPage = () => {
  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();

  const [resumeUrl, setResumeUrl] = useState(portfolio?.resumeUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast('Please select a PDF file format', 'error');
      return;
    }
    setUploading(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res.success) {
        setResumeUrl(res.url);
        await updatePortfolio({ resumeUrl: res.url });
        toast('Resume uploaded and attached to portfolio!', 'success');
      }
    } catch (err) {
      toast('Failed to upload PDF file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleManualSave = async (e) => {
    e.preventDefault();
    try {
      await updatePortfolio({ resumeUrl });
      toast('Resume link updated!', 'success');
    } catch (err) {
      toast('Failed to update resume link', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-400" /> Resume Upload (PDF)
        </h1>
        <p className="text-xs text-slate-400">Upload your PDF resume to display direct download buttons on your portfolio</p>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="border-2 border-dashed border-slate-800 rounded-3xl p-8 text-center space-y-4 hover:border-indigo-500/50 transition">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <Upload className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Upload New PDF Resume</h3>
            <p className="text-xs text-slate-400">Supports PDF format up to 10MB</p>
          </div>

          <label className="inline-block gradient-btn px-6 py-2.5 rounded-xl font-semibold text-xs cursor-pointer shadow-lg shadow-indigo-500/20">
            {uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading PDF...
              </span>
            ) : (
              <span>Select PDF File</span>
            )}
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Existing Resume Link */}
        <form onSubmit={handleManualSave} className="space-y-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Or Paste External PDF URL (Google Drive, Dropbox, etc.)</label>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://example.com/my-resume.pdf"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          {portfolio?.resumeUrl && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-emerald-300">Resume Attached</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-xs">{portfolio.resumeUrl}</p>
                </div>
              </div>

              <a
                href={portfolio.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-200 font-semibold flex items-center gap-1.5"
              >
                <span>View PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="gradient-btn px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Resume Link</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
