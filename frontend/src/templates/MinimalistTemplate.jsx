import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  ExternalLink,
  Download,
  Sparkles,
  Sun,
  Moon,
  User,
  FolderGit2,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Send,
  Menu,
  X,
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';

const MinimalistTemplate = ({ data }) => {
  const { toast } = useToast?.() || { toast: (msg) => alert(msg) };
  const {
    personalInfo = {},
    socialLinks = {},
    projects = [],
    skills = [],
    education = [],
    experience = [],
    certificates = [],
    username,
    resumeUrl,
  } = data;

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(data.themeMode || 'dark');
  const [contactForm, setContactForm] = useState({ senderName: '', senderEmail: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleResumeClick = () => {
    if (resumeUrl) {
      analyticsService.trackEvent(username, 'resume_download');
      window.open(resumeUrl, '_blank');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.senderName || !contactForm.senderEmail || !contactForm.message) return;
    setSending(true);
    try {
      const res = await portfolioService.sendMessage({ username, ...contactForm });
      if (res.success) {
        toast('Message sent to ' + (personalInfo.fullName || username) + '!', 'success');
        setContactForm({ senderName: '', senderEmail: '', subject: '', message: '' });
      }
    } catch (err) {
      toast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sticky Header Nav */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-6 py-4 flex justify-between items-center ${isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-sm'}`}>
        <button onClick={() => setActiveTab('home')} className="font-extrabold text-base tracking-tight text-indigo-500">
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
            className={`p-2 rounded-xl border transition ${isDark ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-indigo-600'}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 text-slate-400">
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* HOME TAB ONLY */}
          {(activeTab === 'home' || activeTab === 'all') && (
            <motion.section key="home" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6 border-b pb-12 border-slate-800/60 pt-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{personalInfo.fullName || username}</h1>
                  <p className="text-xl font-medium text-indigo-500">{personalInfo.title || 'Full Stack Developer'}</p>
                  {personalInfo.location && (
                    <p className="flex items-center text-xs text-slate-400 gap-1.5 pt-1">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      {personalInfo.location}
                    </p>
                  )}
                </div>

                {personalInfo.avatar && (
                  <img
                    src={personalInfo.avatar}
                    alt={personalInfo.fullName}
                    className="w-28 h-28 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-xl"
                  />
                )}
              </div>

              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                {personalInfo.bio || 'Building clean, robust web applications with maximum performance.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {socialLinks.github && (
                  <a href={socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500 transition">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500 transition">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500 transition">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {resumeUrl && (
                  <button
                    onClick={handleResumeClick}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>
                )}
              </div>
            </motion.section>
          )}

          {/* ABOUT TAB ONLY */}
          {(activeTab === 'about' || activeTab === 'all') && (
            <motion.div key="about" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-10 py-6">
              <section className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <User className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold">About Me</h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{personalInfo.bio}</p>
              </section>

              {experience.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold">Work Experience</h2>
                  </div>
                  <div className="space-y-6 border-l-2 border-slate-800 ml-2 pl-6">
                    {experience.map((exp) => (
                      <div key={exp._id || exp.company} className="relative group space-y-1">
                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-[#0f172a]" />
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-sm text-slate-100">{exp.position}</h3>
                          <span className="text-xs font-mono text-indigo-400">{exp.duration}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-400">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                        <p className="text-xs text-slate-400 leading-relaxed pt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {education.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-lg font-bold">Education</h2>
                  </div>
                  {education.map((edu) => (
                    <div key={edu._id || edu.degree} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                      <h3 className="font-bold text-sm text-slate-200">{edu.degree}</h3>
                      <p className="text-xs text-indigo-400">{edu.institution}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">{edu.duration}</span>
                    </div>
                  ))}
                </section>
              )}
            </motion.div>
          )}

          {/* PROJECTS TAB ONLY */}
          {(activeTab === 'projects' || activeTab === 'all') && (
            <motion.section key="projects" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6 py-6">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <FolderGit2 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold">Featured Projects ({projects.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj._id || proj.title}
                    className={`p-6 rounded-2xl border transition group hover:-translate-y-1 ${
                      isDark ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    {proj.thumbnail && (
                      <img src={proj.thumbnail} alt={proj.title} className="w-full h-44 object-cover rounded-xl mb-4" />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base group-hover:text-indigo-400 transition">{proj.title}</h3>
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-400">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-3">{proj.description}</p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech) => (
                          <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* SKILLS TAB ONLY */}
          {(activeTab === 'skills' || activeTab === 'all') && (
            <motion.section key="skills" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6 py-6">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold">Skills & Competencies</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <div
                    key={skill._id || skill.name}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                      {skill.proficiencyLevel}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* CERTIFICATES TAB ONLY */}
          {(activeTab === 'certificates' || activeTab === 'all') && (
            <motion.section key="certificates" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4 py-6">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <h2 className="text-lg font-bold">Certificates & Accreditations</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert._id || cert.title} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
                    <h3 className="font-bold text-sm text-slate-200">{cert.title}</h3>
                    <p className="text-xs text-indigo-400">{cert.organization}</p>
                    <span className="text-[10px] text-slate-500 block">{cert.issueDate}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* CONTACT TAB ONLY */}
          {(activeTab === 'contact' || activeTab === 'all') && (
            <motion.section key="contact" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6 py-6">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold">Contact</h2>
              </div>

              <form onSubmit={handleContactSubmit} className={`p-6 rounded-2xl border space-y-4 text-xs ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.senderName}
                      onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.senderEmail}
                      onChange={(e) => setContactForm({ ...contactForm, senderEmail: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
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
                    placeholder="Hello..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <button type="submit" disabled={sending} className="gradient-btn px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MinimalistTemplate;
