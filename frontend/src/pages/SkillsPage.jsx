import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { Code2, Plus, Trash2, Edit2, Loader2, X, Sparkles, Save } from 'lucide-react';
import SectionPublishBar from '../components/SectionPublishBar';

const SkillsPage = () => {

  const { portfolio, fetchPortfolio, addSkillToContext, removeSkillFromContext } = usePortfolio();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Batch Skill Tag Input State
  const [tagInput, setTagInput] = useState('');
  const [tagCategory, setTagCategory] = useState('Frontend');
  const [tagLevel, setTagLevel] = useState(85);
  const [draftTags, setDraftTags] = useState([]);
  const [savingBatch, setSavingBatch] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'Frontend',
    proficiencyLevel: 85,
  });

  const skills = portfolio?.skills || [];

  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    if (!tagInput.trim()) return;
    const name = tagInput.trim();
    if (draftTags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      toast('Skill already in draft list', 'info');
      return;
    }
    setDraftTags((prev) => [
      ...prev,
      { id: Date.now(), name, category: tagCategory, proficiencyLevel: tagLevel },
    ]);
    setTagInput('');
  };

  const handleRemoveDraftTag = (id) => {
    setDraftTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveBatchSkills = async () => {
    if (draftTags.length === 0) return;
    setSavingBatch(true);
    try {
      for (const skill of draftTags) {
        const res = await portfolioService.createSkill({
          name: skill.name,
          category: skill.category,
          proficiencyLevel: skill.proficiencyLevel,
        });
        if (res.success && res.skill) {
          addSkillToContext(res.skill);
        }
      }
      toast(`${draftTags.length} skill(s) saved & published live!`, 'success');
      setDraftTags([]);
      fetchPortfolio();
    } catch (err) {
      toast('Failed to save skills batch', 'error');
    } finally {
      setSavingBatch(false);
    }
  };

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

      {/* Interactive Quick Add Skill Tags Section */}
      <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Quick Add Skill Tags
          </h2>
          <span className="text-xs text-slate-400">Type skill name and click Add or press Enter</span>
        </div>

        <form onSubmit={handleAddTag} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Type skill name (e.g. React.js, Node.js, Python, Figma)..."
            className="flex-1 w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition"
          />

          <select
            value={tagCategory}
            onChange={(e) => setTagCategory(e.target.value)}
            className="w-full sm:w-40 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 font-medium"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="DevOps">DevOps & Cloud</option>
            <option value="Tools">Tools & Architecture</option>
            <option value="Design">UI/UX Design</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tag</span>
          </button>
        </form>

        {/* Draft Tags Display Chips */}
        {draftTags.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Tags ready to save ({draftTags.length}):</span>
              <button
                type="button"
                onClick={() => setDraftTags([])}
                className="text-slate-400 hover:text-rose-600 transition text-[11px]"
              >
                Clear all tags
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {draftTags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-2"
                >
                  <span>{tag.name}</span>
                  <span className="text-[10px] text-indigo-400 font-mono">({tag.category})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDraftTag(tag.id)}
                    className="hover:text-rose-600 text-indigo-400 p-0.5 rounded-full hover:bg-rose-50 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveBatchSkills}
                disabled={savingBatch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition"
              >
                {savingBatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{savingBatch ? 'Saving Skills...' : `Save ${draftTags.length} Skill Tag(s) to Portfolio`}</span>
              </button>
            </div>
          </div>
        )}
      </div>

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

