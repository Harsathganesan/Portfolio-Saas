import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  Send,
  Menu,
  X,
  Phone,
  Globe,
  ArrowUp,
  Sparkles,
  ArrowRight,
  Code2,
  FolderKanban,
  Users,
  Trophy,
  CheckCircle2,
  Eye,
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
    achievements = [],
    sectionsEnabled = {},
    username,
    resumeUrl,
  } = data;

  const [activeSection, setActiveSection] = useState('home');
  const [contactForm, setContactForm] = useState({ senderName: '', senderEmail: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
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


  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'education', 'experience', 'skills', 'projects', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i]);
        if (sec && sec.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', show: true },
    { id: 'about', label: 'About', show: isEnabled('personal') || isEnabled('about') },
    { id: 'education', label: 'Education', show: isEnabled('education') && education.length > 0 },
    { id: 'experience', label: 'Experience', show: isEnabled('experience') && experience.length > 0 },
    { id: 'skills', label: 'Skills', show: isEnabled('skills') && skills.length > 0 },
    { id: 'projects', label: 'Projects', show: isEnabled('projects') && projects.length > 0 },
    { id: 'certifications', label: 'Certifications', show: isEnabled('certificates') && certificates.length > 0 },
    { id: 'contact', label: 'Contact', show: isEnabled('inbox') },
  ].filter((item) => item.show);


  const firstName = personalInfo.fullName ? personalInfo.fullName.split(' ')[0] : (username || 'Abi');
  const lastName = personalInfo.fullName ? personalInfo.fullName.split(' ').slice(1).join(' ') : 'Harsath';

  // Dynamic theme colors — only applied to the generated portfolio
  const primaryColor = data?.primaryColor || '#6366f1';
  const themeStyles = {
    primaryBg: { backgroundColor: primaryColor },
    primaryText: { color: primaryColor },
    primaryBorder: { borderColor: primaryColor },
    lightBadge: { backgroundColor: `${primaryColor}18`, color: primaryColor },
    activePill: { backgroundColor: primaryColor, color: '#fff' },
    avatarGlow: { boxShadow: `0 0 0 4px ${primaryColor}30` },
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-900 font-sans relative overflow-x-hidden">

      {/* Background Animated Ambient Purple Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 right-0 w-[45rem] h-[45rem] rounded-full bg-indigo-200/60 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -left-32 w-[40rem] h-[40rem] rounded-full bg-purple-200/50 blur-[150px]"
        />
      </div>

      {/* 1. TOP HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full h-16 backdrop-blur-2xl bg-white/95 border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Brand Logo: Desktop full name, Mobile circular letter badge */}
          <button onClick={() => scrollToSection('home')} className="flex items-center gap-2 group">
            <div className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md" style={themeStyles.primaryBg}>
              {firstName?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-extrabold text-2xl tracking-tight text-slate-900">
              {firstName}<span style={themeStyles.primaryText}>.</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative py-1 transition-all duration-200 ${isActive
                      ? 'font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                  style={isActive ? themeStyles.primaryText : {}}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full"
                      style={themeStyles.primaryBg}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Top Download Resume Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResumeClick}
              className="text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-md transition"
              style={themeStyles.primaryBg}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </motion.button>

            <button onClick={() => setNavOpen(!navOpen)} className="lg:hidden p-2 text-slate-600 hover:text-slate-900">
              {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden px-6 py-4 space-y-2 border-b border-slate-100 bg-white text-xs font-semibold"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setNavOpen(false);
                }}
                className={`block w-full text-left py-2.5 px-4 rounded-xl transition ${activeSection === item.id ? 'text-white font-bold shadow-md' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                style={activeSection === item.id ? themeStyles.primaryBg : {}}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </header>

      {/* 2. MAIN SCROLLABLE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-24 relative z-10">

        {/* ============================================================ */}
        {/* SECTION 1: HERO HOME                                         */}
        {/* ============================================================ */}
        <section id="home" className="pt-6 pb-12 flex flex-col justify-between gap-12 scroll-mt-28">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 space-y-6 max-w-2xl w-full text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              {/* Greeting */}
              <div className="text-sm font-semibold text-slate-500 flex items-center justify-center lg:justify-start gap-1.5">
                <span>Hello, I'm</span>
                <span className="text-base">👋</span>
              </div>

              {/* Glowing Name Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-slate-900">
                {firstName}{' '}
                <span style={themeStyles.primaryText}>
                  {lastName}
                </span>
              </h1>

              {/* Subtitle / Role */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
                {personalInfo.title ? (
                  <span>{personalInfo.title}</span>
                ) : (
                  <>Full Stack <span style={themeStyles.primaryText}>Developer</span></>
                )}
              </h2>

              {/* Mobile Only Profile Photo (Displayed below heading, above bio content) */}
              <div className="lg:hidden flex justify-center py-2">
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl bg-slate-100 ring-4 ring-indigo-500/20">
                  {personalInfo.avatar ? (
                    <img src={personalInfo.avatar} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-black text-5xl" style={themeStyles.primaryBg}>
                      {firstName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl text-center lg:text-left">
                {personalInfo.bio ||
                  'I build modern, responsive and user-friendly web applications that solve real-world problems with clean code and great design.'}
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollToSection('contact')}
                  className="text-white px-7 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
                  style={themeStyles.primaryBg}
                >
                  <span>Contact Me</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollToSection('projects')}
                  className="px-7 py-3.5 rounded-xl text-xs font-bold border-2 hover:opacity-90 transition flex items-center gap-2 bg-white"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <Briefcase className="w-4 h-4" style={themeStyles.primaryText} />
                  <span>View My Work</span>
                </motion.button>
              </div>

              {/* Connect with me - Social Circle Links */}
              <div className="space-y-2 pt-4 flex flex-col items-center lg:items-start">
                <span className="text-xs text-slate-400 font-medium block">Connect with me</span>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  {socialLinks.github && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      href={socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </motion.a>
                  )}

                  {socialLinks.linkedin && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-sky-600" />
                    </motion.a>
                  )}

                  {socialLinks.twitter && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition"
                      title="Twitter / X"
                    >
                      <Twitter className="w-4 h-4 text-sky-500" />
                    </motion.a>
                  )}

                  {socialLinks.instagram && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4 text-pink-600" />
                    </motion.a>
                  )}

                  {(socialLinks.portfolio || socialLinks.website) && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      href={socialLinks.portfolio || socialLinks.website}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition"
                      title="Personal Website"
                    >
                      <Globe className="w-4 h-4 text-emerald-600" />
                    </motion.a>
                  )}

                  {personalInfo.email && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      href={`mailto:${personalInfo.email}`}
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition"
                      title={personalInfo.email}
                    >
                      <Mail className="w-4 h-4 text-indigo-600" />
                    </motion.a>
                  )}


                  {personalInfo.phone && (
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition"
                    >
                      <Globe className="w-4 h-4 text-emerald-500" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Sleek Professional Photo Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 hidden md:flex justify-center items-center"
            >
              <div className="relative group">
                {/* Soft Ambient Radial Glow */}
                <div
                  className="absolute -inset-4 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${primaryColor}80, ${primaryColor}20)` }}
                />

                {/* Gradient Outer Ring Container */}
                <div
                  className="relative z-10 p-1.5 rounded-full shadow-2xl transition duration-500 group-hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, #818cf8, #c084fc)`,
                    boxShadow: `0 20px 40px -15px ${primaryColor}40`,
                  }}
                >
                  {/* Inner White Separation Border */}
                  <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white bg-slate-100 shadow-inner">
                    {personalInfo.avatar ? (
                      <img src={personalInfo.avatar} alt={personalInfo.fullName} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-black text-6xl" style={themeStyles.primaryBg}>
                        {firstName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating "Available for Work" Live Badge */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-2 right-4 z-20 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl flex items-center gap-2"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-800">Available for Work</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: ABOUT ME                                          */}
        {/* ============================================================ */}
        {(isEnabled('personal') || isEnabled('about')) && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="about"
            className="space-y-10 pt-6 scroll-mt-28"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* LEFT COLUMN: About Text + Stat Cards */}
              <div className="lg:col-span-6 space-y-6">
                {/* Badge */}
                <div className="inline-block px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-600 text-xs font-bold">
                  About Me
                </div>

                {/* Headline */}
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                    Get to know <span className="text-indigo-600">me</span>
                  </h2>
                  <div className="w-10 h-1 bg-indigo-600 rounded-full" />
                </div>

                {/* Bio Description */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal whitespace-pre-line max-w-xl">
                  {personalInfo.aboutBio || personalInfo.bio ||
                    "I'm a passionate Full Stack Developer who loves building beautiful, functional and user-friendly web applications. I enjoy turning complex problems into simple, elegant solutions that create real value."}
                </p>



              </div>

              {/* RIGHT COLUMN: Photo + Floating Overlay Card */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="relative w-full max-w-lg rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-tr from-[#f4f5ff] to-[#eef0ff] border border-indigo-100/80">
                  {/* Dot Grid Pattern in Top Right */}
                  <div className="absolute top-6 right-6 grid grid-cols-5 gap-2 opacity-30 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    ))}
                  </div>

                  {/* Main Portrait Image */}
                  <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                    {(personalInfo.aboutAvatar || personalInfo.avatar) ? (
                      <img
                        src={personalInfo.aboutAvatar || personalInfo.avatar}
                        alt="About Me"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80';
                        }}
                      />
                    ) : (

                      <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-6xl">
                        {firstName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Floating Overlay Badge on Bottom Left */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 p-4 rounded-2xl shadow-2xl border border-slate-100 bg-white/95 backdrop-blur-md text-slate-900 shadow-indigo-500/10 max-w-xs space-y-1.5 z-20"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                      <Users className="w-4 h-4" />
                    </div>
                    <h4 className="font-extrabold text-sm tracking-tight">{personalInfo.fullName || (firstName + ' ' + lastName)}</h4>
                    <p className="text-xs font-bold text-indigo-600">{personalInfo.title || 'Full Stack Developer'}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{personalInfo.location || 'Chennai, Tamil Nadu, India'}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

            </div>
          </motion.section>
        )}

        {/* ============================================================ */}
        {/* SECTION 3: EDUCATION & EXPERIENCE (CAREER 2x2 GRID)           */}
        {/* ============================================================ */}
        {isEnabled('education') && education.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="education"
            className="space-y-8 pt-6 scroll-mt-28"
          >
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Education
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu) => (
                <div key={edu._id || edu.id || edu.degree} className="p-6 rounded-3xl border border-slate-100 bg-white shadow-md shadow-slate-200/40 hover:border-indigo-300 transition flex flex-col justify-between space-y-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{edu.degree}</h4>
                      <span className="text-xs text-indigo-600 font-semibold">{edu.institution}</span>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{edu.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
                    <span>{edu.year || edu.duration}</span>
                    {(edu.cgpa || edu.grade) && (
                      <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
                        CGPA / Grade: {edu.cgpa || edu.grade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {isEnabled('experience') && experience.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="experience"
            className="space-y-8 pt-6 scroll-mt-28"
          >
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Work Experience
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experience.map((exp) => (
                <div key={exp._id || exp.id || exp.role || exp.position} className="p-6 rounded-3xl border border-slate-100 bg-white shadow-md shadow-slate-200/40 hover:border-indigo-300 transition flex flex-col justify-between space-y-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{exp.role || exp.position}</h4>
                      <span className="text-xs text-indigo-600 font-semibold">{exp.company}</span>
                      {exp.location && <span className="text-xs text-slate-400 block">{exp.location}</span>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                      {exp.description}
                    </p>
                  )}
                  <div className="text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
                    {exp.duration}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ============================================================ */}
        {/* SECTION 4: SKILLS                                            */}
        {/* ============================================================ */}
        {isEnabled('skills') && skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="skills"
            className="space-y-8 pt-6 scroll-mt-28"
          >
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Skills
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="flex flex-wrap justify-center gap-3.5 max-w-4xl mx-auto">
              {skills.map((sk) => {
                const skillName = typeof sk === 'string' ? sk : sk.name;
                const skillLevel = typeof sk === 'object' ? sk.level : null;
                return (
                  <span
                    key={skillName}
                    className="px-6 py-3.5 rounded-2xl text-sm font-extrabold border border-slate-200 bg-white text-indigo-700 shadow-sm hover:border-indigo-400 hover:shadow-md hover:scale-105 transition duration-200 flex items-center gap-2"
                  >
                    <span>{skillName}</span>
                    {skillLevel && <span className="text-xs text-slate-400 font-medium">({skillLevel})</span>}
                  </span>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ============================================================ */}
        {/* SECTION 5: PROJECTS                                          */}
        {/* ============================================================ */}
        {isEnabled('projects') && projects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="projects"
            className="space-y-8 pt-6 scroll-mt-28"
          >
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Featured Projects
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => {
                const stack = Array.isArray(p.techStack) ? p.techStack : typeof p.techStack === 'string' ? p.techStack.split(',') : [];
                return (
                  <div key={p._id || p.id || p.title} className="rounded-3xl border border-slate-100 bg-white shadow-md shadow-slate-200/50 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition duration-300 flex flex-col justify-between">
                    {(p.image || p.thumbnail) && (
                      <div className="h-52 bg-slate-900/90 flex items-center justify-center p-3 overflow-hidden relative">
                        <img src={p.image || p.thumbnail} alt={p.title} className="w-full h-full object-contain hover:scale-105 transition duration-500" />
                      </div>
                    )}
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-extrabold text-lg text-slate-900">{p.title}</h3>
                          <div className="flex items-center space-x-1.5">
                            {(p.githubUrl || p.github) && (
                              <a href={p.githubUrl || p.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition" title="GitHub Repository">
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {(p.liveUrl || p.demoUrl || p.link) && (
                              <a href={p.liveUrl || p.demoUrl || p.link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition" title="Live Demo">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{p.description}</p>
                        <button
                          onClick={() => setSelectedProject(p)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 pt-1.5 group"
                        >
                          <Eye className="w-3.5 h-3.5 transition group-hover:scale-110" />
                          <span>View Details</span>
                        </button>
                      </div>
                      {stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                          {stack.map((tech) => (
                            <span key={tech} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700">
                              {String(tech).trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ============================================================ */}
        {/* SECTION 6: CERTIFICATIONS & AWARDS                            */}
        {/* ============================================================ */}
        {isEnabled('certificates') && certificates.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="certifications"
            className="space-y-8 pt-6 scroll-mt-28"
          >
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Certifications & Awards
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div key={cert._id || cert.id || cert.title || cert.name} className="p-6 rounded-3xl border border-slate-100 bg-white shadow-md shadow-slate-200/40 flex items-start space-x-4">
                  {(cert.certificateImage || cert.imageUrl) ? (
                    <img src={cert.certificateImage || cert.imageUrl} alt={cert.title || cert.name} className="w-12 h-12 object-cover rounded-2xl border border-slate-200 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                  )}
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-sm text-indigo-600 leading-tight">{cert.title || cert.name}</h4>
                    {(cert.organization || cert.issuer) && (cert.issueDate || cert.date) && (
                      <span className="text-xs text-slate-500">{cert.organization || cert.issuer} • {cert.issueDate || cert.date}</span>
                    )}
                    {(cert.organization || cert.issuer) && !(cert.issueDate || cert.date) && (
                      <span className="text-xs text-slate-500">{cert.organization || cert.issuer}</span>
                    )}
                    {!(cert.organization || cert.issuer) && (cert.issueDate || cert.date) && (
                      <span className="text-xs text-slate-500">{cert.issueDate || cert.date}</span>
                    )}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1 pt-0.5">
                        <ExternalLink className="w-3 h-3" /> Verify
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}


        {/* ============================================================ */}
        {/* SECTION 7: CONTACT ME                                        */}
        {/* ============================================================ */}
        {isEnabled('inbox') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="contact"
            className="space-y-10 pt-6 scroll-mt-28"
          >
            {/* Centered Heading matching Screenshot */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Contact Me
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side Info Card */}
              <div className="lg:col-span-5 p-8 rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-blue-600">
                    Let's Build Something
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Have an exciting project in mind or want to collaborate? Fill out the form below to message me directly on WhatsApp or reach out via email.
                  </p>
                </div>

                <div className="space-y-3.5 pt-2">
                  {/* Email */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100/80 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 font-bold block">Email</span>
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {personalInfo.email || 'harsath137@gmail.com'}
                      </span>
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100/80 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 font-bold block">Phone / WhatsApp</span>
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {personalInfo.phone || '+91 6382245266'}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100/80 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 font-bold block">Location</span>
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {personalInfo.location || 'Pudukkottai, Tamil Nadu, India'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Form Card matching Screenshot */}
              <form
                onSubmit={handleContactSubmit}
                className="lg:col-span-7 p-8 rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold text-xs">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.senderName}
                      onChange={(e) => setContactForm({ ...contactForm, senderName: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-blue-600 transition font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold text-xs">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.senderEmail}
                      onChange={(e) => setContactForm({ ...contactForm, senderEmail: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-blue-600 transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold text-xs">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="What is this regarding?"
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-blue-600 transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold text-xs">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-blue-600 transition font-medium leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={sending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition"
                  >
                    <span>{sending ? 'Sending Message...' : 'Send Message'}</span>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.section>
        )}

      </main>

      {/* 3. FOOTER SECTION */}
      <footer id="footer" className="border-t border-slate-800 bg-slate-900 text-slate-300 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 {personalInfo.fullName || username}. All rights reserved.</p>
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </footer>

      {/* Expanded Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col"
          >
            {/* Top Close Button (Cancel Symbol) */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md shadow-lg transition duration-200"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Full Image Header */}
            {(selectedProject.image || selectedProject.thumbnail) && (
              <div className="w-full h-64 sm:h-72 bg-slate-950 flex items-center justify-center p-4 relative shrink-0">
                <img
                  src={selectedProject.image || selectedProject.thumbnail}
                  alt={selectedProject.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{selectedProject.title}</h3>
                  {selectedProject.category && (
                    <span className="text-xs font-semibold text-indigo-600">{selectedProject.category}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {(selectedProject.githubUrl || selectedProject.github) && (
                    <a
                      href={selectedProject.githubUrl || selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:border-indigo-600 hover:text-indigo-600 flex items-center gap-1.5 transition"
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
                      className="px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                      style={themeStyles.primaryBg}
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack Badges */}
              {selectedProject.techStack && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedProject.techStack)
                      ? selectedProject.techStack
                      : typeof selectedProject.techStack === 'string'
                      ? selectedProject.techStack.split(',')
                      : []
                    ).map((tech) => (
                      <span key={tech} className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
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

export default MinimalistTemplate;
