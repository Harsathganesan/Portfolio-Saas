import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Instagram, Globe, Mail, MapPin, ExternalLink, Download, Sun, Moon, Sparkles, User, FolderGit2, Code2, Briefcase, GraduationCap, Award, Send, Menu, X } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';

const SleekTemplate = ({ data }) => {
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
    { id: 'skills', label: 'Skills', show: isEnabled('skills') && skills.length > 0 },
    { id: 'certificates', label: 'Certificates', show: isEnabled('certificates') && certificates.length > 0 },
    { id: 'contact', label: 'Contact', show: isEnabled('inbox') },
    { id: 'all', label: 'Full View', show: true },
  ].filter((t) => t.show);


  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.senderName || !contactForm.senderEmail || !contactForm.message) return;
    setSending(true);
    try {
      const res = await portfolioService.sendMessage({ username, ...contactForm });

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

      if (res.success) {
        toast('Message saved to inbox & opening WhatsApp!', 'success');
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
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 font-bold text-lg text-indigo-500">
          <div className="md:hidden w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            {username?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline">{personalInfo.fullName || username}</span>
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
          {navTabs.map((tab) => (
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
            <div className="space-y-4 max-w-xl w-full text-center md:text-left flex flex-col items-center md:items-start">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Hello, I'm <span className="text-indigo-500">{personalInfo.fullName || username}</span>.
              </h1>
              <p className="text-lg font-medium text-slate-400">{personalInfo.title || 'Full Stack Engineer'}</p>

              {/* Mobile Profile Photo (Placed below heading and title, above bio) */}
              {personalInfo.avatar && (
                <div className="md:hidden flex justify-center py-2">
                  <img
                    src={personalInfo.avatar}
                    alt={personalInfo.fullName}
                    className="w-44 h-44 rounded-3xl object-cover shadow-2xl ring-4 ring-indigo-500/20"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80';
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-slate-400 leading-relaxed text-center md:text-left">{personalInfo.bio}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
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

                <div className="flex items-center justify-center md:justify-start space-x-3">
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="GitHub">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="Twitter / X">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="Instagram">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {(socialLinks.portfolio || socialLinks.website) && (
                    <a href={socialLinks.portfolio || socialLinks.website} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="Personal Website">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {personalInfo.email && (
                    <a href={`mailto:${personalInfo.email}`} className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title={personalInfo.email}>
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>

            {personalInfo.avatar && (
              <img
                src={personalInfo.avatar}
                alt={personalInfo.fullName}
                className="w-44 h-44 rounded-3xl object-cover shadow-2xl ring-4 ring-indigo-500/20 hidden md:block"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80';
                }}
              />
            )}

          </section>
        )}

        {/* ABOUT TAB ONLY */}
        {(activeTab === 'about' || activeTab === 'all') && (isEnabled('personal') || isEnabled('about') || isEnabled('education') || isEnabled('experience')) && (
          <div className="space-y-10 mb-10">
            {(isEnabled('personal') || isEnabled('about')) && (
              <section className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <User className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-2xl font-bold">About Me</h2>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{personalInfo.bio}</p>
              </section>
            )}

            {isEnabled('experience') && experience.length > 0 && (
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

            {isEnabled('education') && education.length > 0 && (
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
        {(activeTab === 'projects' || activeTab === 'all') && isEnabled('projects') && projects.length > 0 && (
          <section className="space-y-6 mb-10">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-2xl font-bold">Featured Projects ({projects.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const stack = Array.isArray(proj.techStack) ? proj.techStack : typeof proj.techStack === 'string' ? proj.techStack.split(',') : [];
                return (
                  <div key={proj._id || proj.title} className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="space-y-3">
                      {(proj.thumbnail || proj.image) && (
                        <img src={proj.thumbnail || proj.image} alt={proj.title} className="w-full h-44 object-cover rounded-xl border border-slate-700/40" />
                      )}
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">{proj.title}</h3>
                        <div className="flex items-center space-x-2">
                          {(proj.githubUrl || proj.github) && (
                            <a href={proj.githubUrl || proj.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition" title="GitHub Repository">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {(proj.liveUrl || proj.demoUrl || proj.link) && (
                            <a href={proj.liveUrl || proj.demoUrl || proj.link} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition" title="Live Demo">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                    </div>

                    {stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60">
                        {stack.map((tech) => (
                          <span key={tech} className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
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

        {/* SKILLS TAB ONLY */}
        {(activeTab === 'skills' || activeTab === 'all') && isEnabled('skills') && skills.length > 0 && (
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
        {(activeTab === 'certificates' || activeTab === 'all') && isEnabled('certificates') && certificates.length > 0 && (
          <section className="space-y-6 mb-10">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Award className="w-5 h-5 text-indigo-400" />
              <h2 className="text-2xl font-bold">Certificates & Accreditations</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert._id || cert.title || cert.name} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-start gap-3">
                    {(cert.certificateImage || cert.imageUrl) && (
                      <img src={cert.certificateImage || cert.imageUrl} alt={cert.title || cert.name} className="w-12 h-12 object-cover rounded-xl border border-slate-700 shrink-0" />
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="font-bold text-base leading-tight">{cert.title || cert.name}</h3>
                      {(cert.organization || cert.issuer) && <p className="text-xs text-indigo-400 font-semibold">{cert.organization || cert.issuer}</p>}
                      {(cert.issueDate || cert.date) && <span className="text-[10px] text-slate-500 block">{cert.issueDate || cert.date}</span>}
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 pt-1">
                          <ExternalLink className="w-3 h-3" /> Verify Credential
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT TAB ONLY */}
        {(activeTab === 'contact' || activeTab === 'all') && isEnabled('inbox') && (

          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">Contact Me</h2>
              <div className="w-12 h-1 bg-indigo-500 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Info Card */}
              <div className={`lg:col-span-5 p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-indigo-500">Let's Build Something</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Have an exciting project in mind or want to collaborate? Fill out the form below to message me directly on WhatsApp or reach out via email.
                  </p>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 font-bold block">Email</span>
                      <span className="text-xs font-bold truncate block">{personalInfo.email || 'harsath137@gmail.com'}</span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 font-bold block">Phone / WhatsApp</span>
                      <span className="text-xs font-bold truncate block">{personalInfo.phone || '+91 6382245266'}</span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 font-bold block">Location</span>
                      <span className="text-xs font-bold truncate block">{personalInfo.location || 'Pudukkottai, Tamil Nadu, India'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Card */}
              <form
                onSubmit={handleContactSubmit}
                className={`lg:col-span-7 p-8 rounded-3xl border space-y-4 text-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.senderName}
                      onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                      placeholder="Enter your name"
                      className={`w-full rounded-xl px-4 py-3 outline-none border transition ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.senderEmail}
                      onChange={(e) => setContactForm({ ...contactForm, senderEmail: e.target.value })}
                      placeholder="Enter your email"
                      className={`w-full rounded-xl px-4 py-3 outline-none border transition ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject || ''}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="What is this regarding?"
                    className={`w-full rounded-xl px-4 py-3 outline-none border transition ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Write your message here..."
                    className={`w-full rounded-xl px-4 py-3 outline-none border transition ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={sending} className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition">
                    <span>{sending ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default SleekTemplate;
