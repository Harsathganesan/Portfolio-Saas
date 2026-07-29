import React, { useState } from 'react';
import { Terminal, Cpu, Shield, ExternalLink, Download, Sun, Moon, Mail, Send, Menu, X, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';

const CyberTemplate = ({ data }) => {
  const { toast } = useToast?.() || { toast: (msg) => alert(msg) };
  const { personalInfo = {}, socialLinks = {}, projects = [], skills = [], education = [], experience = [], certificates = [], sectionsEnabled = {}, username, resumeUrl } = data;

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(data.themeMode || 'dark');
  const [contactForm, setContactForm] = useState({ senderName: '', senderEmail: '', message: '' });
  const [sending, setSending] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const isDark = theme === 'dark';

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

  const isEnabled = (key) => {
    const active = { ...defaultSections, ...(sectionsEnabled || {}) };
    return active[key] === true;
  };

  const navTabs = [
    { id: 'home', label: '> HOME', show: true },
    { id: 'about', label: '> ABOUT', show: isEnabled('personal') || isEnabled('about') || isEnabled('education') || isEnabled('experience') },
    { id: 'projects', label: `> PROJECTS (${projects.length})`, show: isEnabled('projects') && projects.length > 0 },
    { id: 'skills', label: '> SKILLS', show: isEnabled('skills') && skills.length > 0 },
    { id: 'certificates', label: '> CERTS', show: isEnabled('certificates') && certificates.length > 0 },
    { id: 'contact', label: '> TRANSMIT', show: isEnabled('inbox') },
    { id: 'all', label: '> FULL', show: true },
  ].filter((t) => t.show);


  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.senderName || !contactForm.senderEmail || !contactForm.message) return;
    setSending(true);
    try {
      const res = await portfolioService.sendMessage({ username, ...contactForm });
      if (res.success) {
        toast('Message transmitted to terminal inbox!', 'success');
        setContactForm({ senderName: '', senderEmail: '', message: '' });
      }
    } catch (err) {
      toast('Transmission failed', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`min-h-screen font-mono ${isDark ? 'bg-black text-emerald-400' : 'bg-slate-900 text-cyan-400'} p-4 sm:p-6 selection:bg-emerald-500 selection:text-black`}>
      {/* Cyber Sticky Header */}
      <header className="sticky top-0 z-40 bg-black/90 border border-emerald-500/40 rounded-xl px-4 py-3 flex justify-between items-center mb-8 backdrop-blur-md">
        <button onClick={() => setActiveTab('home')} className="text-xs font-bold flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>ROOT@${username}</span>
        </button>

        <nav className="hidden md:flex items-center space-x-3 text-xs font-bold">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded transition border ${
                activeTab === tab.id
                  ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold'
                  : 'border-transparent text-emerald-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-1.5 border border-emerald-500/40 bg-black rounded text-xs"
          >
            {isDark ? 'LIGHT_MATRIX' : 'DARK_CYBER'}
          </button>
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-1 text-emerald-400">
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {navOpen && (
        <div className="md:hidden border border-emerald-500/40 bg-black p-4 mb-6 space-y-2 text-xs font-bold">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setNavOpen(false);
              }}
              className={`block w-full text-left py-1 text-xs ${activeTab === tab.id ? 'text-white' : 'text-emerald-500'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}


      <div className="max-w-5xl mx-auto space-y-12">
        {/* HOME TAB ONLY */}
        {(activeTab === 'home' || activeTab === 'all') && (
          <section className="border border-emerald-500/40 rounded-xl bg-black/90 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-3">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-emerald-500">root@cyber-grid:~/${username}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wider text-emerald-300">
                &gt; {personalInfo.fullName || username}_
              </h1>
              <p className="text-sm text-emerald-500/80">&gt; ROLE: {personalInfo.title || 'CYBER ARCHITECT'}</p>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed pt-2">
                {personalInfo.bio || 'Executing high-speed protocol builds & secure applications.'}
              </p>
            </div>

            {resumeUrl && (
              <button
                onClick={() => {
                  analyticsService.trackEvent(username, 'resume_download');
                  window.open(resumeUrl, '_blank');
                }}
                className="px-4 py-2 border border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs rounded flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>FETCH_RESUME.PDF</span>
              </button>
            )}
          </section>
        )}

        {/* ABOUT TAB ONLY */}
        {(activeTab === 'about' || activeTab === 'all') && (isEnabled('personal') || isEnabled('about') || isEnabled('education') || isEnabled('experience')) && (
          <div className="space-y-8">
            {(isEnabled('personal') || isEnabled('about')) && (
              <section className="border border-emerald-500/40 rounded-xl bg-black/80 p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-emerald-500/30 pb-2">
                  <User className="w-5 h-5" />
                  <h2 className="text-base font-bold">SYSTEM_PROFILE // ABOUT</h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{personalInfo.bio}</p>
              </section>
            )}

            {isEnabled('experience') && experience.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-500/40 pb-2">
                  <Briefcase className="w-5 h-5" />
                  <h2 className="text-lg font-bold">EXECUTION_LOGS // EXPERIENCE</h2>
                </div>
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div key={exp._id || exp.company} className="border border-emerald-500/30 bg-black/80 p-4 rounded-lg space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-emerald-200">
                        <span>{exp.position} @ {exp.company}</span>
                        <span className="text-emerald-500">{exp.duration}</span>
                      </div>
                      <p className="text-slate-400 pt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isEnabled('education') && education.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-500/40 pb-2">
                  <GraduationCap className="w-5 h-5" />
                  <h2 className="text-lg font-bold">ACADEMIC_NODES // EDUCATION</h2>
                </div>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu._id || edu.degree} className="border border-emerald-500/30 bg-black/80 p-4 rounded-lg space-y-1 text-xs">
                      <h3 className="font-bold text-emerald-200">{edu.degree}</h3>
                      <p className="text-emerald-500">{edu.institution} ({edu.duration})</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* PROJECTS TAB ONLY */}
        {(activeTab === 'projects' || activeTab === 'all') && isEnabled('projects') && projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-emerald-500/40 pb-2">
              <Cpu className="w-5 h-5" />
              <h2 className="text-lg font-bold">DEPLOYED_NODES // PROJECTS ({projects.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj._id || proj.title} className="border border-emerald-500/30 bg-black/80 p-5 rounded-lg space-y-3 hover:border-emerald-400 transition">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-emerald-200">{proj.title}</h3>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                  {proj.techStack && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="text-[10px] px-2 py-0.5 border border-emerald-500/40 text-emerald-400 rounded">
                          [{tech}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS TAB ONLY */}
        {(activeTab === 'skills' || activeTab === 'all') && isEnabled('skills') && skills.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-emerald-500/40 pb-2">
              <Shield className="w-5 h-5" />
              <h2 className="text-lg font-bold">SKILL_MATRIX</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills.map((skill) => (
                <div key={skill.name} className="border border-emerald-500/30 bg-black/60 p-3 rounded text-xs flex justify-between">
                  <span>{skill.name}</span>
                  <span className="text-emerald-500 font-bold">{skill.proficiencyLevel}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATES TAB ONLY */}
        {(activeTab === 'certificates' || activeTab === 'all') && isEnabled('certificates') && certificates.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-emerald-500/40 pb-2">
              <Award className="w-5 h-5" />
              <h2 className="text-lg font-bold">VERIFIED_CREDENTIALS</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certificates.map((cert) => (
                <div key={cert._id || cert.title} className="border border-emerald-500/30 bg-black/60 p-4 rounded text-xs space-y-1">
                  <h3 className="font-bold text-emerald-200">{cert.title}</h3>
                  <p className="text-emerald-500">{cert.organization} [{cert.issueDate}]</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT TAB ONLY */}
        {(activeTab === 'contact' || activeTab === 'all') && isEnabled('inbox') && (

          <section className="space-y-4 border border-emerald-500/40 rounded-xl bg-black/90 p-6">
            <div className="flex items-center gap-2 border-b border-emerald-500/30 pb-2">
              <Mail className="w-5 h-5" />
              <h2 className="text-base font-bold">TRANSMIT_PACKET // CONTACT</h2>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-emerald-500 mb-1">INPUT_SENDER_NAME</label>
                  <input
                    type="text"
                    required
                    value={contactForm.senderName}
                    onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                    className="w-full bg-black border border-emerald-500/40 rounded p-2 text-emerald-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-emerald-500 mb-1">INPUT_SENDER_EMAIL</label>
                  <input
                    type="email"
                    required
                    value={contactForm.senderEmail}
                    onChange={(e) => setContactForm({ ...contactForm, senderEmail: e.target.value })}
                    className="w-full bg-black border border-emerald-500/40 rounded p-2 text-emerald-300 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-emerald-500 mb-1">INPUT_MESSAGE_BODY</label>
                <textarea
                  required
                  rows={3}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-black border border-emerald-500/40 rounded p-2 text-emerald-300 outline-none"
                />
              </div>
              <button type="submit" disabled={sending} className="px-6 py-2 border border-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/40 font-bold rounded">
                {sending ? 'TRANSMITTING...' : 'TRANSMIT_MESSAGE'}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default CyberTemplate;
