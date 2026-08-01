import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Download,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Send,
  User,
  FolderGit2,
  ExternalLink,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';

import portfolioData from './data/portfolio.json';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [contactForm, setContactForm] = useState({ senderName: '', senderEmail: '', subject: '', message: '' });
  const [sentMsg, setSentMsg] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const {
    name = 'My Portfolio',
    title = 'Software Developer',
    tagline = 'WELCOME TO MY PORTFOLIO',
    bio = '',
    email = '',
    phone = '',
    location = '',
    avatar = '',
    resumeUrl = '',
    socialLinks = {},
    skills = [],
    projects = [],
    education = [],
    experience = [],
    certificates = [],
  } = portfolioData || {};

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSentMsg(true);
    setTimeout(() => setSentMsg(false), 4000);
    setContactForm({ senderName: '', senderEmail: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen relative font-sans bg-slate-50 text-slate-900 selection:bg-purple-600 selection:text-white">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b bg-white/90 border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-slate-900">
            <div className="md:hidden w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-extrabold shadow-md">
              {name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline">{name}</span>
          </button>

          {/* Centered Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'awards', label: 'Awards' },
              { id: 'contact', label: 'Contact' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-1 transition-colors ${isActive ? 'text-purple-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div layoutId="activeTabUnderline" className="absolute left-0 right-0 -bottom-1 h-0.5 bg-purple-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 text-slate-500">
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {navOpen && (
          <div className="md:hidden px-6 py-4 space-y-3 border-b text-sm font-semibold bg-white border-slate-200">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'awards', label: 'Awards' },
              { id: 'contact', label: 'Contact' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setNavOpen(false);
                }}
                className={`block w-full text-left py-2 px-3 rounded-lg ${activeTab === tab.id ? 'bg-purple-600 text-white font-bold' : 'text-slate-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <motion.section key="home" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="min-h-[75vh] flex flex-col md:flex-row items-center justify-between gap-12 py-6">
              <div className="flex-1 space-y-6 text-left max-w-2xl w-full">
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 font-sans">{tagline}</span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
                  Hi, I'm <span className="text-purple-600">{name}</span>
                </h1>
                <div className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <span className="text-slate-800">A</span>
                  <span className="text-purple-600 font-bold">{title}</span>
                </div>

                {/* Mobile Profile Photo (Placed below heading and title, above bio) */}
                <div className="md:hidden flex justify-center py-2">
                  <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl ring-4 ring-purple-600/20 bg-slate-900">
                    {avatar ? (
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-5xl">
                        {name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl font-normal">{bio}</p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-purple-600/30 transition transform active:scale-95"
                    >
                      <span>Download Resume</span>
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="px-6 py-3.5 rounded-2xl text-xs font-bold border transition flex items-center gap-2 bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                  >
                    <span>Let's Talk</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full flex items-center justify-center border bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600 transition">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full flex items-center justify-center border bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600 transition">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="w-11 h-11 rounded-full flex items-center justify-center border bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600 transition">
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex-1 hidden md:flex justify-center items-center py-8">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/30 to-indigo-500/20 blur-2xl pointer-events-none" />
                  <div className="relative z-10 w-60 h-60 sm:w-76 sm:h-76 rounded-full overflow-hidden shadow-2xl ring-8 ring-purple-600/15 bg-slate-900 border-4 border-white">
                    {avatar ? (
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-6xl">
                        {name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-12 py-6 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">About Me</h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              {/* Education */}
              <section className="space-y-6">
                <div className="flex items-center space-x-2 text-2xl font-extrabold text-purple-600">
                  <GraduationCap className="w-7 h-7" />
                  <span>Education</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {education.map((edu, i) => (
                    <div key={i} className="p-6 sm:p-7 rounded-3xl border bg-white border-slate-100 shadow-md flex justify-between items-start">
                      <div className="space-y-2 max-w-[85%]">
                        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">{edu.degree}</h3>
                        <p className="text-xs sm:text-sm font-semibold text-purple-600">{edu.institution}</p>
                        {edu.duration && <p className="text-[11px] font-mono text-slate-400">{edu.duration} {edu.cgpa ? `• CGPA: ${edu.cgpa}` : ''}</p>}
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Experience */}
              {experience.length > 0 && (
                <section className="space-y-6 pt-4">
                  <div className="flex items-center space-x-2 text-2xl font-extrabold text-purple-600">
                    <Briefcase className="w-7 h-7" />
                    <span>Experience</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {experience.map((exp, i) => (
                      <div key={i} className="p-6 sm:p-7 rounded-3xl border bg-white border-slate-100 shadow-md flex justify-between items-start">
                        <div className="space-y-2 max-w-[85%]">
                          <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">{exp.position}</h3>
                          <p className="text-xs sm:text-sm font-semibold text-purple-600">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                          {exp.duration && <p className="text-[11px] font-mono text-slate-400">{exp.duration}</p>}
                          {exp.description && <p className="text-xs text-slate-500 leading-relaxed pt-1">{exp.description}</p>}
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center">
                          <Briefcase className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <motion.section key="skills" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-10 py-6 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Skills</h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {skills.map((skill, i) => (
                  <div key={i} className="p-5 rounded-3xl border bg-white border-slate-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                      <span>{skill.name}</span>
                      <span className="text-purple-600 font-mono">{skill.proficiencyLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full transition-all duration-1000" style={{ width: `${skill.proficiencyLevel}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <motion.section key="projects" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-10 py-6 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Projects</h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((proj, i) => (
                  <div key={i} className="p-6 rounded-3xl border bg-white border-slate-100 shadow-sm space-y-4 flex flex-col justify-between group">
                    <div className="space-y-4">
                      {proj.thumbnail && (
                        <div className="overflow-hidden rounded-2xl h-52 bg-slate-950">
                          <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold group-hover:text-purple-600 transition">{proj.title}</h3>
                        <div className="flex items-center space-x-2">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-purple-600 transition">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-600 hover:text-white transition">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                    </div>

                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4">
                        {(Array.isArray(proj.techStack) ? proj.techStack : proj.techStack.split(',')).map((tech) => (
                          <span key={tech} className="text-[11px] font-mono px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
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

          {/* TAB 5: AWARDS */}
          {activeTab === 'awards' && (
            <motion.section key="awards" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-10 py-6 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Awards</h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {certificates.map((cert, i) => (
                  <div key={i} className="p-6 rounded-3xl border bg-white border-slate-100 shadow-sm space-y-2">
                    <h3 className="font-bold text-base">{cert.title}</h3>
                    <p className="text-xs font-semibold text-purple-600">{cert.organization}</p>
                    <span className="text-[10px] text-slate-500 font-mono block">{cert.issueDate}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* TAB 6: CONTACT */}
          {activeTab === 'contact' && (
            <motion.section key="contact" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-2xl mx-auto space-y-8 py-6">
              <div className="text-center space-y-3">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Contact</h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              <form onSubmit={handleContactSubmit} className="p-8 rounded-3xl border bg-white border-slate-100 shadow-sm space-y-4 text-xs">
                {sentMsg && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-center font-bold">Message sent successfully!</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.senderName}
                      onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full border rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 bg-slate-50 border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-500 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.senderEmail}
                      onChange={(e) => setContactForm({ ...contactForm, senderEmail: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full border rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 bg-slate-50 border-slate-200 text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Project Inquiry"
                    className="w-full border rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 bg-slate-50 border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Hi! I'd love to discuss..."
                    className="w-full border rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 bg-slate-50 border-slate-200 text-slate-900"
                  />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {name}. Built with Portfolia SaaS.</p>
      </footer>
    </div>
  );
};

export default App;
