import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { uploadService } from '../services/uploadService';
import { useToast } from '../components/Toast';
import { FolderGit2, Plus, Trash2, Edit2, Sparkles, ExternalLink, Github, Upload, Loader2, X } from 'lucide-react';
import AIGeneratorModal from '../components/AIGeneratorModal';

const ProjectsPage = () => {
  const { portfolio, fetchPortfolio, addProjectToContext, removeProjectFromContext } = usePortfolio();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    thumbnail: '',
    category: 'Web Application',
    isFeatured: false,
  });

  const projects = portfolio?.projects || [];

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      techStack: '',
      githubUrl: '',
      liveUrl: '',
      thumbnail: '',
      category: 'Web Application',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingId(proj._id);
    setForm({
      title: proj.title || '',
      description: proj.description || '',
      techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack || '',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      thumbnail: proj.thumbnail || '',
      category: proj.category || 'Web Application',
      isFeatured: proj.isFeatured || false,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res.success) {
        setForm((prev) => ({ ...prev, thumbnail: res.url }));
        toast('Thumbnail uploaded!', 'success');
      }
    } catch (err) {
      toast('Failed to upload image', 'error');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast('Project title is required', 'error');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await portfolioService.updateProject(editingId, form);
        toast('Project updated!', 'success');
        fetchPortfolio();
      } else {
        const res = await portfolioService.createProject(form);
        if (res.success && res.project) {
          addProjectToContext(res.project);
        } else {
          fetchPortfolio();
        }
        toast('Project added!', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      toast('Failed to save project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      removeProjectFromContext(id);
      await portfolioService.deleteProject(id);
      toast('Project deleted', 'info');
    } catch (err) {
      toast('Failed to delete project', 'error');
      fetchPortfolio();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-indigo-400" /> Projects ({projects.length})
          </h1>
          <p className="text-xs text-slate-400">Add, edit, or remove work showcase items</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {proj.thumbnail && (
                <img src={proj.thumbnail} alt={proj.title} className="w-full h-40 object-cover rounded-2xl" />
              )}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white">{proj.title}</h3>
                <div className="flex items-center space-x-1">
                  <button onClick={() => handleOpenEdit(proj)} className="p-1.5 text-slate-400 hover:text-indigo-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(proj._id)} className="p-1.5 text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{proj.description}</p>
            </div>

            {proj.techStack && proj.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-3">
                {(Array.isArray(proj.techStack) ? proj.techStack : proj.techStack.split(',')).map((tech) => (
                  <span key={tech} className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Project Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enterprise AI Gateway"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-400 font-medium">Description</label>
                  <button
                    type="button"
                    onClick={() => setAiModalOpen(true)}
                    className="text-purple-400 hover:underline text-[11px] flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" /> Write with AI
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Engineered high throughput API routing..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  placeholder="React, Node.js, MongoDB, Tailwind"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Live Demo URL</label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Thumbnail Image URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-indigo-500"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Project</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      <AIGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        type="project"
        initialData={{ projectTitle: form.title, techStack: form.techStack }}
        onApply={(text) => setForm((prev) => ({ ...prev, description: text }))}
      />
    </div>
  );
};

export default ProjectsPage;
