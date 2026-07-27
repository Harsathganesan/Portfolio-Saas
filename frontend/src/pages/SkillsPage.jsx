import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { Code2, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-400" /> Skills & Technical Stack ({skills.length})
          </h1>
          <p className="text-xs text-slate-400">Manage technical proficiencies and category groupings</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((sk) => (
          <div key={sk._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{sk.name}</span>
              <div className="flex items-center space-x-1">
                <button onClick={() => handleOpenEdit(sk)} className="p-1 text-slate-400 hover:text-indigo-400">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(sk._id)} className="p-1 text-slate-400 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>{sk.category}</span>
                <span className="text-indigo-400">{sk.proficiencyLevel}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                  style={{ width: `${sk.proficiencyLevel}%` }}
                />
              </div>
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
            <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit Skill' : 'Add Skill'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Skill Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="React.js / Node.js"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
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
                <div className="flex justify-between font-medium text-slate-300 mb-1">
                  <span>Proficiency Level</span>
                  <span className="text-indigo-400 font-bold">{form.proficiencyLevel}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={form.proficiencyLevel}
                  onChange={(e) => setForm({ ...form, proficiencyLevel: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 mt-2"
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
