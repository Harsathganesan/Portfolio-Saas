import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { Award, Plus, Trash2, Edit2, Loader2, X, ExternalLink } from 'lucide-react';
import SectionPublishBar from '../components/SectionPublishBar';



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
    <div className="space-y-8 animate-fade-in font-sans text-slate-900">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" /> Certificates ({certificates.length})
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage technical certifications and credentials</p>
        </div>
        <button onClick={handleOpenAdd} className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <SectionPublishBar sectionId="certificates" title="Certifications & Awards Section" itemCount={certificates.length} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {certificates.map((cert) => (
          <div key={cert._id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900">{cert.title}</h3>
              <p className="text-xs font-bold text-blue-600">{cert.organization}</p>
              {cert.issueDate && <p className="text-[11px] text-slate-400 font-mono font-medium">Issued: {cert.issueDate}</p>}
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 pt-1">
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={() => handleOpenEdit(cert)} className="p-1.5 text-slate-400 hover:text-blue-600 transition">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cert._id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Light Theme Add / Edit Certificate Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[99999] top-0 left-0 w-screen h-screen bg-slate-900/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-slate-900">


            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-5">{editingId ? 'Edit Certificate' : 'Add Certificate'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Certificate Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="AWS Solutions Architect"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="Amazon Web Services"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Issue Date</label>
                <input
                  type="text"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  placeholder="May 2024"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Credential Verification URL</label>
                <input
                  type="url"
                  value={form.credentialUrl}
                  onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                  placeholder="https://aws.amazon.com/..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-2"
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

