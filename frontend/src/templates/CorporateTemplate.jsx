import React, { useState } from 'react';
import { Mail, MapPin, Phone, ExternalLink, Download, Briefcase, GraduationCap, Award, ShieldCheck, Sun, Moon, User, Code2, Send, Menu, X, FolderGit2 } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';

const CorporateTemplate = ({ data }) => {
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
    { id: 'home', label: 'Home', show: true },
    { id: 'about', label: 'About', show: isEnabled('personal') || isEnabled('about') || isEnabled('education') || isEnabled('experience') },
    { id: 'projects', label: `Projects (${projects.length})`, show: isEnabled('projects') && projects.length > 0 },
    { id: 'skills', label: 'Competencies', show: isEnabled('skills') && skills.length > 0 },
    { id: 'certificates', label: 'Certificates', show: isEnabled('certificates') && certificates.length > 0 },
    { id: 'contact', label: 'Contact', show: isEnabled('inbox') },
    { id: 'all', label: 'Full View', show: true },
  ].filter((tab) => tab.show);


  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.senderName || !contactForm.senderEmail || !contactForm.message) return;
    setSending(true);
    try {
      const res = await portfolioService.sendMessage({ username, ...contactForm });
      if (res.success) {
        toast('Message sent successfully!', 'success');
        setContactForm({ senderName: '', senderEmail: '', message: '' });
      }
    } catch (err) {
      toast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 border-b py-3 px-6 flex justify-between items-center ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90 shadow-sm'}`}>
        <button onClick={() => setActiveTab('home')} className="font-bold text-sm tracking-wide text-indigo-500 uppercase">
          {personalInfo.fullName || username}
        </button>

        <nav className="hidden md:flex items-center space-x-2 text-xs font-semibold">
          {navTabs.map((tab) => (
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
            className="p-1.5 rounded-lg border border-slate-700 text-xs font-semibold"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-1.5 text-slate-400">
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
            { id: 'skills', label: 'Competencies' },
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

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Executive Sidebar */}
        <aside className="space-y-6 md:col-span-1">
          <div className={`p-6 rounded-2xl border text-center space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            {personalInfo.avatar && (
              <img src={personalInfo.avatar} alt={personalInfo.fullName} className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-indigo-500/20" />
            )}
            <div>
              <h1 className="text-2xl font-bold">{personalInfo.fullName || username}</h1>
              <p className="text-xs font-semibold text-indigo-500">{personalInfo.title || 'Executive Leader'}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{personalInfo.bio}</p>

            {resumeUrl && (
              <button
                onClick={() => {
                  analyticsService.trackEvent(username, 'resume_download');
                  window.open(resumeUrl, '_blank');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume PDF</span>
              </button>
            )}
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900 border-slate-800 text-xs' : 'bg-white border-slate-200 text-xs shadow-sm'}`}>
            <h3 className="font-bold text-sm text-indigo-400 border-b border-slate-800 pb-2">Contact Details</h3>
            {personalInfo.email && (
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Right Main Content Tabs */}
        <main className="md:col-span-2 space-y-10">
          {(activeTab === 'home' || activeTab === 'all') && (
            <section className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
                <User className="w-5 h-5" /> Executive Profile
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">{personalInfo.bio}</p>
            </section>
          )}

          {(activeTab === 'about' || activeTab === 'all') && (
            <div className="space-y-8">
              <section className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
                  <User className="w-5 h-5" /> Executive Summary
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">{personalInfo.bio}</p>
              </section>

              {experience.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
                    <Briefcase className="w-5 h-5" /> Professional Experience
                  </h2>
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div key={exp._id || exp.company} className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-base text-slate-100">{exp.position}</h3>
                          <span className="text-xs font-mono text-indigo-400">{exp.duration}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-400 mb-2">{exp.company}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {education.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
                    <GraduationCap className="w-5 h-5" /> Academic Background
                  </h2>
                  {education.map((edu) => (
                    <div key={edu._id || edu.degree} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <h3 className="font-bold text-sm">{edu.degree}</h3>
                      <p className="text-xs text-indigo-400">{edu.institution}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">{edu.duration}</span>
                    </div>
                  ))}
                </section>
              )}
            </div>
          )}

          {(activeTab === 'projects' || activeTab === 'all') && projects.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
                <FolderGit2 className="w-5 h-5" /> Highlighted Initiatives & Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj._id || proj.title} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-bold text-sm mb-1">{proj.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'skills' || activeTab === 'all') && skills.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
                <Code2 className="w-5 h-5" /> Core Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.name} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-medium">
                    {skill.name} ({skill.proficiencyLevel}%)
                  </span>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'certificates' || activeTab === 'all') && certificates.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
                <Award className="w-5 h-5" /> Certifications & Accreditations
              </h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert._id || cert.title} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-bold text-sm">{cert.title}</h3>
                    <p className="text-xs text-indigo-400">{cert.organization}</p>
                    <span className="text-[10px] text-slate-500 block">{cert.issueDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'contact' || activeTab === 'all') && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
                <Mail className="w-5 h-5" /> Direct Inquiry
              </h2>
              <form onSubmit={handleContactSubmit} className={`p-6 rounded-xl border space-y-4 text-xs ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.senderName}
                      onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Your Email</label>
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
                  <label className="block text-slate-400 mb-1">Message</label>
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
        </main>
      </div>
    </div>
  );
};

export default CorporateTemplate;
