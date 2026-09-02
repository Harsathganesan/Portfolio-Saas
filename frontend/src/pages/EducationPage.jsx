import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { GraduationCap, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import SectionPublishBar from '../components/SectionPublishBar';




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
      cgpa: edu.cgpa || edu.grade || '',
      description: edu.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.degree || !form.institution) return;
    setLoading(true);
    const payload = {
      ...form,
      grade: form.cgpa || '',
      cgpa: form.cgpa || '',
    };
    try {
      if (editingId) {
        await portfolioService.updateEducation(editingId, payload);
        toast('Education record updated!', 'success');
      } else {
        await portfolioService.createEducation(payload);
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
    <div className="space-y-8 animate-fade-in font-sans text-slate-900">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" /> Education ({education.length})
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage academic degrees, universities, and CGPA</p>
        </div>
        <button onClick={handleOpenAdd} className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <SectionPublishBar sectionId="education" title="Education Section" itemCount={education.length} />

      <div className="space-y-4">

        {education.map((edu) => (
          <div key={edu._id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-2xs flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">{edu.degree}</h3>
              <p className="text-xs font-bold text-blue-600">{edu.institution} {edu.duration ? `(${edu.duration})` : ''}</p>
              {edu.cgpa && <p className="text-xs text-slate-600 font-mono font-medium">CGPA / Grade: {edu.cgpa}</p>}
              {edu.description && <p className="text-xs text-slate-500 pt-1 font-medium">{edu.description}</p>}
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={() => handleOpenEdit(edu)} className="p-1.5 text-slate-400 hover:text-blue-600 transition">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(edu._id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Light Theme Add / Edit Education Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[99999] top-0 left-0 w-screen h-screen bg-slate-900/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-slate-900">


            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-5">{editingId ? 'Edit Education' : 'Add Education'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Degree / Field of Study</label>
                <input
                  type="text"
                  required
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  placeholder=""
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">College / University</label>
                <input
                  type="text"
                  required
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  placeholder=""
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
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5 font-semibold">CGPA / GPA</label>
                  <input
                    type="text"
                    value={form.cgpa}
                    onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder=""
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-2"
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

