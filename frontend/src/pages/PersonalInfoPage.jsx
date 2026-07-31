import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { uploadService } from '../services/uploadService';
import { User, Sparkles, Upload, Save, Loader2, Link2 } from 'lucide-react';
import AIGeneratorModal from '../components/AIGeneratorModal';

import SectionPublishBar from '../components/SectionPublishBar';

const ensureUrlProtocol = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const clean = url.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('mailto:') || clean.startsWith('tel:')) {
    return clean;
  }
  return `https://${clean}`;
};

const PersonalInfoPage = () => {

  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();

  const [form, setForm] = useState({
    fullName: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    portfolioUrl: '',
  });

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (portfolio) {
      setForm({
        fullName: portfolio.personalInfo?.fullName || '',
        title: portfolio.personalInfo?.title || '',
        bio: portfolio.personalInfo?.bio || '',
        email: portfolio.personalInfo?.email || '',
        phone: portfolio.personalInfo?.phone || '',
        location: portfolio.personalInfo?.location || '',
        avatar: portfolio.personalInfo?.avatar || '',
        github: portfolio.socialLinks?.github || '',
        linkedin: portfolio.socialLinks?.linkedin || '',
        twitter: portfolio.socialLinks?.twitter || '',
        instagram: portfolio.socialLinks?.instagram || '',
        portfolioUrl: portfolio.socialLinks?.portfolio || '',
      });
    }
  }, [portfolio]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res.success) {
        setForm((prev) => ({ ...prev, avatar: res.url }));
        // Auto-save avatar URL to database immediately for live portfolio display
        await updatePortfolio({
          personalInfo: {
            fullName: form.fullName || portfolio?.personalInfo?.fullName || '',
            title: form.title || portfolio?.personalInfo?.title || '',
            bio: form.bio || portfolio?.personalInfo?.bio || '',
            email: form.email || portfolio?.personalInfo?.email || '',
            phone: form.phone || portfolio?.personalInfo?.phone || '',
            location: form.location || portfolio?.personalInfo?.location || '',
            avatar: res.url,
          },
        });
        toast('Profile photo uploaded and saved live!', 'success');
      }
    } catch (err) {
      toast('Failed to upload profile photo', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePortfolio({
        personalInfo: {
          fullName: form.fullName,
          title: form.title,
          bio: form.bio,
          email: form.email,
          phone: form.phone,
          location: form.location,
          avatar: form.avatar,
        },
        socialLinks: {
          github: ensureUrlProtocol(form.github),
          linkedin: ensureUrlProtocol(form.linkedin),
          twitter: ensureUrlProtocol(form.twitter),
          instagram: ensureUrlProtocol(form.instagram),
          portfolio: ensureUrlProtocol(form.portfolioUrl),
          website: ensureUrlProtocol(form.portfolioUrl),
        },
        sectionsEnabled: {
          ...(portfolio?.sectionsEnabled || {}),
          personal: true,
        },
      });
      toast('Personal details saved & published to portfolio live!', 'success');
    } catch (err) {
      toast('Failed to save details', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" /> Personal Details & Socials
          </h1>
          <p className="text-xs text-slate-500">Update your header details, profile photo, and social links</p>
        </div>

        <button
          onClick={() => setAiModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold flex items-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>AI Bio Generator</span>
        </button>
      </div>

      <SectionPublishBar sectionId="personal" title="Personal Details" />

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">

        {/* Profile Avatar & Primary Info */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-6 bg-white">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600">Profile Photo & Basic Info</h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80';
                  }}
                />
              ) : (

                <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
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
                <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer flex items-center gap-2 font-semibold transition shadow-sm">
                  {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{uploadingAvatar ? 'Uploading Image...' : 'Choose Profile Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Avatar Image URL (or upload above)</label>
                <input
                  type="text"
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Alex Rivera"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Professional Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Senior Full Stack Engineer"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-slate-600 font-medium">About Me / Bio</label>
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="text-purple-600 hover:underline text-[11px] flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3" /> Auto-generate with AI
              </button>
            </div>
            <textarea
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              placeholder="Passionate engineer building web applications with high performance..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Public Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="San Francisco, CA"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 bg-white">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Link2 className="w-4 h-4" /> Social Links & Profiles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">GitHub URL</label>
              <input
                type="text"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">LinkedIn URL</label>
              <input
                type="text"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">Instagram URL</label>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </form>

      {/* AI Generator Modal */}
      <AIGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        type="bio"
        initialData={{ fullName: form.fullName, title: form.title }}
        onApply={(text) => setForm((prev) => ({ ...prev, bio: text }))}
      />
    </div>
  );
};

export default PersonalInfoPage;

