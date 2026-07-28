import React, { useState } from 'react';
import { Download, Sparkles, CheckCircle2, ArrowRight, PackageCheck, Layers, FileJson, Globe, ExternalLink } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';

const GeneratePage = () => {
  const { portfolio } = usePortfolio();
  const { toast } = useToast?.() || { toast: (msg) => alert(msg) };

  const [generating, setGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(null);

  const steps = [
    { title: 'Reading Portfolio Data', icon: FileJson, desc: 'Fetching latest skills, projects, and personal info' },
    { title: 'Duplicating React Template', icon: Layers, desc: 'Cloning Vite + Tailwind CSS production template' },
    { title: 'Injecting portfolio.json', icon: Sparkles, desc: 'Writing customized data into src/data/portfolio.json' },
    { title: 'Building ZIP Archive', icon: PackageCheck, desc: 'Compressing project into deployable portfolio.zip' },
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const res = await portfolioService.generatePortfolioZip();
      clearInterval(interval);
      setStepIndex(3);

      if (res.success) {
        setResult(res);
        toast('Portfolio ZIP generated successfully!', 'success');
      } else {
        toast(res.message || 'Failed to generate ZIP', 'error');
      }
    } catch (err) {
      clearInterval(interval);
      toast(err.response?.data?.message || 'Error generating ZIP package', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!result?.zipFileName) return;
    try {
      const data = await portfolioService.downloadZipFile(result.zipFileName);
      const blob = new Blob([data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.zipFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast('ZIP file downloaded successfully!', 'success');
    } catch (err) {
      window.open(result.downloadUrl || `/api/generate/download/${result.zipFileName}`, '_blank');
    }
  };

  const username = portfolio?.username || 'developer';
  const previewUrl = `/${username}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span>Generate & Download ZIP</span>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded-full text-xs font-mono font-bold">
              Canva-Style Export
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Export your edited portfolio as a standalone, production-ready React (Vite + Tailwind) project.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-purple-600/30 transition transform active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          <span>{generating ? 'Building Package...' : 'Generate Portfolio ZIP'}</span>
        </button>
      </div>

      {/* Generation Progress Stepper */}
      {generating && (
        <div className="p-8 rounded-3xl border border-purple-500/30 bg-purple-500/5 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
            <span>Building Your Deployable React Project...</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isDone = stepIndex > idx;
              const isCurrent = stepIndex === idx;
              return (
                <div
                  key={step.title}
                  className={`p-5 rounded-2xl border transition ${
                    isCurrent
                      ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                      : isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-6 h-6" />
                    {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <h4 className="font-bold text-sm leading-snug">{step.title}</h4>
                  <p className={`text-[11px] mt-1 ${isCurrent ? 'text-purple-100' : 'text-slate-500'}`}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Card with Download & Live Preview */}
      {result && (
        <div className="p-8 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Ready for Direct Deployment
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Your Portfolio ZIP is Ready!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Package: <code className="font-mono text-purple-600 font-bold">{result.zipFileName}</code>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadZip}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download ZIP</span>
              </button>

              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white px-6 py-3.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition"
              >
                <Globe className="w-4 h-4 text-purple-600" />
                <span>Open Full Page Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Embedded Iframe Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span>Live Interactive Preview</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Target: {previewUrl}</span>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner bg-slate-950 h-[500px]">
              <iframe
                src={previewUrl}
                title="Live Portfolio Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* Deployment Instructions */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-purple-600" />
              <span>How to Run & Deploy Your Downloaded Portfolio</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">1. Run Locally</span>
                <p className="text-slate-500 font-mono text-[11px]">
                  Unzip file<br />
                  npm install<br />
                  npm run dev
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">2. Deploy to Vercel</span>
                <p className="text-slate-500 font-mono text-[11px]">
                  Upload to GitHub<br />
                  Connect to Vercel<br />
                  Automatic Deployment
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">3. GitHub Pages</span>
                <p className="text-slate-500 font-mono text-[11px]">
                  npm run build<br />
                  Deploy dist/ folder
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePage;
