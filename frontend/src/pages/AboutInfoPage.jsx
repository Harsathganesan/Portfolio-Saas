import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { uploadService } from '../services/uploadService';
import { Save, Sparkles, Loader2, FileText, Upload, User } from 'lucide-react';
import SectionPublishBar from '../components/SectionPublishBar';
import AIGeneratorModal from '../components/AIGeneratorModal';


const AboutInfoPage = () => {

  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();

  const [bio, setBio] = useState('');
  const [aboutAvatar, setAboutAvatar] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    if (portfolio?.personalInfo) {
      setBio(portfolio.personalInfo.aboutBio || portfolio.personalInfo.bio || '');
      setAboutAvatar(portfolio.personalInfo.aboutAvatar || portfolio.personalInfo.avatar || '');
    }
  }, [portfolio]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res.success) {
        setAboutAvatar(res.url);
        // Auto-save uploaded aboutAvatar immediately for live portfolio display
        await updatePortfolio({
          personalInfo: {
            ...portfolio?.personalInfo,
            aboutAvatar: res.url,
          },
        });
        toast('About Me photo uploaded and saved live!', 'success');
      }
    } catch (err) {
      toast('Failed to upload photo', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePortfolio({
        personalInfo: {
          ...portfolio?.personalInfo,
          aboutBio: bio,
          aboutAvatar: aboutAvatar,
        },

        sectionsEnabled: {
          ...(portfolio?.sectionsEnabled || {}),
          about: true,
        },
      });
      toast('About Me content updated and published live!', 'success');
    } catch (err) {
      toast('Failed to update About Me content', 'error');
    }
  };

  const handleApplyAiBio = (generatedText) => {
    setBio(generatedText);
    toast('AI bio applied! Click Save to apply changes.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> About Me Description & Photo
          </h1>
          <p className="text-xs text-slate-500">
            Upload your dedicated About Me photo and write your personal bio description for your live portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAiModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generate with AI</span>
        </button>
      </div>

      <SectionPublishBar sectionId="about" title="About Me Section" />


      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 bg-white border border-slate-200">
        {/* Profile Photo Upload Section */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            About Me Section Photo
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              {aboutAvatar ? (
                <img
                  src={aboutAvatar}
                  alt="About Avatar"
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80';
                  }}
                />
              ) : (

                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <User className="w-8 h-8" />
                </div>
              )}

              <label className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white text-[10px] font-semibold gap-1">
                {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploadingAvatar ? 'Uploading...' : 'Upload'}</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center gap-3">
                <label className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer flex items-center gap-2 font-bold text-xs transition shadow-sm">
                  {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{uploadingAvatar ? 'Uploading Image...' : 'Choose About Section Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 text-[11px] font-medium">Or enter Image URL</label>
                <input
                  type="text"
                  value={aboutAvatar}
                  onChange={(e) => setAboutAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio Textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Personal Bio & About Content
          </label>
          <textarea
            rows={6}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="I am a passionate Full Stack Developer with experience in building web applications..."
            className="w-full bg-white border border-slate-300 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 leading-relaxed font-sans"
          />
          <p className="text-[11px] text-slate-500">
            💡 Changes written in this box will instantly display on your live portfolio's About Me section!
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition transform active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save About Me Content'}</span>
          </button>
        </div>
      </form>

      {/* AI Modal */}
      <AIGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApply={handleApplyAiBio}
        type="bio"
        initialData={{
          fullName: portfolio?.personalInfo?.fullName || portfolio?.username || '',
          title: portfolio?.personalInfo?.title || 'Full Stack Engineer',
          skills: portfolio?.skills,
        }}
      />
    </div>
  );
};

export default AboutInfoPage;

