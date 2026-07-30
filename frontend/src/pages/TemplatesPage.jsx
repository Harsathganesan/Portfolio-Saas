import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { Palette, Check, Save, Loader2 } from 'lucide-react';

const templatesList = [
  {
    id: 'minimalist',
    name: 'Template 1',
    description: 'Complete developer layout with top header navbar tabs (Home, About, Education, Experience, Skills, Projects, Certifications, Awards, Contact), timeline, stat counters, and newsletter footer.',
    tag: 'Featured',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
  },
];

const accentColors = [
  { label: 'Royal Indigo',   value: '#6366f1', bg: '#6366f1' },
  { label: 'Ocean Blue',    value: '#2563eb', bg: '#2563eb' },
  { label: 'Emerald Green', value: '#10b981', bg: '#10b981' },
  { label: 'Rose Red',      value: '#f43f5e', bg: '#f43f5e' },
  { label: 'Deep Purple',   value: '#8b5cf6', bg: '#8b5cf6' },
  { label: 'Amber Gold',    value: '#f59e0b', bg: '#f59e0b' },
  { label: 'Cyan Teal',     value: '#06b6d4', bg: '#06b6d4' },
  { label: 'Slate Gray',    value: '#64748b', bg: '#64748b' },
];

const TemplatesPage = () => {
  const { portfolio, updatePortfolio } = usePortfolio();
  const { toast } = useToast();

  const currentTemplate = portfolio?.templateId || 'minimalist';
  const savedColor = portfolio?.primaryColor || '#6366f1';

  const [selectedColor, setSelectedColor] = useState(savedColor);
  const [savingTheme, setSavingTheme] = useState(false);

  const handleSelectTemplate = async (templateId) => {
    try {
      await updatePortfolio({ templateId });
      toast('Template updated!', 'success');
    } catch {
      toast('Failed to change template', 'error');
    }
  };

  const handleSaveTheme = async () => {
    setSavingTheme(true);
    try {
      await updatePortfolio({ primaryColor: selectedColor, templateId: currentTemplate });
      toast('Theme color saved to your portfolio!', 'success');
    } catch {
      toast('Failed to save theme', 'error');
    } finally {
      setSavingTheme(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-600" /> Portfolio Templates ({templatesList.length} Available)
          </h1>
          <p className="text-xs text-slate-500">Choose your active portfolio layout and accent color</p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesList.map((tpl) => {
          const isSelected = currentTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl.id)}
              className={`bg-white rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 relative flex flex-col justify-between shadow-sm ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-500/10'
                  : 'border-slate-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-indigo-600 text-white text-[10px] font-extrabold uppercase rounded-full flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3" /> Active Template
                </span>
              )}

              <div className="h-44 overflow-hidden relative">
                <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-[10px] font-semibold text-slate-700 rounded-full border border-slate-200">
                  {tpl.tag}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-bold text-base text-slate-900">{tpl.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition ${
                    isSelected
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isSelected ? '✓ Active Layout' : 'Select Template'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accent Color Picker Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Change Accent Color</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a color — click <strong>Save Theme</strong> to apply it to your live portfolio
            </p>
          </div>
          <button
            onClick={handleSaveTheme}
            disabled={savingTheme}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-60"
          >
            {savingTheme ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Theme
          </button>
        </div>

        {/* Color Swatches */}
        <div className="flex flex-wrap gap-3">
          {accentColors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              title={color.label}
              className={`w-10 h-10 rounded-full border-4 transition-all duration-200 shadow-sm ${
                selectedColor === color.value
                  ? 'border-slate-900 scale-110 shadow-md'
                  : 'border-white hover:scale-105 hover:border-slate-300'
              }`}
              style={{ backgroundColor: color.bg }}
            />
          ))}
        </div>

        {/* Live Preview Bar */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div
            className="w-12 h-12 rounded-xl shadow-sm shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: selectedColor }}
          >
            Aa
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900">Preview</p>
            <p className="text-xs text-slate-500 font-medium">
              Selected: <span className="font-bold" style={{ color: selectedColor }}>{selectedColor}</span>
              {selectedColor === savedColor ? (
                <span className="ml-2 text-emerald-600 font-semibold">✓ Currently saved</span>
              ) : (
                <span className="ml-2 text-amber-600 font-semibold">⚠ Unsaved — click Save Theme</span>
              )}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] px-3 py-1 rounded-full text-white font-semibold" style={{ backgroundColor: selectedColor }}>
                Button
              </span>
              <span className="text-[11px] font-semibold" style={{ color: selectedColor }}>Section Title</span>
              <div className="h-1 w-12 rounded-full" style={{ backgroundColor: selectedColor }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
