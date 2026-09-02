import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  Download,
  Sparkles,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Sun,
  Moon,
  Send,
  User,
  FolderGit2,
  Menu,
  X,
  ArrowRight,
  ShieldAlert,
  Eye,
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';

// Typewriter Animation Component
const ensureUrlProtocol = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const clean = url.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('mailto:') || clean.startsWith('tel:')) {
    return clean;
  }
  return `https://${clean}`;
};

const TypewriterText = ({ words, colorClass = "text-purple-600" }) => {
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
      <span className="inline-block w-0.5 h-6 sm:h-7 ml-1 bg-current animate-pulse" />
    </span>
  );
};

const CreativeTemplate = ({ data }) => {
  const { toast } = useToast?.() || { toast: (msg) => alert(msg) };
  const {
    personalInfo = {},
    socialLinks = {},
    projects = [],
    skills = [],
    education = [],
    experience = [],
    certificates = [],
    sectionsEnabled = {},
    username,
    resumeUrl,
  } = data;

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'about' | 'skills' | 'projects' | 'awards' | 'contact'
  const [theme, setTheme] = useState(data.themeMode || 'light');
  const [contactForm, setContactForm] = useState({ senderName: '', senderEmail: '', subject: '', message: '' });
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

  const handleResumeClick = async () => {
    if (!resumeUrl) {
      toast('Resume file not uploaded yet', 'info');
      return;
    }
    analyticsService.trackEvent(username, 'resume_download');

    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${personalInfo.fullName || username || 'Resume'}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      toast('Resume PDF download started!', 'success');
    } catch (err) {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.target = '_blank';
      a.download = `${personalInfo.fullName || username || 'Resume'}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };


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
    <div className={`min-h-screen relative font-sans transition-colors duration-300 ${isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition ${isDark ? 'bg-[#0b0f19]/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 font-extrabold text-2xl tracking-tight">
            <div className="md:hidden w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-extrabold shadow-md">
              {username?.charAt(0).toUpperCase()}
            </div>
            <span className={`hidden md:inline ${isDark ? 'text-white' : 'text-slate-900'}`}>{personalInfo.fullName || username}</span>
          </button>

          {/* Centered Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            {[
              { id: 'home', label: 'Home', show: true },
              { id: 'about', label: 'About', show: isEnabled('personal') || isEnabled('about') || isEnabled('education') || isEnabled('experience') },
              { id: 'skills', label: 'Skills', show: isEnabled('skills') && skills.length > 0 },
              { id: 'projects', label: 'Projects', show: isEnabled('projects') && projects.length > 0 },
              { id: 'awards', label: 'Awards', show: isEnabled('certificates') && certificates.length > 0 },
              { id: 'contact', label: 'Contact', show: isEnabled('inbox') },
            ]

              .filter((tab) => tab.show)
              .map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-1 transition-colors ${
                      isActive
                        ? isDark ? 'text-purple-400 font-bold' : 'text-purple-600 font-bold'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute left-0 right-0 -bottom-1 h-0.5 bg-purple-600 rounded-full"
                      />
                    )}
                  </button>
                );
              })}
          </nav>

          {/* Actions: Admin Button & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-xl border transition ${isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-purple-600'}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="/admin"
              target="_blank"
              rel="noreferrer"
              className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin</span>
            </a>

            <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 text-slate-500">
              {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {navOpen && (
          <div className={`md:hidden px-6 py-4 space-y-3 border-b text-sm font-semibold ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            {[
              { id: 'home', label: 'Home', show: true },
              { id: 'about', label: 'About', show: isEnabled('education') || isEnabled('experience') || isEnabled('personal') },
              { id: 'skills', label: 'Skills', show: isEnabled('skills') },
              { id: 'projects', label: 'Projects', show: isEnabled('projects') },
              { id: 'awards', label: 'Awards', show: isEnabled('certificates') },
              { id: 'contact', label: 'Contact', show: isEnabled('inbox') },
            ]
              .filter((tab) => tab.show)
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setNavOpen(false);
                  }}
                  className={`block w-full text-left py-2 px-3 rounded-lg ${activeTab === tab.id ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  {tab.label}
                </button>
              ))}
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* ============================================================ */}
          {/* TAB 1: HOME PAGE                                             */}
          {/* ============================================================ */}
          {activeTab === 'home' && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="min-h-[75vh] flex flex-col md:flex-row items-center justify-between gap-12 py-6"
            >
              {/* Left Column: Welcome Tag, Headline, Role, Bio, Buttons, Social Icons */}
              <div className="flex-1 space-y-6 max-w-2xl w-full text-center md:text-left flex flex-col items-center md:items-start">
                {/* Purple Welcome Badge */}
                <div className="inline-block">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 font-sans">
                    WELCOME TO MY PORTFOLIO
                  </span>
                </div>

                {/* Big Headline */}
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Hi, I'm <span className="text-purple-600">{personalInfo.fullName || username}</span>
                </h1>

                {/* Typewriter Role Title */}
                <div className="text-2xl sm:text-3xl font-bold flex items-center justify-center md:justify-start gap-2 h-10">
                  <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>A</span>
                  <TypewriterText
                    words={
                      personalInfo.title
                        ? (personalInfo.title.includes(',')
                            ? personalInfo.title.split(',').map(s => s.trim()).filter(Boolean)
                            : [personalInfo.title.trim()])
                        : ['Software Developer']
                    }
                    colorClass="text-purple-600 font-bold"
                  />
                </div>

                {/* Mobile Only Profile Photo (Displayed below heading and title, above bio) */}
                <div className="md:hidden flex justify-center py-2">
                  <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl ring-4 ring-purple-600/20 bg-slate-900">
                    {personalInfo.avatar ? (
                      <img src={personalInfo.avatar} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-5xl">
                        {username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Description */}
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl font-normal text-center md:text-left">
                  {personalInfo.bio ||
                    'I build modern, responsive, and high-performance web applications with clean code and intuitive user experiences. Passionate about creating innovative software solutions that solve real-world problems.'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <button
                    onClick={handleResumeClick}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-purple-600/30 transition transform active:scale-95"
                  >
                    <span>Download Resume</span>
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-6 py-3.5 rounded-2xl text-xs font-bold border transition flex items-center gap-2 ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                        : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <span>Let's Talk</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Social Circle Buttons */}
                <div className="flex items-center space-x-4 pt-4">
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      title="GitHub"
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-purple-400' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600'
                      }`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      title="LinkedIn"
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-purple-400' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600'
                      }`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      title="Twitter / X"
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-purple-400' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600'
                      }`}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      title="Instagram"
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-purple-400' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600'
                      }`}
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {(socialLinks.portfolio || socialLinks.website) && (
                    <a
                      href={socialLinks.portfolio || socialLinks.website}
                      target="_blank"
                      rel="noreferrer"
                      title="Personal Website"
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-purple-400' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600'
                      }`}
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {personalInfo.email && (
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-purple-400' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-purple-600'
                      }`}
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Clean Simple Circular Photo Card */}
              <div className="flex-1 hidden md:flex justify-center items-center py-8">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center"
                >
                  {/* Subtle Glow Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/30 to-indigo-500/20 blur-2xl pointer-events-none" />

                  {/* Clean Circle Border & Image Container */}
                  <div className="relative z-10 w-60 h-60 sm:w-76 sm:h-76 rounded-full overflow-hidden shadow-2xl ring-8 ring-purple-600/15 bg-slate-900 border-4 border-white dark:border-slate-800">
                    {personalInfo.avatar ? (
                      <img
                        src={personalInfo.avatar}
                        alt={personalInfo.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-6xl">
                        {username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* TAB 2: ABOUT PAGE                                             */}
          {/* ============================================================ */}
          {activeTab === 'about' && (isEnabled('education') || isEnabled('experience') || isEnabled('personal')) && (
            <motion.div key="about" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-12 py-6 max-w-5xl mx-auto">
              {/* Centered Main Header: About Me + Accent Line */}
              <div className="text-center space-y-3">
                <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  About Me
                </h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              {/* 1. Education Sub-heading */}
              {isEnabled('education') && (
                <section className="space-y-6">
                  <div className="flex items-center space-x-2 text-2xl font-extrabold text-purple-600">
                    <GraduationCap className="w-7 h-7" />
                    <span>Education</span>
                  </div>

                  {education.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {education.map((edu) => (
                        <div
                          key={edu._id || edu.degree}
                          className={`p-6 sm:p-7 rounded-3xl border transition duration-300 flex justify-between items-start ${
                            isDark
                              ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40 shadow-xl'
                              : 'bg-white border-slate-100 shadow-md hover:shadow-lg'
                          }`}
                        >
                          <div className="space-y-2 max-w-[85%]">
                            <h3 className={`font-extrabold text-lg sm:text-xl leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {edu.degree}
                            </h3>
                            <p className="text-xs sm:text-sm font-semibold text-purple-600">
                              {edu.institution}
                            </p>
                            {edu.duration && (
                              <p className="text-[11px] font-mono text-slate-400">
                                {edu.duration} {edu.cgpa ? `• CGPA: ${edu.cgpa}` : ''}
                              </p>
                            )}
                          </div>

                          {/* Calendar Icon Badge */}
                          <div className={`p-2.5 rounded-xl border flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            <Award className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'} text-xs`}>
                      <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span>No education records added yet. Add degrees in your Dashboard to display qualifications.</span>
                    </div>
                  )}
                </section>
              )}

              {/* 2. Experience Sub-heading */}
              {isEnabled('experience') && (
                <section className="space-y-6 pt-4">
                  <div className="flex items-center space-x-2 text-2xl font-extrabold text-purple-600">
                    <Briefcase className="w-7 h-7" />
                    <span>Experience</span>
                  </div>

                  {experience.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {experience.map((exp) => (
                        <div
                          key={exp._id || exp.company}
                          className={`p-6 sm:p-7 rounded-3xl border transition duration-300 flex justify-between items-start ${
                            isDark
                              ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40 shadow-xl'
                              : 'bg-white border-slate-100 shadow-md hover:shadow-lg'
                          }`}
                        >
                          <div className="space-y-2 max-w-[85%]">
                            <h3 className={`font-extrabold text-lg sm:text-xl leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {exp.position}
                            </h3>
                            <p className="text-xs sm:text-sm font-semibold text-purple-600">
                              {exp.company} {exp.location ? `• ${exp.location}` : ''}
                            </p>
                            {exp.duration && (
                              <p className="text-[11px] font-mono text-slate-400">{exp.duration}</p>
                            )}
                            {exp.description && (
                              <p className="text-xs text-slate-500 leading-relaxed pt-1">{exp.description}</p>
                            )}
                          </div>

                          <div className={`p-2.5 rounded-xl border flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            <Briefcase className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'} text-xs`}>
                      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span>No experience records added yet. Add work experience in your Dashboard.</span>
                    </div>
                  )}
                </section>
              )}
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: SKILLS PAGE                                           */}
          {/* ============================================================ */}
          {activeTab === 'skills' && isEnabled('skills') && (
            <motion.section key="skills" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-10 py-6 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Skills
                </h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <div key={skill._id || skill.name} className={`p-5 rounded-3xl border space-y-2 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className={isDark ? 'text-white' : 'text-slate-900'}>{skill.name}</span>
                      <span className="text-purple-600 font-mono">{skill.proficiencyLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${skill.proficiencyLevel}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* TAB 4: PROJECTS PAGE                                         */}
          {/* ============================================================ */}
          {activeTab === 'projects' && isEnabled('projects') && (
            <motion.section key="projects" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-10 py-6 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Projects
                </h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((proj) => (
                  <div
                    key={proj._id || proj.title}
                    className={`p-6 rounded-3xl border transition duration-300 space-y-4 flex flex-col justify-between group ${
                      isDark ? 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40' : 'bg-white border-slate-100 hover:border-purple-500/40 shadow-sm'
                    }`}
                  >
                    <div className="space-y-4">
                      {proj.thumbnail && (
                        <div className="overflow-hidden rounded-2xl h-52 bg-slate-950 flex items-center justify-center p-3">
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold group-hover:text-purple-600 transition">{proj.title}</h3>
                        <div className="flex items-center space-x-2">
                          {(proj.githubUrl || proj.github || proj.gitUrl || proj.repoUrl) && (
                            <a href={ensureUrlProtocol(proj.githubUrl || proj.github || proj.gitUrl || proj.repoUrl)} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 transition" title="GitHub Repository">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {(proj.liveUrl || proj.demoUrl || proj.link) && (
                            <a
                              href={ensureUrlProtocol(proj.liveUrl || proj.demoUrl || proj.link)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => analyticsService.trackEvent(username, 'project_click', proj._id)}
                              className="p-2 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-600 hover:text-white transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{proj.description}</p>
                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 pt-1 group"
                      >
                        <Eye className="w-3.5 h-3.5 transition group-hover:scale-110" />
                        <span>View Details</span>
                      </button>
                    </div>

                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4">
                        {proj.techStack.map((tech) => (
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

          {/* ============================================================ */}
          {/* TAB 5: AWARDS / CERTIFICATES PAGE                            */}
          {/* ============================================================ */}
          {activeTab === 'awards' && isEnabled('certificates') && (
            <motion.section key="awards" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-10 py-6 max-w-5xl mx-auto">
              <div className="text-center space-y-3">
                <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Awards
                </h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div key={cert._id || cert.title || cert.name} className={`p-6 rounded-3xl border space-y-2 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-start gap-3">
                      {(cert.certificateImage || cert.imageUrl) ? (
                        <img src={cert.certificateImage || cert.imageUrl} alt={cert.title || cert.name} className="w-12 h-12 object-cover rounded-xl border border-slate-700 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-bold text-base leading-tight">{cert.title || cert.name}</h3>
                        {(cert.organization || cert.issuer) && <p className="text-xs font-semibold text-purple-600">{cert.organization || cert.issuer}</p>}
                        {(cert.issueDate || cert.date) && <span className="text-[10px] text-slate-500 font-mono block">{cert.issueDate || cert.date}</span>}
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[11px] text-purple-500 hover:underline flex items-center gap-1 pt-0.5">
                            <ExternalLink className="w-3 h-3" /> Verify Credential
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ============================================================ */}
          {/* TAB 6: CONTACT PAGE                                          */}
          {/* ============================================================ */}
          {activeTab === 'contact' && isEnabled('inbox') && (
            <motion.section key="contact" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-5xl mx-auto space-y-8 py-6">
              <div className="text-center space-y-3">
                <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Contact Me
                </h2>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Info Card */}
                <div className={`lg:col-span-5 p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-purple-600">Let's Build Something</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Have an exciting project in mind or want to collaborate? Fill out the form below to message me directly on WhatsApp or reach out via email.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <div className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 font-bold block">Email</span>
                        <span className="text-xs font-bold truncate block">{personalInfo.email || 'harsath137@gmail.com'}</span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 font-bold block">Phone / WhatsApp</span>
                        <span className="text-xs font-bold truncate block">{personalInfo.phone || '+91 6382245266'}</span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
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
                <form onSubmit={handleContactSubmit} className={`lg:col-span-7 p-8 rounded-3xl border space-y-4 text-xs ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-500 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.senderName}
                        onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                        placeholder="Enter your name"
                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-600 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-500 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.senderEmail}
                        onChange={(e) => setContactForm({ ...contactForm, senderEmail: e.target.value })}
                        placeholder="Enter your email"
                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-600 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 mb-1">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="What is this regarding?"
                      className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-600 ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Write your message here..."
                      className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-600 leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition"
                    >
                      <span>{sending ? 'Sending Message...' : 'Send Message'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>

      {/* Expanded Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border relative max-h-[90vh] flex flex-col ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            {/* Top Close Button (Cancel Symbol) */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md shadow-lg transition duration-200"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Full Image Header */}
            {(selectedProject.thumbnail || selectedProject.image) && (
              <div className="w-full h-64 sm:h-72 bg-slate-950 flex items-center justify-center p-4 relative shrink-0">
                <img
                  src={selectedProject.thumbnail || selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/40 pb-4">
                <div>
                  <h3 className="text-2xl font-extrabold">{selectedProject.title}</h3>
                  {selectedProject.category && (
                    <span className="text-xs font-semibold text-purple-500">{selectedProject.category}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {(selectedProject.githubUrl || selectedProject.github || selectedProject.gitUrl || selectedProject.repoUrl) && (
                    <a
                      href={ensureUrlProtocol(selectedProject.githubUrl || selectedProject.github || selectedProject.gitUrl || selectedProject.repoUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-4 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-purple-400' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-purple-600'
                      }`}
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                  )}
                  {(selectedProject.liveUrl || selectedProject.demoUrl || selectedProject.link) && (
                    <a
                      href={ensureUrlProtocol(selectedProject.liveUrl || selectedProject.demoUrl || selectedProject.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-purple-700 transition"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500">Project Description</h4>
                <p className="text-sm leading-relaxed font-normal whitespace-pre-line text-slate-400">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack Badges */}
              {selectedProject.techStack && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedProject.techStack)
                      ? selectedProject.techStack
                      : typeof selectedProject.techStack === 'string'
                      ? selectedProject.techStack.split(',')
                      : []
                    ).map((tech) => (
                      <span key={tech} className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {String(tech).trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CreativeTemplate;
