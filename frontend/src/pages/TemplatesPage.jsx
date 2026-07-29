import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { Palette, Check, Sun, Moon } from 'lucide-react';

const templatesList = [
  {
    id: 'minimalist',
    name: 'Template 1: Abi.dev Full Portfolio',
    description: 'Complete developer layout with top header navbar tabs (Home, About, Education, Experience, Skills, Projects, Certifications, Awards, Contact), timeline, stat counters, and newsletter footer.',
    tag: 'Template 1 (Featured)',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'creative',
    name: 'Creative Dark Studio',
    description: 'Vibrant glassmorphic cards, glowing accents, particle aesthetics.',
    tag: 'Glassmorphism',
    img: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80',
  },
];

const TemplatesPage = () => {
  const { portfolio, updatePortfolio } = usePortfolio();
  const { toast } = useToast();

  const currentTemplate = portfolio?.templateId || 'minimalist';
  const currentThemeMode = portfolio?.themeMode || 'dark';

  const handleSelectTemplate = async (templateId) => {
    try {
      await updatePortfolio({ templateId });
      toast(`Active template switched to ${templateId}!`, 'success');
    } catch (err) {
      toast('Failed to change template', 'error');
    }
  };

  const handleToggleThemeMode = async (themeMode) => {
    try {
      await updatePortfolio({ themeMode });
      toast(`Default portfolio theme set to ${themeMode} mode!`, 'info');
    } catch (err) {
      toast('Failed to change theme mode', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-400" /> Portfolio Templates (2 Available)
          </h1>
          <p className="text-xs text-slate-400">Choose your active portfolio layout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesList.map((tpl) => {
          const isSelected = currentTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl.id)}
              className={`glass-card rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20'
                  : 'border-slate-800 hover:border-slate-700 hover:-translate-y-1'
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-indigo-600 text-white text-[10px] font-extrabold uppercase rounded-full flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3" /> Active Template
                </span>
              )}

              <div className="h-44 overflow-hidden relative">
                <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-indigo-300 rounded-full border border-indigo-500/30">
                  {tpl.tag}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-bold text-base text-white">{tpl.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition ${
                    isSelected
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  {isSelected ? 'Active Layout' : 'Select Template'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatesPage;
