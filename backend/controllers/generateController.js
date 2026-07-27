import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');
import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Certificate from '../models/Certificate.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

// @desc    Generate deployable portfolio React project ZIP
// @route   POST /api/generate
export const generatePortfolioZip = async (req, res) => {
  try {
    const userId = req.user._id;
    let portfolio;
    let projects = [];
    let skills = [];
    let education = [];
    let experience = [];
    let certificates = [];

    if (isInMemoryFallback) {
      portfolio = await mockStore.findPortfolioByUserId(userId);
      if (!portfolio) {
        portfolio = await mockStore.createPortfolio({ userId: req.user._id, username: req.user.username });
      }
      projects = mockStore.projects.filter((p) => p.portfolioId === portfolio._id);
      skills = mockStore.skills.filter((s) => s.portfolioId === portfolio._id);
      education = mockStore.education.filter((e) => e.portfolioId === portfolio._id);
      experience = mockStore.experience.filter((e) => e.portfolioId === portfolio._id);
      certificates = mockStore.certificates.filter((c) => c.portfolioId === portfolio._id);
    } else {
      portfolio = await Portfolio.findOne({ userId });
      if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
      projects = await Project.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
      skills = await Skill.find({ portfolioId: portfolio._id }).sort({ proficiencyLevel: -1 });
      education = await Education.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
      experience = await Experience.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
      certificates = await Certificate.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    }

    const portfolioJsonData = {
      name: portfolio.personalInfo?.fullName || req.user.username,
      title: portfolio.personalInfo?.title || 'Software Developer',
      tagline: 'WELCOME TO MY PORTFOLIO',
      bio: portfolio.personalInfo?.bio || '',
      email: portfolio.personalInfo?.email || '',
      phone: portfolio.personalInfo?.phone || '',
      location: portfolio.personalInfo?.location || '',
      avatar: portfolio.personalInfo?.avatar || '',
      resumeUrl: portfolio.resumeUrl || '',
      socialLinks: portfolio.socialLinks || {},
      skills,
      projects,
      education,
      experience,
      certificates,
    };

    const rootDir = process.cwd();
    const templatePath = path.join(rootDir, 'template');
    const generatedBaseDir = path.join(rootDir, 'generated');
    await fse.ensureDir(generatedBaseDir);

    const folderName = `portfolio_${portfolio.username}_${Date.now()}`;
    const targetProjectDir = path.join(generatedBaseDir, folderName);
    const zipFilePath = path.join(generatedBaseDir, `${folderName}.zip`);

    // 1. Copy template folder
    await fse.copy(templatePath, targetProjectDir);

    // 2. Write custom portfolio.json
    const dataFilePath = path.join(targetProjectDir, 'src', 'data', 'portfolio.json');
    await fse.outputJson(dataFilePath, portfolioJsonData, { spaces: 2 });

    // 3. Compress folder to ZIP
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.json({
        success: true,
        message: 'Portfolio ZIP generated successfully',
        downloadUrl: `/api/generate/download/${folderName}.zip`,
        previewUrl: `/${portfolio.username}`,
        zipFileName: `${folderName}.zip`,
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(targetProjectDir, false);
    await archive.finalize();
  } catch (error) {
    console.error('Generate ZIP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download generated ZIP file
// @route   GET /api/generate/download/:filename
export const downloadZip = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'generated', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'ZIP file not found or expired' });
    }

    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
