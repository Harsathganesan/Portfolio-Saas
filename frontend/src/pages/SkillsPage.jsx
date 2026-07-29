import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { Code2, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import SectionPublishBar from '../components/SectionPublishBar';



const SkillsPage = () => {

  const { portfolio, fetchPortfolio, addSkillToContext, removeSkillFromContext } = usePortfolio();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'Frontend',
    proficiencyLevel: 85,
  });

  const skills = portfolio?.skills || [];

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ name: '', category: 'Frontend', proficiencyLevel: 85 });
    setModalOpen(true);
  };

  const handleOpenEdit = (sk) => {
    setEditingId(sk._id);
    setForm({
      name: sk.name || '',
      category: sk.category || 'Frontend',
      proficiencyLevel: sk.proficiencyLevel || 85,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setLoading(true);
    try {
      if (editingId) {
        await portfolioService.updateSkill(editingId, form);
        toast('Skill updated!', 'success');
        fetchPortfolio();
      } else {
        const res = await portfolioService.createSkill(form);
        if (res.success && res.skill) {
          addSkillToContext(res.skill);
        } else {
          fetchPortfolio();
        }
        toast('Skill added successfully!', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      toast('Failed to save skill', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      removeSkillFromContext(id);
      await portfolioService.deleteSkill(id);
      toast('Skill deleted', 'info');
    } catch (err) {
      toast('Failed to delete skill', 'error');
      fetchPortfolio();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans text-slate-900">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-blue-600" /> Skills & Technical Stack ({skills.length})
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage technical proficiencies and category groupings</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <SectionPublishBar sectionId="skills" title="Skills Section" itemCount={skills.length} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {skills.map((sk) => (
          <div key={sk._id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{sk.name}</span>
              <div className="flex items-center space-x-1">
                <button onClick={() => handleOpenEdit(sk)} className="p-1 text-slate-400 hover:text-blue-600 transition">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(sk._id)} className="p-1 text-slate-400 hover:text-rose-600 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                <span>{sk.category}</span>
                <span className="text-blue-600 font-bold">{sk.proficiencyLevel}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${sk.proficiencyLevel}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Light Theme Add / Edit Skill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[99999] top-0 left-0 w-screen h-screen bg-slate-900/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-slate-900">


            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-5">{editingId ? 'Edit Skill' : 'Add Skill'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Skill Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="React.js / Node.js"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps & Cloud</option>
                  <option value="Tools">Tools & Architecture</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                  <span>Proficiency Level</span>
                  <span className="text-blue-600 font-bold">{form.proficiencyLevel}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={form.proficiencyLevel}
                  onChange={(e) => setForm({ ...form, proficiencyLevel: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Skill</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;

