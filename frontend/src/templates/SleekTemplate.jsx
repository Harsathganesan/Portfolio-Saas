import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Download, Sun, Moon, Sparkles, User, FolderGit2, Code2, Briefcase, GraduationCap, Award, Send, Menu, X } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';

const SleekTemplate = ({ data }) => {
  const { toast } = useToast?.() || { toast: (msg) => alert(msg) };
  const { personalInfo = {}, socialLinks = {}, projects = [], skills = [], education = [], experience = [], certificates = [], username, resumeUrl } = data;

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(data.themeMode || 'dark');
  const [contactForm, setContactForm] = useState({ senderName: '', senderEmail: '', message: '' });
  const [sending, setSending] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.senderName || !contactForm.senderEmail || !contactForm.message) return;
    setSending(true);
    try {
      const res = await portfolioService.sendMessage({ username, ...contactForm });
      if (res.success) {
        toast('Message sent!', 'success');
        setContactForm({ senderName: '', senderEmail: '', message: '' });
      }
    } catch (err) {
      toast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-6 py-4 flex justify-between items-center ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <button onClick={() => setActiveTab('home')} className="font-bold text-lg text-indigo-500">
          {personalInfo.fullName || username}
        </button>

        <nav className="hidden md:flex items-center space-x-2 text-xs font-semibold">
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'projects', label: `Projects (${projects.length})` },
            { id: 'skills', label: 'Skills' },
            { id: 'certificates', label: 'Certificates' },
            { id: 'contact', label: 'Contact' },
            { id: 'all', label: 'Full View' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-slate-700/60 text-slate-300 hover:text-white"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 text-slate-400">
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {navOpen && (
        <div className={`md:hidden px-6 py-4 space-y-2 border-b text-xs font-semibold ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About (Education & Experience)' },
            { id: 'projects', label: 'Projects' },
            { id: 'skills', label: 'Skills' },
            { id: 'certificates', label: 'Certificates' },
            { id: 'contact', label: 'Contact' },
            { id: 'all', label: 'Full View' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setNavOpen(false);
              }}
              className={`block w-full text-left py-1.5 px-3 rounded-lg ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* HOME TAB ONLY */}
        {(activeTab === 'home' || activeTab === 'all') && (
          <section className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4 border-b border-slate-800 pb-12 mb-10">
            <div className="space-y-4 max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Hello, I'm <span className="text-indigo-500">{personalInfo.fullName || username}</span>.
              </h1>
              <p className="text-lg font-medium text-slate-400">{personalInfo.title || 'Full Stack Engineer'}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{personalInfo.bio}</p>

              {resumeUrl && (
                <button
                  onClick={() => {
                    analyticsService.trackEvent(username, 'resume_download');
                    window.open(resumeUrl, '_blank');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Get Resume PDF</span>
                </button>
              )}
            </div>

            {personalInfo.avatar && (
              <img src={personalInfo.avatar} alt={personalInfo.fullName} className="w-44 h-44 rounded-3xl object-cover shadow-2xl ring-4 ring-indigo-500/20" />
            )}
          </section>
        )}

        {/* ABOUT TAB ONLY */}
        {(activeTab === 'about' || activeTab === 'all') && (
          <div className="space-y-10 mb-10">
            <section className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <User className="w-5 h-5 text-indigo-400" />
                <h2 className="text-2xl font-bold">About Me</h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{personalInfo.bio}</p>
            </section>

            {experience.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-2xl font-bold">Work Experience</h2>
                </div>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp._id || exp.company} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base">{exp.position}</h3>
                        <span className="text-xs font-mono text-indigo-400">{exp.duration}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold mb-2">{exp.company}</p>
                      <p className="text-xs text-slate-300">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-2xl font-bold">Education</h2>
                </div>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu._id || edu.degree} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <h3 className="font-bold text-base">{edu.degree}</h3>
                      <p className="text-xs text-indigo-400">{edu.institution}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">{edu.duration}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* PROJECTS TAB ONLY */}
        {(activeTab === 'projects' || activeTab === 'all') && projects.length > 0 && (
          <section className="space-y-6 mb-10">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-2xl font-bold">Featured Projects ({projects.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj._id || proj.title} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  {proj.thumbnail && <img src={proj.thumbnail} alt={proj.title} className="w-full h-40 object-cover rounded-xl mb-4" />}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{proj.title}</h3>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-400">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS TAB ONLY */}
        {(activeTab === 'skills' || activeTab === 'all') && skills.length > 0 && (
          <section className="space-y-6 mb-10">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-2xl font-bold">Skills & Proficiencies</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <span key={skill.name} className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                  {skill.name} ({skill.proficiencyLevel}%)
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATES TAB ONLY */}
        {(activeTab === 'certificates' || activeTab === 'all') && certificates.length > 0 && (
          <section className="space-y-6 mb-10">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Award className="w-5 h-5 text-indigo-400" />
              <h2 className="text-2xl font-bold">Certificates & Accreditations</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert._id || cert.title} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="font-bold text-base">{cert.title}</h3>
                  <p className="text-xs text-indigo-400">{cert.organization}</p>
                  <span className="text-[10px] text-slate-500 block mt-1">{cert.issueDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT TAB ONLY */}
        {(activeTab === 'contact' || activeTab === 'all') && (
          <section className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Mail className="w-5 h-5 text-indigo-400" />
              <h2 className="text-2xl font-bold">Contact Me</h2>
            </div>

            <form onSubmit={handleContactSubmit} className={`p-6 rounded-2xl border space-y-4 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.senderName}
                    onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.senderEmail}
                    onChange={(e) => setContactForm({ ...contactForm, senderEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Message</label>
                <textarea
                  required
                  rows={3}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                />
              </div>
              <button type="submit" disabled={sending} className="gradient-btn px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>{sending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default SleekTemplate;
