import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { Briefcase, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import SectionPublishBar from '../components/SectionPublishBar';




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
      position: exp.position || exp.role || '',
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
    const payload = {
      ...form,
      role: form.position,
      position: form.position,
    };
    try {
      if (editingId) {
        await portfolioService.updateExperience(editingId, payload);
        toast('Experience item updated!', 'success');
      } else {
        await portfolioService.createExperience(payload);
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
    <div className="space-y-8 animate-fade-in font-sans text-slate-900">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" /> Work Experience ({experience.length})
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage employment history and key role achievements</p>
        </div>
        <button onClick={handleOpenAdd} className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <SectionPublishBar sectionId="experience" title="Work Experience Section" itemCount={experience.length} />

      <div className="space-y-4">

        {experience.map((exp) => (
          <div key={exp._id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-2xs flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">{exp.position}</h3>
              <p className="text-xs font-bold text-blue-600">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
              <span className="text-[11px] font-mono text-slate-400 font-medium block">{exp.duration}</span>
              {exp.description && <p className="text-xs text-slate-600 pt-2 leading-relaxed font-medium">{exp.description}</p>}
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={() => handleOpenEdit(exp)} className="p-1.5 text-slate-400 hover:text-blue-600 transition">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(exp._id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Light Theme Add / Edit Experience Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[99999] top-0 left-0 w-screen h-screen bg-slate-900/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-slate-900">


            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-5">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Position / Role Title</label>
                <input
                  type="text"
                  required
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Senior Full Stack Engineer"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Company Name</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Google / Acme Corp"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1.5 font-semibold">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Jan 2022 - Present"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5 font-semibold">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Description & Key Achievements</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Led team of 6 building microservices..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-2"
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

