import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { uploadService } from '../services/uploadService';
import { useToast } from '../components/Toast';
import { FolderGit2, Plus, Trash2, Edit2, Sparkles, ExternalLink, Github, Upload, Loader2, X } from 'lucide-react';
import SectionPublishBar from '../components/SectionPublishBar';
import AIGeneratorModal from '../components/AIGeneratorModal';



const ProjectsPage = () => {
  const { portfolio, fetchPortfolio, addProjectToContext, removeProjectFromContext, updatePortfolio } = usePortfolio();

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
    <div className="space-y-8 animate-fade-in font-sans text-slate-900">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-blue-600" /> Projects ({projects.length})
          </h1>
          <p className="text-xs text-slate-500 font-medium">Add, edit, or remove work showcase items</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      <SectionPublishBar sectionId="projects" title="Projects Section" itemCount={projects.length} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {projects.map((proj) => (
          <div key={proj._id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {proj.thumbnail && (
                <img
                  src={proj.thumbnail}
                  alt={proj.title}
                  className="w-full h-40 object-cover rounded-xl border border-slate-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80';
                  }}
                />
              )}

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">{proj.title}</h3>
                <div className="flex items-center space-x-1">
                  <button onClick={() => handleOpenEdit(proj)} className="p-1.5 text-slate-400 hover:text-blue-600 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(proj._id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">{proj.description}</p>
            </div>

            {proj.techStack && proj.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-50">
                {(Array.isArray(proj.techStack) ? proj.techStack : proj.techStack.split(',')).map((tech) => (
                  <span key={tech} className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Light Theme Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[99999] top-0 left-0 w-screen h-screen bg-slate-900/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900">


            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-5">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Project Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enterprise AI Gateway"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-slate-700 font-semibold">Description</label>
                  <button
                    type="button"
                    onClick={() => setAiModalOpen(true)}
                    className="text-purple-600 hover:underline text-[11px] flex items-center gap-1 font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Write with AI
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Engineered high throughput API routing..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  placeholder="React, Node.js, MongoDB, Tailwind"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1.5 font-semibold">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5 font-semibold">Live Demo URL</label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Thumbnail Image URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                  />
                  <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer flex items-center gap-1 font-semibold transition border border-slate-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-4"
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
