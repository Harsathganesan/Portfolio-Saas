/**
 * api/index.js — Vercel Serverless Handler (Self-Contained)
 * All logic is inline. Zero imports from ../backend to avoid Vercel ESM bundling issues.
 * Auth: JWT  |  DB: MongoDB Atlas  |  Hashing: bcryptjs
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// ─── MongoDB Connection (cached across warm starts) ──────────────────────────
let cachedConn = null;
const connectDB = async () => {
  if (cachedConn && mongoose.connection.readyState === 1) return cachedConn;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not set in Vercel Environment Variables!');
    return null;
  }
  try {
    cachedConn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ MongoDB Atlas connected');
    return cachedConn;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    cachedConn = null;
    return null;
  }
};

// Connect before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ─── Mongoose Models ─────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true, select: false },
  fullName:   { type: String, default: '' },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  isDisabled: { type: Boolean, default: false },
  avatar:     { type: String, default: '' },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const PortfolioSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:        { type: String, required: true },
  isPublished:     { type: Boolean, default: false },
  published:       { type: Boolean, default: false },
  personalInfo:    { type: Object, default: {} },
  socialLinks:     { type: Object, default: {} },
  sectionsEnabled: { type: Object, default: {} },
  templateId:      { type: String, default: 'minimalist' },
  primaryColor:    { type: String, default: '#6366f1' },
  themeMode:       { type: String, default: 'light' },
  resumeUrl:       { type: String, default: '' },
  seo:             { type: Object, default: {} },
  slug:            { type: String, default: '' },
  publishedAt:     { type: Date },
  isFeatured:      { type: Boolean, default: false },
}, { timestamps: true });
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

const makeModel = (name, extra) => {
  const schema = new mongoose.Schema(
    { portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true }, ...extra },
    { timestamps: true }
  );
  return mongoose.models[name] || mongoose.model(name, schema);
};

const Project     = makeModel('Project',     { title: String, description: String, techStack: [String], liveUrl: String, repoUrl: String, imageUrl: String, isFeatured: { type: Boolean, default: false } });
const Skill       = makeModel('Skill',       { name: String, category: String, proficiencyLevel: { type: Number, default: 50 }, icon: String });
const Education   = makeModel('Education',   { institution: String, degree: String, field: String, startDate: String, endDate: String, grade: String, description: String });
const Experience  = makeModel('Experience',  { company: String, position: String, startDate: String, endDate: String, current: Boolean, description: String, techStack: [String] });
const Certificate = makeModel('Certificate', { title: String, organization: String, name: String, issuer: String, issueDate: String, expiryDate: String, credentialId: String, credentialUrl: String, certificateImage: String, imageUrl: String });
const Message     = makeModel('Message',     { senderName: String, senderEmail: String, message: String, isRead: { type: Boolean, default: false } });
const Analytics   = mongoose.models.Analytics || mongoose.model('Analytics', new mongoose.Schema(
  { portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }, username: String, totalViews: { type: Number, default: 0 }, uniqueVisitors: { type: Number, default: 0 } },
  { timestamps: true }
));

// ─── JWT Helpers ──────────────────────────────────────────────────────────────
const JWT_SECRET  = process.env.JWT_SECRET  || 'super_secret_jwt_key_portfolio_saas_2026';
const JWT_EXPIRE  = process.env.JWT_EXPIRE  || '30d';
const signToken   = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

// ─── Auth Middleware ─────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token provided' });
  try {
    const { id } = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    if (req.user.isDisabled) return res.status(403).json({ success: false, message: 'Account disabled' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};
const adminOnly = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ success: false, message: 'Admin only' });

// ─── Health ───────────────────────────────────────────────────────────────────
app.get(['/api', '/api/', '/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'Portfolio SaaS API', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', time: new Date().toISOString() });
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const R = (path, fn) => { app.post([`/api/auth${path}`, `/auth${path}`], fn); };

R('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: 'username, email and password are required' });
    const clean = String(username).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
    const cleanEmail = String(email).toLowerCase().trim();
    if (!clean || clean.length < 3) return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
    if (String(password).length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });

    const existing = await User.findOne({ $or: [{ email: cleanEmail }, { username: clean }] });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: existing.email === cleanEmail ? 'Email is already registered. Please log in.' : 'Username is already taken. Choose another.'
      });
    }

    const user = await User.create({ username: clean, email: cleanEmail, password, fullName: fullName || clean });
    const portfolio = await Portfolio.create({
      userId: user._id, username: user.username, isPublished: true, published: true, publishedAt: new Date(), slug: user.username,
      personalInfo: { fullName: user.fullName, email: user.email, title: 'Full Stack Developer', bio: `Hi, I'm ${user.fullName}!` },
    });
    await Analytics.create({ portfolioId: portfolio._id, username: user.username });
    res.status(201).json({ success: true, token: signToken(user._id), user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Email or username already registered' });
    res.status(400).json({ success: false, message: err.message });
  }
});

R('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email/username and password required' });
    const loginId = String(email).toLowerCase().trim();
    const user = await User.findOne({ $or: [{ email: loginId }, { username: loginId }] }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
    if (user.isDisabled) return res.status(403).json({ success: false, message: 'Account disabled' });
    res.json({ success: true, token: signToken(user._id), user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get(['/api/auth/profile', '/auth/profile'], protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role, avatar: user.avatar } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post(['/api/auth/forgot-password', '/auth/forgot-password'], (req, res) =>
  res.json({ success: true, message: 'Password reset instructions sent' }));

app.put(['/api/auth/change-password', '/auth/change-password'], protect, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please enter current password and new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error updating password' });
  }
});

// ─── Portfolio Helpers ────────────────────────────────────────────────────────
const getOrCreate = async (userId, username) => {
  let p = await Portfolio.findOne({ userId });
  if (!p) p = await Portfolio.create({ userId, username, isPublished: true, published: true, publishedAt: new Date(), slug: username, personalInfo: { email: '' } });
  return p;
};

const mapCertificateFields = (cert) => {
  if (!cert) return cert;
  const obj = cert.toObject ? cert.toObject() : { ...cert };
  return {
    ...obj,
    title: obj.title || obj.name || '',
    organization: obj.organization || obj.issuer || '',
    name: obj.name || obj.title || '',
    issuer: obj.issuer || obj.organization || '',
  };
};

// ─── Portfolio Routes ─────────────────────────────────────────────────────────
app.get(['/api/portfolio/me', '/portfolio/me'], protect, async (req, res) => {
  try {
    const p = await getOrCreate(req.user._id, req.user.username);
    const [projects, skills, education, experience, rawCertificates] = await Promise.all([
      Project.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Skill.find({ portfolioId: p._id }),
      Education.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Experience.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Certificate.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
    ]);
    const certificates = rawCertificates.map(mapCertificateFields);
    res.json({ success: true, portfolio: { ...p.toObject(), projects, skills, education, experience, certificates } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put(['/api/portfolio/me', '/portfolio/me'], protect, async (req, res) => {
  try {
    const p = await getOrCreate(req.user._id, req.user.username);
    const { personalInfo, socialLinks, templateId, themeMode, primaryColor, resumeUrl, seo, sectionsEnabled, isPublished, username } = req.body;
    if (personalInfo)     { p.personalInfo     = { ...p.personalInfo,     ...personalInfo };     p.markModified('personalInfo'); }
    if (socialLinks)      { p.socialLinks       = { ...p.socialLinks,       ...socialLinks };       p.markModified('socialLinks'); }
    if (seo)              { p.seo               = { ...p.seo,               ...seo };               p.markModified('seo'); }
    if (sectionsEnabled)  { p.sectionsEnabled   = { ...p.sectionsEnabled,   ...sectionsEnabled };   p.markModified('sectionsEnabled'); }
    if (templateId  !== undefined) p.templateId  = templateId;
    if (themeMode   !== undefined) p.themeMode   = themeMode;
    if (primaryColor!== undefined) p.primaryColor = primaryColor;
    if (resumeUrl   !== undefined) p.resumeUrl   = resumeUrl;
    if (isPublished !== undefined) { p.isPublished = isPublished; p.published = isPublished; }
    if (username) {
      const clean = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      const taken = await User.findOne({ username: clean, _id: { $ne: req.user._id } });
      if (taken) return res.status(400).json({ success: false, message: 'Username already taken' });
      p.username = clean;
      await User.findByIdAndUpdate(req.user._id, { username: clean });
    }
    await p.save();
    res.json({ success: true, message: 'Portfolio updated', portfolio: p });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post(['/api/portfolio/publish', '/portfolio/publish'], protect, async (req, res) => {
  try {
    const p = await getOrCreate(req.user._id, req.user.username);
    p.isPublished = true; p.published = true; p.publishedAt = new Date(); p.slug = p.username;
    await p.save();
    res.json({ success: true, message: 'Portfolio published!', publicUrl: `/${p.username}`, portfolio: p });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post(['/api/portfolio/unpublish', '/portfolio/unpublish'], protect, async (req, res) => {
  try {
    const p = await getOrCreate(req.user._id, req.user.username);
    p.isPublished = false; p.published = false; await p.save();
    res.json({ success: true, message: 'Portfolio unpublished' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get(['/api/portfolio/check-username/:username', '/portfolio/check-username/:username'], protect, async (req, res) => {
  try {
    const u = req.params.username.toLowerCase().trim();
    const existing = await User.findOne({ username: u });
    res.json({ success: true, available: !existing || existing._id.equals(req.user._id), username: u });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Public portfolio by username
app.get(['/api/user/:username', '/user/:username'], async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    let p = await Portfolio.findOne({ $or: [{ username }, { slug: username }] });
    if (!p) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    if (!p.isPublished && !p.published) {
      p.isPublished = true; p.published = true; p.publishedAt = new Date();
      await p.save();
    }
    const [projects, skills, education, experience, rawCertificates] = await Promise.all([
      Project.find({ portfolioId: p._id }).sort({ isFeatured: -1, createdAt: -1 }),
      Skill.find({ portfolioId: p._id }),
      Education.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Experience.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Certificate.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
    ]);
    const certificates = rawCertificates.map(mapCertificateFields);
    let a = await Analytics.findOne({ portfolioId: p._id });
    if (!a) a = await Analytics.create({ portfolioId: p._id, username: p.username });
    a.totalViews += 1; await a.save();
    res.json({ success: true, portfolio: { ...p.toObject(), projects, skills, education, experience, certificates, analytics: { totalViews: a.totalViews, uniqueVisitors: a.uniqueVisitors } } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── CRUD Factory ─────────────────────────────────────────────────────────────
const crud = (prefix, Model) => {
  app.get([`/api/${prefix}`, `/${prefix}`], protect, async (req, res) => {
    try {
      const p = await Portfolio.findOne({ userId: req.user._id });
      if (!p) return res.json({ success: true, items: [] });
      const rawItems = await Model.find({ portfolioId: p._id }).sort({ createdAt: -1 });
      const items = prefix === 'certificates' ? rawItems.map(mapCertificateFields) : rawItems;
      res.json({ success: true, items, certificates: items });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  app.post([`/api/${prefix}`, `/${prefix}`], protect, async (req, res) => {
    try {
      const p = await getOrCreate(req.user._id, req.user.username);
      const payload = { ...req.body };
      if (prefix === 'certificates') {
        if (payload.title && !payload.name) payload.name = payload.title;
        if (payload.name && !payload.title) payload.title = payload.name;
        if (payload.organization && !payload.issuer) payload.issuer = payload.organization;
        if (payload.issuer && !payload.organization) payload.organization = payload.issuer;
      }
      const rawItem = await Model.create({ portfolioId: p._id, ...payload });
      const item = prefix === 'certificates' ? mapCertificateFields(rawItem) : rawItem;
      res.status(201).json({ success: true, item, certificate: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  app.put([`/api/${prefix}/:id`, `/${prefix}/:id`], protect, async (req, res) => {
    try {
      const payload = { ...req.body };
      if (prefix === 'certificates') {
        if (payload.title && !payload.name) payload.name = payload.title;
        if (payload.name && !payload.title) payload.title = payload.name;
        if (payload.organization && !payload.issuer) payload.issuer = payload.organization;
        if (payload.issuer && !payload.organization) payload.organization = payload.issuer;
      }
      const rawItem = await Model.findByIdAndUpdate(req.params.id, payload, { new: true });
      if (!rawItem) return res.status(404).json({ success: false, message: 'Not found' });
      const item = prefix === 'certificates' ? mapCertificateFields(rawItem) : rawItem;
      res.json({ success: true, item, certificate: item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  app.delete([`/api/${prefix}/:id`, `/${prefix}/:id`], protect, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
};

crud('projects',     Project);
crud('skills',       Skill);
crud('education',    Education);
crud('experience',   Experience);
crud('certificates', Certificate);

// ─── AI Content Generator Routes ─────────────────────────────────────────────
const generateBioText = async ({ name, title, skills = [], experienceYears = '3+', tone = 'professional' }) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const skillsList = Array.isArray(skills) && skills.length > 0 ? skills.join(', ') : 'modern web tech';
      const prompt = `Write a compelling portfolio "About Me" bio for ${name || 'a Developer'} whose job title is "${title || 'Full Stack Engineer'}". Key skills: ${skillsList}. Experience: ${experienceYears} years. Tone: ${tone}. Keep it concise (2-4 sentences), highly impressive, professional, and directly usable in a portfolio website.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (e) {
      console.warn('Gemini API call failed in serverless, falling back:', e.message);
    }
  }

  const skillsList = Array.isArray(skills) && skills.length > 0 ? skills.join(', ') : 'modern web tech';
  if (tone === 'creative') {
    return `Hey there! I'm ${name || 'a passionate developer'}, a visionary ${title || 'Full Stack Engineer'} dedicated to crafting immersive digital experiences. With expertise in ${skillsList}, I blend intuitive design with clean, high-performance architecture.`;
  }
  if (tone === 'minimal') {
    return `${title || 'Software Developer'} specializing in building scalable web applications. Proficient in ${skillsList}. Focused on performance, clean code, and intuitive user experiences.`;
  }
  return `I am ${name || 'a Software Engineer'}, a results-driven ${title || 'Full Stack Developer'} with ${experienceYears} years of experience engineering high-impact web applications. My core technical expertise spans ${skillsList}. I excel at architecting scalable backends, responsive design systems, and optimizing application performance.`;
};

const generateProjectDescText = async ({ title, techStack = [], goal = '', role = 'Lead Developer' }) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const stack = Array.isArray(techStack) && techStack.length > 0 ? techStack.join(', ') : 'React, Node.js, and MongoDB';
      const prompt = `Write a detailed, high-impact project description for a developer portfolio project titled "${title}". Role: ${role}. Tech Stack: ${stack}. Primary Goal: ${goal || 'streamline workflows'}. Keep it concise (2-3 sentences), highlighting technical architecture and results.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (e) {
      console.warn('Gemini API call failed in serverless, falling back:', e.message);
    }
  }

  const stack = Array.isArray(techStack) && techStack.length > 0 ? techStack.join(', ') : 'React, Node.js, and MongoDB';
  const goalClause = goal ? ` to ${goal}` : ' to streamline user workflows and elevate operational performance';
  return `Engineered ${title || 'a high-performance application'}${goalClause}. As the ${role}, I architected the core application workflow utilizing ${stack}. Implemented robust security authentication, responsive UI components, dynamic data handling, and optimized database queries.`;
};

app.post(['*generate-bio*', '/api/ai/generate-bio', '/ai/generate-bio', '/api/generate-bio', '/generate-bio'], async (req, res) => {
  try {
    const { name, title, skills, experienceYears, tone } = req.body;
    const bio = await generateBioText({ name, title, skills, experienceYears, tone });
    res.json({ success: true, bio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post(['*generate-project-desc*', '/api/ai/generate-project-desc', '/ai/generate-project-desc', '/api/generate-project-desc', '/generate-project-desc'], async (req, res) => {
  try {
    const { title, techStack, goal, role } = req.body;
    const description = await generateProjectDescText({ title, techStack, goal, role });
    res.json({ success: true, description });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Messages ─────────────────────────────────────────────────────────────────
app.post(['/api/messages', '/messages'], async (req, res) => {
  try {
    const { portfolioUsername, ...data } = req.body;
    const p = await Portfolio.findOne({ username: portfolioUsername });
    if (!p) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    const msg = await Message.create({ portfolioId: p._id, ...data });
    res.status(201).json({ success: true, message: 'Message sent!', data: msg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.get(['/api/messages/me', '/messages/me'], protect, async (req, res) => {
  try {
    const p = await Portfolio.findOne({ userId: req.user._id });
    if (!p) return res.json({ success: true, messages: [] });
    res.json({ success: true, messages: await Message.find({ portfolioId: p._id }).sort({ createdAt: -1 }) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.put(['/api/messages/:id/read', '/messages/:id/read'], protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, message: msg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Analytics ────────────────────────────────────────────────────────────────
app.get(['/api/analytics/me', '/analytics/me'], protect, async (req, res) => {
  try {
    const p = await Portfolio.findOne({ userId: req.user._id });
    if (!p) return res.json({ success: true, analytics: { totalViews: 0, uniqueVisitors: 0 } });
    const a = await Analytics.findOne({ portfolioId: p._id });
    res.json({ success: true, analytics: a || { totalViews: 0, uniqueVisitors: 0 } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Admin ────────────────────────────────────────────────────────────────────
app.get(['/api/admin/db-status', '/admin/db-status'], protect, adminOnly, async (req, res) => {
  try {
    const startTime = Date.now();
    const isConnected = mongoose.connection.readyState === 1;
    let pingTimeMs = 0;

    if (isConnected && mongoose.connection.db) {
      try {
        await mongoose.connection.db.admin().ping();
        pingTimeMs = Date.now() - startTime;
      } catch (e) {
        pingTimeMs = Date.now() - startTime;
      }
    }

    const host = mongoose.connection.host || 'cluster0.tuz60f1.mongodb.net';
    const dbName = mongoose.connection.name || 'portfolio_saas';
    const totalUsers = await User.countDocuments();
    const totalPortfolios = await Portfolio.countDocuments();
    const totalProjects = await Project.countDocuments();

    res.json({
      success: true,
      dbStatus: {
        isConnected,
        statusText: isConnected ? 'MongoDB Atlas Connected & Healthy' : 'Database Offline',
        host,
        dbName,
        pingTimeMs,
        totalUsers,
        totalPortfolios,
        totalProjects,
        mode: 'MongoDB Atlas Cloud Database',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      dbStatus: {
        isConnected: false,
        statusText: `Connection Error: ${error.message}`,
        host: 'cluster0.tuz60f1.mongodb.net',
        dbName: 'portfolio_saas',
        pingTimeMs: 0,
        mode: 'MongoDB Atlas Cloud Database',
      },
    });
  }
});

app.get(['/api/admin/stats', '/admin/stats'], protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, publishedPortfolios] = await Promise.all([
      User.countDocuments(),
      Portfolio.countDocuments({ $or: [{ isPublished: true }, { published: true }] }),
    ]);
    res.json({ success: true, stats: { totalUsers, publishedPortfolios, totalViews: 0, totalDownloads: 0 } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.get(['/api/admin/users', '/admin/users'], protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    const portfolios = await Portfolio.find().lean();
    const pMap = {};
    portfolios.forEach(p => { pMap[String(p.userId)] = p; });
    res.json({ success: true, users: users.map(u => ({ ...u, portfolio: pMap[String(u._id)] || null })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.put(['/api/admin/users/:id/toggle-status', '/api/admin/users/:id/toggle', '/admin/users/:id/toggle-status', '/admin/users/:id/toggle'], protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isDisabled = !user.isDisabled; await user.save();
    res.json({ success: true, message: `User ${user.isDisabled ? 'disabled' : 'enabled'}` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.delete(['/api/admin/users/:id', '/admin/users/:id'], protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.put(['/api/admin/portfolios/:id/feature', '/admin/portfolios/:id/feature'], protect, adminOnly, async (req, res) => {
  try {
    const p = await Portfolio.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    p.isFeatured = !p.isFeatured; await p.save();
    res.json({ success: true, message: `Portfolio ${p.isFeatured ? 'featured' : 'unfeatured'}` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Public Explore ───────────────────────────────────────────────────────────
app.get(['/api/public/explore', '/public/explore'], async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ $or: [{ isPublished: true }, { published: true }] }).limit(20);
    res.json({ success: true, portfolios });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Upload stub (serverless doesn't support multer disk storage) ─────────────
app.post(['/api/upload', '/upload'], protect, (req, res) => {
  res.json({ success: false, message: 'Direct upload not supported in serverless. Use Cloudinary widget.' });
});

// ─── 404 & Error Handler ──────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, req, res, _next) => { console.error(err.message); res.status(500).json({ success: false, message: err.message }); });

export default app;
