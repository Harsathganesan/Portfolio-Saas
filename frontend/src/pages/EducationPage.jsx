import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { GraduationCap, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';

const EducationPage = () => {
  const { portfolio, fetchPortfolio } = usePortfolio();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    degree: '',
    institution: '',
    duration: '',
    cgpa: '',
    description: '',
  });

  const education = portfolio?.education || [];

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ degree: '', institution: '', duration: '', cgpa: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (edu) => {
    setEditingId(edu._id);
    setForm({
      degree: edu.degree || '',
      institution: edu.institution || '',
      duration: edu.duration || '',
      cgpa: edu.cgpa || '',
      description: edu.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.degree || !form.institution) return;
    setLoading(true);
    try {
      if (editingId) {
        await portfolioService.updateEducation(editingId, form);
        toast('Education record updated!', 'success');
      } else {
        await portfolioService.createEducation(form);
        toast('Education record added!', 'success');
      }
      setModalOpen(false);
      fetchPortfolio();
    } catch (err) {
      toast('Failed to save education record', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await portfolioService.deleteEducation(id);
      toast('Education record deleted', 'info');
      fetchPortfolio();
    } catch (err) {
      toast('Failed to delete education record', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" /> Education ({education.length})
          </h1>
          <p className="text-xs text-slate-400">Manage academic degrees, universities, and CGPA</p>
        </div>
        <button onClick={handleOpenAdd} className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu._id} className="glass-card p-6 rounded-2xl border border-slate-800 flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">{edu.degree}</h3>
              <p className="text-xs font-semibold text-indigo-400">{edu.institution} {edu.duration ? `(${edu.duration})` : ''}</p>
              {edu.cgpa && <p className="text-xs text-slate-300 font-mono">CGPA / Grade: {edu.cgpa}</p>}
              {edu.description && <p className="text-xs text-slate-400 pt-1">{edu.description}</p>}
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={() => handleOpenEdit(edu)} className="p-1.5 text-slate-400 hover:text-indigo-400">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(edu._id)} className="p-1.5 text-slate-400 hover:text-rose-400">
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
            <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit Education' : 'Add Education'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Degree / Field of Study</label>
                <input
                  type="text"
                  required
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  placeholder="B.S. in Computer Science"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">College / University</label>
                <input
                  type="text"
                  required
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  placeholder="Stanford University"
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
                    placeholder="2020 - 2024"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">CGPA / GPA</label>
                  <input
                    type="text"
                    value={form.cgpa}
                    onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                    placeholder="3.9 / 4.0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Relevant coursework & honors..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Education</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationPage;
