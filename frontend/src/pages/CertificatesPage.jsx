import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { Award, Plus, Trash2, Edit2, Loader2, X, ExternalLink } from 'lucide-react';

const CertificatesPage = () => {
  const { portfolio, fetchPortfolio } = usePortfolio();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    organization: '',
    issueDate: '',
    credentialUrl: '',
  });

  const certificates = portfolio?.certificates || [];

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ title: '', organization: '', issueDate: '', credentialUrl: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingId(cert._id);
    setForm({
      title: cert.title || '',
      organization: cert.organization || '',
      issueDate: cert.issueDate || '',
      credentialUrl: cert.credentialUrl || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.organization) return;
    setLoading(true);
    try {
      if (editingId) {
        await portfolioService.updateCertificate(editingId, form);
        toast('Certificate updated!', 'success');
      } else {
        await portfolioService.createCertificate(form);
        toast('Certificate added!', 'success');
      }
      setModalOpen(false);
      fetchPortfolio();
    } catch (err) {
      toast('Failed to save certificate', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await portfolioService.deleteCertificate(id);
      toast('Certificate deleted', 'info');
      fetchPortfolio();
    } catch (err) {
      toast('Failed to delete certificate', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-400" /> Certificates ({certificates.length})
          </h1>
          <p className="text-xs text-slate-400">Manage technical certifications and credentials</p>
        </div>
        <button onClick={handleOpenAdd} className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div key={cert._id} className="glass-card p-5 rounded-2xl border border-slate-800 flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">{cert.title}</h3>
              <p className="text-xs font-semibold text-indigo-400">{cert.organization}</p>
              {cert.issueDate && <p className="text-[10px] text-slate-400 font-mono">Issued: {cert.issueDate}</p>}
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 pt-1">
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={() => handleOpenEdit(cert)} className="p-1.5 text-slate-400 hover:text-indigo-400">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cert._id)} className="p-1.5 text-slate-400 hover:text-rose-400">
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
            <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit Certificate' : 'Add Certificate'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Certificate Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="AWS Solutions Architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="Amazon Web Services"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Issue Date</label>
                <input
                  type="text"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  placeholder="May 2024"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Credential Verification URL</label>
                <input
                  type="url"
                  value={form.credentialUrl}
                  onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                  placeholder="https://aws.amazon.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Certificate</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
