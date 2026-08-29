import React, { useState } from 'react';
import { Mail, MapPin, Phone, ExternalLink, Download, Briefcase, GraduationCap, Award, ShieldCheck, Sun, Moon, User, Code2, Send, Menu, X, FolderGit2, Github, Linkedin, Twitter, Instagram, Globe, Eye } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';

// Typewriter Animation Component
const TypewriterText = ({ words, colorClass = "text-indigo-400" }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const current = words[index] || '';

    if (subIndex === current.length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  const current = words[index] || '';
  return (
    <span className={`inline-flex items-center ${colorClass}`}>
      <span>{current.substring(0, subIndex)}</span>
      <span className="inline-block w-0.5 h-5 sm:h-6 ml-1 bg-current animate-pulse" />
    </span>
  );
};

const CorporateTemplate = ({ data }) => {
  const { toast } = useToast?.() || { toast: (msg) => alert(msg) };
  const { personalInfo = {}, socialLinks = {}, projects = [], skills = [], education = [], experience = [], certificates = [], sectionsEnabled = {}, username, resumeUrl } = data;

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(data.themeMode || 'dark');
  const [contactForm, setContactForm] = useState({ senderName: '', senderEmail: '', message: '' });
  const [sending, setSending] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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

    const targetUsername = username || data?.username || personalInfo?.username || '';
    const rawPhone = personalInfo.whatsapp || personalInfo.phone || '6382245266';
    let userPhone = rawPhone.replace(/[^0-9]/g, '');
    if (userPhone.length === 10) {
      userPhone = '91' + userPhone;
    }

    if (userPhone) {
      const waMessage = encodeURIComponent(
        `*New Contact Message from Portfolio*\n\n` +
        `👤 *Name:* ${contactForm.senderName}\n` +
        `📧 *Email:* ${contactForm.senderEmail}\n` +
        (contactForm.subject ? `📌 *Subject:* ${contactForm.subject}\n` : '') +
        `💬 *Message:* ${contactForm.message}`
      );
      window.open(`https://wa.me/${userPhone}?text=${waMessage}`, '_blank');
    }

    try {
      await portfolioService.sendMessage({ username: targetUsername, ...contactForm });
      toast('Opening WhatsApp & saved to inbox!', 'success');
    } catch (err) {
      console.warn('Backend message save skipped/failed:', err?.response?.data?.message || err.message);
      toast('Opening WhatsApp!', 'success');
    } finally {
      setContactForm({ senderName: '', senderEmail: '', subject: '', message: '' });
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
              <motion.img
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                src={personalInfo.avatar}
                alt={personalInfo.fullName}
                className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-indigo-500/20 hidden md:block"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{personalInfo.fullName || username}</h1>
              <div className="text-xs font-semibold text-indigo-500 h-5 flex items-center justify-center">
                <TypewriterText
                  words={[
                    personalInfo.title || 'Executive Leader',
                    'Full Stack Strategist',
                    'Engineering Lead',
                  ]}
                  colorClass="text-indigo-400 font-bold"
                />
              </div>
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
            <h3 className="font-bold text-sm text-indigo-400 border-b border-slate-800 pb-2">Contact & Socials</h3>
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
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="GitHub">
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="LinkedIn">
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="Twitter / X">
                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="Instagram">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                </a>
              )}
              {(socialLinks.portfolio || socialLinks.website) && (
                <a href={socialLinks.portfolio || socialLinks.website} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="Personal Website">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              )}
            </div>
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
                {projects.map((proj) => {
                  const stack = Array.isArray(proj.techStack) ? proj.techStack : typeof proj.techStack === 'string' ? proj.techStack.split(',') : [];
                  return (
                    <div key={proj._id || proj.title} className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="space-y-2">
                        {(proj.thumbnail || proj.image) && (
                          <div className="w-full h-48 bg-slate-950 flex items-center justify-center p-2 rounded-xl border border-slate-700/40 overflow-hidden">
                            <img src={proj.thumbnail || proj.image} alt={proj.title} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-base text-slate-100">{proj.title}</h3>
                          <div className="flex items-center space-x-1.5">
                            {(proj.githubUrl || proj.github) && (
                              <a href={proj.githubUrl || proj.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="GitHub Repository">
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {(proj.liveUrl || proj.demoUrl || proj.link) && (
                              <a href={proj.liveUrl || proj.demoUrl || proj.link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition" title="Live Demo">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{proj.description}</p>
                        <button
                          onClick={() => setSelectedProject(proj)}
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 pt-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </div>
                      {stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                          {stack.map((tech) => (
                            <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {String(tech).trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                  <div key={cert._id || cert.title || cert.name} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-start gap-3">
                      {(cert.certificateImage || cert.imageUrl) ? (
                        <img src={cert.certificateImage || cert.imageUrl} alt={cert.title || cert.name} className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="w-4 h-4" />
                        </div>
                      )}
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="font-bold text-sm leading-tight">{cert.title || cert.name}</h3>
                        {(cert.organization || cert.issuer) && <p className="text-xs text-indigo-400">{cert.organization || cert.issuer}</p>}
                        {(cert.issueDate || cert.date) && <span className="text-[10px] text-slate-500 block">{cert.issueDate || cert.date}</span>}
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 pt-0.5">
                            <ExternalLink className="w-3 h-3" /> Verify
                          </a>
                        )}
                      </div>
                    </div>
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

      {/* Expanded Corporate Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border relative max-h-[90vh] flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Top Close Button (Cancel Symbol) */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md shadow-lg transition duration-200"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            {(selectedProject.thumbnail || selectedProject.image) && (
              <div className="w-full h-64 bg-slate-950 flex items-center justify-center p-4 border-b border-slate-800 shrink-0">
                <img
                  src={selectedProject.thumbnail || selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                  {selectedProject.category && (
                    <span className="text-xs font-semibold text-indigo-400">{selectedProject.category}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {(selectedProject.githubUrl || selectedProject.github) && (
                    <a
                      href={selectedProject.githubUrl || selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 font-bold hover:text-white flex items-center gap-1.5 transition"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                  )}
                  {(selectedProject.liveUrl || selectedProject.demoUrl || selectedProject.link) && (
                    <a
                      href={selectedProject.liveUrl || selectedProject.demoUrl || selectedProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 flex items-center gap-1.5 transition"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Project Summary</h4>
                <p className="text-sm leading-relaxed font-normal whitespace-pre-line text-slate-300">
                  {selectedProject.description}
                </p>
              </div>

              {selectedProject.techStack && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Core Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedProject.techStack)
                      ? selectedProject.techStack
                      : typeof selectedProject.techStack === 'string'
                      ? selectedProject.techStack.split(',')
                      : []
                    ).map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-lg text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {String(tech).trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateTemplate;
