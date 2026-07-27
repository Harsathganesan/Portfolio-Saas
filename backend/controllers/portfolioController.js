import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Certificate from '../models/Certificate.js';
import Analytics from '../models/Analytics.js';
import User from '../models/User.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

// @desc    Get user's current portfolio with all section items
// @route   GET /api/portfolio/me
export const getMyPortfolio = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      let portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      if (!portfolio) {
        portfolio = await mockStore.createPortfolio({
          userId: req.user._id,
          username: req.user.username,
          personalInfo: {
            fullName: req.user.fullName || req.user.username,
            title: 'Full Stack Developer',
            bio: 'Building awesome web applications with modern tech.',
            email: req.user.email,
          },
        });
      }

      const projects = mockStore.projects.filter((p) => p.portfolioId === portfolio._id);
      const skills = mockStore.skills.filter((s) => s.portfolioId === portfolio._id);
      const education = mockStore.education.filter((e) => e.portfolioId === portfolio._id);
      const experience = mockStore.experience.filter((e) => e.portfolioId === portfolio._id);
      const certificates = mockStore.certificates.filter((c) => c.portfolioId === portfolio._id);

      return res.json({
        success: true,
        portfolio: {
          ...portfolio,
          projects,
          skills,
          education,
          experience,
          certificates,
        },
      });
    }

    let portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: req.user._id,
        username: req.user.username,
        personalInfo: {
          fullName: req.user.fullName || req.user.username,
          title: 'Full Stack Developer',
          bio: 'Building awesome web applications with modern tech.',
          email: req.user.email,
        },
      });
    }

    const projects = await Project.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    const skills = await Skill.find({ portfolioId: portfolio._id }).sort({ proficiencyLevel: -1 });
    const education = await Education.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    const experience = await Experience.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    const certificates = await Certificate.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      portfolio: {
        ...portfolio.toObject(),
        projects,
        skills,
        education,
        experience,
        certificates,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user's portfolio settings & main fields
// @route   PUT /api/portfolio/me
export const updateMyPortfolio = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      let portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      if (!portfolio) {
        portfolio = await mockStore.createPortfolio({ userId: req.user._id, username: req.user.username });
      }

      const { personalInfo, socialLinks, templateId, themeMode, resumeUrl, seo, isPublished } = req.body;
      if (personalInfo) portfolio.personalInfo = { ...portfolio.personalInfo, ...personalInfo };
      if (socialLinks) portfolio.socialLinks = { ...portfolio.socialLinks, ...socialLinks };
      if (templateId) portfolio.templateId = templateId;
      if (themeMode) portfolio.themeMode = themeMode;
      if (resumeUrl !== undefined) portfolio.resumeUrl = resumeUrl;
      if (seo) portfolio.seo = { ...portfolio.seo, ...seo };
      if (isPublished !== undefined) portfolio.isPublished = isPublished;

      return res.json({
        success: true,
        message: 'Portfolio updated successfully',
        portfolio,
      });
    }

    let portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user._id, username: req.user.username });
    }

    const {
      personalInfo,
      socialLinks,
      templateId,
      themeMode,
      primaryColor,
      resumeUrl,
      achievements,
      languages,
      interests,
      seo,
      customDomain,
      isPublished,
      username,
    } = req.body;

    if (username && username.toLowerCase() !== portfolio.username) {
      const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      const existingUser = await User.findOne({ username: cleanUsername, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already in use' });
      }
      portfolio.username = cleanUsername;
      await User.findByIdAndUpdate(req.user._id, { username: cleanUsername });
    }

    if (personalInfo) portfolio.personalInfo = { ...portfolio.personalInfo, ...personalInfo };
    if (socialLinks) portfolio.socialLinks = { ...portfolio.socialLinks, ...socialLinks };
    if (templateId) portfolio.templateId = templateId;
    if (themeMode) portfolio.themeMode = themeMode;
    if (primaryColor) portfolio.primaryColor = primaryColor;
    if (resumeUrl !== undefined) portfolio.resumeUrl = resumeUrl;
    if (achievements) portfolio.achievements = achievements;
    if (languages) portfolio.languages = languages;
    if (interests) portfolio.interests = interests;
    if (seo) portfolio.seo = { ...portfolio.seo, ...seo };
    if (customDomain !== undefined) portfolio.customDomain = customDomain;
    if (isPublished !== undefined) portfolio.isPublished = isPublished;

    await portfolio.save();

    res.json({
      success: true,
      message: 'Portfolio updated successfully',
      portfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public portfolio by username
// @route   GET /api/portfolio/:username
export const getPublicPortfolio = async (req, res) => {
  try {
    const { username } = req.params;

    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUsername(username);
      if (!portfolio || !portfolio.isPublished) {
        return res.status(404).json({ success: false, message: 'Portfolio not found or private' });
      }

      const projects = mockStore.projects.filter((p) => p.portfolioId === portfolio._id);
      const skills = mockStore.skills.filter((s) => s.portfolioId === portfolio._id);
      const education = mockStore.education.filter((e) => e.portfolioId === portfolio._id);
      const experience = mockStore.experience.filter((e) => e.portfolioId === portfolio._id);
      const certificates = mockStore.certificates.filter((c) => c.portfolioId === portfolio._id);

      return res.json({
        success: true,
        portfolio: {
          ...portfolio,
          projects,
          skills,
          education,
          experience,
          certificates,
          analytics: { totalViews: 142, uniqueVisitors: 98 },
        },
      });
    }

    const portfolio = await Portfolio.findOne({ username: username.toLowerCase() });

    if (!portfolio || !portfolio.isPublished) {
      return res.status(404).json({ success: false, message: 'Portfolio not found or private' });
    }

    const projects = await Project.find({ portfolioId: portfolio._id }).sort({ isFeatured: -1, createdAt: -1 });
    const skills = await Skill.find({ portfolioId: portfolio._id }).sort({ proficiencyLevel: -1 });
    const education = await Education.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    const experience = await Experience.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    const certificates = await Certificate.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });

    let analytics = await Analytics.findOne({ portfolioId: portfolio._id });
    if (!analytics) {
      analytics = new Analytics({ portfolioId: portfolio._id, username: portfolio.username });
    }
    analytics.totalViews += 1;
    await analytics.save();

    res.json({
      success: true,
      portfolio: {
        ...portfolio.toObject(),
        projects,
        skills,
        education,
        experience,
        certificates,
        analytics: {
          totalViews: analytics.totalViews,
          uniqueVisitors: analytics.uniqueVisitors,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish user portfolio
// @route   POST /api/portfolio/publish
export const publishPortfolio = async (req, res) => {
  try {
    const { username, visibility } = req.body;

    if (isInMemoryFallback) {
      let portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      if (!portfolio) {
        portfolio = await mockStore.createPortfolio({ userId: req.user._id, username: req.user.username });
      }

      if (username && username.toLowerCase() !== portfolio.username) {
        const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
        const existing = await mockStore.findPortfolioByUsername(cleanUsername);
        if (existing && existing.userId !== req.user._id) {
          return res.status(400).json({ success: false, message: 'Username already taken' });
        }
        portfolio.username = cleanUsername;
      }

      portfolio.published = true;
      portfolio.isPublished = true;
      portfolio.publishedAt = new Date();
      portfolio.slug = portfolio.username;
      portfolio.visibility = visibility || 'public';

      return res.json({
        success: true,
        message: 'Portfolio published successfully!',
        publicUrl: `/u/${portfolio.username}`,
        portfolio,
      });
    }

    let portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user._id, username: req.user.username });
    }

    if (username && username.toLowerCase() !== portfolio.username) {
      const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      const existingUser = await User.findOne({ username: cleanUsername, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
      portfolio.username = cleanUsername;
      await User.findByIdAndUpdate(req.user._id, { username: cleanUsername });
    }

    portfolio.published = true;
    portfolio.isPublished = true;
    portfolio.publishedAt = new Date();
    portfolio.slug = portfolio.username;
    portfolio.visibility = visibility || 'public';

    await portfolio.save();

    res.json({
      success: true,
      message: 'Portfolio published successfully!',
      publicUrl: `/u/${portfolio.username}`,
      portfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unpublish user portfolio
// @route   POST /api/portfolio/unpublish
export const unpublishPortfolio = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      let portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      if (portfolio) {
        portfolio.published = false;
        portfolio.isPublished = false;
      }
      return res.json({ success: true, message: 'Portfolio unpublished successfully', portfolio });
    }

    let portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (portfolio) {
      portfolio.published = false;
      portfolio.isPublished = false;
      await portfolio.save();
    }
    res.json({ success: true, message: 'Portfolio unpublished successfully', portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check username availability
// @route   GET /api/portfolio/check-username/:username
export const checkUsernameAvailability = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();

    if (isInMemoryFallback) {
      const existing = await mockStore.findPortfolioByUsername(username);
      const isMine = existing && existing.userId === req.user?._id;
      return res.json({ success: true, available: !existing || isMine, username });
    }

    const existingUser = await User.findOne({ username });
    const isMine = req.user && existingUser && existingUser._id.toString() === req.user._id.toString();

    res.json({
      success: true,
      available: !existingUser || isMine,
      username,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public portfolio data by username
// @route   GET /api/user/:username
export const getPublicUserPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    const cleanUsername = username ? username.toLowerCase().trim() : '';

    console.log('🔍 [Backend] Requested Username:', cleanUsername);

    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUsername(cleanUsername);
      if (!portfolio) {
        console.log('❌ [Backend] Portfolio Not Found in MockStore for:', cleanUsername);
        return res.status(404).json({ success: false, message: 'Portfolio Not Found' });
      }
      if (!portfolio.published && !portfolio.isPublished) {
        console.log('⚠️ [Backend] Portfolio Not Published for:', cleanUsername);
        return res.status(404).json({ success: false, message: 'Portfolio Not Published' });
      }
      if (portfolio.visibility === 'private') {
        console.log('🔒 [Backend] Portfolio Private for:', cleanUsername);
        return res.status(403).json({ success: false, message: 'This portfolio is private.' });
      }

      const projects = mockStore.projects.filter((p) => p.portfolioId === portfolio._id);
      const skills = mockStore.skills.filter((s) => s.portfolioId === portfolio._id);
      const education = mockStore.education.filter((e) => e.portfolioId === portfolio._id);
      const experience = mockStore.experience.filter((e) => e.portfolioId === portfolio._id);
      const certificates = mockStore.certificates.filter((c) => c.portfolioId === portfolio._id);

      return res.json({
        success: true,
        portfolio: {
          ...portfolio,
          projects,
          skills,
          education,
          experience,
          certificates,
          analytics: { totalViews: 142, uniqueVisitors: 98 },
        },
      });
    }

    // MongoDB Case-Insensitive Username & Slug Query
    console.log('🍃 [Backend] Querying MongoDB Atlas for:', cleanUsername);
    const portfolio = await Portfolio.findOne({
      $or: [
        { username: cleanUsername },
        { username: new RegExp('^' + cleanUsername + '$', 'i') },
        { slug: cleanUsername },
      ],
    });

    if (!portfolio) {
      console.log('❌ [Backend] Portfolio Not Found in MongoDB Atlas for:', cleanUsername);
      return res.status(404).json({ success: false, message: 'Portfolio Not Found' });
    }

    console.log('📦 [Backend] Found Portfolio in MongoDB Atlas:', portfolio._id);

    // Check publication status (allows published OR isPublished for backwards compatibility)
    const isLive = portfolio.published || portfolio.isPublished;
    if (!isLive) {
      console.log('⚠️ [Backend] Portfolio is draft/unpublished for:', cleanUsername);
      return res.status(404).json({ success: false, message: 'Portfolio Not Published' });
    }

    if (portfolio.visibility === 'private') {
      console.log('🔒 [Backend] Portfolio is set to private for:', cleanUsername);
      return res.status(403).json({ success: false, message: 'This portfolio is private.' });
    }

    const projects = await Project.find({ portfolioId: portfolio._id }).sort({ isFeatured: -1, createdAt: -1 });
    const skills = await Skill.find({ portfolioId: portfolio._id }).sort({ proficiencyLevel: -1 });
    const education = await Education.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    const experience = await Experience.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    const certificates = await Certificate.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });

    let analytics = await Analytics.findOne({ portfolioId: portfolio._id });
    if (!analytics) {
      analytics = new Analytics({ portfolioId: portfolio._id, username: portfolio.username });
    }
    analytics.totalViews += 1;
    await analytics.save();

    console.log('✅ [Backend] Successfully returning public portfolio JSON for:', cleanUsername);
    res.json({
      success: true,
      portfolio: {
        ...portfolio.toObject(),
        projects,
        skills,
        education,
        experience,
        certificates,
        analytics: {
          totalViews: analytics.totalViews,
          uniqueVisitors: analytics.uniqueVisitors,
        },
      },
    });
  } catch (error) {
    console.error('💥 [Backend Error] Exception in getPublicUserPortfolio:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// @desc    Delete portfolio
// @route   DELETE /api/portfolio/:id
export const deletePortfolio = async (req, res) => {
  res.json({ success: true, message: 'Portfolio deleted' });
};
