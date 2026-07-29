import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const SectionPublishBar = ({ sectionId, title, itemCount }) => {
  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();

  const defaultSections = {
    personal: true,
    about: true,
    education: true,
    experience: true,
    skills: true,
    projects: true,
    certificates: true,
    inbox: true,
  };

  const sectionsEnabled = portfolio?.sectionsEnabled || {};
  const activeSections = { ...defaultSections, ...sectionsEnabled };
  const isPublished = activeSections[sectionId] === true;

  const handleTogglePublish = async () => {
    const nextState = !isPublished;
    const updated = {
      ...sectionsEnabled,
      [sectionId]: nextState,
    };

    try {
      await updatePortfolio({ sectionsEnabled: updated });
      if (nextState) {
        toast(`${title} published live on your portfolio!`, 'success');
      } else {
        toast(`${title} hidden from your portfolio!`, 'info');
      }
    } catch (err) {
      toast(`Failed to update ${title} visibility`, 'error');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full shrink-0 ${isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-800">{title} Visibility</h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {isPublished ? 'Live on Portfolio' : 'Unsaved / Hidden'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isPublished
              ? `This section is visible on your public portfolio.${itemCount !== undefined ? ` (${itemCount} items)` : ''}`
              : 'This section is hidden from your public portfolio navigation and page content.'}
          </p>
        </div>
      </div>

      <button
        onClick={handleTogglePublish}
        disabled={saving}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 border shadow-sm shrink-0 ${
          isPublished
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
        }`}
      >
        {isPublished ? (
          <>
            <EyeOff className="w-4 h-4 text-slate-500" />
            <span>Unsave / Hide Section</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 text-white" />
            <span>Save & Publish Live</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SectionPublishBar;
