import React, { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, Check, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useToast } from './Toast';
import { usePortfolio } from '../context/PortfolioContext';

const formatSkillsString = (s) => {
  if (!s) return 'React, Node.js, TypeScript';
  if (typeof s === 'string') return s;
  if (Array.isArray(s)) {
    return s.map((item) => (typeof item === 'string' ? item : item.name || '')).filter(Boolean).join(', ');
  }
  return 'React, Node.js, TypeScript';
};

const formatTechStackString = (s) => {
  if (!s) return 'React, Express, MongoDB';
  if (typeof s === 'string') return s;
  if (Array.isArray(s)) return s.map((item) => (typeof item === 'string' ? item : item.name || '')).filter(Boolean).join(', ');
  return 'React, Express, MongoDB';
};

const AIGeneratorModal = ({ isOpen, onClose, type = 'bio', initialData = {}, onApply }) => {
  const { portfolio } = usePortfolio?.() || {};
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  // Bio fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [tone, setTone] = useState('professional');
  const [skills, setSkills] = useState('');

  // Project fields
  const [projectTitle, setProjectTitle] = useState('');
  const [techStack, setTechStack] = useState('');
  const [goal, setGoal] = useState('automate workflows and optimize user experience');

  useEffect(() => {
    if (isOpen) {
      const defaultName = initialData.fullName || initialData.name || portfolio?.personalInfo?.fullName || portfolio?.username || '';
      const defaultTitle = initialData.title || portfolio?.personalInfo?.title || 'Full Stack Engineer';
      const defaultSkills = formatSkillsString(initialData.skills || portfolio?.skills);
      const defaultProjectTitle = initialData.projectTitle || initialData.title || '';
      const defaultTechStack = formatTechStackString(initialData.techStack);

      setName(defaultName);
      setTitle(defaultTitle);
      setSkills(defaultSkills);
      setProjectTitle(defaultProjectTitle);
      setTechStack(defaultTechStack);
      setGeneratedText('');
    }
  }, [isOpen, initialData, portfolio]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (type === 'bio') {
        const skillsArray = typeof skills === 'string'
          ? skills.split(',').map((s) => s.trim()).filter(Boolean)
          : Array.isArray(skills)
          ? skills.map((s) => (typeof s === 'string' ? s : s.name || '')).filter(Boolean)
          : [];

        const res = await aiService.generateBio({
          name: name || portfolio?.personalInfo?.fullName || portfolio?.username || 'Developer',
          title: title || portfolio?.personalInfo?.title || 'Full Stack Engineer',
          skills: skillsArray,
          tone,
        });
        const bioText = res?.bio || res?.text;
        if (res?.success && bioText) {
          setGeneratedText(bioText);
          if (onApply) onApply(bioText);
          toast('AI Bio generated & applied to About field!', 'success');
        } else {
          toast('Failed to generate AI content.', 'error');
        }
      } else {
        const stackArray = typeof techStack === 'string'
          ? techStack.split(',').map((s) => s.trim()).filter(Boolean)
          : Array.isArray(techStack)
          ? techStack.map((s) => String(s)).filter(Boolean)
          : [];

        const res = await aiService.generateProjectDescription({
          title: projectTitle,
          techStack: stackArray,
          goal,
        });
        const descText = res?.description || res?.text;
        if (res?.success && descText) {
          setGeneratedText(descText);
          if (onApply) onApply(descText);
          toast('AI Description generated & applied to field!', 'success');
        } else {
          toast('Failed to generate AI content.', 'error');
        }
      }
    } catch (error) {
      console.error('AI Generator Error:', error);
      toast('Failed to generate AI content. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedText) return;
    onApply(generatedText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] top-0 left-0 w-screen h-screen bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-900">


        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              AI {type === 'bio' ? 'About Me' : 'Project Description'} Assistant
            </h3>
            <p className="text-xs text-slate-500">Generate compelling professional copy in seconds</p>
          </div>
        </div>

        {/* Inputs depending on type */}
        <div className="space-y-4 mb-5 text-xs">
          {type === 'bio' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Core Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
                >
                  <option value="professional">Professional & Technical</option>
                  <option value="creative">Creative & Visionary</option>
                  <option value="minimal">Minimal & Direct</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Project Name / Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Tech Stack Used</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Project Goal / Key Achievement</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Magic...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>

        {/* Output box */}
        {generatedText && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Generated Result</span>
              <button onClick={handleGenerate} className="text-slate-400 hover:text-slate-700 p-1" title="Regenerate">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed italic">"{generatedText}"</p>
            <button
              onClick={handleApply}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Form</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGeneratorModal;

