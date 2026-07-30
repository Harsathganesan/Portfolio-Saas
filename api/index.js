/**
 * Vercel Serverless API Handler
 * Self-contained Express server for Vercel deployment.
 * Does NOT import from ../backend to avoid ESM module resolution issues.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// ─── MongoDB Connection ──────────────────────────────────────────────
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.warn('⚠️ MONGODB_URI not set'); return; }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    isConnected = false;
  }
};

// ─── Mongoose Models ─────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  fullName: { type: String, default: '' },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  isDisabled: { type: Boolean, default: false },
}, { timestamps: true });
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};
const User = mongoose.models.User || mongoose.model('User', userSchema);

const portfolioSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:    { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  published:   { type: Boolean, default: false },
  visibility:  { type: String, default: 'public' },
  personalInfo: { type: Object, default: {} },
  socialLinks:  { type: Object, default: {} },
  sectionsEnabled: { type: Object, default: {} },
  templateId:  { type: String, default: 'minimalist' },
  primaryColor:{ type: String, default: '#6366f1' },
  themeMode:   { type: String, default: 'light' },
  resumeUrl:   { type: String, default: '' },
  seo:         { type: Object, default: {} },
  slug:        { type: String, default: '' },
  publishedAt: { type: Date },
  isFeatured:  { type: Boolean, default: false },
}, { timestamps: true });
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

const itemSchema = (extra = {}) => new mongoose.Schema({
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  ...extra
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', itemSchema({
  title: String, description: String, techStack: [String], liveUrl: String,
  repoUrl: String, imageUrl: String, isFeatured: { type: Boolean, default: false },
}));
const Skill = mongoose.models.Skill || mongoose.model('Skill', itemSchema({
  name: String, category: String, proficiencyLevel: { type: Number, default: 50 },
  icon: String,
}));
const Education = mongoose.models.Education || mongoose.model('Education', itemSchema({
  institution: String, degree: String, field: String, startDate: String,
  endDate: String, grade: String, description: String,
}));
const Experience = mongoose.models.Experience || mongoose.model('Experience', itemSchema({
  company: String, position: String, startDate: String, endDate: String,
  current: Boolean, description: String, techStack: [String],
}));
const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', itemSchema({
  name: String, issuer: String, issueDate: String, expiryDate: String,
  credentialId: String, credentialUrl: String, imageUrl: String,
}));
const Message = mongoose.models.Message || mongoose.model('Message', itemSchema({
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  senderName: String, senderEmail: String, message: String,
  isRead: { type: Boolean, default: false },
}));
const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', new mongoose.Schema({
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' },
  username: String, totalViews: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
}, { timestamps: true }));

// ─── JWT Helpers ──────────────────────────────────────────────────────
const JWT_SECRET  = process.env.JWT_SECRET  || 'super_secret_jwt_key_portfolio_saas_2026';
const JWT_EXPIRE  = process.env.JWT_EXPIRE  || '30d';
const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

// ─── Auth Middleware ─────────────────────────────────────────────────
const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    if (req.user.isDisabled) return res.status(403).json({ success: false, message: 'Account disabled' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
  next();
};

// ─── DB Connect Middleware ────────────────────────────────────────────
app.use(async (req, res, next) => { await connectDB(); next(); });

// ─── Health Check ─────────────────────────────────────────────────────
app.get(['/api/health', '/health', '/api', '/api/'], (req, res) => {
  res.json({ status: 'ok', service: 'Portfolio SaaS API', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', time: new Date().toISOString() });
});

// ─── AUTH ROUTES ──────────────────────────────────────────────────────
const authHandler = (path, fn) => {
  app.post([`/api/auth${path}`, `/auth${path}`], fn);
};

authHandler('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    if (!username || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    const clean = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
    if (await User.findOne({ $or: [{ email }, { username: clean }] })) {
      return res.status(400).json({ success: false, message: 'Email or username already taken' });
    }
    const user = await User.create({ username: clean, email, password, fullName: fullName || clean });
    const portfolio = await Portfolio.create({ userId: user._id, username: user.username, personalInfo: { fullName: user.fullName, email: user.email, title: 'Full Stack Developer', bio: `Hi, I'm ${user.fullName}!` } });
    await Analytics.create({ portfolioId: portfolio._id, username: user.username });
    res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

authHandler('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.isDisabled) return res.status(403).json({ success: false, message: 'Account disabled' });
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get(['/api/auth/profile', '/auth/profile'], protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role, avatar: user.avatar } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post(['/api/auth/forgot-password', '/auth/forgot-password'], (req, res) => {
  res.json({ success: true, message: 'Password reset instructions sent' });
});

// ─── PORTFOLIO ROUTES ────────────────────────────────────────────────
const getOrCreatePortfolio = async (userId, username) => {
  let p = await Portfolio.findOne({ userId });
  if (!p) p = await Portfolio.create({ userId, username, personalInfo: { email: '' } });
  return p;
};

app.get(['/api/portfolio/me', '/portfolio/me'], protect, async (req, res) => {
  try {
    const p = await getOrCreatePortfolio(req.user._id, req.user.username);
    const [projects, skills, education, experience, certificates] = await Promise.all([
      Project.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Skill.find({ portfolioId: p._id }),
      Education.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Experience.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Certificate.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
    ]);
    res.json({ success: true, portfolio: { ...p.toObject(), projects, skills, education, experience, certificates } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put(['/api/portfolio/me', '/portfolio/me'], protect, async (req, res) => {
  try {
    const p = await getOrCreatePortfolio(req.user._id, req.user.username);
    const { personalInfo, socialLinks, templateId, themeMode, primaryColor, resumeUrl, seo, sectionsEnabled, isPublished, username } = req.body;
    if (personalInfo) { p.personalInfo = { ...p.personalInfo, ...personalInfo }; p.markModified('personalInfo'); }
    if (socialLinks) { p.socialLinks = { ...p.socialLinks, ...socialLinks }; p.markModified('socialLinks'); }
    if (templateId !== undefined) p.templateId = templateId;
    if (themeMode !== undefined) p.themeMode = themeMode;
    if (primaryColor !== undefined) p.primaryColor = primaryColor;
    if (resumeUrl !== undefined) p.resumeUrl = resumeUrl;
    if (seo) { p.seo = { ...p.seo, ...seo }; p.markModified('seo'); }
    if (sectionsEnabled) { p.sectionsEnabled = { ...p.sectionsEnabled, ...sectionsEnabled }; p.markModified('sectionsEnabled'); }
    if (isPublished !== undefined) { p.isPublished = isPublished; p.published = isPublished; }
    if (username) {
      const clean = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      const exists = await User.findOne({ username: clean, _id: { $ne: req.user._id } });
      if (exists) return res.status(400).json({ success: false, message: 'Username taken' });
      p.username = clean;
      await User.findByIdAndUpdate(req.user._id, { username: clean });
    }
    await p.save();
    res.json({ success: true, message: 'Portfolio updated', portfolio: p });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post(['/api/portfolio/publish', '/portfolio/publish'], protect, async (req, res) => {
  try {
    const p = await getOrCreatePortfolio(req.user._id, req.user.username);
    p.isPublished = true; p.published = true; p.publishedAt = new Date(); p.slug = p.username;
    await p.save();
    res.json({ success: true, message: 'Portfolio published!', publicUrl: `/${p.username}`, portfolio: p });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post(['/api/portfolio/unpublish', '/portfolio/unpublish'], protect, async (req, res) => {
  try {
    const p = await getOrCreatePortfolio(req.user._id, req.user.username);
    p.isPublished = false; p.published = false; await p.save();
    res.json({ success: true, message: 'Portfolio unpublished' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get(['/api/portfolio/check-username/:username', '/portfolio/check-username/:username'], protect, async (req, res) => {
  try {
    const u = req.params.username.toLowerCase().trim();
    const existing = await User.findOne({ username: u });
    const isMine = existing && existing._id.toString() === req.user._id.toString();
    res.json({ success: true, available: !existing || isMine, username: u });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Public portfolio
app.get(['/api/user/:username', '/user/:username'], async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    const p = await Portfolio.findOne({ $or: [{ username }, { slug: username }] });
    if (!p) return res.status(404).json({ success: false, message: 'Portfolio Not Found' });
    if (!p.isPublished && !p.published) return res.status(404).json({ success: false, message: 'Portfolio Not Published' });
    const [projects, skills, education, experience, certificates] = await Promise.all([
      Project.find({ portfolioId: p._id }).sort({ isFeatured: -1, createdAt: -1 }),
      Skill.find({ portfolioId: p._id }),
      Education.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Experience.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
      Certificate.find({ portfolioId: p._id }).sort({ createdAt: -1 }),
    ]);
    let analytics = await Analytics.findOne({ portfolioId: p._id });
    if (!analytics) analytics = await Analytics.create({ portfolioId: p._id, username: p.username });
    analytics.totalViews += 1; await analytics.save();
    res.json({ success: true, portfolio: { ...p.toObject(), projects, skills, education, experience, certificates, analytics: { totalViews: analytics.totalViews, uniqueVisitors: analytics.uniqueVisitors } } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get(['/api/portfolio/:username', '/portfolio/:username'], async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    const p = await Portfolio.findOne({ username });
    if (!p || (!p.isPublished && !p.published)) return res.status(404).json({ success: false, message: 'Not found or private' });
    res.json({ success: true, portfolio: p.toObject() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── CRUD FACTORY ────────────────────────────────────────────────────
const crudRoutes = (basePath, Model) => {
  app.get([`/api/${basePath}`, `/${basePath}`], protect, async (req, res) => {
    try {
      const p = await Portfolio.findOne({ userId: req.user._id });
      if (!p) return res.json({ success: true, items: [] });
      const items = await Model.find({ portfolioId: p._id }).sort({ createdAt: -1 });
      res.json({ success: true, items });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  app.post([`/api/${basePath}`, `/${basePath}`], protect, async (req, res) => {
    try {
      const p = await getOrCreatePortfolio(req.user._id, req.user.username);
      const item = await Model.create({ portfolioId: p._id, ...req.body });
      res.status(201).json({ success: true, item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  app.put([`/api/${basePath}/:id`, `/${basePath}/:id`], protect, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, item });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  app.delete([`/api/${basePath}/:id`, `/${basePath}/:id`], protect, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
};

crudRoutes('projects', Project);
crudRoutes('skills', Skill);
crudRoutes('education', Education);
crudRoutes('experience', Experience);
crudRoutes('certificates', Certificate);

// ─── MESSAGES ────────────────────────────────────────────────────────
app.post(['/api/messages', '/messages'], async (req, res) => {
  try {
    const { portfolioUsername, ...msgData } = req.body;
    const p = await Portfolio.findOne({ username: portfolioUsername });
    if (!p) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    const msg = await Message.create({ portfolioId: p._id, ...msgData });
    res.status(201).json({ success: true, message: 'Message sent!', data: msg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get(['/api/messages/me', '/messages/me'], protect, async (req, res) => {
  try {
    const p = await Portfolio.findOne({ userId: req.user._id });
    if (!p) return res.json({ success: true, messages: [] });
    const messages = await Message.find({ portfolioId: p._id }).sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put(['/api/messages/:id/read', '/messages/:id/read'], protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, message: msg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── ANALYTICS ───────────────────────────────────────────────────────
app.get(['/api/analytics/me', '/analytics/me'], protect, async (req, res) => {
  try {
    const p = await Portfolio.findOne({ userId: req.user._id });
    if (!p) return res.json({ success: true, analytics: { totalViews: 0, uniqueVisitors: 0 } });
    const a = await Analytics.findOne({ portfolioId: p._id });
    res.json({ success: true, analytics: a || { totalViews: 0, uniqueVisitors: 0 } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── ADMIN ───────────────────────────────────────────────────────────
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
    const portfolioMap = {};
    portfolios.forEach(p => { portfolioMap[p.userId?.toString()] = p; });
    const result = users.map(u => ({ ...u, portfolio: portfolioMap[u._id?.toString()] || null }));
    res.json({ success: true, users: result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put(['/api/admin/users/:id/toggle', '/admin/users/:id/toggle'], protect, adminOnly, async (req, res) => {
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

// ─── PUBLIC EXPLORE ──────────────────────────────────────────────────
app.get(['/api/public/explore', '/public/explore'], async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ $or: [{ isPublished: true }, { published: true }] }).limit(20);
    res.json({ success: true, portfolios });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── UPLOAD (Stub for Vercel - use Cloudinary URL directly) ──────────
app.post(['/api/upload', '/upload'], protect, (req, res) => {
  res.json({ success: false, message: 'File upload not supported in serverless mode. Please use Cloudinary direct upload.' });
});

// ─── Error Handler ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;
