import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { Briefcase, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';

const ExperiencePage = () => {
  const { portfolio, fetchPortfolio } = usePortfolio();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    company: '',
    position: '',
    duration: '',
    location: '',
    description: '',
  });

  const experience = portfolio?.experience || [];

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ company: '', position: '', duration: '', location: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
      company: exp.company || '',
      position: exp.position || '',
      duration: exp.duration || '',
      location: exp.location || '',
      description: exp.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.position) return;
    setLoading(true);
    try {
      if (editingId) {
        await portfolioService.updateExperience(editingId, form);
        toast('Experience item updated!', 'success');
      } else {
        await portfolioService.createExperience(form);
        toast('Experience item added!', 'success');
      }
      setModalOpen(false);
      fetchPortfolio();
    } catch (err) {
      toast('Failed to save experience item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await portfolioService.deleteExperience(id);
      toast('Experience item deleted', 'info');
      fetchPortfolio();
    } catch (err) {
      toast('Failed to delete experience item', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" /> Work Experience ({experience.length})
          </h1>
          <p className="text-xs text-slate-400">Manage employment history and key role achievements</p>
        </div>
        <button onClick={handleOpenAdd} className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp._id} className="glass-card p-6 rounded-2xl border border-slate-800 flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">{exp.position}</h3>
              <p className="text-xs font-semibold text-indigo-400">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
              <span className="text-[10px] font-mono text-slate-400 block">{exp.duration}</span>
              {exp.description && <p className="text-xs text-slate-400 pt-2 leading-relaxed">{exp.description}</p>}
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={() => handleOpenEdit(exp)} className="p-1.5 text-slate-400 hover:text-indigo-400">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(exp._id)} className="p-1.5 text-slate-400 hover:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Position / Role Title</label>
                <input
                  type="text"
                  required
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Senior Full Stack Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Company Name</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Google / Acme Corp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Jan 2022 - Present"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description & Key Achievements</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Led team of 6 building microservices..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Experience</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;
